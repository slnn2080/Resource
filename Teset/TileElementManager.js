import TileModel from '../TileModel.js'
import Bounds from './Bounds.js'
import TileElement from './TileElement.js'
import PositionManager from './PositionManager.js'
// import MessageConst from '../MessageConst.js'
import i18n from '@/lang'

var EventEmitter = require('events').EventEmitter

/**
 * タイル情報管理クラス。
 *
 * タイル情報をcol,rowのインデックスで処理できるよう管理を行うクラス。
 */
export default class TileElementManager extends EventEmitter {
  static EVENT_DESTORY_ALL_TILE_SHAPES = 'destroy-all-tile-shape';
  static EVENT_ADD_TILE_SHAPE = 'add-tile-shape';
  static EVENT_CLEAR_TILE_BOUNDS = 'clear-tile-bounds';
  static EVENT_SHELF_INFO_APPLIED = 'shelf-info-applied';
  /** 矩形サイズ */
  static RECT_SIZE = 30;

  cols = 0;
  rows = 0;

  /** TileElement data array. */
  tileElementArray = [];
  positionManager;
  shelfInfoManager;

  errorMessage = null;

  /**
   * 出発・到着地点タイル
   *
   * ※描画で上書きされた際はmodel内容が一致しないので
   * 設定済みの判断は設定されているTileElementのElementModel値を確認する必要あり。
   */
  depotTiles = {
    [TileModel.DEPOT.START]: null,
    [TileModel.DEPOT.END]: null
  }
  shelfSelectedList; // 選択済み棚マスタCSVデータ

  /**
   * コンストラクタ。
   *
   * @returns {TileElementManager}
   */
  constructor() {
    super()
    TileModel.loadImage() // 初期化タイミングがないので仕方なくここにて。どうにかしたいなぁ...
  }

  /**
   * Column数、Row数を設定してタイル情報を初期化する。
   *
   * @param {Integer} cols Column数
   * @param {Integer} rows Row数
   * @returns {Bounds} タイルグリッドの領域
   */
  initialize(cols, rows) {
    // 移除 tile 身上上的所有事件回调
    for (let i = 0; i < this.tileElementArray.length; i++) {
      const tile = this.tileElementArray[i]
      tile.removeAllListeners(tile.eventNames())
    }

    // 销毁所有的图形数据
    this.emit(TileElementManager.EVENT_DESTORY_ALL_TILE_SHAPES)

    // TileElement data array
    this.tileElementArray = []

    // 仓库瓷砖的 start end 为 null 这里都是设置默认值
    this.depotTiles = {
      [TileModel.DEPOT.START]: null,
      [TileModel.DEPOT.END]: null
    }

    // Setup tileElements. 将我们传入的cols和rows保存到 实例身上
    this.cols = cols
    this.rows = rows

    // 这里是将 cols rows 和 tileSize 封装成一个对象
    this.positionManager = new PositionManager(cols, rows, TileElementManager.RECT_SIZE)

    // 初始化了一个 货架选择列表
    this.shelfSelectedList = []

    // 将 this 换了一个名字
    const titleElementManager = this

    // 遍历 cols 和 rows
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {

        // 我们把每一个瓷砖拿到 丢进了 TileElement的构造器中 返回一个 准备好的瓷砖(有rect的了)
        const tileElement = new TileElement(col, row, this.positionManager)

        // 这个逻辑是要做什么? Set handler 性能面に問題が出た場合は相互リンクにするか...
        tileElement.on(TileElement.EVENT_MODEL_CHANGING,
          (tileElement) => {
            titleElementManager.__tileModelChanging(tileElement)
          }
        )


        // 管理用スタックに積み、レイヤに図形を登録, 将图形压入到 栈中 然后将图形登录到界面上
        this.tileElementArray.push(tileElement)

        // 发射事件 然后 绘制图形
        this.emit(TileElementManager.EVENT_ADD_TILE_SHAPE, tileElement.rect)
        this.emit(TileElementManager.EVENT_ADD_TILE_SHAPE, tileElement.imgRect)
      }
    }

    // Create ShelfInfoManager
    this.shelfInfoManager = new ShelfInfoManager(this)

