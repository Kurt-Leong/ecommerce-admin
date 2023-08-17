import Layout from '@/components/Layout'
import ProductForm from '@/components/ProductForm'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function EditProductPage() {
  const router = useRouter()
  const { id } = router.query
  const [productInfo, setProductInfo] = useState(null)
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
  console.log(productInfo)
  return (
    <Layout>
      <h1>Edit Product</h1>
      {loading ? <div>Loading...</div> : <ProductForm {...productInfo} />}
    </Layout>
  )
}

export default EditProductPage
