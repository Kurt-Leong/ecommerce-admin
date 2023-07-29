import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from 'next-auth/react'

import Layout from '@/components/Layout'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session } = useSession()
  console.log(session)
  if (!session) return
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Hello,<b>{session.user.name}</b>
        </h2>
        <div className="flex bg-gray-200 gap-1 text-black rounded-full ">
          <Image
            width="150"
            height="150"
            src={session?.user?.image}
            alt={session?.user?.name}
            className="w-9 h-9 rounded-full"
          />
          <span className="  px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  )
}