    // Create Grid bounds for response.
    const brTileRect = this.positionManager.getBounds(cols - 1, rows - 1)
    const botomRightCoords = brTileRect.getBottomRight()
    return new Bounds(0, 0, botomRightCoords.x + 1, botomRightCoords.y + 1)
  }

  /**
   * 
   * Test 
   */
  addGrid(cols, rows) {
    
  }

  /**
   * TileElementを返す。
   *
   * @param {Integer} col Columnインデックス
   * @param {Integer} row Rowインデックス
   * @returns {TileElementManager.tileElementAry|unresolved}
   */
  getTileElement(col, row) {
    if (col < 0 || col > this.cols || row < 0 || row > this.rows) {
      return null
    }
    return this.tileElementArray[row * this.cols + col]
  }

  /**
   * 通路の方向値取得(10進数)
   *
   * @param {TileModel} tileModel タイルモデル
   * @param {Object} tile 通路タイルの2進数方向値
   * @returns {Integer} direction 10進数の通路方向値(direction値)
    */
  getPassageDirection(tileModel, neighborTiles) {
    return tileModel.__getDecDirection(neighborTiles)
  }

  /**
   * 通路の方向に応じた隣接したTileElementを返す。
   * ただし、進めない方向のタイルの場合はエラー扱い(TileModel.TYPE.ERROR)
   *
   * @param {Integer} col Columnインデックス
   * @param {Integer} row Rowインデックス
   * @param {TileModel} tile タイル情報
   * @returns {
    *  up: 上のTileElement,
    *  down: 下のTileElement,
    *  left: 左のTileElement,
    *  right: 右のTileElement
    * }
    */
  getDirNeighborTiles(col, row, tileModel) {
    const maxRows = this.rows - 1
    const maxCols = this.cols - 1
    const dirBin = tileModel.__getDirBinStrAry()
    // TODO: リファクタリング(getNeighborTilesなど使う) dirBinを Object -> Array. getNeighborTiles, for, setの順
    const neighborTiles = {
      down: (parseInt(dirBin.down, 10) !== 0) ? this.getTileElement(col, row + 1) : null,
      right: (parseInt(dirBin.right, 10) !== 0) ? this.getTileElement(col + 1, row) : null,
      up: (parseInt(dirBin.up, 10) !== 0) ? this.getTileElement(col, row - 1) : null,
      left: (parseInt(dirBin.left, 10) !== 0) ? this.getTileElement(col - 1, row) : null
    }
    // 隣接タイルの制約に応じて、使用しないものはエラー扱いとする(グリッド外に向かう方向の通路はエラーとする)
    neighborTiles.up = (parseInt(dirBin.up, 10) > 0 && row === 0) ? TileModel.TYPE.ERROR : neighborTiles.up
    neighborTiles.left = (parseInt(dirBin.left, 10) > 0 && col === 0) ? TileModel.TYPE.ERROR : neighborTiles.left
    neighborTiles.down = (parseInt(dirBin.down, 10) > 0 && row === maxRows) ? TileModel.TYPE.ERROR : neighborTiles.down
    neighborTiles.right = (parseInt(dirBin.right, 10) > 0 && col === maxCols) ? TileModel.TYPE.ERROR : neighborTiles.right

    // 進行方向の隣接タイルが進めるかどうかチェック
    neighborTiles.up = (this.isPassageClosedTile(neighborTiles.up)) ? TileModel.TYPE.ERROR : neighborTiles.up
    neighborTiles.left = (this.isPassageClosedTile(neighborTiles.left)) ? TileModel.TYPE.ERROR : neighborTiles.left
    neighborTiles.down = (this.isPassageClosedTile(neighborTiles.down)) ? TileModel.TYPE.ERROR : neighborTiles.down
    neighborTiles.right = (this.isPassageClosedTile(neighborTiles.right)) ? TileModel.TYPE.ERROR : neighborTiles.right
    return neighborTiles
  }

  /**
   * 隣接したTileElementを返す。
   *
   * @param {Integer} col Columnインデックス
   * @param {Integer} row Rowインデックス
   * @returns {
   *  up: 上のTileElement,
   *  down: 下のTileElement,
   *  left: 左のTileElement,
   *  right: 右のTileElement
   * }
   */
  getNeighborTiles(col, row) {
    return {
      up: this.getTileElement(col, row - 1),
      down: this.getTileElement(col, row + 1),
      left: this.getTileElement(col - 1, row),
      right: this.getTileElement(col + 1, row)
    }
  }

  /**
   * 指定されたlayer領域内に掛かるTileElementを返す。
   *
   * @param {Bounds} shapeBounds Shape領域
   * @returns {
   *   tileElementAry: TileElement配列,
   *   bounds: {x: 領域原点x, y: 領域原点y, width: 領域幅, height: 領域高さ}
   * }
   */
  getTileElementAndRect(bounds) {
    const shapeCoord1 = bounds.getTopLeft()
    const shapeCoord2 = bounds.getBottomRight()
    const idx1 = this.positionManager.toIndex(shapeCoord1.x, shapeCoord1.y)
    const idx2 = this.positionManager.toIndex(shapeCoord2.x, shapeCoord2.y)

    const colMin = idx1.col
    const colMax = idx2.col
    const rowMin = idx1.row
    const rowMax = idx2.row

    const tileElementAry = []
    for (let i = 0; i < rowMax - rowMin + 1; i++) {
      for (let j = 0; j < colMax - colMin + 1; j++) {
        tileElementAry.push(this.getTileElement(colMin + j, rowMin + i))
      }
    }

    const bounds1 = this.positionManager.getBounds(colMin, rowMin)
    const bounds2 = this.positionManager.getBounds(colMax, rowMax)
    const clearBounds = new Bounds(bounds1.x, bounds1.y,
      bounds2.x + bounds2.width - bounds1.x,
      bounds2.y + bounds2.height - bounds1.y
    )

    return {
      tileElementAry: tileElementAry,
      bounds: this.__toCrearAreaBounds(clearBounds)
    }
  }

  /**
   * 対象layer領域内にあるタイルにタイルモデルを適用する。
   *
   * @param {Bounds} shapeBounds 設定領域
   * @param {TileModel} tileModel 設定するタイルモデル
   */
  setTileModel(shapeBounds, tileModel) {
    // 方向指示のない通路モデルはスルー(NOP)とする
    if (tileModel) {
      if (tileModel.type === TileModel.TYPE.PASSAGE && !tileModel.direction) {
        return
      }
    }
    // Draw info
    const drawInfo = this.getTileElementAndRect(shapeBounds)
    // Clear layer.
    this.emit(TileElementManager.EVENT_CLEAR_TILE_BOUNDS, drawInfo.bounds)
    // Set tile model.
    const tileAry = drawInfo.tileElementAry
    for (let i = 0; i < tileAry.length; i++) {
      const tile = tileAry[i]
      tile.setTileModel(tileModel)
    }
  }

  /**
   * (通路の自動設定用) 対象layer領域内にあるタイルにタイルモデルを適用する。
   *
   * @param {Bounds} shapeBounds 設定領域
   */
  setPassageTileModel(shapeBounds) {
    // 出発・到着地点取得
    const depotMap = this.getDepotMap()

    // エラーメッセージの削除
    this.clearErrorMessage()
    const errMsg = {
      unPassageAutoDraw: ''
    }

    // Draw info: 範囲内(すべて)のタイル情報取得
    const drawInfo = this.getTileElementAndRect(shapeBounds)
    const tileAry = drawInfo.tileElementAry
    const nonAttrPointList = []
    for (let i = 0; i < tileAry.length; i++) {
      const tile = tileAry[i]
      const tileModel = tile.tileModel
      if (tileModel == null || tileModel.type === TileModel.TYPE.ERROR) {
        // 再描画処理(背景色が透過しているので一度削除してから作成する必要がある)
        const tileBounds = this.__getTileClearAreaBounds(tile)
        this.emit(TileElementManager.EVENT_CLEAR_TILE_BOUNDS, tileBounds)
        // 未設定属性タイルを全方向の通路属性にする
        tile.setTileModel(new TileModel(TileModel.TYPE.PASSAGE, 15))
        nonAttrPointList.push({ 'col': tile.col, 'row': tile.row })
      }
    }

    // 未設定タイルなし
    if (nonAttrPointList.length === 0) {
      return
    }

    // Set tile model.
    // drawInfo = this.getTileElementAndRect(shapeBounds);
    // tileAry = drawInfo.tileElementAry;
    for (let i = 0; i < tileAry.length; i++) {
      const tile = tileAry[i]
      const tileModel = tile.tileModel

      // 通路タイルの隣接タイル取得
      const neighborTiles = this.getDirNeighborTiles(tile.col, tile.row, tileModel)

      // 未設定タイルチェック
      const nonAttrTile = nonAttrPointList.find((item) => {
        return (item.col === tile.col && item.row === tile.row)
      })
      if (nonAttrTile) {
        // 未設定タイルのみ
        // 再描画処理(背景色が透過しているので一度削除してから作成する必要がある)
        const tileBounds = this.__getTileClearAreaBounds(tile)
        this.emit(TileElementManager.EVENT_CLEAR_TILE_BOUNDS, tileBounds)

        // 進める通路のdirection値取得
        const direction = this.getPassageDirection(tileModel, neighborTiles)

        // 進行方向が塞がれている場合、warning(yellow)扱いとする
        tileModel.type = TileModel.TYPE.PASSAGE
        tileModel.direction = (direction === 0) ? tileModel.direction : direction
        tileModel.setPassageClosed((direction === 0))
        if (errMsg.unPassageAutoDraw === '' && direction === 0) {
          // errMsg.unPassageAutoDraw = MessageConst.grid.unPassageAutoDraw
          errMsg.unPassageAutoDraw = i18n.t('go.confirmTips.map_mapmaintain.grid.unPassageAutoDraw')
        }

        // 設定済み出発・到着地点の再描画
        const depotKeys = Object.keys(depotMap)
        const depotValues = Object.values(depotMap)
        for (let j = 0; j < depotValues.length; j++) {
          const depot = depotValues[j]
          if (!depot || depot === '') {
            continue
          }
          if (tile.col === depot.col && tile.row === depot.row) {
            this.__setDepot(tile, depotKeys[j])
          }
        }

        // タイル情報更新
        tile.setTileModel(tileModel)
      }

      // TODO: 通路属性が設定されているものも自動描画する場合は下記の処理を修正して適応すること。
      // // 既存の通路タイルの方向性も適切なタイルに変更する場合
      // if(!this.isDirNeighborTiles(neighborTiles)){
      //   // 進める通路のdirection値取得
      //   const direction = this.getPassageDirection(tileModel, neighborTiles);
      //   // 進行方向が塞がれている場合、warning(yellow)扱いとする
      //   tileModel.direction = (direction === 0) ? tileModel.direction : direction;
      //   tileModel.setPassageClosed((direction === 0));
      //   tile.draw();

      //   if(errMsg.unPassageAutoDraw == "" && direction === 0){
      //     errMsg.unPassageAutoDraw = MessageConst.grid.unPassageAutoDraw;
      //   }
      // }
      // // タイル情報更新
      // tile.setTileModel(tileModel);
    }

    // 表示するエラーメッセージ設定
    let errMsgAry = Object.values(errMsg)
    errMsgAry = errMsgAry.filter(v => !!v)
    this.errorMessage = (errMsgAry.length > 0) ? errMsgAry.join('\n') : ''
  }

  /**
   * (ピック位置の自動設定用) 対象layer領域内にあるタイルにタイルモデルを適用する。
   *
   * @param {Bounds} shapeBounds 設定領域
   */
  setShelfPassageTileModel(shapeBounds) {
    // Draw info: 範囲内(すべて)のタイル情報取得
    const drawInfo = this.getTileElementAndRect(shapeBounds)
    const tileAry = drawInfo.tileElementAry
    // const nonAttrPointList = []
    for (let i = 0; i < tileAry.length; i++) {
      const tile = tileAry[i]
      const tileModel = tile.tileModel
      if (tileModel !== null && tileModel.type === TileModel.TYPE.SHELF && tileModel.shelfLinked === true) {
        // 通路タイルの隣接タイル取得
        const neighborTiles = this.getNeighborTiles(tile.col, tile.row)
        var neighborTilePassageCount = 0
        var direction = 0
        if (neighborTiles.up !== null && neighborTiles.up.tileModel !== null && neighborTiles.up.tileModel.type === TileModel.TYPE.PASSAGE) {
          neighborTilePassageCount++
          direction = TileModel.DIR.UP
        }
        if (typeof neighborTiles.down !== 'undefined' && neighborTiles.down !== null && neighborTiles.down.tileModel !== null && neighborTiles.down.tileModel.type === TileModel.TYPE.PASSAGE) {
          neighborTilePassageCount++
          direction = TileModel.DIR.DOWN
        }
        if (neighborTiles.left !== null && neighborTiles.left.tileModel !== null && neighborTiles.left.tileModel.type === TileModel.TYPE.PASSAGE) {
          neighborTilePassageCount++
          direction = TileModel.DIR.LEFT
        }
        if (typeof neighborTiles.right !== 'undefined' && neighborTiles.right !== null && neighborTiles.right.tileModel !== null && neighborTiles.right.tileModel.type === TileModel.TYPE.PASSAGE) {
          neighborTilePassageCount++
          direction = TileModel.DIR.RIGHT
        }

        if (neighborTilePassageCount === 1) {
          // current tile layer clear
          const tileBounds = this.__getTileClearAreaBounds(tile)
          this.emit(TileElementManager.EVENT_CLEAR_TILE_BOUNDS, tileBounds)
          // 最描画
          tileModel.setDirection(direction)
          tile.draw()
          // nonAttrPointList.push(tile)
        } else if (neighborTilePassageCount === 0) {
          // current tile layer clear
          const tileBounds = this.__getTileClearAreaBounds(tile)
          this.emit(TileElementManager.EVENT_CLEAR_TILE_BOUNDS, tileBounds)
          // 最描画
          tileModel.setDirection(0)
          tile.draw()
        } else {
          // current tile layer clear
          const tileBounds = this.__getTileClearAreaBounds(tile)
          this.emit(TileElementManager.EVENT_CLEAR_TILE_BOUNDS, tileBounds)
          // 最描画
          tile.draw()
        }
      }
    }
    // console.log('TileElementManager setShelfPassageTileModel nonAttrPointList::', nonAttrPointList)
  }

  /**
   * 棚座標を指定した通行不可タイル判定
   *
   * @param {String} cellId CellID(Exported address String)
   */
  setShelfLinked(cellId) {
    const colRow = TileElement.cellIdToColRow(cellId)
    const tile = this.getTileElement(colRow.col, colRow.row)

    // 通路タイルの制約チェック
    const tileModel = tile.tileModel
    if (tileModel && this.isShelfTile(tileModel)) {
      // 通路方向に応じた隣接タイル取得
      const neighborTiles = this.getDirNeighborTiles(colRow.col, colRow.row, tileModel)
      // 棚指定した通路タイルと進んでない方面を指定しているタイル共存場合、棚指定した通路タイル表示する
      if (!this.isDirNeighborTiles(neighborTiles)) {
        tileModel.setPassageClosed(false)
        tile.draw()
      }
    }
  }

  /**
   * 出発・到着地点を設定する。
   *
   * @param {Coords} shapeCoodes Shape座標
   * @param {Integer} depotVal TileModel.DEPOT
   *
   */
  setDepot(shapeCoodes, depotVal) {
    const tileAndRect = this.getTileElementAndRect(Bounds.createByPoints(shapeCoodes, shapeCoodes))
    if (!tileAndRect.tileElementAry.length) {
      return
    }
    const tile = tileAndRect.tileElementAry[0]
    this.__setDepot(tile, depotVal)
  }

  /**
   * 出発・到着地点を設定する。
   *
   * @param {String} cellId CellID(Exported address String)
   * @param {Integer} depotVal TileModel.DEPOT
   *
   */
  setDepotByCellId(cellId, depotVal) {
    const colRow = TileElement.cellIdToColRow(cellId)
    const tile = this.getTileElement(colRow.col, colRow.row)
    this.__setDepot(tile, depotVal)
  }

  /**
   * 出発・到着地点を設定する。
   *
   * @param {TileElement} tile TileElement
   * @param {Integer} depotVal TileModel.DEPOT
   *
   */
  __setDepot(tile, depotVal) {
    const tileModel = tile.tileModel
    const prevTile = this.depotTiles[depotVal]
    // 設定先が未設定タイルの場合はアボート
    if (!tileModel) {
      return
    }
    // 設定先タイルのdepot値の変更を試みる
    const depotOld = tileModel.depot
    tileModel.setDepot(depotOld | depotVal) // 既存値と設定値のORをとって設定
    // 設定値の変化が起こらなかった場合は(設定先が同じ、対象のタイルが通路で無い等)アボート
    if (depotOld === tileModel.depot) {
      return
    }
    // 以前に値を設定されたタイルの属性をはずす
    if (prevTile && prevTile !== tile) { // ※同一タイルが通路で上書きされているケースを考慮
      const prevTileModel = prevTile.tileModel
      if (prevTileModel) {
        let depot = prevTileModel.depot
        // 出発地点と到着地点が同一タイルの可能性があるのでビット演算で落とす
        depot &= ~depotVal
        prevTileModel.setDepot(depot)
        // draw.
        const tileBounds = this.__getTileClearAreaBounds(prevTile)
        this.emit(TileElementManager.EVENT_CLEAR_TILE_BOUNDS, tileBounds)
        prevTile.draw()
      }
    }
    // Set depot tile.
    this.depotTiles[depotVal] = tile
    // draw.
    const tileBounds = this.__getTileClearAreaBounds(tile)
    this.emit(TileElementManager.EVENT_CLEAR_TILE_BOUNDS, tileBounds)
    tile.draw()
  }

  /**
   * 描画領域幅を返す。
   *
   * @returns {width:幅, height:高さ}
   */
  getDrawAreaSize() {
    return {
      width: this.cols * TileElementManager.RECT_SIZE + TileElement.BORDER_WIDTH * 2,
      height: this.rows * TileElementManager.RECT_SIZE + TileElement.BORDER_WIDTH * 2
    }
  }

  /**
   * 1タイル分のサイズを返す。
   *
   * @return {Integer} tileSize タイルのサイズ
   */
  getTileSize() {
    return TileElementManager.RECT_SIZE + TileElement.BORDER_WIDTH * 2
  }

  /**
   * 対象座標にある棚タイル情報を返す。
   *
   * @param {Coords} shapeCoords 対象座標
   * @return {
    *    col: column_index,
    *    row: row_index,
    *    shapeCode: current_chape_code
    *    }
    */
  getShelfInfo(shapeCoords) {
    //  let shelfInfo = null;
    const shapeBounds = Bounds.createByPoints(shapeCoords, shapeCoords)
    const drawInfo = this.getTileElementAndRect(shapeBounds)
    if (!drawInfo.tileElementAry.length) {
      return null
    }
    const tileElement = drawInfo.tileElementAry[0]
    if (!tileElement.tileModel) { // 空のタイル
      return null
    }
    //  if(tileElement.tileModel.type !== TileModel.TYPE.PASSAGE){ // 通路ではない
    //    return null;
    //  }

    if (tileElement.tileModel.type !== TileModel.TYPE.SHELF) { // 棚ではない
      return null
    }

    // 隣で通路があるかどうかチェックする
    const neighborTiles = this.getNeighborTiles(tileElement.col, tileElement.row)
    const tileAry = Object.values(neighborTiles)
    for (let i = 0; i < tileAry.length; i++) {
      const tile = tileAry[i]
      if (!tile || !tile.tileModel) {
        continue
      }
      if (tile.tileModel.type === TileModel.TYPE.PASSAGE) { // 隣で通路がある
        return {
          col: tileElement.col,
          row: tileElement.row,
          shelfCodeAry: tileElement.shelfCodeAry
        }
      }
    }

    return null
  }

  /**
 * 選択した棚座標タイル情報を返す。
 *
 * @param {Coords} shapeCoords 対象座標
 * @return {
  *    col: column_index,
  *    row: row_index
  *    }
  */
  getShelfPassageInfo(drawInfo) {
    if (!drawInfo.tileElementAry.length) {
      return null
    }
    const tileElement = drawInfo.tileElementAry[0]
    if (!tileElement.tileModel) { // 空のタイル
      return null
    }
    if (tileElement.tileModel.type !== TileModel.TYPE.SHELF) { // 棚ではない
      return null
    }

    if (!tileElement.tileModel.shelfLinked || !tileElement.shelfCodeAry) { // 選択した棚ではない
      return null
    }

    return {
      col: tileElement.col,
      row: tileElement.row
    }
  }

  /**
  * 棚で指定している方向タイルのチェック（指定している方面が通路かどうか）
  *
  * @param {tileElement} tileElement タイル対象
  * @param {Integer} direction 矢印方向1DOWN 2RIGHT 4UP 8LEFT
  * @return {
  *    col: column_index,
  *    row: row_index,
  *    shapeCode: current_chape_code
  *    }
  */
  checkShelfPassage(tileElement, direction) {
    let DIR = null
    switch (direction) {
      case TileModel.DIR.DOWN:
        DIR = 'down'
        break
      case TileModel.DIR.RIGHT:
        DIR = 'right'
        break
      case TileModel.DIR.UP:
        DIR = 'up'
        break
      case TileModel.DIR.LEFT:
        DIR = 'left'
        break
      default:
        DIR = null
        break
    }

    if (!DIR) {
      return null // 存在方向ではない
    }

    // 隣で通路があるかどうかチェックする
    const neighborTiles = this.getNeighborTiles(tileElement.col, tileElement.row)
    const neighborTileDIR = neighborTiles[DIR]

    if (!neighborTileDIR) {
      return null
    }

    if (!neighborTileDIR.tileModel) {
      return null // 空タイル
    }

    if (neighborTileDIR.tileModel.type !== TileModel.TYPE.PASSAGE) {
      return null // 指定している方向タイルが通路ではない
    }

    return neighborTileDIR
  }

  /**
   * 棚座標を設定する。
   *
   * @param {Integer} col Columnインデックス
   * @param {Integer} row Rowインデックス
   * @param {Array} shelfCodeAry 選択済みShelfCode(解除指定はnull)
   */
  setShelfInfo(col, row, shelfCodeAry, dir, updateShelfFlag) {
    const tile = this.getTileElement(col, row)
    if (!tile) {
      throw new Error('No such tile.(' + col + ', ' + row + ')')
    }
    const tileBounds = this.positionManager.getBounds(col, row)
    const clearBounds = this.__toCrearAreaBounds(tileBounds)
    // const depotVal = tile.tileModel.depot;
    // Clear layer.
    this.emit(TileElementManager.EVENT_CLEAR_TILE_BOUNDS, clearBounds)
    // Set tile model.
    if (shelfCodeAry.length > 0) {
      const tile = this.getTileElement(col, row)
      if (updateShelfFlag) {
        const tileModel = tile.tileModel
        tileModel.setDirection(dir)
      }

      // let tileModel = tile.tileModel;
      // if(tileModel && this.isShelfTile(tileModel)){
      //   // 通路方向に応じた隣接タイル取得
      //   const neighborTiles = this.getDirNeighborTiles(col, row, tileModel);
      //   // 進んでない方面を指定しているタイル場合、先ずは進んでないエラー色塗りとリンク状態色塗りを削除する
      //   console.log('neighborTiles::', neighborTiles)
      //   if(!this.isDirNeighborTiles(neighborTiles)){
      //     tileModel.setPassageClosed(false);
      //     tileModel.setShelfLinked(false);
      //     tile.draw();
      //   }
      // }
      this.shelfInfoManager.assign(tile, shelfCodeAry)
      // tile.draw();

      // 設定済み出発・到着地点の再設定(assignした際にsetTileModelでthis.depotTilesが消えてしまうため)
      // 同一タイル、同一depotはスキップされるため、一度、初期化してから元の値を再セットする。
      // if(depotVal === TileModel.DEPOT.START){
      //   this.depotTiles[TileModel.DEPOT.START] = tile;
      //   this.__setDepot(tile, TileModel.DEPOT.START);
      // } else if(depotVal === TileModel.DEPOT.END){
      //   this.depotTiles[TileModel.DEPOT.END] = tile;
      //   this.__setDepot(tile, TileModel.DEPOT.END);
      // } else if(depotVal > TileModel.DEPOT.END){
      //   this.depotTiles[TileModel.DEPOT.START] = tile;
      //   this.__setDepot(tile, TileModel.DEPOT.START);

      //   this.depotTiles[TileModel.DEPOT.END] = tile;
      //   this.__setDepot(tile, TileModel.DEPOT.END);
      // }
      // console.log("isOldDepotAry", depotVal, isOldDepotAry, updTile);
    } else {
      this.shelfInfoManager.release(tile)
      tile.draw()
    }
    // console.log("depotTiles", this.depotTiles);
  }

  /**
   * 棚座標を設定する。
   *
   * @param {String} cellId CellID(Exported address String)
   * @param {String} shelfCode ShelfCode(解除指定はnull)
   */
  setShelfInfoByCellId(cellId, shelfCode) {
    const colRow = TileElement.cellIdToColRow(cellId)
    this.setShelfInfo(colRow.col, colRow.row, shelfCode)
  }

  /**
   * 棚座標の設定状況を返す。
   *
   * @returns {
   *  棚コード: {col: ColumnIndex, row: RowIndex},
   *  ...
   * }
   */
  getShelfPointMap() {
    return this.shelfInfoManager.getShelfPointMap()
  }

  /**
   * 到着地点、出発地点情報を返す。
   *
   * @return {
   *    [TileModel.DEPOT.START]: {col: ColumnIndex, row: RowIndex},
   *    [TileModel.DEPOT.END]: {col: ColumnIndex, row: RowIndex}
   * } START,ENDに該当する設定値がない場合はnullとなる。
   */
  getDepotMap() {
    const ret = {}
    const keys = Object.keys(this.depotTiles)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const tile = this.depotTiles[key]
      ret[key] = tile ? { col: tile.col, row: tile.row } : null
    }
    return ret
  }

  /**
   * 該当タイルのクリアする領域を返す。
   *
   * @param {TileElement} tile タイル
   * @return {Bounds}クリアする領域
   */
  __getTileClearAreaBounds(tile) {
    const bounds = this.positionManager.getBounds(tile.col, tile.row)
    return this.__toCrearAreaBounds(bounds)
  }

  /**
   * タイルの領域からクリアする領域に変換する。
   *
   * @param {Bounds} bounds タイルの領域
   * @return {Bounds}クリアする領域
   */
  __toCrearAreaBounds(bounds) {
    const border = TileElement.BORDER_WIDTH // 枠線がRect内部に描画できるオプションが見つかれば楽なんだけど。
    return new Bounds(
      bounds.x + border,
      bounds.y + border,
      bounds.width - border,
      bounds.height - border
    )
  }

  /**
   * TileElement TileModel変更イベントハンドラ。
   *
   * @param {TileElement} tileElement TileElement
   */
  __tileModelChanging(tileElement) {
    // Down depot tile info.
    if (tileElement.tileModel && tileElement.tileModel.depot) {
      const depot = tileElement.tileModel.depot
      if (depot & TileModel.DEPOT.START) {
        this.depotTiles[TileModel.DEPOT.START] = null
      }
      if (depot & TileModel.DEPOT.END) {
        this.depotTiles[TileModel.DEPOT.END] = null
      }
    }
    // Release shelf.
    this.shelfInfoManager.release(tileElement)
  }

  /**
   * JSON出力用Object生成。
   *
   * @param {Number} unit タイル幅(cm)
   * @param {Object} shelfInfoMap 棚コード-ロケーションの連想配列
   * @return {Object} JSON出力用Object
   * @throws {String} バリデーションエラー等発生時
   */
  createOutputObject(unit, shelfInfoMap) {
    const ret = {}

    this.clearErrorMessage()
    const errMsg = {
      unsetTile: '',
      closedPassage: '',
      shelfInfo: '',
      unsetShelfPassage: ''
    }

    ret.width = this.cols.toString()
    ret.height = this.rows.toString()
    const unitMeter = (unit > 0) ? unit / 100 : unit // cm -> m
    ret.unit = unitMeter.toString()
    const locationcell2codes = this.shelfInfoManager.createLocationCellid2codesObject(shelfInfoMap)
    ret.locationcell2codes = locationcell2codes
    const cellid2codes = this.shelfInfoManager.createCellid2codesObject(shelfInfoMap)
    ret.cellid2codes = cellid2codes
    if (!this.shelfInfoManager.checkAllShelfPassage()) {
      // errMsg.unsetShelfPassage = MessageConst.grid.unsetShelfPassage
      errMsg.unsetShelfPassage = i18n.t('go.confirmTips.map_mapmaintain.grid.unsetShelfPassage')
    }

    const matrix = []
    for (let row = 0; row < this.rows; row++) {
      const colAry = []
      for (let col = 0; col < this.cols; col++) {
        // let tile = this.tileElementArray[row * this.cols + col];
        const tile = this.getTileElement(col, row)
        let tileModel = tile.tileModel
        if (!tileModel) {
          // throw "Undefined grid exist.(" + col + ", " + row + ")";
          // msg += "(" + col + ", " + row + ")";
          // 属性未設定タイルチェック
          // errMsg.unsetTile = MessageConst.grid.attributeUnsetTile
          errMsg.unsetTile = i18n.t('go.confirmTips.map_mapmaintain.grid.attributeUnsetTile')
          tileModel = new TileModel(TileModel.TYPE.ERROR, 0)
          tile.setTileModel(tileModel)
        } else if (tileModel.type === TileModel.TYPE.ERROR) {
          // 属性未設定タイルチェック(インポート後の再チェック)
          // errMsg.unsetTile = MessageConst.grid.attributeUnsetTile
          errMsg.unsetTile = i18n.t('go.confirmTips.map_mapmaintain.grid.attributeUnsetTile')
        } else if (this.isShelfTile(tileModel)) {
          // 通路方向に応じた隣接タイル取得
          const neighborTiles = this.getDirNeighborTiles(col, row, tileModel)
          if (!this.isDirNeighborTiles(neighborTiles)) {
            // errMsg.closedPassage = MessageConst.grid.passageClosed
            errMsg.closedPassage = i18n.t('go.confirmTips.map_mapmaintain.grid.passageClosed')
            tileModel.setPassageClosed(true)
            tile.draw()
          }
        }
        colAry.push(tileModel.getJSONMatrixVal())
      }
      matrix.push(colAry)
    }
    ret.matrix = matrix

    // 棚マスタCSV残件チェック
    errMsg.shelfInfo = this.validateShelfInfo(shelfInfoMap)

    // 表示するエラーメッセージ設定
    let errMsgAry = Object.values(errMsg)
    errMsgAry = errMsgAry.filter(v => !!v)
    this.errorMessage = (errMsgAry.length > 0) ? errMsgAry.join('\n') : ''

    // start/end
    const startCell = this.depotTiles[TileModel.DEPOT.START]
    ret.startPoint = startCell ? startCell.getCellId() : ''
    const endCell = this.depotTiles[TileModel.DEPOT.END]
    ret.endPoint = endCell ? endCell.getCellId() : ''

    return ret
  }

  /**
   * 棚座標指定済み エラー通路タイル判定
   *
   * @param {Object} tileModel タイル情報
   * @throws {Boolean} エラー判定結果
   */
  isShelfTile(tileModel) {
    let ret = false
    if (tileModel.type === TileModel.TYPE.PASSAGE || tileModel.type === TileModel.TYPE.PASSAGE_SHELF) {
      ret = true
    }
    return ret
  }

  /**
   * 通路タイルの進行方向が進めるかどうかチェック
   *
   * @param {TileElement} tile 通路の方向に隣接したタイル
   * @return {TileElement} ret
   */
  isPassageClosedTile(tile) {
    let ret = false
    if (!tile || !tile.tileModel) {
      return ret
    }
    if (tile === TileModel.TYPE.ERROR) { // grid 一番外枠タイル
      ret = true
    }
    if (tile.tileModel.type === TileModel.TYPE.SHELF) { // 隣接する棚がある
      ret = true
    } else if (tile.tileModel.type === TileModel.TYPE.WALL) { // 隣接する壁がある
      ret = true
    }
    return ret
  }

  /**
   * 通路タイルの進行方向チェック
   *
   * @param {Object} neighborTiles 通路の方向に隣接したタイル配列
   * @throws {Boolean} true: 進行方向が進める, false: 進めない
   */
  isDirNeighborTiles(neighborTiles) {
    let ret = true
    // 通路の隣接タイルのエラーチェック
    let tileAry = Object.values(neighborTiles)
    tileAry = tileAry.filter(v => !!v)
    for (let i = 0; i < tileAry.length; i++) {
      if (tileAry[i] === TileModel.TYPE.ERROR) {
        ret = false
        break
      }
      // if(tileAry[i].tileModel === null){
      //   continue;
      // }
      // if(tileAry[i].tileModel.passageClosed){
      //   // ret = false;
      //   // break;
      // }
    }
    return ret
  }

  /**
   * 棚マスタCSV設定チェック
   *
   * @param {Object} shelfInfoMap 棚コード-ロケーションの連想配列
   * @throws {String} エラーメッセージ
   */
  validateShelfInfo(shelfInfoMap) {
    let errMsg = ''
    const selectedShelfPoint = this.shelfInfoManager.getShelfPointMap()
    // let that = this
    if (Object.keys(shelfInfoMap).length > Object.keys(selectedShelfPoint).length) {
      // errMsg = MessageConst.grid.unsetShelfInfo
      errMsg = i18n.t('go.confirmTips.map_mapmaintain.grid.unsetShelfInfo')
    }
    return errMsg
  }

  getColRowByShapeCoords(shapeCoords) {
    try {
      const colRow = this.positionManager.toIndex(shapeCoords.x, shapeCoords.y, true)
      return colRow
    } catch {
      return null
    }
  }

  /**
   * JSONファイルのmatrixにてTileを設定する。
   *
   * matrix値は2重配列で値は
   * TileModel.TYPE.WALL、TileModel.TYPE.SHELF、
   * 4ビット2進数文字列("0000"-"1111")のいずれか。
   *
   * @param {Arry} matrx値
   * @throws {String} 想定外の値に遭遇した場合。
   */
  setUpTileByMatrix(matrix) {
    if (matrix.length !== this.rows) {
      throw new Error('heightとmatrixの要素数があっていません。(height:' + this.rows + ', matrix.length:' + matrix.length + ')')
    }
    for (let rowIdx = 0; rowIdx < matrix.length; rowIdx++) {
      const colItems = matrix[rowIdx]
      if (colItems.length !== this.cols) {
        throw new Error('widthとmatrixの要素数があっていません。(width:' + this.cols + ', matrix[' + rowIdx + '].length:' + colItems.length + ')')
      }
      for (let colIdx = 0; colIdx < colItems.length; colIdx++) {
        const val = colItems[colIdx]
        try {
          this.__setTileByMatrixValue(colIdx, rowIdx, val)
        } catch (errStr) {
          throw new Error(errStr + '(' + colIdx + ', ' + rowIdx + ')')
        }
      }
    }
  }

  /**
   * データインポート時のチェック
   *
   * @param なし
   * @throws なし
   */
  validateImportTiles() {
    const grid = this.getDrawAreaSize()
    const layerBounds = new Bounds(0, 0, grid.width, grid.height)

    // エラーメッセージの削除
    this.clearErrorMessage()
    const errMsg = {
      unsetTile: '',
      closedPassage: ''
      // shelfInfo: ""
    }

    // 未設定タイルは全方向として指定する(詰め替え作業)。
    const drawInfo = this.getTileElementAndRect(layerBounds)
    const tileAry = drawInfo.tileElementAry
    for (let i = 0; i < tileAry.length; i++) {
      const tile = tileAry[i]
      const tileModel = tile.tileModel
      // 通路タイルの制約チェック
      if (this.isShelfTile(tileModel)) {
        // 通路方向に応じた隣接タイル取得
        const neighborTiles = this.getDirNeighborTiles(tile.col, tile.row, tileModel)
        if (!this.isDirNeighborTiles(neighborTiles)) {
          tileModel.setPassageClosed(true)
          tile.draw()
        }
      }

      // エラーメッセージ取得
      if (tileModel.type === TileModel.TYPE.ERROR) {
        // errMsg.unsetTile = MessageConst.grid.attributeUnsetTile
        errMsg.unsetTile = i18n.t('go.confirmTips.map_mapmaintain.grid.attributeUnsetTile')
      } else if (tileModel.passageClosed) {
        // errMsg.passageClosed = MessageConst.grid.passageClosed
        errMsg.passageClosed = i18n.t('go.confirmTips.map_mapmaintain.grid.passageClosed')
      }
    }

    // 棚マスタCSV残件チェック
    // 取り込み時のチェックは不要
    // 表示するエラーメッセージ設定
    let errMsgAry = Object.values(errMsg)
    errMsgAry = errMsgAry.filter(v => !!v)
    this.errorMessage = (errMsgAry.length > 0) ? errMsgAry.join('\n') : ''
  }

  /**
   * matrix値にてTileを設定する。
   *
   * matrix値は2重配列で値は
   * TileModel.TYPE.WALL、TileModel.TYPE.SHELF、
   * 4ビット2進数文字列("0000"-"1111")のいずれか。
   *
   * @param {Integer} col ColumnIndex
   * @param {Integer} row RowIndex
   * @param {String} matrx値
   * @throws {String} 想定外の値に遭遇した場合。
   */
  __setTileByMatrixValue(col, row, val) {
    let type
    let direction = 0
    if (val.length === 1) {
      type = parseInt(val, 10)
      switch (type) {
        case TileModel.TYPE.WALL:
        case TileModel.TYPE.SHELF:
          break
        case 4: // このアプリ外で作られたJSONに存在する例外値 全方向通路として扱う
          type = TileModel.TYPE.PASSAGE
          direction = TileModel.DIR.LEFT | TileModel.DIR.UP | TileModel.DIR.RIGHT | TileModel.DIR.DOWN
          break
        default:
          throw new Error('matrixの値が想定外の値です(' + val + ')')
      }
      /*
      if(type !== TileModel.TYPE.WALL && type !== TileModel.TYPE.SHELF){
        throw "matrixの値が想定外の値です(" + val + ")";
      }
      */
    } else if (val.length === 4) {
      type = TileModel.TYPE.PASSAGE
      direction = parseInt(val, 2)
      if (isNaN(direction)) {
        throw new Error('matrixの値が想定外の値です(' + val + ')')
      }
    } else if (val.length === 3) {
      type = TileModel.TYPE.SHELF
      const arr = val.split('.')
      const val_direction = arr[arr.length - 1]
      direction = TileModel.IMPORT_DIR[val_direction]
    } else {
      // TileModel.TYPE.ERROR: 通路の方向なしで表示する。
      // 属性未設定タイルチェック
      type = TileModel.TYPE.ERROR
    }
    // else{
    //   throw "matrixの値が想定外の値です(" + val + ")";
    // }
    // タイル情報セット
    const tileModel = new TileModel(type, direction)
    const tile = this.getTileElement(col, row)
    tile.setTileModel(tileModel)
  }

  /**
   * エラーメッセージ取得
   *
   * @param: list エラーメッセージリスト
   * @returns なし
    */
  clearErrorMessage() {
    this.errorMessage = null
  }

  /**
   * エラーメッセージ取得
   *
   * @returns String message
    */
  getErrorMessage() {
    return this.errorMessage
  }

  /**
   * エラーメッセージのセット
   *
   * @param: msg エラーメッセージリスト
   * @returns なし
    */
  setErrorMessage(msg) {
    this.errorMessage = msg
  }
}

