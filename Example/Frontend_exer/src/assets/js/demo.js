let num = 0
let id = 0
let queue = []
let temp = null

function print(id) {

  return (content) => {
    console.log(`我是${id}逻辑: ${content}`)
    if(content == 5) throw new Error("network")
  }

}

function handler(num) {

  temp = queue.shift()
  
  while(true) {

    try {

      // 说明是第一次
      if(!temp && !temp?.flag) {
        temp.fn(num)

      } else if(temp && temp.flag) {
        temp = queue.shift()
        temp.fn(num)
      }
      
      temp.flag = true

    } catch(err) {
      
      if(err.message == "network") {
        console.log(err.message)
        temp.flag = false
        continue
      }
    }
  }
}


let timer = setInterval(() => {
  console.log(num)

  if(num >= 5) {
    clearInterval(timer)
    handler && handler(num)
  }

  queue.push({id: id++, fn: print(id), flag: false})
  num++
}, 1000)


