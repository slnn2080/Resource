export enum MatchingStatus {
  /** @const この値は、管理者「マッチング状況モニター」画面でのみ使われる値で通常ではこの値をとりうることはない */
  INVALID = -1,

  NONE = 0,
  WAITING = 1,
  CONNECTED = 2,
}
