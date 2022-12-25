/**
 * Boundsデータクラス。
 */
export default class Bounds {
  /**
   * 対角座標2つからBoundsを生成する。
   *
   * @param {x: x座標, y: y座標} pt1 座標1
   * @param {x: x座標, y: y座標} pt2 座標2
   * @returns {Bounds}
   */
  static createByPoints(pt1, pt2) {
    const x1 = pt1.x < pt2.x ? pt1.x : pt2.x
    const x2 = pt1.x > pt2.x ? pt1.x : pt2.x
    const y1 = pt1.y < pt2.y ? pt1.y : pt2.y
    const y2 = pt1.y > pt2.y ? pt1.y : pt2.y

    return new Bounds(x1, y1, x2 - x1, y2 - y1)
  }

  x;
  y;
  width;
  height;

  /**
   * コンストラクタ。
   *
   * @param {Number} x x座標
   * @param {Number} y y座標
   * @param {Number} width 幅
   * @param {Number} height 高さ
   * @returns {Bounds}
   */
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  /**
   * scaleを適用したBoundsを返す。
   *
   * @param {x; xスケール, y: yスケール} scale 倍率
   * @return {Bounds} scaleを適用したBounds
   */
  multiplyWithScale(scale) {
    return new Bounds(
      this.x * scale.x,
      this.y * scale.y,
      this.width * scale.x,
      this.height * scale.y
    )
  }

  /**
   * 左上の座標を取得する。
   *
   * @returns {x: x座標, y: y座標}
   */
  getTopLeft() {
    return { x: this.x, y: this.y }
  }

  /**
   * 右上の座標を取得する。
   *
   * @returns {x: x座標, y: y座標}
   */
  getTopRight() {
    return { x: this.x + this.width, y: this.y }
  }

  /**
   * 左下の座標を取得する。
   *
   * @returns {x: x座標, y: y座標}
   */
  getBottomLeft() {
    return { x: this.x, y: this.y + this.height }
  }

  /**
   * 右下の座標を取得する。
   *
   * @returns {x: x座標, y: y座標}
   */
  getBottomRight() {
    return { x: this.x + this.width, y: this.y + this.height }
  }
}