/**
 * 棚情報管理クラス
 */
class ShelfInfoManager {
  /**
   * 棚-タイル配列マップ
   * {棚Key: TileElement[], ...}
   */
  shelfTileAryMap = {};

  tileElementManager;

  /**
   * コンストラクタ。
   *
   * @returns {ShelfInfoManager}
   */
  constructor(tileElementManager) {
    this.tileElementManager = tileElementManager
  }

  /**
   * 棚情報を設定する。
   *
   * @param {TileElement} tileElement 棚情報を設定するタイル
   * @param {Array} shelfCodeAry 選択済み棚コード
   */
  assign(tileElement, shelfCodeAry) {
    const model = tileElement.tileModel
    if (!model) { // 空タイルなので操作できない
      return
    }
    // 対象のTileに割り当てを行う。
    model.setShelfLinked(true) // 設定可能な種別の判別はTileModelに任せる。
    // 選択済み棚マスタの更新
    // console.log("model.shelfLinked", model.shelfLinked);
    tileElement.setTileModel(model) // この時点でmodel上書きが検知されTileElementからEVENT_MODEL_CHANGING発行により棚情報のリンク解除が行われる。
    // 割り当て変更ができていた場合は内部リンクを更新する。
    // console.log("model.shelfLinked", model.shelfLinked);
    const list = (!shelfCodeAry) ? [null] : shelfCodeAry
    for (let i = 0; i < list.length; i++) {
      const shelfCode = list[i]

      if (model.shelfLinked) {
        // tileElement.shelfCode = shelfCode;
        tileElement.shelfCodeAry.push(shelfCode)
        let tileAry = this.shelfTileAryMap[shelfCode]
        if (!tileAry) {
          tileAry = []
          this.shelfTileAryMap[shelfCode] = tileAry
        }
        tileAry.push(tileElement)
      }
    }
  }

