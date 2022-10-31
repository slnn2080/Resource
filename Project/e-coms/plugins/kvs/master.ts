/* eslint-disable no-console */
import AWS from 'aws-sdk';
import { Role, SignalingClient } from 'amazon-kinesis-video-streams-webrtc';
import { Plugin, Context } from '@nuxt/types';
import { KVSConfig } from './kvsconfig';
import { KvsDataType, KvsCommand, CommandObject, MessageObject } from '@/plugins/kvs/type/sendMessageType';

declare module 'vue/types/vue' {
  interface Vue {
    $kvsMaster(
      mediaStream: MediaStream | null,
      eventHandler: KVSMasterEventHandler,
    ): KVSMaster;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $kvsMaster(
      mediaStream: MediaStream | null,
      eventHandler: KVSMasterEventHandler,
    ): KVSMaster;
  }
}
declare module 'vuex/types/index' {
  interface Store<S> {
    $kvsMaster(
      mediaStream: MediaStream | null,
      eventHandler: KVSMasterEventHandler,
    ): KVSMaster;
  }
}

/* -------------------------------------------- declare types end -------------------------------------------- */

export type KVSMasterEventHandler = {
  onOpened: () => void;
  onClosed: () => void;
  onConnectionStateChange: (event: RTCPeerConnection, connectionState: string) => void;
  onRemoteDataMessage: (event: any) => void;
};

type Peer = {
  peerConnection: RTCPeerConnection;
  dataChannel: RTCDataChannel | null;
  senders: RTCRtpSender[];
  listeners: { [event: string]: /*Function*/any };
}

export class KVSMaster
{
  private kvsConfig: KVSConfig = new KVSConfig()
  private iceServers: RTCIceServer[] = [];
  private signalingClient: SignalingClient | null = null;
  private peerMap: { [clientId: string]: Peer } = {}

