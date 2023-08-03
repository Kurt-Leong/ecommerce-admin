import Layout from '@/components/Layout'
import axios from 'axios'

import { useRouter } from 'next/router'
import { useState } from 'react'

export default function NewProducts() {
  const [title, steTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [goToProduct, setGoToProduct] = useState(false)
  const router = useRouter()

  async function createProduct(ev) {
    ev.preventDefault()
    // try {
    //   const response = await fetch('/api/products', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ title, description, price }),
    //   })

    //   if (response.ok) {
    //     // Product created successfully
    //     console.log('Product created successfully!')
    //   } else {
    //     // Handle error response
    //     console.error('Error creating product:', response.statusText)
    //   }
    // } catch (error) {
    //   // Handle network or other errors
    //   console.error('Error creating product:', error.message)
    // }

    const data = { title, description, price }
    try {
      await axios.post('/api/products', data)
      // Product created successfully
      console.log('Product created successfully!')

      router.push('/products') // Redirect to the product page after creating the product
    } catch (error) {
      // Handle error response
      console.error('Error creating product:', error.message)
    }
  }
  return (
    <Layout>
      <form onSubmit={createProduct}>
        <h1>New Products</h1>
        <label>Products Name</label>

        <input
          type="text"
          placeholder="Add new products here"
          value={title}
          onChange={(ev) => steTitle(ev.target.value)}
        />
        <label>description</label>
        <textarea
          type="text"
          placeholder="description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        <label>Price (in NZD)</label>

        <input
          type="number"
          placeholder="price"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
        />
        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
    </Layout>
  )
}
