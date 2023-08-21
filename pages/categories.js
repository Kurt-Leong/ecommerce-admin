import Layout from '@/components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Categories() {
  const [name, setName] = useState('')
  const [categories, setCategories] = useState([])
  useEffect(() => {
    fetechCategories()
  }, [])

  async function fetechCategories() {
    const result = await axios.get('/api/categories')
    setCategories(result.data)
  }

  async function saveCategory(ev) {
    ev.preventDefault()
    await axios.post('/api/categories', { name })
    setName('')
    fetechCategories()
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label>New Category name</label>

      <form onSubmit={saveCategory} className="flex">
        <input
          className="mb-0"
          type="text"
          placeholder={'Category name'}
          onChange={(ev) => setName(ev.target.value)}
          value={name}
        />
        <button className="btn btn-primary py-1" type={'submit'}>
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  )
}
