import Konva from 'konva'
import TileModel from '../TileModel.js'

import Bounds from './Bounds.js'
import Coords from './Coords.js'
import CoordsConverter from './CoordsConverter.js'
import TileElementManager from './TileElementManager.js'
import FloorImageElementManager from './FloorImageElementManager.js'

var EventEmitter = require('events').EventEmitter

/**
 * 描画管理クラス。
 *
 * レイヤ管理、描画管理等をインタフェース化し、KONVAの実装を隠蔽化する。
 */
export default class DrawManager extends EventEmitter {
  /** スタンプ背景設定リクエストイベント */
  static EVENT_SHELF_POINT_CLICKED = 'shelf-point-clicked';
  /** 棚通路イベント */
  static EVENT_SHELF_PASSAGE_CLICKED = 'shelf-passage-clicked';
  /** 出発地点・到着地点適用完了イベント */
  static EVENT_DEPOT_INFO_APPLIED = 'depot-info-applied';
  /** タイル位置通知イベント */
  static EVENT_TILE_ADDRESS_NOTIFICATION = 'tile-address-notification';

  /** Mode enum. */
  static MODE = Object.freeze({
    NONE: 0,
    AREA: 1,
    STAMP: 2,
    ERASE: 3,
    FLOOR_IMG: 4,
    SELECT_GRID: 5,
    SHELF_POINT: 6,
    DEPOT_START: 7,
    DEPOT_END: 8,
    SHELF_PASSAGE: 9
  });
  /** Rubber band config */
  static CONF_RUBBER_BAND = {
    stroke: 'rgb(0, 161, 255)',
    strokeWidth: 1,
    hitStrokeWidth: 0,
    dash: [4, 6]
  };

  /** Konva Stage */
  stage;
  /** 図面画像レイヤ */
  floorImageLayer;
  /** グリッド(タイル)用レイヤ */
  gridLayer;
  /** ツール描画ワークレイヤ */
  drawLayer;
  /** TileElementManager */
  tileElementManager;
  /** FloorImageElementManager */
  floorImageManager;
  /** ズームレベル(0:等倍、負数:縮小 正数:拡大) */
  zoom = 0;
  /** ズームステップ (zoomStep の zoom 乗が表示時のズーム係数となる) */
  zoomStep = 1.2;
  /** 現在のモード*/
  mode = DrawManager.MODE.NONE;
  /** 描画時のTile属性 */
  tileModel;
  /** エリアモード実装 class */
  areaMode;
  /** スタンプモード実装 class */
  stampMode;
  /** 座標変換ユーティリティ */
  converter;
  /** 棚タイル描画モード */
  shelfPointMode;
  /** 棚通路描画モード */
  shelfPassageMode;
  /* 選択済み棚タイルリスト */
  shelfSelectedList;
  shelfInfoMap;
  /** カーソルポジション履歴 */
  prevCursorPos = {
    col: null,
    row: null
  };

