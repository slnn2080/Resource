/*
 * タイルモデル。
 */
export default class TileModel {
  /** タイル種別。 */
  static TYPE = Object.freeze({
    ERROR: -1, // error(タイル属性未設定の場合使用する)
    WALL: 0, // 通過不可能な壁
    PASSAGE: 1, // 通路
    SHELF: 2 // 棚
  });

  /** タイル種別による背景色。 */
  static BACKGROUND_COLOR_ARY = {
    [TileModel.TYPE.WALL]: 'rgb(204,204,204, 1)', // ltGray
    [TileModel.TYPE.PASSAGE]: 'transparent',
    // [TileModel.TYPE.SHELF]: 'rgb(255,140,0, 0.60)'    // ltBlue
    [TileModel.TYPE.SHELF]: 'transparent' // ltBlue
  };
  /** 方向Bit値 */
  static DIR = Object.freeze({
    DOWN: 1,
    RIGHT: 2,
    UP: 4,
    LEFT: 8
  });

  /** 出力方向値 */
  static EXPORT_DIR = {
    [TileModel.DIR.DOWN]: 4,
    [TileModel.DIR.RIGHT]: 3,
    [TileModel.DIR.UP]: 2,
    [TileModel.DIR.LEFT]: 1
  };

  /** 入力方向値 */
  static IMPORT_DIR = {
    4: parseInt([TileModel.DIR.DOWN]),
    3: parseInt([TileModel.DIR.RIGHT]),
    2: parseInt([TileModel.DIR.UP]),
    1: parseInt([TileModel.DIR.LEFT])
  };

  /** 方向イメージURL */
  static DIR_IMAGE_URL_ARY = {
    0: null,
    [TileModel.DIR.DOWN]: '/images/icons/pan/mdi-pan-down.png',
    [TileModel.DIR.RIGHT]: '/images/icons/pan/mdi-pan-right.png',
    [TileModel.DIR.RIGHT | TileModel.DIR.DOWN]: '/images/icons/pan/mdi-pan-down-right.png',
    [TileModel.DIR.UP]: '/images/icons/pan/mdi-pan-up.png',
    [TileModel.DIR.UP | TileModel.DIR.DOWN]: '/images/icons/pan/mdi-pan-vertical.png',
    [TileModel.DIR.UP | TileModel.DIR.RIGHT]: '/images/icons/pan/mdi-pan-up-right.png',
    [TileModel.DIR.UP | TileModel.DIR.RIGHT | TileModel.DIR.DOWN]: '/images/icons/pan/mdi-pan-v-right.png',
    [TileModel.DIR.LEFT]: '/images/icons/pan/mdi-pan-left.png',
    [TileModel.DIR.LEFT | TileModel.DIR.DOWN]: '/images/icons/pan/mdi-pan-down-left.png',
    [TileModel.DIR.LEFT | TileModel.DIR.RIGHT]: '/images/icons/pan/mdi-pan-horizontal.png',
    [TileModel.DIR.LEFT | TileModel.DIR.RIGHT | TileModel.DIR.DOWN]: '/images/icons/pan/mdi-pan-h-down.png',
    [TileModel.DIR.LEFT | TileModel.DIR.UP]: '/images/icons/pan/mdi-pan-up-left.png',
    [TileModel.DIR.LEFT | TileModel.DIR.UP | TileModel.DIR.DOWN]: '/images/icons/pan/mdi-pan-v-left.png',
    [TileModel.DIR.LEFT | TileModel.DIR.UP | TileModel.DIR.RIGHT]: '/images/icons/pan/mdi-pan-h-up.png',
    [TileModel.DIR.LEFT | TileModel.DIR.UP | TileModel.DIR.RIGHT | TileModel.DIR.DOWN]: '/images/icons/pan/mdi-pan.png'
  };
  /** 方向イメージ(Image Object) */
  static DIR_IMAGE_ARY = null;
  /** 棚を設定された背景色: 设置架子的背景色 */
  static SHELF_BACKGROUND_COLOR = 'rgb(255,140,0, 0.60)';
  /** 棚に面した通路背景色: 面向架子的通道的背景色 */
  static PASSAGE_SHELF_BACKGROUND_COLOR = 'rgb(138,174,220, 0.30)';
  /** 棚座標を設定された通路背景色: 设置了架子坐标 */
  static PASSAGE_SHELF_LINKED_BACKGROUND_COLOR = 'rgb(52, 139, 214, 0.5)';
  /** 棚リンク済みイメージURL */
  static SHELF_LINKED_IMAGE_URL = '/images/icons/shelf/inbox-multiple.png';
  /** 棚リンク済みイメージ(Image Object) */
  static SHELF_LINKED_IMAGE = null;
  /** 出発・到着Bit値 */
  static DEPOT = {
    START: 1, // 出発地点
    END: 2 // 到着地点
  }
  /** 出発・到着イメージURL */
  static DEPOT_IMAGE_URL_ARY = {
    0: null,
    [TileModel.DEPOT.START]: '/images/icons/depot/map-marker-up.png',
    [TileModel.DEPOT.END]: '/images/icons/depot/map-marker-down.png',
    [TileModel.DEPOT.START | TileModel.DEPOT.END]: '/images/icons/depot/map-marker-multiple.png'
  }

