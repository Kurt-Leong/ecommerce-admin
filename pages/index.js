import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from 'next-auth/react'
import Nav from '@/components/Nav'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session } = useSession()
  if (!session) {
    return (
      <div className={'bg-red-500 w-screen h-screen flex items-center'}>
        <div className={`text-center w-full`}>
          <button
            onClick={() => signIn('google')}
            className={`bg-white p-2 rounded-lg`}
          >
            Log in with Google
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-blue-900 min-h-screen">
      <Nav />
      <div>logged in {session.user.email}</div>
    </div>
  )
}

// export default function Component() {
//   if(session) {
//     return <>
//       Signed in as {session.user.email} <br/>
//       <button onClick={() => signOut()}>Sign out</button>
//     </>
//   }
//   return <>
//     Not signed in <br/>
//     <button onClick={() => signIn()}>Sign in</button>
//   </>
// }
