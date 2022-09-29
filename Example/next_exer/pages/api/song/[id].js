export default (req, res) => {
  console.log(req.query)  // { id: '1' }

  res.json("ok")
}