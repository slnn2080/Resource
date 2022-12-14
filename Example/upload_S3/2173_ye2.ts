/* eslint-disable no-console */
import AWS from 'aws-sdk';
import { Plugin, Context } from '@nuxt/types';
import * as rootTypes from '@/store/types/rootType';
import * as testerPageTypes from '@/store/types/testerPageType';
import {
  TesterRecordingAdapter
  // TesterRecordingRecoveryAdapter,
  // TesterRecordingRecoveryRequestType,
} from '@/store/types/adapters/testerRecordingAdapter';
import { Formatter } from '@/utils/Formatter';
import { PromiseUtils } from '@/utils/PromiseUtils';

declare const MediaRecorder: any;
declare module 'vue/types/vue' {
  interface Vue {
    $startUploader(stream: MediaStream, eventHandler: UploaderEventHandler, options: optionsType): Promise<boolean>;
    $stopUploader(): Promise<boolean>;
  }
}
declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $startUploader(stream: MediaStream, eventHandler: UploaderEventHandler, options: optionsType): Promise<boolean>;
    $stopUploader(): Promise<boolean>;
  }
}
declare module 'vuex/types/index' {
  interface Store<S> {
    $startUploader(stream: MediaStream, eventHandler: UploaderEventHandler, options: optionsType): Promise<boolean>;
    $stopUploader(): Promise<boolean>;
  }
}

type s3ConfigsType = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  bucket: string;
  key: string;
  uploadId: string;
};

type optionsType = {
  mimeType?: string;
  audioBitsPerSecond?: number;
  videoBitsPerSecond?: number;
  timeslice?: number;
  videoRecordingPreference?: number;
  voiceQualityPreference?: number;
};

export type UploaderEvent = {
  error?: Error;
  errorString?: string;
};

export type UploaderEventHandler = {
  initializeError: (event: UploaderEvent) => Promise<boolean>;
  uploadError: (event: UploaderEvent) => Promise<boolean>;
};

type UploadPart = {
  PartNumber: number;
  Completed: boolean;
  Errored: boolean;
  data: Blob;
};

type UploadStatus = {
  readonly maxUploadingNum: number;
  currUploadingNum: number;
};

const logPath = '/proctor/front/plugins/s3/upload.ts';
const debugLevel = 0;
let loggerContext: Context | null = null;
let loggerStartTime: Date;

function logging(isDebug: number, params: any) {
  try {
    const context: any = loggerContext as Context;
    const _isDebug = context.app.store.getters[rootTypes.GETTER_STARTUP].isDebug;
    if (_isDebug >= isDebug) {
      const endTime = new Date();
      params.type = 5;
      params.path = logPath;
      params.timestamp = Formatter.date('yyyy-MM-dd hh:mm:ss', endTime);
      params.tag1 = endTime.getTime() - loggerStartTime.getTime();
      context.app.$axios.$post('/api/v1/log_receive.php', params);
    }
  } catch (e) {
    // ?????????????????????????????????
  }
}

/**
 * S3???????????????????????????????????????????????????
 *
 * ???????????????/????????????????????????????????????????????????????????????????????????????????????????????????
 *
 * @class
 */
class S3Component {
  /**
   * ?????????????????????
   *
   * @constructor
   */
  constructor(
    public context: Context | null = null,
    public s3Client: AWS.S3 | null = null,
    public bucketName: string | null = null,
    public key: string | null = null,
    public uploadId: string | null = null
  ) {}

