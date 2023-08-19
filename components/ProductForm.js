import axios from 'axios'

import { useRouter } from 'next/router'
import { useState } from 'react'

import Spinner from './Spinner'

function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
}) {
  const [title, setTitle] = useState(existingTitle || '')
  const [description, setDescription] = useState(existingDescription || '')
  const [images, setImages] = useState(existingImages || [])
  const [price, setPrice] = useState(existingPrice || '')
  const [isUploading, setIsUploading] = useState(false)

  const router = useRouter()

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
    const data = { title, description, price, images }
    if (_id) {
      //update
      try {
        await axios.put('/api/products', { ...data, _id })
        // Product created successfully
        console.log('Product edited successfully!')

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

  // I could not understand append
  async function uploadImages(ev) {
    const files = ev.target?.files
    if (files?.length > 0) {
      setIsUploading(true)
      const data = new FormData()
      for (const file of files) {
        data.append('file', file)
      }
      const res = await axios.post(
        '/api/upload',
        data
        // headers: { 'Contetnt-Type': 'multiparty/form-data' },
      )
      // const res = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: data,
      // })
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links]
      })
      setIsUploading(false)
    }
  }
  return (
    <form onSubmit={saveProduct}>
      <label>Products Name</label>

      <input
        type="text"
        placeholder="Add new products here"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        {!!images?.length &&
          images.map((link) => (
            <div key={link} className="h-24">
              <img src={link} alt="" className="rounded-lg" />
            </div>
          ))}
        {isUploading && (
          <div className="w-24 p-1  flex items-center justify-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer border flex flex-col items-center justify-center text-sm text-gray-500 rounded-lg bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>
        {!images?.length && (
          <div className="text-blue-900">No photos in this product</div>
        )}
      </div>

      <label>Description</label>
      <textarea
        type="text"
        placeholder="Description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (in NZD)</label>

      <input
        type="number"
        placeholder="Price"
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
