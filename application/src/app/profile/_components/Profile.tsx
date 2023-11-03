import Image from 'next/image'
import { getViperBasicProps, preloadViperFollowed } from '@/lib/vipers'
import ViperInfo from './ViperInfo'
import { Follow, ViperBasicProps } from '@/types/viper'
import { EditProfileLink } from './EditProfileLink'
import { CheckFollow } from './CheckFollow'
import { ShowFollows } from './ShowFollows'
import Link from 'next/link'

export const Profile = async ({ viperId, profile }: { viperId: string; profile: boolean }) => {
   // Change name for Viper
   const fullViper: ViperBasicProps | null = await getViperBasicProps(viperId)
   if (!fullViper) throw new Error('No viper bro')
   preloadViperFollowed(viperId)

   // return (
   //     <div className="grid lg:grid-cols-4">
   //         <div className="lg:col-span-4 overflow-hidden">
   //             <div className="">
   //                 <Image
   //                     data-test="background-image"
   //                     alt={fullViper.name}
   //                     src={fullViper.backgroundImage}
   //                     width={700}
   //                     height={560}
   //                     placeholder="blur"
   //                     loading="lazy"
   //                     blurDataURL={fullViper.image}
   //                     quality={100}
   //                     style={{
   //                         objectFit: "cover",
   //                         objectPosition: "center",
   //                         maxHeight: "12rem",
   //                     }}
   //                     className="-z-10 rounded-xl  group-hover:opacity-80 -mb-2"
   //                 />
   //             </div>
   //             <div className="z-10 relative bottom-9 left-7">
   //                 <Image
   //                     data-test="profile-image"
   //                     alt={fullViper.name}
   //                     src={`${fullViper.image}`}
   //                     width={120}
   //                     height={120}
   //                     placeholder="blur"
   //                     loading="lazy"
   //                     blurDataURL={fullViper.image}
   //                     quality={100}
   //                     style={{
   //                         objectFit: "contain",
   //                         objectPosition: "top",
   //                     }}
   //                     className="  rounded-full border-solid border-2 border-yellow-600 group-hover:opacity-80"
   //                 />
   //                 <div className="grid grid-cols-2">
   //                     <h1 data-test="viper-name" className="text-sm text-yellow-700 mt-4">
   //                         {fullViper.name}
   //                         <p className="text-xs text-gray-300 mt-1">{fullViper.email}</p>
   //                         <p className="text-xs text-gray-400 mt-2">
   //                             Settled in{" "}
   //                             <span data-test="viper-location" className="text-gray-200 ">
   //                                 {fullViper.address.country ?? "Planet Earth"}
   //                             </span>
   //                         </p>
   //                     </h1>
   //                     {profile ? (
   //                         <EditProfileLink href={`/profile/edit/${viperId}`} />
   //                     ) : (
   //                         /* @ts-expect-error Server Component */
   //                         <CheckFollow viperId={viperId} />
   //                     )}
   //                 </div>
   //                 <div className="break-after-column">
   //                     <h1 data-test="viper-biography" className="text-gray-300 text-sm mt-5">
   //                         {fullViper.biography}
   //                     </h1>
   //                 </div>
   //                 <div className="mt-5 space-x-8 text-gray-300 text-xs">
   //                     <ShowFollows
   //                         follows={fullViper.follows.length}
   //                         followers={false}
   //                         profile={true}
   //                     >
   //                         {fullViper.follows.map((follows: Follow) => {
   //                             return (
   //                                 /* @ts-expect-error Async Server Component */
   //                                 <ViperInfo
   //                                     key={JSON.stringify(follows._id)}
   //                                     id={JSON.stringify(follows._id)}
   //                                 />
   //                             )
   //                         })}
   //                     </ShowFollows>

   //                     <ShowFollows
   //                         follows={fullViper.followers.length}
   //                         followers={true}
   //                         profile={true}
   //                     >
   //                         {fullViper.followers.map((followers: Follow) => {
   //                             return (
   //                                 /* @ts-expect-error Async Server Component */
   //                                 <ViperInfo
   //                                     key={JSON.stringify(followers._id)}
   //                                     id={JSON.stringify(followers._id)}
   //                                 />
   //                             )
   //                         })}
   //                     </ShowFollows>
   //                 </div>
   //             </div>
   //         </div>
   //     </div>
   // )
   const profileWidth = 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'

   const settingsPage = false

   const saving = false
   const error = 'non error'

   return (
      <div className="min-h-screen pb-20">
         <div>
            <Image
               data-test="background-image"
               alt={fullViper.name}
               src={fullViper.backgroundImage}
               width={560}
               height={280}
               placeholder="blur"
               loading="lazy"
               blurDataURL={fullViper.image}
               quality={100}
               className="-z-10 h-48 w-full lg:h-56 rounded-xl object-cover object-center"
            />
            <div className={`${profileWidth} -mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5`}>
               <div className="relative flex justify-center align-middle h-28 w-28 border-solid border-4 rounded-full border-yellow-600 overflow-hidden">
                  {/* <Link href={'profile-image'}> */}
                  <Image
                     data-test="profile-image"
                     alt={fullViper.name}
                     src={`${fullViper.image}`}
                     width={140}
                     height={140}
                     placeholder="blur"
                     loading="lazy"
                     blurDataURL={fullViper.image}
                     quality={100}
                     className="object-cover object-center"
                  />
                  {/* </Link> */}
                  {/* <BlurImage src={user.image} alt={user.name} width={300} height={300} /> */}
                  {settingsPage && (
                     <button
                        className="absolute bg-gray-800 bg-opacity-50 hover:bg-opacity-70 w-full h-full z-10 transition-all flex items-center justify-center"
                        // onClick={() => alert('Image upload has been disabled for demo purposes.')}
                     >
                        {/* <UploadIcon className="h-6 w-6 text-white" /> */}
                        {/* add this as a component or find a materialUI */}
                        <svg
                           className={'h-6 w-6 text-white'}
                           viewBox="0 0 24 24"
                           width="24"
                           height="24"
                           stroke="currentColor"
                           strokeWidth="1.5"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           fill="none"
                           shapeRendering="geometricPrecision"
                        >
                           <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                           <path d="M17 8l-5-5-5 5" />
                           <path d="M12 3v12" />{' '}
                        </svg>
                        {/*  */}
                     </button>
                  )}
               </div>
               <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                  <div className="flex min-w-0 flex-1 items-center space-x-2">
                     <h1 className="text-2xl font-semibold text-white truncate">
                        {fullViper.name}
                     </h1>

                     {/* <CheckInCircleIcon className="w-6 h-6 text-[#0070F3]" /> */}
                     {/* same here add it as a class or find a material UI */}
                     <svg
                        className={'h-6 w-6 text-[#0070F3]'}
                        viewBox="0 0 20 20"
                        fill="currentColor "
                     >
                        <path
                           fillRule="evenodd"
                           d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                           clipRule="evenodd"
                        />
                     </svg>
                     {/*  */}
                  </div>
                  {fullViper ? (
                     <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <a
                           href={`https://github.com/${fullViper.name}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-flex justify-center px-4 py-2 border border-gray-800 hover:border-white shadow-sm text-sm font-medium rounded-md text-white font-mono bg-black focus:outline-none focus:ring-0 transition-all"
                        >
                           {/* <GitHubIcon className="mr-3 h-5 w-5 text-white" /> */}
                           {/* same here material UI */}
                           <svg
                              className={'mr-3 h-5 w-5 text-white'}
                              fill="currentColor"
                              height="24"
                              viewBox="0 0 24 24"
                              width="24"
                           >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                           </svg>
                           {/*  */}
                           {/* we could use the edit button in here */}
                           <span>View GitHub Profile</span>
                        </a>
                     </div>
                  ) : (
                     // we might return null in this statement
                     <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <a
                           href="https://github.com/vercel/mongodb-starter"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-flex justify-center px-4 py-2 border border-gray-800 hover:border-white shadow-sm text-sm font-medium rounded-md text-white font-mono bg-black focus:outline-none focus:ring-0 transition-all"
                        >
                           {/* <GitHubIcon className="mr-3 h-5 w-5 text-white" /> */}
                           <svg
                              className={'mr-3 h-5 w-5 text-white'}
                              fill="currentColor"
                              height="24"
                              viewBox="0 0 24 24"
                              width="24"
                           >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                           </svg>
                           {/*  */}
                           <span>Demo Account</span>
                        </a>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Bio */}
         <div className={`${profileWidth} mt-16`}>
            <h2 className="font-semibold font-mono text-2xl text-white">Bio</h2>
            {settingsPage ? (
               <>
                  {/* find a material ui in here */}
                  {/* <TextareaAutosize */}
                  <textarea
                     name="description"
                     //  onInput={(e) => {
                     //     // setData({
                     //     //    ...data,
                     //     //    bio: (e.target as HTMLTextAreaElement).value,
                     //     // })
                     //  }}
                     className="mt-1 w-full max-w-2xl px-0 text-sm tracking-wider leading-6 text-white bg-black font-mono border-0 border-b border-gray-800 focus:border-white resize-none focus:outline-none focus:ring-0"
                     placeholder="Enter a short bio about yourself... (Markdown supported)"
                     value={fullViper.biography}
                  ></textarea>
                  {/* /> */}
                  <div className="flex justify-end w-full max-w-2xl">
                     <p className="text-gray-400 font-mono text-sm">
                        {fullViper.biography.length}/256
                     </p>
                  </div>
               </>
            ) : (
               <article className="mt-3 max-w-2xl text-sm tracking-wider leading-6 text-white font-mono prose prose-headings:text-white prose-a:text-white">
                  {/* <MDXRemote {...data.bioMdx} /> */}
                  What's going on here
               </article>
            )}
         </div>

         {/* Edit buttons */}
         {settingsPage ? (
            <div className="fixed bottom-10 right-10 flex items-center space-x-3">
               <p className="text-sm text-gray-500">{error}</p>
               <button
                  className={`${
                     saving ? 'cursor-not-allowed' : ''
                  } rounded-full border border-[#0070F3] hover:border-2 w-12 h-12 flex justify-center items-center transition-all`}
                  disabled={saving}
                  //   onClick={handleSave}
               >
                  {
                     saving
                        ? 'loading dots'
                        : //  <LoadingDots color="white" />
                          'check icon'
                     //  <CheckIcon className="h-4 w-4 text-white" />
                  }
               </button>
               <Link href={`/${fullViper.name}`} shallow replace scroll={false}>
                  <a className="rounded-full border border-gray-800 hover:border-white w-12 h-12 flex justify-center items-center transition-all">
                     close icon
                     {/* <XIcon className="h-4 w-4 text-white" /> */}
                  </a>
               </Link>
            </div>
         ) : fullViper ? (
            <Link
               href={{ query: { settings: true } }}
               as="/settings"
               shallow
               replace
               scroll={false}
               //    className="fixed bottom-10 right-10 rounded-full border bg-black border-gray-800 hover:border-white w-12 h-12 flex justify-center items-center transition-all"
            >
               {/* <span className="fixed bottom-10 right-10 rounded-full border bg-black border-gray-800 hover:border-white w-12 h-12 flex justify-center items-center transition-all"></span> */}
               edit icon
               {/* <EditIcon className="h-4 w-4 text-white" /> */}
            </Link>
         ) : null}
      </div>
   )
}
