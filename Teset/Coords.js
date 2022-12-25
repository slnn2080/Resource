/**
 * Coordsデータクラス。
 */
export default class Coords {
  x;
  y;

  /**
   * コンストラクタ。
   *
   * @param {Number} x x座標
   * @param {Number} y y座標
   * @return {Coords}
   */
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  /**
   * scaleを適用したCoordsを返す。
   *
   * @param {x; xスケール, y: yスケール} scale 倍率
   * @return {Coords} scaleを適用したCoords
   */
  multiplyWithScale(scale) {
    return new Coords(
      this.x * scale.x,
      this.y * scale.y
    )
  }
}
