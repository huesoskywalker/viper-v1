import { Suspense } from 'react'
import { getCurrentViper } from '../../lib/session'
import { preloadViperBlogs } from '../../lib/vipers'
import Loading from './loading'
import { ViperBlogs } from './_components/ViperBlogs'
import { Session } from 'next-auth'

export default async function ProfilePage() {
   const viperSession: Session = await getCurrentViper()

   const viperId: string = viperSession.user._id

   preloadViperBlogs(viperId)

   return (
      <div className="space-y-4 w-full flex flex-wrap">
         <Suspense fallback={<Loading />}>
            @ts-expect-error Server Component
            {/* <ViperBlogs viperId={viperId} /> */}
         </Suspense>
      </div>
   )
}
