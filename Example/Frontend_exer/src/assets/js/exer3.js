function fn() {
  return new Promise(resolve => {
    resolve("hello")
  })
}

fn()
  .then((res) => {
    console.log(res)
    return "world"
  })
  .then((res2) => {
    JSON.parse({name: "sam"})
  })
  .then((res3) => {
    console.log(res3)
  })
  .catch(err => {
    console.log("err: ", err)
  })