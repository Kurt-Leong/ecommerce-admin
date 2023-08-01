import Layout from '@/components/Layout'

export default function NewProducts() {
  return (
    <Layout>
      <h1>New Products</h1>
      <label>Products Name</label>

      <input type="text" placeholder="Add new products here" />
      <label>description</label>
      <textarea type="text" placeholder="description"></textarea>
      <label>Price (in NZD)</label>

      <input type="number" placeholder="price" />
      <button className="btn-primary">Save</button>
    </Layout>
  )
}