  /**
   * コンストラクタ。
   *
   * @param {Stage} stage Target stage
   * @returns {DrawManager}
   */
  constructor(stage) {
    super()
    this.stage = stage
    this.floorImageLayer = new Konva.Layer()
    this.stage.add(this.floorImageLayer)
    this.gridLayer = new Konva.Layer()
    this.stage.add(this.gridLayer)
    this.drawLayer = new Konva.Layer()
    this.stage.add(this.drawLayer)

    this.tileElementManager = new TileElementManager()
    this.floorImageManager = new FloorImageElementManager()
    this.areaMode = new AreaMode()
    this.stampMode = new StampMode()
    this.converter = new CoordsConverter(this.stage)
    this.shelfPointMode = new ShelfPointMode()

    this.shelfPassageMode = new ShelfPassageMode()

    this.depotMode = new DepotMode()

    this.shelfSelectedList = []
    this.shelfCsvMasterList = []

    // Setup handlers for TileElementManager.
    const manager = this
    this.tileElementManager.on(TileElementManager.EVENT_DESTORY_ALL_TILE_SHAPES,
      () => { manager.__destroyAllTileElementShape() }
    )
    this.tileElementManager.on(TileElementManager.EVENT_ADD_TILE_SHAPE,
      (shape) => { manager.__addTileElementShape(shape) }
    )
    this.tileElementManager.on(TileElementManager.EVENT_CLEAR_TILE_BOUNDS,
      (shapeBounds) => { manager.__clearGridBounds(shapeBounds) }
    )
    // Setup handlers for FloorImageElementManager.
    this.floorImageManager.on(FloorImageElementManager.EVENT_DRAW_FLOOR_IMAGE_SHAPES,
      () => { manager.__drawFloorImageShapes() }
    )
    this.floorImageManager.on(FloorImageElementManager.EVENT_ADD_FLOOR_IMAGE_SHAPE,
      (shape) => { manager.__addFloorImageShape(shape) }
    )
    // Draw helper handlers.
    // タイル描画リクエスト
    this.areaMode.on(AreaMode.EVENT_DRAW_TILE,
      (bounds) => { manager.__drawTiles(bounds, this.tileModel) }
    )
    // Mouse move イベント
    this.areaMode.on(AreaMode.EVENT_MOUSE_MOVE,
      (layerCoords) => { manager.__mouseMoveHandler(layerCoords) }
    )
    // ラバーバンド描画リクエスト
    this.areaMode.on(AreaMode.EVENT_DRAW_RUBBER_BAND,
      (layerBounds) => { manager.__drawRubberBand(layerBounds) }
    )
    // スタンプ背景設定リクエスト
    this.stampMode.on(StampMode.EVENT_SET_STAMP_BACKGROUND_COLOR,
      () => { manager.__setStampBackgroundColor() }
    )
    // スタンプ適用リクエスト
    this.stampMode.on(StampMode.EVENT_SET_TILE_IN_BOUNDS,
      (bounds, eraseFlag) => { manager.__setTileInBounds(bounds, eraseFlag) }
    )
    // Mouse move イベント
    this.stampMode.on(StampMode.EVENT_MOUSE_MOVE,
      (layerCoords) => { manager.__mouseMoveHandler(layerCoords) }
    )

    // 棚座標リクエスト
    this.shelfPointMode.on(ShelfPointMode.EVENT_SHELF_POINT_CLICKED,
      (shapeCoords) => { manager.__shelfPointCliked(shapeCoords) }
    )

    // 棚通路リクエスト
    this.shelfPassageMode.on(ShelfPassageMode.EVENT_SHELF_PASSAGE_CLICKED,
      (shapePoint) => { manager.__shelfPassageCliked(shapePoint) }
    )

    // 出発・到着地点設定リクエスト
    this.depotMode.on(DepotMode.EVENT_SET_DEPOT,
      (layerCoords, depotVal) => { manager.__setDepot(layerCoords, depotVal) }
    )

    // タイルポジション表示用ハンドラ
    this.stage.on('mousemove', function(e) {
      const layerCoords = new Coords(e.evt.layerX, e.evt.layerY)
      manager.__mouseMoveHandler(layerCoords)
    })
  }

  /**
   * JSONオブジェクトで初期化を行う。
   *
   * @param {Object} src インポート用JSONファイルから生成されたObject
   */
  setUpByJSON(src) {
    try {
      this.__setUpJsonProcess(src)
    } catch (errMsg) {
      // Opportunity for clean up!!
      console.error(errMsg)

      throw errMsg
    }
  }

  /**
   * JSONオブジェクトで初期化を行う。
   *
   * @param {Object} src インポート用JSONファイルから生成されたObject
   */
  __setUpJsonProcess(src) {
    // Set up grid.
    const cols = parseInt(src.width, 10)
    const rows = parseInt(src.height, 10)
    if (isNaN(cols)) {
      throw new Error('widthが正しく設定されていません(' + src.width + ')')
    }
    if (isNaN(rows)) {
      throw new Error('heightが正しく設定されていません(' + src.height + ')')
    }
    this.createGrid(cols, rows)
    // Set up tiles.
    this.tileElementManager.setUpTileByMatrix(src.matrix)
    this.tileElementManager.validateImportTiles(src.matrix)
    // Set up Cellids.(棚座標)
    // 棚コードの逆引きマップを作成。
    const revMap = {}
    const keys = Object.keys(this.shelfInfoMap)
    const vals = Object.values(this.shelfInfoMap)
    for (let i = 0; i < keys.length; i++) {
      revMap[vals[i]] = keys[i]
    }
    // 棚コードを逆引きして存在しない場合はコード登録を行わない。
    const cellids = Object.keys(src.locationcell2codes)
    for (let i = 0; i < cellids.length; i++) {
      const cellId = cellids[i]
      const shelfCodeStrAry = []
      const idStrAry = src.locationcell2codes[cellId]
      for (let j = 0; j < idStrAry.length; j++) {
        let idStr = idStrAry[j]
        // カンマ区切りになっている正規化のためバラしてソートして結合
        // idStr= idStr.split(',').sort().join();
        idStr = idStr.sort().join()
        const shelfCodesStr = revMap[idStr]
        if (!shelfCodesStr) {
          continue // 存在しない場合はコード登録を行わない。
        }
        shelfCodeStrAry.push(shelfCodesStr)
      }

      // 棚座標セット
      this.tileElementManager.setShelfInfoByCellId(cellId, shelfCodeStrAry)

      // 棚指定した通路タイルの方向は再度チェックする
      // 棚指定した通路タイルと進んでない方面を指定しているタイル共存場合、棚指定した通路タイル表示する
      // 2021/06/04 新た仕様のため、一応使用しません。
      // this.tileElementManager.setShelfLinked(cellId);
    }
    // 出発地点・到着地点
    const startCellId = src.startPoint
    if (startCellId) {
      this.tileElementManager.setDepotByCellId(startCellId, TileModel.DEPOT.START)
    }
    const endCellId = src.endPoint
    if (endCellId) {
      this.tileElementManager.setDepotByCellId(endCellId, TileModel.DEPOT.END)
    }
  }

