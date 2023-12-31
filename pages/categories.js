import Layout from '@/components/Layout'
import axios from 'axios'

import { useEffect, useState } from 'react'
import { withSwal } from 'react-sweetalert2'

function Categories({ swal }) {
  const [name, setName] = useState('')
  const [parentCategory, setParentCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [editedCategory, setEditedCategory] = useState(null)
  const [properties, setProperties] = useState([])

  useEffect(() => {
    fetechCategories()
  }, [])

  async function fetechCategories() {
    const result = await axios.get('/api/categories')

    setCategories(result.data)
  }

  function clearForm() {
    setName('')
    setParentCategory('')
    fetechCategories()
    setProperties([])
  }

  async function saveCategory(ev) {
    ev.preventDefault()

    if (!name) {
      console.error('Category name is required.')
      return
    }

    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(','),
      })),
    }
    console.log('save is', data.properties)
    if (editedCategory) {
      try {
        data._id = editedCategory._id
        console.log(editedCategory)
        await axios.put('/api/categories', { ...data })
        setEditedCategory(null)
      } catch (error) {
        console.error('Error updating category:', error)
      }
    } else {
      try {
        await axios.post('/api/categories', {
          ...data,
        })
      } catch (error) {
        console.error('Error creating category:', error)
      }
    }
    clearForm()
  }
  function editCategory(category) {
    setEditedCategory(category)
    setName(category.name)

    setParentCategory(category.parent?._id)
    console.log('edit is', category.properties)
    // setProperties(category.properties)

    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(','),
      }))
    )
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: 'Are you sure',
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, Delete!',
        confirmButtonColor: '#d55',
        reverseButtons: true,
      })
      .then(async (result) => {
        console.log({ result })
        if (result.isConfirmed) {
          const { _id } = category
          await axios.delete('/api/categories?_id=' + _id)
          fetechCategories()
        }
      })
      .catch((error) => {
        // when promise rejected...
      })
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: '', values: '' }]
    })
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev]
      properties[index].name = newName
      return properties
    })
  }
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev]
      properties[index].values = newValues
      return properties
    })
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      const neePropArr = [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove
      })
      return neePropArr
    })
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? ` Edited Category ${editedCategory.name}`
          : 'Create New Category'}
      </label>

      <form onSubmit={saveCategory} className="">
        <div className="flex gap-1">
          <input
            className="mb-1"
            type="text"
            placeholder={'Category name'}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <select
            className="mb-1"
            onChange={(ev) =>
              setParentCategory(
                ev.target.value === '0' ? null : ev.target.value
              )
            }
            value={parentCategory || '0'}
          >
            <option value="0">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2 "
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input
                  type="text"
                  value={property.name}
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                  placeholder="property name(example: color)"
                  className="mb-0"
                />
                <input
                  type="text"
                  value={property.values}
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                  placeholder="values. comma separate "
                  className="mb-0"
                />
                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="btn-default"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          <button className="btn btn-primary py-1" type="submit">
            Save
          </button>
          {editedCategory && (
            <button
              className="btn btn-default py-1"
              type="button"
              onClick={() => {
                setEditedCategory(null)
                setName('')
                setParentCategory('')
                setProperties([])
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Parent Category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.parent?.name}</td>
                  <td>
                    <div className="flex mr-1 gap-2">
                      <button
                        onClick={() => editCategory(category)}
                        className="btn btn-default flex rounded-lg"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 mt-0.5 mr-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                        Edit
                      </button>
                      <div>
                        <button
                          onClick={() => deleteCategory(category)}
                          className="btn btn-red flex"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 mt-0.5 mr-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  )
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />)
