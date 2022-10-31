/**
 * デバイス(カメラ・マイク)の状態
 */
export enum DeviceState {
  /** チェック前 */
  BEFORE_CHECK = 1,
  /** 許可済 */
  ALLOWED,
  /** ブロック済 */
  DENIED,
}