  /**
   * グリッドの作成。
   *
   * 既存のグリッド(タイル)の情報は失われる。
   *
   * @param {Integer} cols Column数
   * @param {Integer} rows Row数
   */
  createGrid(cols, rows) {
    const gridBounds = this.tileElementManager.initialize(cols, rows)
    this.floorImageManager.justify(gridBounds.width, gridBounds.height)
    this.floorImageLayer.draw()
    this.gridLayer.draw()
  }

  /**
   * ズームを変更する。
   *
   * @param {Integer} delta ズーム増減
   */
  changeZoom(delta) {
    this.__setZoom(this.zoom + delta)
  }

  /**
   * 現在のズームレベルを取得する。
   */
  getZoom() {
    return this.zoom
  }

  /**
   * ズームステップを取得する。
   */
  getZoomStep() {
    return this.zoomStep
  }

  /**
   * 1タイル分の幅を取得する。
   */
  getTileSize() {
    return this.tileElementManager.getTileSize()
  }

  /**
   * 指定サイズに調整する。
   *
   * @param {Integer} width
   * @param {Integer} height
   */
  justify(width, height) {
    const baseSize = this.tileElementManager.getDrawAreaSize()
    const rateW = width / baseSize.width
    const rateH = height / baseSize.height

    const rate = rateW < rateH ? rateW : rateH
    const zoom = Math.floor(Math.log(rate) / Math.log(this.zoomStep))

    this.__setZoom(zoom)
  }

  /**
   * 棚CSV情報設定。
   *
   * @param {[{key: 棚コード(String), location: ロケーション(String)}, ...]} shelfCsv CSVデータを棚コードでまとめ上げた配列
   */
  setShelfCsvData(shelfCsv) {
    const shelfInfoMap = {}
    for (let i = 0; i < shelfCsv.length; i++) {
      const rec = shelfCsv[i]
      let shelfInfoAry = shelfInfoMap[rec.key]
      if (!shelfInfoAry) {
        shelfInfoAry = []
        shelfInfoMap[rec.key] = shelfInfoAry
      }
      shelfInfoAry.push(rec.location)
      shelfInfoAry = shelfInfoAry.sort()
    }
    this.shelfInfoMap = shelfInfoMap
  }

  /**
   * スケールを変更する。
   *
   * @param {Integer} zoom 0:等倍、負数:縮小 正数:拡大
   */
  __setZoom(zoom) {
    this.zoom = zoom

    const scaleCoeff = Math.pow(this.zoomStep, this.zoom)
    const baseSize = this.tileElementManager.getDrawAreaSize()

    const stage = this.stage
    stage.width(Math.ceil(baseSize.width * scaleCoeff))
    stage.height(Math.ceil(baseSize.height * scaleCoeff))
    stage.scale({ x: scaleCoeff, y: scaleCoeff })
    stage.draw()
  }

  /**
   * 描画モード(AREA, STAMP)時に適用されるタイルモデル。
   */
  setTileModel(tileModel) {
    this.tileModel = tileModel
    // スタンプモードの場合、スタンプの背景を変える。
    if (this.mode === DrawManager.MODE.STAMP) {
      this.stampMode.setStampBackgroundColor(this.tileModel.getBackgroundColor())
      this.drawLayer.draw()
    }
  }

