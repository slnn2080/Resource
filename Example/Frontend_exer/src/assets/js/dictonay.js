
class Dictonay {
  items = {}


  // 在字典中添加键值对
  set(key, value) {
    this.items[key] = value
  }

  // 判断字典中是否有某个key
  has(key) {
    return this.items.hasOwnProperty(key)
  }

  // 删除
  remove(key) {
    if(!this.has(key)) return false

    delete this.items[key]
    return true
  }

  // 获取
  get(key) {
    return this.has(key) ? this.items[key] : undefined
  }

  // 获取所有的keys
  keys() {
    return Object.key(this.items)
  }

  // 获取所有的values
  values() {
    return Object.values(this.items)
  }

  size() {
    return this.keys().length
  }

  clear() {
    this.items = {}
  }
}

module.exports = Dictonay