  constructor(
    private mediaStream: MediaStream | null,
    private eventHandler: KVSMasterEventHandler,
    private context: Context
  ) {
    if (!this.mediaStream) {
      console.error('[MASTER] Could not find webcam', this.mediaStream);
      throw new Error('[MASTER] Could not find webcam')
    }
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
   * KVSを接続します
   *
   * @param {KVSConfig} kvsConfig
   */
  public async startMaster(kvsConfig: KVSConfig) {
    this.kvsConfig = kvsConfig

    try {
      // Create KVS client
      const kinesisVideoClient = new AWS.KinesisVideo({
        region: this.kvsConfig.region,
        accessKeyId: this.kvsConfig.accessKeyId,
        secretAccessKey: this.kvsConfig.secretAccessKey,
        sessionToken: this.kvsConfig.sessionToken,
        endpoint: this.kvsConfig.endpoint,
        correctClockSkew: true,
      });

      // Get signaling channel ARN
      const describeSignalingChannelResponse = await kinesisVideoClient
        .describeSignalingChannel({
          ChannelName: this.kvsConfig.channelName
        })
        .promise();
      const channelARN = (describeSignalingChannelResponse as any).ChannelInfo.ChannelARN;
      console.log('[MASTER] Channel ARN: ', channelARN);

      // Get signaling channel endpoints
      const getSignalingChannelEndpointResponse = await kinesisVideoClient
        .getSignalingChannelEndpoint({
          ChannelARN: channelARN,
          SingleMasterChannelEndpointConfiguration: {
            Protocols: ['WSS', 'HTTPS'],
            Role: Role.MASTER
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
      console.log('[MASTER] Endpoints: ', endpointsByProtocol);

      this.iceServers = await this.getIceServers({
        endpoint: endpointsByProtocol.HTTPS,
        channelARN: channelARN,
      });
      console.log('[MASTER] ICE servers: ', this.iceServers);

      // Create Signaling Client
      this.signalingClient = new SignalingClient({
        channelARN,
        channelEndpoint: endpointsByProtocol.WSS,
        role: Role.MASTER,
        region: this.kvsConfig.region,
        credentials: {
          accessKeyId: this.kvsConfig.accessKeyId,
          secretAccessKey: this.kvsConfig.secretAccessKey,
          sessionToken: this.kvsConfig.sessionToken
        }
      });

      // eslint-disable-next-line require-await
      this.signalingClient!.on('open', async () => {
        this.eventHandler.onOpened()
        console.log('[MASTER] Connected to signaling service');
      });

      this.signalingClient!.on('close', () => {
        console.log('[MASTER] Disconnected from signaling channel');

        this.eventHandler.onClosed()
      });

      this.signalingClient!.on('error', () => {
        console.error('[MASTER] Signaling client error');
      });

      this.signalingClient!.on('sdpOffer', async (offer: any, clientId: string) => {
        console.log('[MASTER] Received SDP offer from client: ' + clientId);

        this.addPeerConnection(clientId, offer)
      });

      // eslint-disable-next-line require-await
      this.signalingClient.on('iceCandidate', async (candidate: any, clientId: any) => {
        console.log('[MASTER] Received ICE candidate from client: ' + clientId);
        console.log(candidate);

        // Add the ICE candidate received from the client to the peer connection
        const peer = this.peerMap[clientId];
        if (peer) {
          peer.peerConnection.addIceCandidate(candidate);
        }
      });

      console.log('[MASTER] Starting this connection');
      this.signalingClient!.open();
    } catch (e) {
      this.stopMaster()
      throw e
    }
  }

  /**
   * KVSを切断します
   */
  public stopMaster() {
    console.log('[MASTER] Stopping this connection');

    if (!this.signalingClient) {
      return;
    }

    if (this.mediaStream) {
      //this.mediaStream = null;
    }

    const clientIdList = Object.keys(this.peerMap)
    for (let i = 0; i < clientIdList.length; i ++ ) {
      let clientId = clientIdList[i]
      this.removePeerConnection(clientId)
    }
    this.peerMap = {};

    this.iceServers = []

    this.signalingClient!.close();
    this.signalingClient = null
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
  public async getIceServers(options: {endpoint: string, channelARN: string}): Promise<RTCIceServer[]> {
    // Get ICE server configuration
    const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
      region: this.kvsConfig.region,
      accessKeyId: this.kvsConfig.accessKeyId,
      secretAccessKey: this.kvsConfig.secretAccessKey,
      sessionToken: this.kvsConfig.sessionToken,
      endpoint: options.endpoint,
    });
    const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
      .getIceServerConfig({
        ChannelARN: options.channelARN
      })
      .promise();
    
    const iceServers: RTCIceServer[] = []
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
   *
   * @param {string} clientId
   * @param {any} offer
   */
  public async addPeerConnection(clientId: string, offer: any) {
    const configuration: any = {
      iceServers: this.iceServers,
      iceTransportPolicy: this.kvsConfig.forceTURN ? 'relay' : 'all'
    };
    // Create a new peer connection using the offer from the given client
    const peerConnection = new RTCPeerConnection(configuration);

    let dataChannel: RTCDataChannel | null = null
    if (this.kvsConfig.openDataChannel) {
      dataChannel = peerConnection.createDataChannel(this.kvsConfig.channelName)
      // @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/datachannel_event
      peerConnection.ondatachannel = (event: any) => {
        event.channel.onmessage = this.eventHandler.onRemoteDataMessage;
      };
    }

    this.peerMap[clientId] = {
      peerConnection: peerConnection,
      dataChannel: dataChannel,
      senders: [],
      listeners: {},
    }
    const peer = this.peerMap[clientId]

    // Send any ICE candidates to the other peer
    peerConnection.addEventListener('icecandidate', peer.listeners['icecandidate'] = (event: any) => {
      if (event.candidate) {
        console.log('[MASTER] Generated ICE candidate for client: ' + clientId);

        // When trickle ICE is enabled, send the ICE candidates as they are generated.
        if (this.kvsConfig.useTrickleICE) {
          console.log('[MASTER] Sending ICE candidate to client: ' + clientId);
          this.signalingClient!.sendIceCandidate(event.candidate, clientId);
        }
      } else {
        console.log('[MASTER] All ICE candidates have been generated for client: ' + clientId);

        // When trickle ICE is disabled, send the answer now that all the ICE candidates have ben generated.
        if (!this.kvsConfig.useTrickleICE) {
          console.log('[MASTER] Sending SDP answer to client: ' + clientId);
          this.signalingClient!.sendSdpAnswer(peerConnection.localDescription as RTCSessionDescription, clientId);
        }
      }
    });

    peerConnection.addEventListener('iceconnectionstatechange', peer.listeners['iceconnectionstatechange'] = (event: any) => {
      console.log(peerConnection.iceConnectionState, event)
    });

    peerConnection.addEventListener('connectionstatechange', peer.listeners['connectionstatechange'] = (event: any) => {
      console.log('connectionstatechange');

      this.eventHandler.onConnectionStateChange(event, peerConnection.connectionState)
    });

    // If there's no video/audio, mediaStream will be null. So, we should skip adding the tracks from it.
    this.mediaStream!.getTracks().forEach((track: MediaStreamTrack) => {
      const sender = peerConnection.addTrack(track, this.mediaStream!);
      peer.senders.push(sender)
    });

    await peerConnection.setRemoteDescription(offer);

    // Create an SDP answer to send back to the client
    console.log('[MASTER] Creating SDP answer for client: ' + clientId);
    await peerConnection.setLocalDescription(
      await peerConnection.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
    );

    // When trickle ICE is enabled, send the answer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
    if (this.kvsConfig.useTrickleICE) {
      console.log('[MASTER] Sending SDP answer to client: ' + clientId);
      this.signalingClient!.sendSdpAnswer(peerConnection.localDescription as RTCSessionDescription, clientId);
    }
    console.log('[MASTER] Generating ICE candidates for client: ' + clientId);
  }

  /**
   *
   *
   * @param {string} clientId
   */
  public removePeerConnection(clientId: string) {
    try {
      const peer = this.peerMap[clientId]
      if (!peer) {
        return
      }

      delete this.peerMap[clientId]

      peer.peerConnection.removeEventListener('icecandidate', peer.listeners['icecandidate'] as any)
      peer.peerConnection.removeEventListener('iceconnectionstatechange', peer.listeners['iceconnectionstatechange'] as any)
      peer.peerConnection.removeEventListener('connectionstatechange', peer.listeners['connectionstatechange'] as any)
      peer.senders.forEach((sender) => {
        try {
          peer.peerConnection.removeTrack(sender)
        } catch (e) {
          // エラーは握りつぶす
        }
      })
      peer.senders = []

      peer.peerConnection.close()
    } catch (e) {
      throw e
    }
  }


  /**
   * データを送ります
   *
   * @param {any} data
   */
  private sendMasterData(data: any) {
    const dataJson = JSON.stringify(data)

    Object.keys(this.peerMap).forEach((clientId) => {
      try {
        this.peerMap[clientId].dataChannel?.send(dataJson);
      } catch (e) {
        console.error('[MASTER] Send DataChannel: ', e.toString());
      }
    });
  }

  /**
   * メッセージを送ります
   *
   * @param {MessageObject} data
   */
  public sendMasterMessage(data: MessageObject) {
    return this.sendMasterData(data)
  }

  /**
   * コマンドを送ります
   *
   * @param {CommandObject} data
   */
  public sendMasterCommand(data: CommandObject) {
    return this.sendMasterData(data)
  }
}

const kvsMasterPlugin: Plugin = (context, inject) => {
  inject('kvsMaster', (mediaStream: MediaStream | null, eventHandler: KVSMasterEventHandler) => {
    return new KVSMaster(mediaStream, eventHandler, context);
  });
};

export default kvsMasterPlugin;
