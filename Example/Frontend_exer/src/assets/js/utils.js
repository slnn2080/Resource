function $(el) {
  return document.querySelector(el)
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

exports.$ = $
exports.sleep = sleep