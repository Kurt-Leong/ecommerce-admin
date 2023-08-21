import { mongooseConnect } from '@/lib/mongoose'
import { Product } from '@/models/Product'

export default async function handler(req, res) {
  const { method } = req
  await mongooseConnect()
  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }))
    } else {
      res.json(await Product.find())
    }
  }
  if (method === 'POST') {
    const { title, description, price, images } = req.body
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
    })
    res.json(productDoc)
  }
  if (method === 'PUT') {
    const { title, description, price, _id, images } = req.body

    await Product.updateOne({ _id }, { title, description, price, images })
    res.json(true)
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query.id })
      res.json(true)
    }
  }
  // const { method } = req
  // if (method === 'POST') {
  //   try {
  //     const { title, description, price } = req.body
  //     // Connect to the MongoDB database using clientPromise
  //     const client = await clientPromise
  //     const db = client.db()
  //     // Create the product in the database
  //     const productDoc = await db.collection('products').insertOne({
  //       title,
  //       description,
  //       price,
  //     })
  //     // Respond with the created product data
  //     res.status(201).json(productDoc.ops[0])
  //   } catch (error) {
  //     console.error('Error creating product:', error)
  //     res.status(500).json({ message: 'Error creating product.' })
  //   }
  // } else {
  //   // If the request method is not POST, respond with the request method
  //   res.json({ method })
  // }
}
