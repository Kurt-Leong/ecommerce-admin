import { Category } from '@/models/Category'
import { mongooseConnect } from '@/lib/mongoose'

export default async function handle(req, res) {
  await mongooseConnect()

  const { method } = req
  if (method === 'GET') {
    res.json(await Category.find())
  }
  if (method === 'POST') {
    const { name } = req.body
    const categoryDoc = await Category.create({ name })
    res.json(categoryDoc)
  }
}
