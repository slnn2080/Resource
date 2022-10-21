let res = 0
onmessage = function(e) {
  let num = e.data
  for(let i=0; i<=num; i++) {
    res += i
  }
  postMessage(res)
}


