/* eslint-disable no-console */
import AWS from 'aws-sdk';
import { Role, SignalingClient } from 'amazon-kinesis-video-streams-webrtc';
import { Plugin, Context } from '@nuxt/types';
import { KVSConfig } from './kvsconfig';
import { KvsDataType, KvsCommand, CommandObject, MessageObject } from '@/plugins/kvs/type/sendMessageType';

declare module 'vue/types/vue' {
  interface Vue {
    $kvsViewer(
      eventHandler: KVSViewerEventHandler
    ): KVSViewer;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $kvsViewer(
      eventHandler: KVSViewerEventHandler
    ): KVSViewer;
  }
}
declare module 'vuex/types/index' {
  interface Store<S> {
    $kvsViewer(
      eventHandler: KVSViewerEventHandler
    ): KVSViewer;
  }
}

/* -------------------------------------------- declare types end -------------------------------------------- */

export type KVSViewerEventHandler = {
  onOpened: () => void;
  onClosed: () => void;
  onConnectionStateChange: (event: RTCPeerConnection, connectionState: string) => void;
  onTrack: (mediaStream: MediaStream | null) => void;
  onAudioProcess: (audioSize: number) => void;
  onRemoteDataMessage: (event: any) => void;
};

type Peer = {
  peerConnection: RTCPeerConnection;
  dataChannel: RTCDataChannel | null;
  mediaStream: MediaStream | null;
  scriptProcesserNode: ScriptProcessorNode | null;
  listeners: { [event: string]: /*Function*/any };
}

export class KVSViewer
{
  private kvsConfig: KVSConfig = new KVSConfig();
  private iceServers: RTCIceServer[] = [];
  private signalingClient: SignalingClient | null = null;
  private peer: Peer | null = null;

  constructor(
    private eventHandler: KVSViewerEventHandler,
    private context: Context
  ) {
  }

  /**
   * KVSの接続を開始しているか調べます
   *
   * @return {boolean}
   */
  public isStartedMaster() {
    return !!this.signalingClient
  }

  /**
   *
   *
   * @param {KVSConfig} kvsConfig
   */
  public async startViewer(kvsConfig: KVSConfig) {
    this.kvsConfig = kvsConfig

    try {
      // Create KVS client
      const kinesisVideoClient = new AWS.KinesisVideo({
        region: this.kvsConfig.region,
        accessKeyId: this.kvsConfig.accessKeyId,
        secretAccessKey: this.kvsConfig.secretAccessKey,
        sessionToken: this.kvsConfig.sessionToken,
        endpoint: this.kvsConfig.endpoint,
        correctClockSkew: true
      });

      // Get signaling channel ARN
      const describeSignalingChannelResponse = await kinesisVideoClient
        .describeSignalingChannel({
          ChannelName: this.kvsConfig.channelName
        })
        .promise();

      const channelARN = (describeSignalingChannelResponse as any).ChannelInfo.ChannelARN;
      console.log('[VIEWER] Channel ARN: ', channelARN);

      // Get signaling channel endpoints
      const getSignalingChannelEndpointResponse = await kinesisVideoClient
        .getSignalingChannelEndpoint({
          ChannelARN: channelARN,
          SingleMasterChannelEndpointConfiguration: {
            Protocols: ['WSS', 'HTTPS'],
            Role: Role.VIEWER
          }
        })
        .promise();
      const endpointsByProtocol = (getSignalingChannelEndpointResponse as any).ResourceEndpointList.reduce(
        (endpoints: any, endpoint: any) => {
          endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
          return endpoints;
        },
        {}
      );
      console.log('[VIEWER] Endpoints: ', endpointsByProtocol);

      this.iceServers = await this.getIceServers({
        endpoint: endpointsByProtocol.HTTPS,
        channelARN: channelARN,
      })
      console.log('[VIEWER] ICE servers: ', this.iceServers);

      // Create Signaling Client
      this.signalingClient = new SignalingClient({
        channelARN,
        channelEndpoint: endpointsByProtocol.WSS,
        clientId: this.kvsConfig.clientId,
        role: Role.VIEWER,
        region: this.kvsConfig.region,
        credentials: {
          accessKeyId: this.kvsConfig.accessKeyId,
          secretAccessKey: this.kvsConfig.secretAccessKey,
          sessionToken: this.kvsConfig.sessionToken
        }
      });

      this.signalingClient!.on('open', async () => {
        this.eventHandler.onOpened()

        do { 
          try {
            await this.createPeerConnection()
            break;
          } catch (e) {
            console.log('[VIEWER Error] createPeerConnection() is failed');
            this.destroyPeerConnection()
          }
        } while(true)

        console.log('[VIEWER] Generating ICE candidates');
      });

      this.signalingClient!.on('close', () => {
        this.eventHandler.onClosed()

        console.log('[VIEWER] Disconnected from signaling channel');
      });

      this.signalingClient!.on('error', (error: any) => {
        console.error('[VIEWER] Signaling client error: ', error);
      });

      this.signalingClient!.on('sdpAnswer', async (answer: any) => {
        // Add the SDP answer to the peer connection
        console.log('[VIEWER] Received SDP answer');

        //do {
          try {
            await this.peer!.peerConnection!.setRemoteDescription(answer);
        //    break;
          } catch (e) {
            console.log('[VIEWER Error] setRemoteDescription() is failed');
        //    this.destroyPeerConnection()
        //    await this.createPeerConnection()
          }
        //} while(true)
      });

      this.signalingClient!.on('iceCandidate', (candidate: any) => {
        // Add the ICE candidate received from the MASTER to the peer connection
        console.log('[VIEWER] Received ICE candidate');

        this.peer!.peerConnection!.addIceCandidate(candidate);
      });

      console.log('[VIEWER] Starting this connection');
      this.signalingClient!.open();
    } catch (e) {
      this.stopViewer()
      throw e
    }
  }