  /**
   * 棚情報を解除する。
   *
   * @param {TileElement} tileElement 棚情報を設定するタイル
   */
  release(tileElement) {
    const model = tileElement.tileModel
    if (!model) { // 空タイルなので操作できない
      return
    }

    const tileShelfCodeAry = tileElement.shelfCodeAry
    // 割り当て済みのデータを削除する。
    if (tileShelfCodeAry.length === 0) {
      return
    }

    model.setShelfLinked(false) // 設定可能な種別の判別はTileModelに任せる。
    model.setDirection(0)
    tileElement.shelfCodeAry = []
    for (let i = 0; i < tileShelfCodeAry.length; i++) {
      const shelfCode = tileShelfCodeAry[i]
      const tileAry = this.shelfTileAryMap[shelfCode]
      for (let j = 0; j < tileAry.length; j++) {
        const prev = tileAry[j]
        if (prev === tileElement) {
          tileAry.splice(j, 1)

          // 複数選択対応
          delete this.shelfTileAryMap[shelfCode]
          break
        }
      }
    }
  }

  /**
   * 設定状況を返す。
   *
   * @returns {
   *  棚コード: {col: ColumnIndex, row: RowIndex},
   *  ...
   * }
   */
  getShelfPointMap() {
    const ret = {}
    const keys = Object.keys(this.shelfTileAryMap)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const tileAry = this.shelfTileAryMap[key]
      if (!tileAry || !tileAry.length) {
        continue
      }
      const tile = tileAry[0] // 現状は1-1でしか紐づかない想定である(shelfCode:TileElement=1:1)。
      ret[key] = { col: tile.col, row: tile.row }
    }
    return ret
  }

  /**
   * 棚座標情報を出力フォーマットとして作成する。
   *
   * @shelfInfoMap {Object} shelfTileAryMap 設定済み棚マスタ
   * @returns {
   *  "cell-1-19": {
   *  ["01-001-1-1","01-001-1-2","01-001-1-3","01-001-2-1","01-001-2-2"],
   *  ["02-001-1-1","02-001-1-2","02-001-1-3","02-001-2-1","02-001-2-2"],
   *  },
   *  "cell-x-xx": { ["XXXXXa1","XXXXXa2,XXXXXa3,XXXXXa4", ・・・], ["XXXXXb1","XXXXXb2,XXXXXb3,XXXXXb4", ・・・] },
   *  ...
   * }
   */
  createLocationCellid2codesObject(shelfInfoMap) {
    const ret = {}
    const keys = Object.keys(this.shelfTileAryMap)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const tiles = this.shelfTileAryMap[key]
      if (!tiles || !tiles.length) {
        continue
      }
      const shelfInfo = shelfInfoMap[key]
      if (!shelfInfo || !shelfInfo.length) {
        continue
      }
      // let shelfStr = shelfInfo.join();
      const shelfAry = shelfInfo.sort()
      // 現在は複数の棚にkey(棚コード)を付与できる実装になっている。
      // 制約条件に合わせて修正が必要。
      for (let j = 0; j < tiles.length; j++) {
        const tile = tiles[j]
        const name = tile.getCellId()
        // ret[name] = shelfStr;
        ret[name] = (!ret[name]) ? [] : ret[name]
        // ret[name].push(shelfStr);
        ret[name].push(shelfAry)
        ret[name].sort()
      }
    }
    return ret
  }

  /**
   * 棚で隣の通路情報を出力フォーマットとして作成する。
   *
   * @shelfInfoMap {Object} shelfTileAryMap 設定済み棚マスタ
   * @returns {
   *  "cell-1-19": {
   *  ["01-001-1-1","01-001-1-2","01-001-1-3","01-001-2-1","01-001-2-2"],
   *  ["02-001-1-1","02-001-1-2","02-001-1-3","02-001-2-1","02-001-2-2"],
   *  },
   *  "cell-x-xx": { ["XXXXXa1","XXXXXa2,XXXXXa3,XXXXXa4", ・・・], ["XXXXXb1","XXXXXb2,XXXXXb3,XXXXXb4", ・・・] },
   *  ...
   * }
   */
  createCellid2codesObject(shelfInfoMap) {
    const ret = {}
    const keys = Object.keys(this.shelfTileAryMap)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const tiles = this.shelfTileAryMap[key]
      if (!tiles || !tiles.length) {
        continue
      }
      const shelfInfo = shelfInfoMap[key]
      if (!shelfInfo || !shelfInfo.length) {
        continue
      }
      // let shelfStr = shelfInfo.join();
      const shelfAry = shelfInfo.sort()
      // 現在は複数の棚にkey(棚コード)を付与できる実装になっている。
      // 制約条件に合わせて修正が必要。
      for (let j = 0; j < tiles.length; j++) {
        const tile = tiles[j]
        if (tile.tileModel && tile.tileModel.direction > 0) {
          const neighborTileDIR = this.tileElementManager.checkShelfPassage(tile, tile.tileModel.direction)
          if (neighborTileDIR) {
            const name = neighborTileDIR.getCellId()
            ret[name] = (!ret[name]) ? [] : ret[name]
            // ret[name].push(shelfStr);
            ret[name].push(shelfAry)
            ret[name].sort()
          }
        }
      }
    }
    return ret
  }

  /**
   * ピック位置未設定の棚があるかどうかチェックする
   *
   * @returns boolean
   */
  checkAllShelfPassage() {
    let ret = true
    if (JSON.stringify(this.shelfTileAryMap) === '{}') {
      ret = false
      return ret
    }
    const keys = Object.keys(this.shelfTileAryMap)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const tiles = this.shelfTileAryMap[key]
      if (!tiles || !tiles.length) {
        continue
      }
      for (let j = 0; j < tiles.length; j++) {
        const tile = tiles[j]
        if (!tile.tileModel || tile.tileModel.direction < 1) {
          ret = false
          return ret
        }
      }
    }
    return ret
  }
}

