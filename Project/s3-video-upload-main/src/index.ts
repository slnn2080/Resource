/*
  fileName: 2173_version1
  desc:
    简单的构建 视频录制 上传数据到服务端的基本流程
  验证:
    dataavailable 确实是指定 毫秒后 触发一次
  结论:
    1. 程序会在start(1000)指定秒数后 dataavailable 会触发一次
    2. 当最后我们点击停止录制的时候 马上会再次触发一次 dataavailable 方法
    3. mediaRecorder.state
      在录制的时候为 recording
      在点击停止时为 inactive
    4. e.data
      Blob: {
        size: 32042
        type: "video/webm;codecs=vp9"
      }
*/
import AWS from "aws-sdk";
import { region, IdentityPoolId, Bucket, folderName } from "../env";

// 定义了一个接口  继承了 CompletedPart 有一个 isUploaded
interface UploadPartResult extends AWS.S3.CompletedPart {
  PartNumber: number;
  isUploaded: boolean;
  data: Blob;
}

// initS3
let s3Client: AWS.S3;
let UploadId: string;
initS3();

const MINIMUM_SIZE = 1048576 * 5; // 5MB制限

// 录制的数据
const recordedChunks: Blob[] = [];

// 上传的part数组
const uploadParts: UploadPartResult[] = [];
let isUploading = false;

// let videoBlob;
let mediaRecorder: MediaRecorder;
let partNumber = 0;

window.addEventListener("DOMContentLoaded", () => {
  const recordBtn = document.querySelector(".record-btn");
  // const videoDom = document.querySelector(".video");
  // const uploadBtn = document.querySelector(".upload-btn");

  // 点击录制按钮所触发的回调
  recordBtn &&
    recordBtn.addEventListener("click", async function () {
      // 选择录制区域 捕获该区域的视频流 只要视频轨道
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      // 拿到record的实例对象 用于获取录制数据 传入录制数据的类型
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });

      // dataavailable start(1000)该方法中指定了多少秒后 调用一次dataavailable方法
      mediaRecorder.addEventListener("dataavailable", dataAvailableHandler);

      mediaRecorder.addEventListener("stop", function () {
        // console.log("视频录制结束");
        // videoBlob = new Blob(recordedChunks, {
        //   type: "video/webm",
        // });
        // console.log(videoBlob);
        // const url = URL.createObjectURL(videoBlob);
        // videoDom.src = url;
      });

      // 指定开始录制 并每1000后触发一次dataavailable
      mediaRecorder.start(1000);
    });

  // uploadBtn.addEventListener("click", () => putObjectVideo(videoBlob));
});

async function initS3() {
  AWS.config.update({
    region,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId,
    }),
  });
  s3Client = await new AWS.S3({ apiVersion: "2006-03-01", params: { Bucket } });


  // 这个方法会返回一个 uploadId 赋值给了 全局的 uploadId
  s3Client
    .createMultipartUpload({
      Bucket,
      Key: `${folderName}/MultipartUpload-test.webm`,
    })
    .promise()
    .then((data) => {
      data.UploadId
        ? (UploadId = data.UploadId)
        : console.error("cannot get UploadId");
      console.log({ UploadId });
    });
}


// 上传一个对象的方法
function putObjectVideo(videoBlob: Blob) {
  if (isUploading) return;

  // 创建一个文件 确定格式
  const file = new File(
    [videoBlob],
    // `test-video-${moment(new Date()).format("YYYY-MM-DD-HH:mm:ss")}.webm`
    `${folderName}/SingleUpload-test.webm`
  );
  

  // 标识为正在上传
  isUploading = true;
  // Use S3 ManagedUpload class as it supports multipart uploads
  new AWS.S3.ManagedUpload({
    params: {
      Bucket,
      Key: `${folderName}/SingleUpload-test.webm`,
      Body: file,
    },
  })
    .promise()
    .then(() => {
      alert("Successfully uploaded single video.");
      // viewAlbum(albumName);
    })
    .catch((err) =>
      alert(`There was an error uploading your video: ${err.message}`)
    )// 最后再改回来
    .finally(() => (isUploading = false));
}

async function uploadPartVideo(currentPart: UploadPartResult) {
  // 如果正在上传就return
  if (isUploading) return;

  // 标识正在上传
  isUploading = true;


  await s3Client
    .uploadPart({
      Bucket,
      Body: currentPart.data,
      Key: `${folderName}/MultipartUpload-test.webm`,
      PartNumber: currentPart.PartNumber,
      UploadId,
      ContentLength: currentPart.data.size,
    })
    .promise()
    .then((uploadPromiseResult) => {
      currentPart.ETag = uploadPromiseResult.ETag;
      currentPart.isUploaded = true;
      currentPart.data = new Blob();
    })// 上传完毕后再标识为false
    .finally(() => (isUploading = false));
}

