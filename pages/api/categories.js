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
    const parent = parentCategory !== '' ? parentCategory : null
    const categoryDoc = await Category.create({ name, parent })
    res.json(categoryDoc)
  }
  if (method === 'PUT') {
    const { name, parentCategory, _id } = req.body
    const parent = parentCategory !== '' ? parentCategory : null
    res.json(await Category.updateOne({ _id }, { name, parent }))
  }
}
