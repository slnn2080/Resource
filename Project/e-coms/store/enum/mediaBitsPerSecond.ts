import {numberLiteralTypeAnnotation} from "~/node_modules/@babel/types";

export function getTimeSlice(aq: number, vq: number): number {
  let mup_size = 9;  //マルチパートアップロード最小サイズ(MB)
  return mup_size * 8 * 1024 * 1024/ (audioBitsPerSecond(aq) + videoBitsPerSecond(vq));
}

export function videoBitsPerSecond(rate: number): number {
  let sizePerHour;      //一時間当たりの目標サイズ(MB)
  let videoBitsPerSecond;
  switch (rate) {
    case 20:
      sizePerHour = 30;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 19:
      sizePerHour = 60;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 18:
      sizePerHour = 80;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 17:
      sizePerHour = 100;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 16:
      sizePerHour = 150;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 15:
      sizePerHour = 225;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 14:
      sizePerHour = 340;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 13:
      sizePerHour = 450;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 12:
      sizePerHour = 675;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 11:
      sizePerHour = 900;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 10:
      sizePerHour = 1100;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 9:
      sizePerHour = 1300;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 8:
      sizePerHour = 1600;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 7:
      sizePerHour = 1800;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 6:
      sizePerHour = 2000;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 5:
      sizePerHour = 2250;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 4:
      sizePerHour = 2500;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 3:
      sizePerHour = 2700;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 2:
      sizePerHour = 2900;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 1:
      sizePerHour = 3100;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    default:
      sizePerHour = 2250;
      videoBitsPerSecond = _getBitsPerSecond(sizePerHour);
  }
  return videoBitsPerSecond;
}

export function audioBitsPerSecond(rate: number): number {
  let sizePerHour;      //一時間当たりの目標サイズ(MB)
  let audioBitsPerSecond;
  switch (rate) {
    case 10:
      sizePerHour = 18;
      audioBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 9:
      sizePerHour = 20;
      audioBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 8:
      sizePerHour = 25;
      audioBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 7:
      sizePerHour = 27;
      audioBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 6:
      sizePerHour = 40;
      audioBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 5:
      sizePerHour = 55;
      audioBitsPerSecond = _getBitsPerSecond(sizePerHour); // 128 kbps (Enhanced Music MP3 Bitrate)
      break;
    case 4:
      sizePerHour = 70;
      audioBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 3:
      sizePerHour = 80;
      audioBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 2:
      sizePerHour = 110;
      audioBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    case 1:
      sizePerHour = 140;
      audioBitsPerSecond = _getBitsPerSecond(sizePerHour);
      break;
    default:
      sizePerHour = 55;
      audioBitsPerSecond = _getBitsPerSecond(sizePerHour);
  }
  return audioBitsPerSecond;
}

function _getBitsPerSecond(sizePerHour: number): number {
  return Math.floor(sizePerHour * 8 * 1024 * 1024 / 3600);
}