  /**
   * 停止させます
   */
  public stopViewer() {
    if (!this.signalingClient) {
      return
    }

    this.destroyPeerConnection()

    this.iceServers = []

    this.signalingClient!.close();
    this.signalingClient = null;
  }

  /**
   *
   *
   * @param {{
   *          endpoint: string;
   *          channelARN: string;
   *        }} options
   * @return {Promise<RTCIceServer[]>}
   */
  public async getIceServers(options: {endpoint: string; channelARN: string}): Promise<RTCIceServer[]> {
    const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
      region: this.kvsConfig.region,
      accessKeyId: this.kvsConfig.accessKeyId,
      secretAccessKey: this.kvsConfig.secretAccessKey,
      sessionToken: this.kvsConfig.sessionToken,
      endpoint: options.endpoint,
    });

    // Get ICE server configuration
    const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
      .getIceServerConfig({
        ChannelARN: options.channelARN
      })
      .promise();

    const iceServers: RTCIceServer[] = [];
    if (!this.kvsConfig.natTraversalDisabled && !this.kvsConfig.forceTURN) {
      iceServers.push({
        urls: `stun:stun.kinesisvideo.${this.kvsConfig.region}.amazonaws.com:443`
      });
    }
    if (!this.kvsConfig.natTraversalDisabled) {
      (getIceServerConfigResponse as any).IceServerList.forEach((iceServer: any) =>
        iceServers.push({
          urls: iceServer.Uris,
          username: iceServer.Username,
          credential: iceServer.Password
        })
      );
    }

    return iceServers
  }

  /**
   *
   */
  public async createPeerConnection() {
    const configuration: any = {
      iceServers: this.iceServers,
      iceTransportPolicy: this.kvsConfig.forceTURN ? 'relay' : 'all'
    };
    const peerConnection = new RTCPeerConnection(configuration);

    let dataChannel = null
    if (this.kvsConfig.openDataChannel) {
      dataChannel = peerConnection!.createDataChannel(
        this.kvsConfig.channelName
      );
      peerConnection.ondatachannel = (event: any) => {
        event.channel.onmessage = this.eventHandler.onRemoteDataMessage;
      };
    }

    this.peer = {
      peerConnection: peerConnection,
      dataChannel: dataChannel,
      mediaStream: null,
      scriptProcesserNode: null,
      listeners: {},
    }
    const peer = this.peer!

    // Send any ICE candidates to the other peer
    peerConnection.addEventListener('icecandidate', peer.listeners['icecandidate'] = (event: any) => {
      if (event.candidate) {
        // console.log('[VIEWER] Generated ICE candidate');

        // When trickle ICE is enabled, send the ICE candidates as they are generated.
        if (this.kvsConfig.useTrickleICE) {
          // console.log('[VIEWER] Sending ICE candidate');
          this.signalingClient!.sendIceCandidate(event.candidate);
        }
      } else {
        console.log('[VIEWER] All ICE candidates have been generated');

        // When trickle ICE is disabled, send the offer now that all the ICE candidates have ben generated.
        if (!this.kvsConfig.useTrickleICE) {
          console.log('[VIEWER] Sending SDP offer');
          this.signalingClient!.sendSdpOffer(peerConnection.localDescription as RTCSessionDescription);
        }
      }
    });

    peerConnection.addEventListener('iceconnectionstatechange', peer.listeners['iceconnectionstatechange'] = (event: any) => {
      console.log('[VIEWER] iceconnectionstatechange:', event, peerConnection.iceConnectionState, peerConnection.connectionState)
    });

    peerConnection.addEventListener('connectionstatechange', peer.listeners['connectionstatechange'] = (event: any) => {
      console.log('[VIEWER] connectionstatechange:', event, peerConnection.iceConnectionState, peerConnection.connectionState)

      this.eventHandler.onConnectionStateChange(event, peerConnection.connectionState)
    });

    peerConnection.addEventListener('track', peer.listeners['track'] = (event: RTCTrackEvent) => {

      console.log('[VIEWER] Received remote track');
      peer.mediaStream = event.streams[0];

      {
        if (peer.scriptProcesserNode) {
          peer.scriptProcesserNode!.removeEventListener('audioprocess', peer.listeners['audioprocess'] as any)
          peer.scriptProcesserNode = null;
        }

        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();
        
        const mediaStreamSource = audioContext.createMediaStreamSource(peer.mediaStream);
        const audioDestination = audioContext.createMediaStreamDestination();
        const gainNode = audioContext.createGain();
        gainNode.connect(audioDestination);
        peer.scriptProcesserNode = audioContext.createScriptProcessor(1024, 1, 1);
        
        // medaiStreamへgainNode, MediaStreamAudioDestinationNode, ScriptProcessorNodeを繋がせる。
        mediaStreamSource.connect(gainNode);
        mediaStreamSource.connect(audioDestination);
        mediaStreamSource.connect(peer.scriptProcesserNode);

        peer.scriptProcesserNode!.connect(audioContext.destination);
        peer.scriptProcesserNode!.addEventListener('audioprocess', peer.listeners['audioprocess'] = (e: AudioProcessingEvent) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const inputDataLength = inputData.length;
          let total = 0;
          for (let i = 0; i < inputDataLength; i++) {
              total += Math.abs(inputData[i++]);
          }
          const rms = Math.sqrt(total / inputDataLength);
          const audioSize = Math.round(rms * 100);

          this.eventHandler.onAudioProcess(audioSize)
        })
      }

      this.eventHandler.onTrack(this.peer!.mediaStream)
    });

    console.log('[VIEWER] Connected to signaling service');
    // Create an SDP offer to send to the master
    console.log('[VIEWER] Creating SDP offer');
    await peerConnection.setLocalDescription(
      await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
    );

    // When trickle ICE is enabled, send the offer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
    if (this.kvsConfig.useTrickleICE) {
      console.log('[VIEWER] Sending SDP offer');
      this.signalingClient!.sendSdpOffer(peerConnection.localDescription as RTCSessionDescription);
    }
  }

  /**
   *
   */
  public destroyPeerConnection() {
    if (!this.peer) {
      return
    }
    const peer = this.peer!
    this.peer = null

    if (peer.mediaStream) {
      peer.mediaStream.getTracks().forEach((track: any) => track.stop());
    }

    if (peer.scriptProcesserNode) {
      peer.scriptProcesserNode!.removeEventListener('audioprocess', peer.listeners['audioprocess'] as any)
      peer.scriptProcesserNode = null;
    }

    if (peer.dataChannel) {
      peer.dataChannel = null;
    }

    peer.peerConnection.removeEventListener('icecandidate', peer.listeners['icecandidate'] as any)
    peer.peerConnection.removeEventListener('track', peer.listeners['track'] as any)
    peer.peerConnection.removeEventListener('iceconnectionstatechange', peer.listeners['iceconnectionstatechange'] as any)
    peer.peerConnection.removeEventListener('connectionstatechange', peer.listeners['connectionstatechange'] as any)
    peer.peerConnection.close();
  }


  /**
   * データを送ります
   *
   * @param {any} data
   */
  private sendViewerData(data: any) {
    const dataJson = JSON.stringify(data)

    if (this.peer && this.peer!.dataChannel) {
      try {
        this.peer!.dataChannel!.send(dataJson);
      } catch (e) {
        console.error('[VIEWER] Send DataChannel: ', e.toString());
      }
    }
  }

  /**
   * メッセージを送ります
   *
   * @param {MessageObject} data
   */
  public sendViewerMessage(data: MessageObject) {
    return this.sendViewerData(data)
  }

  /**
   * コマンドを送ります
   *
   * @param {CommandObject} data
   */
  public sendViewerCommand(data: CommandObject) {
    return this.sendViewerData(data)
  }

  /**
   * MediaStreamを取得します
   *
   * @return {MediaStream | null}
   */
  public getMediaStream(): MediaStream | null {
    if (!this.peer) {
      return null
    }
    return this.peer!.mediaStream
  }
}

const kvsViewerPlugin: Plugin = (context, inject) => {
  inject('kvsViewer', (eventHandler: KVSViewerEventHandler) => {
    return new KVSViewer(eventHandler, context);
  });
};
export default kvsViewerPlugin;
