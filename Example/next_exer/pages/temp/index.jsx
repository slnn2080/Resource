import { useRouter } from 'next/router'

const Temp = () => {
  const router = useRouter()
  const { id } = router.query
  return <p>temp~~~~: {id}</p>
}

export default Temp