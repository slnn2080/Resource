import { useRouter } from 'next/router'

const Post = () => {
  const router = useRouter()
  console.log("router", router)
  const { id } = router.query

  return <p>Post: {id}</p>
}

export default Post