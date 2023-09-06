import axios from 'axios'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Spinner from './Spinner'
import { ReactSortable } from 'react-sortablejs'

function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || '')
  const [description, setDescription] = useState(existingDescription || '')
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  )
  const [images, setImages] = useState(existingImages || [])
  const [price, setPrice] = useState(existingPrice || '')
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState([])

  const [category, setCategory] = useState(assignedCategory || '0')
  console.log('this is', assignedCategory)
  console.log('categories is', categories)

  console.log('category is', category)
  categories.map((c) => {
    console.log(`${c.name} is`, c._id)
  })

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Send a GET request to '/api/categories' using Axios
        const result = await axios.get('/api/categories')

        // Update the state with the fetched data
        setCategories(result.data)
      } catch (error) {
        // Handle errors here, such as displaying an error message
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])
  const router = useRouter()

  async function saveProduct(ev) {
    ev.preventDefault()

    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    }
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
      console.log(res.data.links)
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links]
      })
      setIsUploading(false)
    }
  }

  function updateImagesOrder(images) {
    // setImages(images)
    // console.log('images is:', images)
    setImages(images)
  }
  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev }
      newProductProps[propName] = value
      return newProductProps
    })
  }

  const propertiesToFill = []
  // if (categories.length > 0 && category) {
  //   let catInfo = categories?.find(({ _id }) => _id === category)
  //   console.log(catInfo)
  //   propertiesToFill.push(...catInfo?.properties)
  //   console.log(propertiesToFill)
  //   while (catInfo?.parent?.id) {
  //     const parentCat = categories?.find(
  //       ({ _id }) => _id === catInfo?.parent?.id
  //     )
  //     propertiesToFill.push(...parentCat.properties)
  //     catInfo = parentCat
  //   }
  // }
  if (categories.length > 0 && category) {
    let catInfo = categories?.find(({ _id }) => _id === category)

    if (catInfo && Array.isArray(catInfo.properties)) {
      propertiesToFill.push(...catInfo.properties)
    }

    while (catInfo?.parent?.id) {
      const parentCat = categories?.find(
        ({ _id }) => _id === catInfo?.parent?.id
      )
      if (parentCat && Array.isArray(parentCat.properties)) {
        propertiesToFill.push(...parentCat.properties)
      }
      catInfo = parentCat
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
      <label>Category</label>
      <select
        onChange={(ev) =>
          setCategory(ev.target.value === '0' ? null : ev.target.value)
        }
        value={category}
      >
        <option value="0">Uncategorized</option>

        {categories.length > 0 &&
          categories.map((category, index) => (
            <option key={index} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p, index) => (
          <div className="flex gap-1" key={index}>
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v, index) => (
                  <option key={index} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          setList={updateImagesOrder}
          className="flex flex-wrap gap-1"
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-1 shadow-md rounded-sm border border-gray-300 "
              >
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="w-24 p-1  flex items-center justify-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer border flex flex-col items-center justify-center text-sm text-primary rounded-sm bg-white shadow-lg border border-primary">
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
          <div>Add image</div>
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