  /**
   * フロアイメージ画像を設定する。
   *
   * @param {} url URL
   */
  setFloorImage(url) {
    // Bounds for initial size.
    const layerBounds = new Bounds(
      0, 0, 400, 300
    )
    const shapeBounds = this.converter.toShapeBounds(layerBounds)
    this.floorImageManager.setImage(url, shapeBounds)
  }

  /**
   * フロアイメージ画像を削除する。
   *
   * @param {} url URL
   */
  removeFloorImage() {
    this.floorImageManager.removeImage()
    this.floorImageLayer.draw()
  }

  /*
   * 取得した選択済み棚マスタ一覧をセットする。
   */
  setShelfSelectedList(selectedList) {
    this.shelfSelectedList = []
    for (let i = 0; i < selectedList.length; i++) {
      this.shelfSelectedList.push(selectedList[i])
    }
  }

  /*
   * 取得した選択済み棚マスタ一覧をセットする。
   */
  setShelfCsvMasterList(selectedList) {
    for (let i = 0; i < selectedList.length; i++) {
      this.shelfCsvMasterList.push(selectedList[i])
    }
  }

  /*
   * 取得した選択済み棚マスタ一覧を取得する。
   */
  getShelfSelectedList() {
    return this.shelfSelectedList
  }

  /**
   * 選択済み棚マスタの取得
   *
   * @return {Array} list 棚マスタCSV list
   */
  getSelectedShelfMaster() {
    return this.tileElementManager.getShelfSelectedList()
  }

  /**
   * モード設定。
   *
   * @param {Integer} mode DrawManager.MODEのいずれか。
   */
  setMode(mode) {
    // if(mode === this.mode){
    //   return;
    // }
    // Set default state of DrawManager.
    this.areaMode.enableAreaMode(false, this.gridLayer)
    this.stampMode.enableStampMode(false, this.drawLayer)
    this.depotMode.enableDepotMode(false, this.gridLayer)
    this.floorImageManager.enableEdit(false)

    switch (mode) {
      case DrawManager.MODE.NONE:
        this.__layerToFront(this.drawLayer)
        break
      case DrawManager.MODE.AREA:
        this.areaMode.enableAreaMode(true, this.gridLayer)
        this.__layerToFront(this.drawLayer)
        break
      case DrawManager.MODE.STAMP:
        this.stampMode.enableStampMode(true, this.drawLayer)
        this.__layerToFront(this.drawLayer)
        break
      case DrawManager.MODE.ERASE:
        this.stampMode.enableStampMode(true, this.drawLayer, true)
        this.__layerToFront(this.drawLayer)
        break
      case DrawManager.MODE.FLOOR_IMG:
        this.floorImageManager.enableEdit(true)
        this.__layerToFront(this.floorImageLayer)
        break
      case DrawManager.MODE.SHELF_POINT:
        this.shelfPointMode.enableShelfPointMode(true, this.gridLayer)
        this.__layerToFront(this.drawLayer)
        break
      case DrawManager.MODE.SHELF_PASSAGE:
        this.shelfPassageMode.enableShelfPassageMode(true, this.gridLayer)
        this.__layerToFront(this.drawLayer)
        break
      case DrawManager.MODE.DEPOT_START:
        this.depotMode.enableDepotMode(true, this.gridLayer, TileModel.DEPOT.START)
        this.__layerToFront(this.drawLayer)
        break
      case DrawManager.MODE.DEPOT_END:
        this.depotMode.enableDepotMode(true, this.gridLayer, TileModel.DEPOT.END)
        this.__layerToFront(this.drawLayer)
        break
      default:
        throw new Error('No such mode.(' + mode + ')')
    }
    this.mode = mode
  }

  /**
   * データ出力(JSON)
   *
   * @param {Integer} unit 単位(m)
   * @returns {JSON}
   */
  createJson(unit) {
    const obj = this.tileElementManager.createOutputObject(unit, this.shelfInfoMap)
    this.stage.draw()
    return JSON.stringify(obj, null, 2)
  }

  /**
  * エラーメッセージ削除
  *
  * @param なし
  * @returns なし
  */
  clearErrorMessage() {
    return this.tileElementManager.clearErrorMessage()
  }

  /**
  * エラーメッセージ取得
  *
  * @param なし
  * @returns {String} errorMessage
  */
  getErrorMessage() {
    return this.tileElementManager.getErrorMessage()
  }

