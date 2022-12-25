import Bounds from './Bounds.js'

/**
 * 位置情報管理クラス。
 *
 * タイルのインデックス(col, row)、Shape座標変換、及び算術等を担う。
 */
export default class PositionManager {
  /** Number of Column at maxtrix field. */
  cols;
  /** Number of Row at maxtrix field. */
  rows;

  /**
   * Constructor.
   *
   * @param {Integer} cols Column数
   * @param {Integer} rows Row数
   * @param {Integer} tileSize タイルサイズ(描画サイズ)
   * @returns {PositionManager}
   */
  constructor(cols, rows, tileSize) {
    this.cols = cols
    this.rows = rows
    this.tileSize = tileSize
  }

  /**
   * Rectangleの座標を返す。
   *
   * @param {Integer} col Column index
   * @param {Integer} row Row index
   * @returns {Object} Rect value
   */
  getBounds(col, row) {
    if (col < 0 || col > this.cols || row < 0 || row > this.rows) {
      return null
    }
    const x = col * this.tileSize
    const y = row * this.tileSize
    return new Bounds(x, y, this.tileSize, this.tileSize)
  }

  /**
   * layer座標に該当するタイルインデックスを返す。
   *
   * outOfRangeがtrueの場合は範囲外値で例外を、
   * false(未設定)の場合は端点で丸めるよう動作する。
   *
   * @param {Integer} x Shape x座標
   * @param {Integer} y Shape y座標
   * @param {Boorean} outOfRange 範囲外例外有効
   * @returns {col:columnインデックス, row:rowインデックス}
   */
  toIndex(x, y, outOfRange) {
    let col = Math.floor(x / this.tileSize)
    let row = Math.floor(y / this.tileSize)

    if (outOfRange && (col >= this.cols || row >= this.rows)) {
      throw new Error('Out of range.(' + x + ', ' + y + ')')
    }

    if (col < 0) {
      col = 0
    } else if (col >= this.cols) {
      col = this.cols - 1
    }

    if (row < 0) {
      row = 0
    } else if (row >= this.rows) {
      row = this.rows - 1
    }

    return {
      col: col,
      row: row
    }
  }
}
