import Konva from 'konva'

import ColorConst from '../ColorConst.js'

var EventEmitter = require('events').EventEmitter

/**
 * 描画用タイルモデルクラス。
 */
export default class TileElement extends EventEmitter {
  static EVENT_MODEL_CHANGING = 'model-changing';

  /** タイルボーダー色: 瓷砖的背景色 就是底图的网格颜色*/
  static BORDER_COLOR = ColorConst.mdGry;

  /** タイルボーダー幅: 瓷砖的线粗 */
  static BORDER_WIDTH = 1;

  /** 方向イメージオフセット: 反向图片的偏移量 */
  static OFFSET_DIR_IMG = {
    x: -3,
    y: -3
  };

  // 前缀 和 分隔符
  static CELL_ID_PREFIX = 'cell-';
  static CELL_ID_DELIMITER = '-';

  /** positionManager */
  positionManager;

  /** Column index. */
  col;
  /** Row index. */
  row;

  /** Konva Rect object for background color. */
  rect = null;
  /** Konva Rect object for Image. */
  imgRect = null;

  /** TileModel */
  tileModel = null;
  // /** 棚コード */
  // shelfCode = null;
  /** 棚コード設定リスト */
  shelfCodeAry = [];

  /**
   * 传入 col row positionManager 返回一个 TileElement 得到的是 一个瓷砖
   * positionManager: 它是一个范围
   *
   * @param {Integer} col Columnインデックス
   * @param {Integer} row Rowインデックス
   * @param {PositionManager} positionManager 位置情報管理クラスインスタンス
   * @returns {TileElement}
   */
  constructor(col, row, positionManager) {
    super()

    // 初始化信息: 将传入的参数挂载到实例上一份
    this.positionManager = positionManager
    this.col = col
    this.row = row

    // 返回的是 每一个瓷砖的位置 和 大小
    const bounds = positionManager.getBounds(this.col, this.row)


    // 根据 每一个瓷砖的位置 和 大小 画正方形, 并设置了 颜色 和 线粗
    this.rect = new Konva.Rect({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      stroke: TileElement.BORDER_COLOR,
      strokeWidth: TileElement.BORDER_WIDTH
    })


    this.imgRect = new Konva.Rect({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      fillPatternRepeat: 'no-repeat',
      fillPatternOffset: TileElement.OFFSET_DIR_IMG,
      opactiy: 0.4
    })
  }

  /**
   * TileModel設定。
   *  
   * 传入一个 TileModel 将 TileModel 保存在实例的身上
   * 如果没有这个访问器，则不保证配置的操作。
   *
   * @param {TileModel} tilemodel TileModel(設定解除時はnull)
   */
  setTileModel(tileModel) {
    // 当调用 setTileModel 的时候 会往父级 emit 一个事件: EVENT_MODEL_CHANGING
    this.emit(TileElement.EVENT_MODEL_CHANGING, this)
    
    if (tileModel) {
      this.tileModel = tileModel.clone()
    } else {
      this.tileModel = null
    }
    this.draw()
  }

  // 调用 draw() 方法的时候 才会进行绘制
  draw() {
    // BackgroundColor
    if (this.tileModel) {
      this.rect.fill(this.tileModel.getBackgroundColor())
    } else {
      this.rect.fill(null)
    }
    this.rect.draw()
    // Image
    if (this.tileModel) {
      this.imgRect.fillPatternImage(this.tileModel.getImage())
    } else {
      this.imgRect.fillPatternImage(null)
    }
    this.imgRect.draw()
  }

  getCellId() {
    return TileElement.CELL_ID_PREFIX + this.col + TileElement.CELL_ID_DELIMITER + this.row
  }

  static cellIdToColRow(cellId) {
    if (!cellId || !cellId.startsWith(TileElement.CELL_ID_PREFIX)) {
      throw new Error('Unrecognized format.(' + cellId + ')')
    }
    const colRowStr = cellId.substring(TileElement.CELL_ID_PREFIX.length)
    const colRowAry = colRowStr.split(TileElement.CELL_ID_DELIMITER)
    if (colRowAry.length < 2) {
      throw new Error('Unrecognized format.(' + cellId + ')')
    }
    const col = parseInt(colRowAry[0], 10)
    const row = parseInt(colRowAry[1], 10)
    if (isNaN(col) || isNaN(row)) {
      throw new Error('Unrecognized format.(' + cellId + ')')
    }
    return { col: col, row: row }
  }
}