async function dataAvailableHandler(e: BlobEvent) {
  // console.log(e.data);
  recordedChunks.push(e.data);

  const mediaRecorderState = mediaRecorder.state;
  const isSinglepartUpload =
    mediaRecorderState === "inactive" && partNumber === 0;
  const totalSize = recordedChunks.reduce((total, v) => total + v.size, 0);

  // 是否应该完成多部分上传
  let shouldCompleteMultipartUpload = false;

  if (isSinglepartUpload) {
    console.log("single upload");
  } else if (mediaRecorderState === "inactive") {
    console.log("last part");

    // 当录制状态为 inactive 的时候 标识为true
    shouldCompleteMultipartUpload = true;
  } else if (totalSize >= MINIMUM_SIZE) {
    console.log("part size >= 5M");
  } else {
    console.log(
      `part size < 5M (${((totalSize / MINIMUM_SIZE) * 100).toFixed(2)}%)`
    );
    return;
  }

  partNumber++;
  const webm =
    recordedChunks.length > 1
      ? new Blob(recordedChunks, { type: recordedChunks[0].type })
      : recordedChunks[0];
  recordedChunks.length = 0;


  // 如果是一个部分的话 就调用 上传单独的一个对象
  if (isSinglepartUpload) {
    await putObjectVideo(webm);
    return;
  }

  // 每次拿到的 webm push到 数组中
  uploadParts.push({
    data: webm,
    isUploaded: false,
    PartNumber: partNumber,
  });

  /*
    逻辑解析:
      这个事件触发一次 就会执行一次循环上传 
      正常情况下 这是循环上传一个 part 
        当录制结束的时候 completeMultipartUpload 执行这个方法

      错误的时候 控制是什么? 
      节流阀 也就是说 前一个部分再上传 后一个上传动作就return掉了
        那会不会出现 前一个正在上传 50% 这时候事件触发 下一个part来了 看到前一个在上传中 这个新的part就会return掉了

      如果发生错误了
        断网了 但是录制还是继续 data每2秒执行一次 会往 parts数组里面 push东西
        第一次 parts里面是一个part 循环执行上传这一个part
        第二次 parts里面是二个part 
  */
  // 这个挺好的 所有的元素都返回true 才停止上传
  while (!uploadParts.every((i) => i.isUploaded === true)) {
    try {
      // 能走下来就是多部分上传 上传parts数组里的最后一个
      await uploadPartVideo(uploadParts[uploadParts.length - 1]);
      console.log(`${partNumber} completed`);

      // 如果 录制状态 inactive 的时候 我们 做以下的操作 加工下parts列表 为aws适用的参数格式
      if (shouldCompleteMultipartUpload) {
        const Parts = uploadParts.map((part) => {
          console.log(`[${part.PartNumber}]: ${part.ETag}`);
          return {
            ETag: part.ETag,
            PartNumber: part.PartNumber,
          };
        });

        /*
          你首先启动多部分上传，然后使用UploadPart操作上传所有部分。
          成功上传所有相关的上传部分后，您调用此操作来完成上传。
          在收到这个请求后，Amazon S3将所有部件按部件号的升序连接起来，以创建一个新对象。
          在完成多部件上传请求中，你必须提供部件列表。你必须确保零件清单是完整的。
          此操作将您在列表中提供的零件串联起来。对于列表中的每个零件，您必须提供零件编号和ETag值，在该零件被上传后返回。

          处理一个完整的多部分上传请求可能需要几分钟的时间来完成。在Amazon S3开始处理请求后，它会发送一个HTTP响应头，指定一个200 OK响应。在处理过程中，Amazon S3周期性地发送空白字符，以防止连接超时。在最初的200 OK响应被发送后，一个请求可能会失败。这意味着，200 OK响应可以包含成功或错误。如果你直接调用S3的API，请确保设计你的应用程序来解析响应的内容并适当地处理它。如果你使用AWS SDKs，SDKs会处理这种情况。SDK检测嵌入式错误，并根据您的配置设置应用错误处理（包括自动重试适当的请求）。如果该条件持续存在，SDK会抛出一个异常（或者，对于不使用异常的SDK，它们会返回错误）。
        */
        // 这个部分是起到了 通知s3的作用 告诉我们上传的所有部件可以整合了
        await s3Client
          .completeMultipartUpload({
            Bucket,
            Key: `${folderName}/MultipartUpload-test.webm`,
            MultipartUpload: { Parts },
            UploadId,
          })
          .promise();
        alert("Successfully uploaded multi-part videos.");
      }
    } catch (error) {
      console.error(error);
    }
  }
}
