// import Bounds from './Bounds.js'

/**
 * 座標変換ユーティリティクラス。
 *
 * 今のところのドキュメント上での使い分け。
 * レイヤ座標(layerCoords) -> Layerオブジェクトの座標
 * シェイプ座標(shapeCoords) -> Rect,Line等のLayerに配置されたオブジェクトの座標
 */
export default class CoordsConverter {
  /** ステージ */
  stage;

  /**
   * コンストラクタ。
   *
   * @param {Stage} stage
   * @returns {CoordsConverter}
   */
  constructor(stage) {
    this.stage = stage
  }

  /**
   * レイヤ座標からシェイプ座標に変換する。
   *
   * @param {Coords} layerCoords レイヤ座標
   * @returns {Coords} シェイプ座標
   */
  toShapeCoords(layerCoords) {
    const scale = this.stage.scale()
    scale.x = 1 / scale.x
    scale.y = 1 / scale.y
    return layerCoords.multiplyWithScale(scale)
    /*
    return {
      x: layerCoords.x / scale.x,
      y: layerCoords.y / scale.y
    };
    */
  }

  /**
   * シェイプ座標からレイヤ座標に変換する。
   *
   * @param {Coords} shapeCood シェイプ座標
   * @returns {Coords} レイヤ座標
   */
  toLayerCoords(shapeCoords) {
    const scale = this.stage.scale()
    return shapeCoords.multiplyWithScale(scale)
    /*
    return {
      x: shapeCoords.x * scale.x,
      y: shapeCoords.y * scale.y
    };
    */
  }

  /**
   * レイヤBoundsからシェイプBoundsに変換する。
   *
   * @param {Bounds} layerBounds レイヤBounds
   * @returns {x: x座標, y: y座標} シェイプBounds
   */
  toShapeBounds(layerBounds) {
    const scale = this.stage.scale()
    scale.x = 1 / scale.x
    scale.y = 1 / scale.y
    return layerBounds.multiplyWithScale(scale)
  }

  /**
   * シェイプBoundsからレイヤBoundsに変換する。
   *
   * @param {Bounds} shapeBounds シェイプBounds
   * @returns {x: x座標, y: y座標} レイヤBounds
   */
  toLayerBounds(layerBounds) {
    const scale = this.stage.scale()
    return layerBounds.multiplyWithScale(scale)
  }
}