  /** 出発・到着イメージ(Image Object) */
  DEPOT_IMAGE_URL_ARY = null;

  /** タイルチェック時のエラー(進めない通路) */
  static PASSAGE_CLOSED_BACKGROUND_COLOR = 'rgb(230,232,65, 0.60)'; // yellow
  static EMPTY_ATTR_TILE_BACKGROUND_COLOR = 'rgb(255 83 105 / 0.65)'; // ltRed

  /**
   * イメージロード処理
   */
  static loadImage() {
    if (TileModel.DIR_IMAGE_ARY) {
      return
    }
    // Load direction images.
    const dirImages = {}
    let keys = Object.keys(TileModel.DIR_IMAGE_URL_ARY)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const url = TileModel.DIR_IMAGE_URL_ARY[key]
      const image = url ? new Image() : null
      if (image) {
        image.src = url
      }
      dirImages[key] = image
    }
    TileModel.DIR_IMAGE_ARY = Object.freeze(dirImages)
    // Load depot images.
    const depotImages = {}
    keys = Object.keys(TileModel.DEPOT_IMAGE_URL_ARY)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const url = TileModel.DEPOT_IMAGE_URL_ARY[key]
      const image = url ? new Image() : null
      if (image) {
        image.src = url
      }
      depotImages[key] = image
    }
    TileModel.DEPOT_IMAGE_ARY = Object.freeze(depotImages)
    // Shelf linked image.
    const image = new Image()
    image.src = TileModel.SHELF_LINKED_IMAGE_URL
    TileModel.SHELF_LINKED_IMAGE = image
  }

  /** タイル種別*/
  type;
  /** 方向値 */
  direction = 0;
  /** 棚隣接フラグ */
  faceShelf = false;
  /** 棚リンクフラグ */
  shelfLinked = false;
  shelfLinkList = [];
  /** 出発・到着 */
  depot = 0;
  /** 通行不可タイル(warning) */
  passageClosed = false;

  /**
   * コンストラクタ.
   *
   * @param {Integer} type タイル種別(TileModel.TYPE)
   * @param {Integer} direction 方向値(TileModel.DIR組合せ値 or 0)
   *
   */
  constructor(type, direction) {
    TileModel.loadImage()

    const valAry = Object.values(TileModel.TYPE)
    if (!valAry.includes(type)) {
      throw new Error('No such type.(' + type + ')')
    }
    this.type = type

    switch (type) {
      case TileModel.TYPE.PASSAGE:
      case TileModel.TYPE.PASSAGE_SHELF:
        if (direction < 0 || direction > 15) {
          throw new Error('Direction out of range.(' + direction + ')')
        }
        this.direction = direction
        break
      case TileModel.TYPE.SHELF:
        if (direction > 0) {
          this.direction = direction
        } else {
          this.direction = 0
        }
        break
      case TileModel.TYPE.SHELF_POINT:
        this.shelfPointFlg = true
        break
      case TileModel.TYPE.ERROR:
        if (direction < 0 || direction > 15) {
          direction = 0
        }
        this.direction = direction
        this.shelfPointFlg = false
        this.depotFlg = false
        break
      default:
        this.direction = 0
        this.shelfPointFlg = false
        this.depotFlg = false
    }
  }

  /**
   * 通路方向の進行方向のエラー設定
   *
   * 現状はTYPE.PASSAGE(通路)に対してのみ有効な属性。
   *
   * @param {Boolean} passageClosed true:進行できない、false:進行できる
   */
  setPassageClosed(passageClosed) {
    if (this.type !== TileModel.TYPE.PASSAGE) {
      return
    }
    this.passageClosed = passageClosed
  }

  /**
   * 棚隣接状態を設定する。
   *
   * 現状はTYPE.PASSAGE(通路)に対してのみ有効な属性。
   *
   * @param {Boolean} face true:棚に接する、false:棚に接しない
   */
  setFaceShelf(face) {
    if (this.type !== TileModel.TYPE.PASSAGE) {
      return
    }
    this.faceShelf = face
  }
  /**
   * リンク状態を設定する。
   *
   * 現状はTYPE.PASSAGE(通路)に対してのみ有効な属性。
   *
   * @param {Boolean} linked true:リンク済み、false:未リンク
   */
  setShelfLinked(linked) {
    // if(this.type !== TileModel.TYPE.PASSAGE){
    //   return;
    // }
    this.shelfLinked = linked
  }

  setDirection(direction) {
    // if(this.type !== TileModel.TYPE.PASSAGE){
    //   return;
    // }
    this.direction = direction
  }

  /**
   * 出発・到着地点に設定する。
   *
   * 現状はTYPE.PASSAGE(通路)に対してのみ有効な属性。
   *
   * @param {Integer} depot 出発・到着地点値(TileModel.DEPOT組合せ値 or 0)
   */
  setDepot(depot) {
    if (this.type !== TileModel.TYPE.PASSAGE) {
      return
    }
    this.depot = depot
  }

  /**
   * イメージを返す。
   */
  getImage() {
    switch (this.type) {
      case TileModel.TYPE.PASSAGE:
      case TileModel.TYPE.PASSAGE_SHELF:
        if (this.depot) {
          return TileModel.DEPOT_IMAGE_ARY[this.depot]
        }
        return TileModel.DIR_IMAGE_ARY[this.direction]
      /*
      case TileModel.TYPE.SHELF:
        if(this.shelfLinked){
          return TileModel.SHELF_LINKED_IMAGE;
        }
      */
      case TileModel.TYPE.SHELF:
        if (this.direction > 0) {
          return TileModel.DIR_IMAGE_ARY[this.direction]
        }
    }
    return null
  }

  /**
   * 背景色を返す。
   */
  getBackgroundColor() {
    switch (this.type) {
      case TileModel.TYPE.WALL:
        return TileModel.BACKGROUND_COLOR_ARY[this.type]
      case TileModel.TYPE.SHELF:
        if (this.shelfLinked || this.direction > 0) {
          return TileModel.PASSAGE_SHELF_LINKED_BACKGROUND_COLOR
        } else {
          return TileModel.SHELF_BACKGROUND_COLOR
        }
      case TileModel.TYPE.PASSAGE:
        if (this.passageClosed) {
          return TileModel.PASSAGE_CLOSED_BACKGROUND_COLOR
        }
        if (this.shelfLinked) {
          return TileModel.PASSAGE_SHELF_LINKED_BACKGROUND_COLOR
        }
        // shelfLinkedとの兼ね合いに難があるため背景色実装をコメントアウトとする。
        /*
        if(this.faceShelf){
          return TileModel.PASSAGE_SHELF_BACKGROUND_COLOR;
        }
        */
        return TileModel.BACKGROUND_COLOR_ARY[this.type]
      case TileModel.TYPE.ERROR:
        return TileModel.EMPTY_ATTR_TILE_BACKGROUND_COLOR
    }

    return null
  }

  /**
   * 複製を返す。
   */
  clone() {
    const ret = new TileModel(this.type, this.direction)
    ret.faceShelf = this.faceShelf
    ret.shelfLinked = this.shelfLinked
    ret.passageClosed = this.passageClosed
    ret.depot = this.depot
    return ret
  }

  /**
   * JSONのmatrix部に出力する値を返す。
   */
  getJSONMatrixVal() {
    switch (this.type) {
      case TileModel.TYPE.PASSAGE:
        return this.__getDirBinStr()
      case TileModel.TYPE.WALL:
        return this.type.toString()
      case TileModel.TYPE.SHELF:
        if (this.direction < 1) {
          return this.type.toString()
        } else {
          return this.type.toString() + '.' + TileModel.EXPORT_DIR[this.direction]
        }
      case TileModel.TYPE.ERROR:
        return ''
      default:
        throw new Error('Unresolved.(' + this.type + ')')
    }
  }

  /**
   * direction値を2進数文字列にて返す。
   */
  __getDirBinStr() {
    let dir = this.direction
    let ret = ''
    for (let i = 0; i < 4; i++) {
      ret = ((dir & 0x1) ? '1' : '0') + ret
      dir >>= 1
    }
    return ret
  }

  /**
   * direction値を2進数文字列として、方向別の配列にて返す。
   * @return {Array} 2進数通路方向値の文字列配列
   */
  __getDirBinStrAry() {
    let dir = this.direction
    const ret = []
    let binaryNum = 0
    for (let i = 0; i < 4; i++) {
      binaryNum = ((dir & 0x1) ? '1' : '0')
      ret.push(binaryNum)
      dir >>= 1
    }
    return {
      down: ret[0],
      right: ret[1],
      up: ret[2],
      left: ret[3]
    }
  }

  /**
   * 2進数配列からdirection値取得
   *
   * @param {Object} neighborTiles 進
   * @return {Integer} direction値
   */
  __getDecDirection(neighborTiles) {
    let ret = 0
    const dirVals = Object.values(TileModel.DIR)
    const neighborTileVlues = Object.values(neighborTiles)
    for (let i = 0; i < neighborTileVlues.length; i++) {
      if (neighborTileVlues[i] === null) {
        continue
      }
      if (!neighborTileVlues[i].tileModel) {
        continue
      }

      const type = neighborTileVlues[i].tileModel.type
      // if(type === TileModel.TYPE.PASSAGE || type === TileModel.TYPE.ERROR){
      if (type === TileModel.TYPE.PASSAGE) {
        ret += dirVals[i]
      }
    }
    return ret
  }
}

