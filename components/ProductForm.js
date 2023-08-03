import axios from 'axios'

import { useRouter } from 'next/router'
import { useState } from 'react'

function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
}) {
  const [title, steTitle] = useState(existingTitle || '')
  const [description, setDescription] = useState(existingDescription || '')
  const [price, setPrice] = useState(existingPrice || '')

  const router = useRouter()
  console.log({ _id })
  async function saveProduct(ev) {
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
    if (_id) {
      //update
      try {
        await axios.put('/api/products', { ...data, _id })
        // Product created successfully
        console.log('Product created successfully!')

        router.push('/products') // Redirect to the product page after creating the product
      } catch (error) {
        // Handle error response
        console.error('Error editing product:', error.message)
      }
    } else {
      //create
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
  }
  return (
    <form onSubmit={saveProduct}>
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
  )
}

export default ProductForm
