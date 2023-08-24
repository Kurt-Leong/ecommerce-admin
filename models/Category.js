import mongoose, { Schema, models, model } from 'mongoose'

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: 'Category', default: null },
  properties: [{ type: Object }],
})

export const Category = models?.Category || model('Category', CategorySchema)
