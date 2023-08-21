import { Category } from '@/models/Category'
import { mongooseConnect } from '@/lib/mongoose'

export default async function handle(req, res) {
  await mongooseConnect()

  const { method } = req
  if (method === 'GET') {
    res.json(await Category.find().populate('parent'))
  }
  if (method === 'POST') {
    const { name, parentCategory } = req.body
    const categoryDoc = await Category.create({ name, parent: parentCategory })
    res.json(categoryDoc)
  }
  if (method === 'PUT') {
    const { name, parentCategory, _id } = req.body
    console.log('parents', parentCategory)
    res.json(
      await Category.updateOne({ _id }, { name, parent: parentCategory })
    )
  }
}
