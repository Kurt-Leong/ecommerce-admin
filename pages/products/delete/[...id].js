import Layout from '@/components/Layout'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function DeleteProductPage() {
  const router = useRouter()
  const { id } = router.query

  const [productInfo, setProductInfo] = useState()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!id) {
      return
    }
    axios.get('/api/products?id=' + id).then((response) => {
      setProductInfo(response.data)
      setLoading(false)
    })
  }, [id])

  function goBack() {
    router.push('/products')
    axios
  }

  async function deleteProduct() {
    await axios.delete('/api/products?id=' + id)
    goBack()
  }
  return (
    <Layout>
      <h1 className="text-center">
        Do you really want to delete &nbsp; <b>{productInfo?.title}?</b>
      </h1>
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteProduct}>
          Yes
        </button>
        <button className="btn-default" onClick={goBack}>
          No
        </button>
      </div>
    </Layout>
  )
}
