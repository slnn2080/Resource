import fetch from "node-fetch"

export default (props) => {
  console.log("index组件: ", props)
  return (
    <div>
      <h3>我是 index 页面</h3>
    </div>
  )
}

// 该方法运行在服务端的 所以要在服务端来看结果
export const getServerSideProps = async () => {

  let res = await fetch("http:localhost:3333")
  let data = await res.json();

  console.log(data)

  return {
    // props: {}
    props: data
  }
}