  /**
   * 棚座標を設定する。
   *
   * @param {Integer} col Columnインデックス
   * @param {Integer} row Rowインデックス
   * @param {Array} shelfCodeAry 選択済みShelfCode(解除指定はnull)
   */
  setShelfPoint(col, row, shelfCodeAry, dir = null, updateShelfFlag = false) {
    this.tileElementManager.setShelfInfo(col, row, shelfCodeAry, dir, updateShelfFlag)
  }

  getTileElement(col, row) {
    const tileElement = this.tileElementManager.getTileElement(col, row)
    return tileElement
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
    return this.tileElementManager.getShelfPointMap()
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
    return this.tileElementManager.getDepotMap()
  }

  /**
   * 通路の自動設定
   *
   * @param
   */
  passageAutoDraw() {
    const grid = this.tileElementManager.getDrawAreaSize()
    const layerBounds = new Bounds(0, 0, grid.width, grid.height)
    this.tileElementManager.setPassageTileModel(layerBounds)
  }

  /**
   * ピック位置の自動設定
   *
   * @param
   */
  shelfPassageAutoDraw() {
    const grid = this.tileElementManager.getDrawAreaSize()
    const layerBounds = new Bounds(0, 0, grid.width, grid.height)
    this.tileElementManager.setShelfPassageTileModel(layerBounds)
  }

  /**
   * レイヤを最前面に引き出す。
   *
   * @param {Konva.Layer} layer レイヤ
   */
  __layerToFront(layer) {
    const maxZIndex = this.stage.getLayers().length - 1

    const defaultOrderLayers = [
      this.floorImageLayer,
      this.gridLayer,
      this.drawLayer
    ]

    let index = 0
    for (let i = 0; i < defaultOrderLayers.length; i++) {
      const target = defaultOrderLayers[i]
      const zIndex = (target === layer) ? maxZIndex : index++
      target.zIndex(zIndex)
    }
  }

  /**
   * タイルに属する全shapeデータを削除する。
   */
  __destroyAllTileElementShape() {
    this.gridLayer.destroyChildren()
  }

  /**
   * Shapeを登録する。
   *
   * @param {Shape} shape 登録するShape
   */
  __addTileElementShape(shape) {
    this.gridLayer.add(shape)
  }

  /**
   * FloorImageLayerを描画する。
   */
  __drawFloorImageShapes() {
    this.floorImageLayer.draw()
  }

  /**
   * Shapeを登録する。
   *
   * @param {Shape} shape 登録するShape
   */
  __addFloorImageShape(shape) {
    this.floorImageLayer.add(shape)
  }

  /**
   * グリッドレイヤの領域をクリアする。
   *
   * @param {Bounds} shapeBounds クリアしたいShape領域
   */
  __clearGridBounds(shapeBounds) {
    const layerBounds = this.converter.toLayerBounds(shapeBounds)
    this.gridLayer.clear(layerBounds)
  }

  /**
   * 対象layer領域内にあるタイルに現在設定されているタイルモデルを適用する。
   *
   * @param {Bounds} layerBounds 設定領域
   * @param {TileModel} tileModel 設定するタイルモデル
   */
  __drawTiles(layerBounds, tileModel) {
    const shapeBounds = this.converter.toShapeBounds(layerBounds)
    this.tileElementManager.setTileModel(shapeBounds, tileModel)
  }

  /**
   * ラバーバンドを描画する。
   *
   * @param {Bounds} bounds レイヤ座標領域
   */
  __drawRubberBand(layerBounds) {
    const layer = this.drawLayer
    // Clear
    layer.destroyChildren()
    if (!layerBounds) { // Case of dragend.
      layer.draw()
      return
    }
    const shapeBounds = this.converter.toShapeBounds(layerBounds)
    const ptAry = [
      shapeBounds.getTopLeft(),
      shapeBounds.getTopRight(),
      shapeBounds.getBottomRight(),
      shapeBounds.getBottomLeft(),
      shapeBounds.getTopLeft()
    ]
    const points = []
    for (let i = 0; i < ptAry.length; i++) {
      points.push(ptAry[i].x)
      points.push(ptAry[i].y)
    }
    const conf = Object.assign({}, DrawManager.CONF_RUBBER_BAND)
    conf.points = points
    const line = new Konva.Line(conf)
    layer.add(line)
    layer.draw()
  }

