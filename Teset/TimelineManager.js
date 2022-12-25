import TaskTypeEnum from './TaskTypeEnum'

class TimelineModel {
  /** Color definitions */
  static COLOR = {
    required: '#757575',
    active: '#ffae46',
    noAttr: '#c5c5c5'
  }

  /**
   * Constructor
   *
   * @param {Integer} itemNum Item Number
   * @param {String} title Title
   * @param {Boolean} active Active flag
   * @param {String} icon Icon
   * @param {Boolean} required Required flag
   * @returns {TimelineModel}
   */
  constructor(itemNum, title, active, icon, required) {
    this.itemNum = itemNum
    this.title = title
    this.active = active
    this.icon = icon
    this.required = required
    this.class = 'timeline-icon'
    this.used = false
    this.color = TimelineModel.COLOR[this.active ? 'active' : (this.required ? 'required' : 'noAttr')]
  }

  /**
   * Active flag setter.
   *
   * @param {Boolean} active Active flag
   */
  setActive(active) {
    this.active = active
    this.color = TimelineModel.COLOR[this.active ? 'active' : (this.required ? 'required' : 'noAttr')]
  }

  /**
   * used flag setter.
   *
   * @param {Boolean} active used flag
   */
  setUsed(active) {
    this.used = active
  }

  typeIsImport() {
    return this.itemNum === TaskTypeEnum.import
  }

  typeIsExport() {
    return this.itemNum === TaskTypeEnum.export
  }
}

class TimelineManager {
  /**
   * Constructor
   *
   * @param {Array} timelineModels Array of TimelineModel
   * @returns {TimelineManager}
   */
  constructor(timelineModels) {
    this.models = timelineModels
  }

  /**
   * タイムラインモデル配列を返す。
   *
   * @returns {Array} タイムラインモデル
   */
  getTimelineModelArray() {
    return this.models
  }

  /**
   * itemNumに該当するタイムラインモデルをactiveにする。
   *
   * 該当モデル以外はinavtivbeとなる。
   *
   * @param {Integer} itemNum
   */
  setActive(itemNum) {
    for (let i = 0; i < this.models.length; i++) {
      const model = this.models[i]
      model.setActive(model.itemNum === itemNum)
    }
  }
}

/**
 * TimelineManager
 * pick up icon class
 * https://materialdesignicons.com/
 */
export default new TimelineManager([
  // new TimelineModel(TaskTypeEnum.import, 'フロアインポート', true, 'mdi-floor-plan', true),
  new TimelineModel(TaskTypeEnum.import, 'import', true, 'mdi-floor-plan', true),
  // new TimelineModel(TaskTypeEnum.floor, 'フロア作成', false, 'mdi-map', true),
  new TimelineModel(TaskTypeEnum.floor, 'floor', false, 'mdi-map', true),
  // new TimelineModel(TaskTypeEnum.grid, '棚・壁設定', false, 'mdi-view-grid', false), // 2021/03/08 グリッド設定(固定部分)
  new TimelineModel(TaskTypeEnum.grid, 'grid', false, 'mdi-view-grid', false), // 2021/03/08 グリッド設定(固定部分)
  // new TimelineModel(TaskTypeEnum.passage, '通路設定', false, 'mdi-road-variant', false), // 2021/03/08 グリッド設定(通路自動設定)
  new TimelineModel(TaskTypeEnum.passage, 'passage', false, 'mdi-road-variant', false), // 2021/03/08 グリッド設定(通路自動設定)
  // new TimelineModel(TaskTypeEnum.shelfLink, '棚紐付け', false, 'mdi-link-variant', false), // 2020/10/29 打ち合わせにてペンディング
  // new TimelineModel(TaskTypeEnum.shelfPoint, '棚座標', false, 'mdi-inbox-multiple', false),
  new TimelineModel(TaskTypeEnum.shelfPoint, 'shelfPoint', false, 'mdi-inbox-multiple', false),
  // new TimelineModel(TaskTypeEnum.shelfPassage, 'ピック位置設定', false, 'mdi-ray-start-arrow', false),
  new TimelineModel(TaskTypeEnum.shelfPassage, 'shelfPassage', false, 'mdi-ray-start-arrow', false),
  // new TimelineModel(TaskTypeEnum.depot, '出発・到着', false, 'mdi-map-marker', false),
  // new TimelineModel(TaskTypeEnum.depot, 'depot', false, 'mdi-map-marker', false),
  // new TimelineModel(TaskTypeEnum.export, 'データ出力', false, 'mdi-folder-download', false)
  new TimelineModel(TaskTypeEnum.export, 'export', false, 'mdi-folder-download', false)
])