  /**
   * S3?????????????????????
   *
   * @param {Context} context
   * @return {Promise<s3ConfigsType>}
   */
  initS3(context: Context): Promise<boolean> {
    this.context = context;

    return new Promise((resolve, reject) => {
      (this.context as any).app.store
        .dispatch(testerPageTypes.ACTION_TESTER_PAGE_START_TESTER_RECORDING)
        .then((recording: TesterRecordingAdapter) => {
          const valid = (value: string | null) => value || '';
          const s3Configs = {
            accessKeyId: valid(recording.accessKeyId),
            secretAccessKey: valid(recording.secretAccessKey),
            bucket: valid(recording.bucket),
            key: valid(recording.key),
            sessionToken: valid(recording.sessionToken),
            uploadId: recording.uploadId
          };

          // Configure the AWS. In this case for the simplicity I'm using access key and secret.
          AWS.config.update({
            credentials: {
              accessKeyId: s3Configs.accessKeyId,
              secretAccessKey: s3Configs.secretAccessKey,
              sessionToken: s3Configs.sessionToken
            }
          });

          // sdk's default timeout is 2 min
          // https://github.com/aws/aws-sdk-js/issues/949#issuecomment-204178782
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor_details
          this.s3Client = new AWS.S3({ httpOptions: { timeout: 0 }, region: 'ap-northeast-1' });
          this.bucketName = s3Configs.bucket;
          this.key = s3Configs.key;
          console.log('-----------------config:uploadId' + s3Configs.uploadId);
          this.uploadId = s3Configs.uploadId;
          logging(debugLevel, {
            module: 'initS3',
            location: 'S3Configs set',
            details: 'bucket:' + this.bucketName + ' key:' + this.key + ' uploadId:' + this.uploadId
          });

          resolve(true);
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * S3?????????????????????????????????
   *
   * ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
   *
   * @return {Promise<boolean>}
   */
  finalS3(): Promise<boolean> {
    return new Promise((resolve) => {
      // ??????????????????????????????
      ((this.context as any).app.store.getters[testerPageTypes.GETTER_TESTER_PAGE_IS_AUTH_ERROR]
        ? // ? (this.context as any).app.store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_END_TESTER_RECORDING_RECOVERY,
          // {key: this.key} as TesterRecordingRecoveryRequestType)
          Promise.resolve(true)
        : (this.context as any).app.store.dispatch(testerPageTypes.ACTION_TESTER_PAGE_END_TESTER_RECORDING)
      )
        .then(() => {
          resolve(true);
        })
        .catch(() => resolve(true));
      // .catch((error: any) => reject(error))
    });
  }

  /**
   * S3??????????????????????????????
   *
   * @param {Blob} data
   * @return {Promise<any>}
   */
  putObjectVideo(blob: Blob) {
    return new Promise((resolve, reject) => {
      (this.s3Client as any).putObject(
        {
          Bucket: this.bucketName,
          Body: blob,
          Key: this.key,
          ContentType: blob.type
        },
        (err: any, data: any) => {
          if (err) {
            reject(err);
          } else {
            console.log(`File uploaded successfully. ${data}`);
            resolve(data);
          }
        }
      );
    });
  }

  /**
   * ???????????????????????????????????????????????????S3??????????????????????????????
   *
   * @param {Blob} data
   * @param {number} partNumber
   * @return {Promise<any>}
   */
  uploadPartVideo(blob: Blob, partNumber: number) {
    console.log('s3Obj.uploadId:' + this.uploadId);
    return (this.s3Client as any)
      .uploadPart({
        Body: blob,
        Bucket: this.bucketName,
        Key: this.key,
        PartNumber: partNumber,
        UploadId: this.uploadId,
        ContentLength: blob.size
      })
      .promise();
  }

  //  stopHandler(): Promise<boolean> {
  //    try {
  //      const { Location } = await this.uploadComplete(this.multiParts);
  //      console.log('upload success : ', Location);
  //      logging(debugLevel, {module:'stopHandler','location':'upload success','details':'upload success:'+Location});
  //      this.partNumber = 0;
  //      this.multiParts = [];
  //      return Promise.resolve(true);
  //    } catch (error) {
  //      console.error(error);
  //      logging(debugLevel, {module:'stopHandler','location':'upload error','details':'upload error:'+error+' abortMultipartUpload???'});
  //      (this.s3Client as any)
  //        .abortMultipartUpload({
  //          Bucket: this.bucketName,
  //          UploadId: this.uploadId,
  //          Key: this.key
  //        })
  //        .promise()
  //        .then(() => console.log('Multipart upload aborted'))
  //        .catch((e: any) => {
  //          console.error(e);
  //          logging(debugLevel, {module:'stopHandler','location':'abortMultipartUpload error','details':'abortMultipartUpload error:'+e});
  //          this.eventHandler.abortError({error: e, errorString: e.toString()});
  //        });
  //      return Promise.reject(error);
  //    }
  //  }
  //
  //  uploadComplete(parts: multiPartsType[]) {
  //    console.log(parts);
  //    logging(debugLevel, {module:'uploadComplete','location':'uploadComplete','details':'???????????????????????????????????????'});
  //    return (this.s3Client as any)
  //      .completeMultipartUpload({
  //        Bucket: this.bucketName,
  //        Key: this.key,
  //        UploadId: this.uploadId,
  //        MultipartUpload: {
  //          Parts: this.multiParts
  //        }
  //      })
  //      .promise();
  //  }
}

/** @const */
const MINIMUM_SIZE = 1048576 * 5; // 5MB??????

/**
 * ?????????S3????????????????????????????????????????????????
 *
 * ??????????????????startUploader()???stopUploader()??????????????????????????????????????????
 * ?????????????????????????????????????????????Promise???????????????????????????????????????????????????????????????????????????????????????????????????????????????
 *
 * @class
 */
class S3Uploader {
  /**
   * ?????????????????????
   *
   * @constructor
   */
  constructor(
    public s3Component: S3Component | null = null,
    public mediaRecorder: any /* MediaRecorder | null */ = null,
    public defaultOptions: optionsType = {},
    public eventHandler: UploaderEventHandler = {
      initializeError: (event: UploaderEvent) => {
        return Promise.resolve(true);
      },
      uploadError: (event: UploaderEvent) => {
        return Promise.resolve(true);
      }
    },

    // ??????2??????promise???startUploader()???stopUploader()????????????????????????????????????????????????
    public startUploaderPromise: Promise<any> | null = null,
    public stopUploaderPromise: Promise<any> | null = null,
    public aborts: { error: any }[] = [],

    public partNumber: number = 0,
    public stopPartNumber: number | null = null,
    public uploadParts: UploadPart[] = [],
    public uploadStatus: UploadStatus = {
      maxUploadingNum: 1,
      currUploadingNum: 0
    },

    public lastBlob: Blob[] = []
  ) {}

  /**
   * ????????????????????????????????????
   *
   * @param {Context} context
   * @param {MediaStream} stream
   * @param {UploaderEventHandler} eventHandler
   * @param {optionsType} options
   * @return {Promise<boolean>}
   */
  startUploader(
    context: Context,
    stream: MediaStream,
    eventHandler: UploaderEventHandler,
    options: optionsType
  ): Promise<boolean> {
    if (this.startUploaderPromise) {
      // ?????????startUploader()??????????????????????????????
      return this.startUploaderPromise;
    } else if (this.stopUploaderPromise) {
      // stopUploader()???????????????????????????????????????startUploader()?????????
      return new Promise((resolve, reject) => {
        (this.stopUploaderPromise as any).finally(() => {
          this.startUploader(context, stream, eventHandler, options)
            .then(resolve)
            .catch(reject);
        });
      });
    }

    return (this.startUploaderPromise = new Promise((resolve, reject) => {
      loggerStartTime = new Date();

      this.s3Component = new S3Component();
      this.mediaRecorder = null;
      this.defaultOptions = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000, // 5000000 bits/s
        audioBitsPerSecond: 128000, // 128000 bits/s
        timeslice: 15000 // 15sec
      };
      this.eventHandler = eventHandler;

      this.startUploaderPromise = null;
      this.stopUploaderPromise = null;
      this.aborts = [];

      this.partNumber = 0;
      this.stopPartNumber = null;
      this.uploadParts = [];

      this.lastBlob = [];

      // ????????????????????????????????????????????????
      PromiseUtils.repeatUntilSuccessful(() => (this.s3Component as S3Component).initS3(context), {})
        .then(() => {
          try {
            logging(debugLevel, {
              module: 'startUploader',
              location: '?????????????????????',
              details: 's3Obj??????????????????'
            });

            this.mediaRecorder = new MediaRecorder(stream, this.setOptions(options));
            logging(debugLevel, {
              module: 'startUploader',
              location: 'MediaRecorder created',
              details: 'MediaRecorder:????????????'
            });
            this.mediaRecorder.addEventListener('start', (event: any) => this.startHandler(event));
            this.mediaRecorder.addEventListener('stop', (event: any) => this.stopHandler(event));
            this.mediaRecorder.addEventListener('dataavailable', (event: any) => this.dataAvailableHandler(event));

            this.mediaRecorder.start(this.defaultOptions.timeslice); // timeslice
            logging(debugLevel, {
              module: 'startUploader',
              location: 'MediaRecorder start',
              details: 'MediaRecorder:????????????'
            });

            this.startUploaderPromise = null;
            resolve(true);
          } catch (e) {
            console.error('Exception while creating MediaRecorder: ' + e);
            logging(debugLevel, {
              module: 'startUploader',
              location: 'MediaRecorder error',
              details: 'Exception while creating MediaRecorder: ' + e + ' ???????????????????????????'
            });
            this.eventHandler.initializeError({ error: e, errorString: e.toString() });

            this.mediaRecorder = null;
            this.startUploaderPromise = null;
            reject(e);
          }
        })
        .catch((e: any) => {
          // S3Component??????????????????

          this.mediaRecorder = null;
          this.startUploaderPromise = null;
          reject(e);
        });
    }));
  }

  /**
   * ????????????????????????????????????
   *
   * @param {{
   *          error: any,
   *        }} | null abort ????????????????????????????????????????????????????????????????????????????????????????????????????????????
   *                        ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
   * @return {Promise<boolean>}
   */
  stopUploader(abort: { error: any } | null = null): Promise<boolean> {
    if (abort) {
      this.aborts.push(abort);
    }

    if (this.startUploaderPromise) {
      // startUploader()???????????????????????????????????????????????????
      return new Promise((resolve, reject) => {
        (this.startUploaderPromise as any).finally(() => {
          this.stopUploader(abort)
            .then(resolve)
            .catch(reject);
        });
      });
    } else if (this.stopUploaderPromise) {
      // ?????????stopUploader()?????????????????????????????????
      return this.stopUploaderPromise;
    }

    if (!this.mediaRecorder) {
      return Promise.resolve(true);
    }

    return (this.stopUploaderPromise = new Promise((resolve) => {
      new Promise((resolve) => {
        let isStopUpload: boolean = false;
        let retry: number = 0;
        const interval = setInterval(() => {
          try {
            if (!isStopUpload) {
              retry = 0;

              // ????????????????????????
              console.log('------------------------------------------------------stopUploader');
              this.mediaRecorder.stop();
              isStopUpload = true;
              logging(debugLevel, {
                module: 'stopUploader',
                location: 'stopped',
                details: 'stopUploader'
              });
            } else {
              retry++;

              if (this.stopPartNumber === null) {
                // stop???????????????????????????????????????
                logging(debugLevel, {
                  module: 'stopUploader',
                  location: 'wait stop event retry:' + retry,
                  details: `???????????????????????????????????????????????????:` + retry
                });
              } else {
                const isSinglepartUpload = this.stopPartNumber === 1;
                const uploadMethodText = isSinglepartUpload ? '???????????????????????????????????????' : '????????????????????????????????????';
                const process: any = this.aborts.length
                  ? ({
                      // ????????????????????????????????????????????????????????????????????????
                      isEnd: () =>
                        this.uploadParts.filter((status) => status.Completed || status.Errored).length ===
                        this.stopPartNumber,
                      processText: '????????????'
                    } as any)
                  : ({
                      // ??????????????????????????????????????????????????????
                      isEnd: () => this.uploadParts.filter((status) => status.Completed).length === this.stopPartNumber,
                      processText: '????????????????????????'
                    } as any);

                // ?????????????????????????????????????????????????????????????????????
                if (process.isEnd()) {
                  logging(debugLevel, {
                    module: 'stopUploader',
                    location: 'stopped completed:',
                    details: `${uploadMethodText}???${process.processText}?????????`
                  });
                  clearInterval(interval);
                  resolve(false);
                } else {
                  logging(debugLevel, {
                    module: 'stopUploader',
                    location: 'stopped retry:' + retry,
                    details: `${uploadMethodText}???${process.processText}?????????????????????????????????:` + retry
                  });
                }
              }
            }
          } catch (error) {
            console.error(error);
            logging(debugLevel, {
              module: 'stopUploader',
              location: 'stop error',
              details: 'stop error:' + error
            });
          }
        }, 1000);
      }).then((result) => {
        // ????????????????????????????????????????????????
        PromiseUtils.repeatUntilSuccessful(() => (this.s3Component as S3Component).finalS3(), {}).then(() => {
          this.mediaRecorder = null;
          this.stopUploaderPromise = null;

          if (this.aborts.length) {
            const e = this.aborts[0].error;
            this.eventHandler.uploadError({ error: e, errorString: e.toString() });
          }
          resolve(result);
        });
      });
    }));
  }

  /**
   * MediaRecorder???start???????????????????????????
   *
   * @private
   * @param {any} event
   */
  startHandler(_event: any) {
    // nop
  }

  /**
   * MediaRecorder???stop???????????????????????????
   *
   * @private
   * @param {any} event
   */
  stopHandler(_event: any) {
    if (this.stopPartNumber === null) {
      this.stopPartNumber = this.partNumber;
    }
  }

  /**
   * MediaRecorder???dataAvailable???????????????????????????
   *
   * @private
   * @param {any} event
   */
  async dataAvailableHandler(event: any) {
    this.lastBlob.push(event.data);

    // ??????????????????????????????????????????????????????????????????????????????????????????this.mediaRecorder.state?????????????????????????????????mediaRecorderState???????????????
    const mediaRecorderState = this.mediaRecorder.state;

    // Stop???partNumber===0??????putObject???????????????????????????????????????
    // ?????????????????????????????????????????????????????????stop??????????????????????????????????????????
    // ?????????????????????????????????????????????????????????????????????????????????
    // @see https://developer.mozilla.org/ja/docs/Web/API/MediaRecorder/stop
    const isSinglepartUpload = mediaRecorderState === 'inactive' && this.partNumber === 0;
    const uploadMethodLocation = isSinglepartUpload ? 'single parts upload' : 'multi parts upload';
    const uploadMethodText = isSinglepartUpload ? '???????????????????????????????????????' : '????????????????????????????????????';
    const totalSize = this.lastBlob.reduce((total, v) => total + v.size, 0);
    if (isSinglepartUpload) {
      // ?????????????????????????????????????????????????????????????????????????????????

      // nop

      logging(debugLevel, {
        module: 'dataAvailableHandler',
        location: 'single part upload start',
        details:
          '??????????????????????????????parts???????????????putObject??????????????????????????????????????? part' +
          (this.partNumber + 1) +
          ',????????????????????????:' +
          this.defaultOptions.timeslice +
          ', blob size:' +
          totalSize
      });
      console.log(
        '??????????????????????????????parts???????????????putObject??????????????????????????????????????? part' +
          (this.partNumber + 1) +
          ',????????????????????????:' +
          this.defaultOptions.timeslice +
          ', blob size:' +
          totalSize
      );
    }
    // ?????????????????????????????????????????????????????????????????????????????????5M????????????????????????????????????????????????5M????????????????????????
    // ??????dataAvailableHandler?????????????????????????????????
    // ???????????????????????????????????????????????????????????????????????????????????????
    // @see https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/dev/qfacts.html
    else if (mediaRecorderState === 'inactive') {
      // ??????????????????

      // nop

      logging(debugLevel, {
        module: 'dataAvailableHandler',
        location: 'multi part upload',
        details:
          '???????????????????????????????????????????????????????????????????????? part' +
          (this.partNumber + 1) +
          ', ????????????????????????:' +
          this.defaultOptions.timeslice +
          ', blob size:' +
          totalSize
      });
      console.log(
        '???????????????????????????????????????????????????????????????????????? part' +
          (this.partNumber + 1) +
          ', ????????????????????????:' +
          this.defaultOptions.timeslice +
          ', blob size:' +
          totalSize
      );
    }
    // ????????????????????????
    else if (totalSize >= MINIMUM_SIZE) {
      // ????????????????????????: 5M??????

      // nop

      logging(debugLevel, {
        module: 'dataAvailableHandler',
        location: 'multi part upload',
        details:
          '?????????????????????????????????????????????????????????????????????????????? part' +
          (this.partNumber + 1) +
          ',????????????????????????:' +
          this.defaultOptions.timeslice +
          ', blob size:' +
          totalSize
      });
      console.log(
        '?????????????????????????????????????????????????????????????????????????????? part' +
          (this.partNumber + 1) +
          ',????????????????????????:' +
          this.defaultOptions.timeslice +
          ', blob size:' +
          totalSize
      );
    } else {
      // ????????????????????????: 5M??????

      // ??????dataAvailableHandler?????????????????????????????????
      return;
    }
    this.partNumber++;

    /*
      type UploadPart = {
        PartNumber: number;
        Completed: boolean;
        Errored: boolean;
        data: Blob;
      };

      type UploadStatus = {
        readonly maxUploadingNum: number;
        currUploadingNum: number;
      };
    */
    const webm = this.lastBlob.length > 1 ? new Blob(this.lastBlob, { type: this.lastBlob[0].type }) : this.lastBlob[0];
    this.lastBlob = [];

    // ????????????data??????????????? ??????????????? push ????????????
    this.uploadParts.push({ PartNumber: this.partNumber, Completed: false, Errored: false, data: webm });

    // ???????????????????????????????????????????????????
    const uploadToS3 = isSinglepartUpload
      ? async (blob: Blob, _partNumber: number) => {
          await (this.s3Component as S3Component).putObjectVideo(blob);
        }
      : async (blob: Blob, partNumber: number) => {
          await (this.s3Component as S3Component).uploadPartVideo(blob, partNumber);
        };

    let retry = 0;

    // ???????????????????????????????????????????????????????????????????????????????????????
    const networkErrTime = [];

    // ????????????60?????????????????????????????????????????????
    const minTime = 60;
    /* 
      // ??????
      public uploadStatus: UploadStatus = {
        maxUploadingNum: 1,
        currUploadingNum: 0
      },
    */
   // ?????????????????? ???????????????????????????????????? ?????????????????????????????????
   // ????????????????????? ????????? continue ????????????????????? while(??????) ?????????????????????
    while (
      // ????????????????????? ?????? ?????? ??????????????? ????????????????????? ?????? ??????????????????????????? ?????????
      this.uploadStatus.currUploadingNum < this.uploadStatus.maxUploadingNum &&
      !this.uploadParts.every((p) => p.Completed === true)
    ) {
      // ?????????????????????0??????????????? ??????????????????index ?????????findIndex?????????????????????
      const currPartIndex = this.uploadParts.findIndex((v) => v.Completed === false);
      // ??????????????? index ???????????????????????? partNumber
      const partNumber = this.uploadParts[currPartIndex].PartNumber;
      
      console.log({
        currPartIndex,
        currUploadingNum: this.uploadStatus.currUploadingNum,
        Completed: this.uploadParts.map((p) => p.Completed)
      });

      if (retry === 0) {
        logging(debugLevel, {
          module: 'dataAvailableHandler',
          location: `${uploadMethodLocation} start`,
          details: `${uploadMethodText}?????? part:` + partNumber
        });
      } else {
        logging(debugLevel, {
          module: 'dataAvailableHandler',
          location: `${uploadMethodLocation} retry ` + retry + ' start',
          details: `${uploadMethodText}?????????????????? part:` + partNumber
        });
      }
      retry++;

      try {
        // ?????????????????????????????? part num ++
        this.uploadStatus.currUploadingNum++;
        // ???????????? ????????????????????????part ????????????
        await uploadToS3(this.uploadParts[currPartIndex].data, partNumber);

        // 
        this.uploadStatus.currUploadingNum--;
        // ?????? ???????????????
        this.uploadParts[currPartIndex].data = new Blob();
        this.uploadParts[currPartIndex].Completed = true;

        logging(debugLevel, {
          module: 'dataAvailableHandler',
          location: `${uploadMethodLocation} completed`,
          details: `${uploadMethodText}?????????????????????????????? part` + partNumber
        });

        continue;
      } catch (error) {
        this.uploadStatus.currUploadingNum--;
        if (error.code === 'NetworkingError' || error.name === 'NetworkingError') {
          // ????????????????????????????????????????????????(??????: ???)???networkErrTime???????????????????????????
          const time = Math.floor(+new Date() / 1000 / 60);
          networkErrTime.push(time);

          // networkErrTime??????????????????????????????????????????????????????????????????????????????
          const max = Math.max(...networkErrTime);
          const min = Math.min(...networkErrTime);
          const duration = max - min;

          // ?????????????????? >= 60??? ??????????????????????????????
          if (duration >= minTime) {
            logging(debugLevel, {
              module: 'dataAvailableHandler',
              location: 'NetworkingError!!',
              details:
                'error code:' +
                error.code +
                ':' +
                error.name +
                ` ${uploadMethodText}??????????????? part:${partNumber}, min:${min}, max: ${max}, duration: ${duration}, minTime: ${minTime}`
            });

            // ?????????????????????????????????????????????????????????????????????????????????????????????????????????
            this.uploadParts[currPartIndex].Errored = true;
            this.stopUploader({ error });
            break;
          }

          // ???????????????????????????????????????????????????????????????????????????????????????
          logging(debugLevel, {
            module: 'dataAvailableHandler',
            location: 'NetworkingError!!',
            details:
              'error code:' +
              error.code +
              ':' +
              error.name +
              ` ${uploadMethodText}??????????????? part:${partNumber}, retry:${retry}`
          });

          // ??????????????????????????????API????????????????????????????????????sleep??????
          await PromiseUtils.sleep(1000);
          continue;
        } else if ((error.code === 'TimeoutError' || error.name === 'TimeoutError') && retry <= 10) {
          // ???????????????????????????(??????????????????10?????????)?????????????????????????????????????????????
          logging(debugLevel, {
            module: 'dataAvailableHandler',
            location: 'TimeoutError!!',
            details:
              'error code:' +
              error.code +
              ':' +
              error.name +
              ` ${uploadMethodText}??????????????? part:${partNumber}, retry:${retry}`
          });

          continue;
        } else {
          // ??????????????????????????? / ???????????????????????????(??????????????????10?????????) ??????
          logging(debugLevel, {
            module: 'dataAvailableHandler',
            location: 'error!!',
            details: 'error code:' + error.code + ':' + error.name + ' ?????????????????????????????? part:' + partNumber
          });
          this.uploadParts[currPartIndex].Errored = true;

          // ???????????????????????????????????????????????????????????????(???????????????)
          // ???????????????????????????????????????????????????(or ???????????????????????????????????????)????????????????????????
          this.stopUploader({ error });
          break;
        }
      }
    }
  }

  /**
   *
   *
   * @private
   * @param {optionsType} options
   * @return {optionsType}
   */
  setOptions(options: optionsType): optionsType {
    try {
      logging(debugLevel, {
        module: 'setOptions',
        location: 'defaultOptions set',
        details: 'defaultOptions set'
      });

      this.defaultOptions = Object.assign(this.defaultOptions, options);
      if (MediaRecorder.isTypeSupported(this.defaultOptions.mimeType)) {
        return this.defaultOptions;
      }
      console.log(this.defaultOptions.mimeType + ' is not Supported');

      this.defaultOptions.mimeType = 'video/webm;codecs=vp8';
      if (MediaRecorder.isTypeSupported(this.defaultOptions.mimeType)) {
        return this.defaultOptions;
      }
      console.log(this.defaultOptions.mimeType + ' is not Supported');

      this.defaultOptions.mimeType = 'video/webm';
      if (MediaRecorder.isTypeSupported(this.defaultOptions.mimeType)) {
        return this.defaultOptions;
      }
      console.log(this.defaultOptions.mimeType + ' is not Supported');

      this.defaultOptions.mimeType = 'video/mp4';
      if (MediaRecorder.isTypeSupported(this.defaultOptions.mimeType)) {
        return this.defaultOptions;
      }
      console.log(this.defaultOptions.mimeType + ' is not Supported');

      this.defaultOptions.mimeType = '';
      return this.defaultOptions;
    } catch (e) {
      console.error('Exception while creating MediaRecorder: ' + e.toString());
      logging(debugLevel, {
        module: 'setOptions',
        location: 'defaultOptions error',
        details: 'Exception while creating MediaRecorder: ' + e.toString()
      });
      this.eventHandler.initializeError({ error: e, errorString: e.toString() });
      throw e;
    }
  }
}

/**
 * ???????????????
 */
const s3Plugin: Plugin = (context: Context, inject) => {
  const s3Uploader: S3Uploader = new S3Uploader();

  // logging()???context?????????
  loggerContext = context;

  inject(
    'startUploader',
    (stream: MediaStream, eventHandler: UploaderEventHandler, options: optionsType): Promise<boolean> => {
      return s3Uploader.startUploader(context, stream, eventHandler, options);
    }
  );
  inject(
    'stopUploader',
    (): Promise<boolean> => {
      return s3Uploader.stopUploader();
    }
  );
};

export default s3Plugin;
