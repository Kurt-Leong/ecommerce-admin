import Layout from '@/components/Layout'
import axios from 'axios'

import { useRouter } from 'next/router'
import { useState } from 'react'
import ProductForm from '@/components/ProductForm'
export default function NewProducts() {
  return (
    <Layout>
      <h1>New Products</h1>

      <ProductForm />
    </Layout>
  )
}