  /**
   * スタンプ背景を設定する。
   */
  __setStampBackgroundColor() {
    if (!this.tileModel) {
      return
    }
    this.stampMode.setStampBackgroundColor(this.tileModel.getBackgroundColor())
  }

  /**
   * スタンプ領域のタイル設定を行う。
   *
   * @param {Bounds} layerBounds レイヤ領域
   * @param {Boolean} elaseFlag false:描画、true:削除
   */
  __setTileInBounds(layerBounds, eraseFlag) {
    const tileModel = eraseFlag ? null : this.tileModel
    this.__drawTiles(layerBounds, tileModel)
  }

  /**
   * 対象layer領域内に棚タイル情報を取得しイベント発行。
   *
   * @param {Coords} shapeCoords Shape座標
   */
  __shelfPointCliked(shapeCoords) {
    const shelfInfo = this.tileElementManager.getShelfInfo(shapeCoords)
    if (!shelfInfo) {
      return
    }
    this.emit(DrawManager.EVENT_SHELF_POINT_CLICKED, shelfInfo)
  }

  /**
   * 棚通路を取得しイベント発行。
   *
   * @param {Coords} shapePoint Shape座標
   */
  __shelfPassageCliked(shapePoint) {
    const shapeBounds = Bounds.createByPoints(shapePoint, shapePoint)
    const drawInfo = this.tileElementManager.getTileElementAndRect(shapeBounds)
    const bounds = drawInfo.bounds
    const shelfInfo = this.tileElementManager.getShelfPassageInfo(drawInfo)
    if (!shelfInfo) {
      return
    }

    const currentTileElement = drawInfo.tileElementAry[0]
    const currentTileModel = currentTileElement.tileModel

    const neighborTileDIR = this.tileElementManager.checkShelfPassage(currentTileElement, this.tileModel.direction)
    if (!neighborTileDIR) {
      return
    }

    currentTileModel.setDirection(this.tileModel.direction)
    // clear layer
    this.__clearGridBounds(bounds)
    currentTileElement.draw()
  }

  /**
   * 出発・到着地点を設定する。
   *
   * @param {Coords} layerCoords 設定対象のレイヤ座標
   * @param {Integer} depotVal TileModel.DEPOT.START:出発、TileModel.DEPOT.END:到着
   */
  __setDepot(layerCoords, depotVal) {
    // console.log('current tileElement(2, 2)::', this.tileElementManager.getTileElement(2, 2));
    // console.log('current tileElement(3, 2)::', this.tileElementManager.getTileElement(3, 2));
    // console.log('current tileElement(2, 4)::', this.tileElementManager.getTileElement(2, 4));
    const shapeCoords = this.converter.toShapeCoords(layerCoords)
    this.tileElementManager.setDepot(shapeCoords, depotVal)

    // 座標設定配列をイベントで通知
    const depotTiles = this.tileElementManager.depotTiles
    this.emit(DrawManager.EVENT_DEPOT_INFO_APPLIED, depotTiles)
  }

  /**
   * MouseMoveハンドラ(タイルアドレス通知用)
   *
   * @param {Coords} layerCoords マウス位置(Layer座標)
   */
  __mouseMoveHandler(layerCoords) {
    const shapeCoords = this.converter.toShapeCoords(layerCoords)
    let colRow = this.tileElementManager.getColRowByShapeCoords(shapeCoords)
    if (!colRow) {
      colRow = { col: null, row: null }
    }
    const prevCursorPos = this.prevCursorPos
    this.prevCursorPos = colRow
    if (colRow.col !== prevCursorPos.col || colRow.row !== prevCursorPos.row) {
      this.emit(DrawManager.EVENT_TILE_ADDRESS_NOTIFICATION, colRow)
    }
  }
}

/**
 * エリアモード切替ヘルパクラス。
 */
class AreaMode extends EventEmitter {
  /** タイル描画イベント */
  static EVENT_DRAW_TILE = 'draw-tile';
  /** ラバーバンド描画イベント */
  static EVENT_DRAW_RUBBER_BAND = 'draw-rubber-band';
  /** Mouse move イベント*/
  static EVENT_MOUSE_MOVE = 'mouse-move';

  /** 開始レイヤ座標 */
  beginLayerCoords = null;
  __mouseMoveHandlerForRubberBand = null;

  constructor() {
    super()
    const areaMode = this
    this.__mouseMoveHandlerForRubberBand =
      (e) => { areaMode.areaMouseMoveHandler(e) }
  }

