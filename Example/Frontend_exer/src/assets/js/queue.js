class Queue {

  items = []

  // 入队列
  enqueue(el) {
    this.items.push(el)
  }

  // 出队列
  dequeue() {
    return this.items.shift()
  }

  // 队列中元素的个数
  size() {
    return this.items.length
  }

  // 查看队列前端元素
  front() {
    return this.items[0]
  }

  // 检查队列是否为空
  isEmpty() {
    return this.items.length == 0
  }

  // 打印队列
  toString() {
    console.log(JSON.stringify(this.items, null, 2))
  }
}

module.exports = Queue