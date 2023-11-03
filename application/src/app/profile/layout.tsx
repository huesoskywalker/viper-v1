// import { PageProps } from '../../lib/utils'
// import { ProfileMenu, fetchProfileMenu } from './_lib/getProfile'
// import { getCurrentViper } from '../../lib/session'
// import { Profile } from './_components/Profile'
// import { BlogButton } from './_components/BlogButton'
// import { Session } from 'next-auth'
// import { TabGroup } from '../_components/TabGroup'
// import { preloadViperService } from '@/services/servicesInitializer'
// import ProfileNavTabs from './_components/ProfileNavTabs'

// export default async function Layout({ children }: PageProps) {
//    const profileCategory: ProfileMenu[] = fetchProfileMenu()

//    const viper: Session = await getCurrentViper()

//    preloadViperService.preloadGetById(viper.user._id)
//    return (
//       <div className="justify-center flex-wrap xl:px-20 lg:px-10">
//          {/* <div className=" lg:border-x  lg:border-gray-800 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 md:py-2 md:px-8"> */}
//          {/* @ts-expect-error Async Server Component */}
//          <Profile viperId={viper.user._id} profile={true} />
//          <div className="lg:border-b lg:border-gray-800 pb-3 lg:ml-4">
//             {/* <BlogButton
//                viperId={viper.user._id}
//                viperName={viper.user.name}
//                viperImage={viper.user.image}
//             /> */}
//             {/* Tabs */}
//             {/* <div className="mt-6 sm:mt-2 2xl:mt-5">
//                <div className="border-b border-gray-800">
//                   <div
//                      className={` max-w-5xl mx-auto px-4 sm:px-6 lg:px-8
//                   mt-10`}
//                   >
//                      <nav className="-mb-px flex space-x-8" aria-label="Tabs"> */}
//             <ProfileNavTabs />
//             {/* </nav>
//                   </div>
//                </div>
//             </div> */}
//             {/* <TabGroup
//                path={`/profile`}
//                items={[
//                   {
//                      text: 'Blog',
//                   },
//                   ...profileCategory.map((x) => ({
//                      text: x.name,
//                      slug: x.slug,
//                   })),
//                ]}
//             /> */}
//          </div>
//          <div className="mt-3">{children}</div>
//          {/* </div> */}
//       </div>
//    )
// }
import { PageProps } from '../../lib/utils'
import { getCurrentViper } from '../../lib/session'
import { BlogButton } from './_components/BlogButton'
import { Session } from 'next-auth'
import { preloadViperService } from '@/services/servicesInitializer'
import { ProfileNavTabs } from './_components/ProfileNavTabs'
import { Profile } from './_components/Profile'

export default async function Layout({ children }: PageProps) {
   const viper: Session = await getCurrentViper()

   preloadViperService.preloadGetById(viper.user._id)
   return (
      <div className="flex flex-col justify-center xl:px-20 lg:px-10">
         {/* @ts-expect-error Async Server Component */}
         <Profile viperId={viper.user._id} profile={true} />
         <div className="flex lg:border-b lg:border-gray-800 pb-3">
            <BlogButton
               viperId={viper.user._id}
               viperName={viper.user.name}
               viperImage={viper.user.image}
            />
            <nav className="flex flex-grow justify-center">
               <ProfileNavTabs />
            </nav>
         </div>
         <div className="mt-3">{children}</div>
      </div>
   )
}