  /**
   * エリア描画モードを設定する。
   *
   * @param {Boolean} enable true:有効化、false:無効化
   * @param {Konva.Layer} gridLayer グリッド描画レイヤ
   */
  enableAreaMode(enable, gridLayer) {
    const areaMode = this

    areaMode.beginLayerCoords = null
    gridLayer.off('mousedown')
    gridLayer.off('mouseup')
    gridLayer.off('mousemove')
    if (!enable) {
      return
    }

    gridLayer.on('mousedown',
      (e) => { areaMode.areaModeMouseDownHandler(e, gridLayer) }
    )
    gridLayer.on('mouseup',
      (e) => { areaMode.areaModeMouseUpHandler(e, gridLayer) }
    )
  }

  /**
   * エリアモード中のMouseDownイベントハンドラ。
   *
   * 開始端点の保存、ラバーバンド描画設定。
   *
   * @param {Object} e イベントObject
   * @param {Layer} gridLayer グリッド描画レイヤ
   */
  areaModeMouseDownHandler(e, gridLayer) {
    const evt = e.evt
    this.beginLayerCoords = new Coords(evt.layerX, evt.layerY)

    gridLayer.off('mousemove', this.__mouseMoveHandlerForRubberBand)
    gridLayer.on('mousemove', this.__mouseMoveHandlerForRubberBand)
  }

  /**
   * エリアモード中のMouseUpイベントハンドラ。
   *
   * ラバーバンド削除、タイル描画。
   *
   * @param {Object} e イベントObject
   * @param {Layer} gridLayer グリッド描画レイヤ
   */
  areaModeMouseUpHandler(e, gridLayer) {
    const evt = e.evt
    const endLayerCoords = new Coords(evt.layerX, evt.layerY)
    const bounds = Bounds.createByPoints(this.beginLayerCoords, endLayerCoords)

    gridLayer.off('mousemove', this.__mouseMoveHandlerForRubberBand)

    this.emit(AreaMode.EVENT_DRAW_TILE, bounds)
    this.emit(AreaMode.EVENT_DRAW_RUBBER_BAND, null)
    this.beginLayerCoords = null
  }

  /**
   * エリアモード中のMouseMoveイベントハンドラ。
   *
   * ラバーバンドの更新を行う。
   *
   * @param {Object} e イベントObject
   */
  areaMouseMoveHandler(e) {
    const currCoords = new Coords(e.evt.layerX, e.evt.layerY)
    const bounds = Bounds.createByPoints(this.beginLayerCoords, currCoords)
    this.emit(AreaMode.EVENT_DRAW_RUBBER_BAND, bounds)
  }
}

/**
 * スタンプモード切替ヘルパクラス。
 */
class StampMode extends EventEmitter {
  /** スタンプ背景設定リクエストイベント */
  static EVENT_SET_STAMP_BACKGROUND_COLOR = 'set-stamp-background-color';
  /** ラバーバンド描画イベント */
  static EVENT_SET_TILE_IN_BOUNDS = 'set-tile-in-shape-bounds';
  /** Mouse move イベント*/
  static EVENT_MOUSE_MOVE = 'mouse-move';

  /** 開始レイヤ座標 */
  beginLayerCoords = null;

  stampRect = null;
  transformer = null;
  eraseFlag = false;

  /**
   * スタンプモードを設定する。
   *
   * @param {Boolean} enable true:有効化、false:無効化
   * @param {Konva.Layer} drawLayer ツール描画レイヤ
   * @param {Boolen} eraseFlag false:描画、true:消去
   * @param {BOunds} bounds スタンプ初期表示指定
   */
  enableStampMode(enable, drawLayer, eraseFlag, bounds) {
    const stampMode = this
    // Disable stamp mode.
    if (!enable) {
      drawLayer.destroyChildren()
      this.stampRect = null
      this.transformer = null
      drawLayer.draw()
      return
    }
    // Set erase flag.
    this.eraseFlag = eraseFlag
    // Stamp mode is ready?
    if (this.stampRect && this.transformer) {
      return
    }
    // Need default?
    if (!bounds) {
      // Set default bounds.
      bounds = new Bounds(50, 50, 100, 50)
    }
    // Create shpes for stamp.
    this.transformer = new Konva.Transformer({
      visible: false,
      rotateEnabled: false,
      keepRatio: false,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    })
    this.stampRect = new Konva.Rect({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      draggable: true
    })
    if (!this.eraseFlag) { // Request to DrawMnager.
      this.emit(StampMode.EVENT_SET_STAMP_BACKGROUND_COLOR)
    }
    // Add shapes and some settings.
    drawLayer.add(this.transformer)
    drawLayer.add(this.stampRect)
    this.transformer.nodes([this.stampRect])
    this.transformer.visible(true)
    drawLayer.draw()
    // Stamp rendering trigger.
    this.stampRect.off('click')
    this.stampRect.on('click',
      (e) => { stampMode.stampRectClickHandler(e) }
    )
    this.stampRect.off('dragmove')
    this.stampRect.on('dragmove',
      (e) => { stampMode.dragMoveHandlerForColRowNotify(e) }
    )
  }

  /**
   * スタンプモード中のClickイベントハンドラ。
   */
  stampRectClickHandler() {
    const t = this.transformer
    const bounds = new Bounds(t.x(), t.y(), t.width(), t.height())

    this.emit(StampMode.EVENT_SET_TILE_IN_BOUNDS, bounds, this.eraseFlag)
  }

  /**
   * スタンプ背景色設定。
   *
   * @param {String} color 背景色
   */
  setStampBackgroundColor(color) {
    if (!this.stampRect) {
      return
    }
    this.stampRect.fill(color)
  }

  /**
   * Col,Row通知用 Drag move ハンドラ。
   *
   * @param {Object} e イベントObject
   */
  dragMoveHandlerForColRowNotify(e) {
    const currCoords = new Coords(e.evt.layerX, e.evt.layerY)
    this.emit(StampMode.EVENT_MOUSE_MOVE, currCoords)
  }
}

/**
 * 棚座標描画モード
 *
 */
class ShelfPointMode extends EventEmitter {
  static EVENT_SHELF_POINT_CLICKED = 'shelf-point-clicked';
  // beginTarget = null;
  // currentShelfPoint = null;

  enableShelfPointMode(enable, gridLayer) {
    // Clear handler.
    gridLayer.off('mousedown')

    if (!enable) {
      return
    }

    const shelfPointMode = this
    // event
    gridLayer.on('mousedown',
      (e) => { shelfPointMode.shelfPointModeMouseDownHandler(e) }
    )
  }

  // エリア描画(mousedown)
  shelfPointModeMouseDownHandler(e) {
    const grid = e.target
    const shapePoint = new Coords(grid.x(), grid.y())
    this.emit(ShelfPointMode.EVENT_SHELF_POINT_CLICKED, shapePoint)
  }
}

/**
 * 棚通路描画モード
 *
 */
class ShelfPassageMode extends EventEmitter {
  static EVENT_SHELF_PASSAGE_CLICKED = 'shelf-passage-clicked';
  // beginTarget = null;
  // currentShelfPoint = null;

  enableShelfPassageMode(enable, gridLayer) {
    // Clear handler.
    gridLayer.off('mousedown')

    if (!enable) {
      return
    }

    const shelfPassageMode = this
    // event
    gridLayer.on('mousedown',
      (e) => { shelfPassageMode.shelfPassageModeMouseDownHandler(e) }
    )
  }

  // エリア描画(mousedown)
  shelfPassageModeMouseDownHandler(e) {
    const grid = e.target
    const shapePoint = new Coords(grid.x(), grid.y())
    this.emit(ShelfPassageMode.EVENT_SHELF_PASSAGE_CLICKED, shapePoint)
  }
}

/**
 * 出発地点・到着地点設定モード
 */
class DepotMode extends EventEmitter {
  static EVENT_SET_DEPOT = 'set-depot';

  depotVal = 0;

  enableDepotMode(enable, gridLayer, depotVal) {
    // Clear handler.
    gridLayer.off('mousedown')
    gridLayer.off('mouseup')
    gridLayer.off('click')

    if (!enable) {
      return
    }
    // value check.
    if (!Object.values(TileModel.DEPOT).includes(depotVal)) {
      throw new Error('Unexpected depotVal(' + depotVal + ').')
    }

    this.depotVal = depotVal
    const depotModel = this
    // event
    gridLayer.on('click',
      (e) => { depotModel.deptModeClickHandler(e) }
    )
  }

  // 出発・到着地点設定(click)
  deptModeClickHandler(e) {
    const evt = e.evt
    const layerCoords = new Coords(evt.layerX, evt.layerY)
    this.emit(DepotMode.EVENT_SET_DEPOT, layerCoords, this.depotVal)
  }
}

