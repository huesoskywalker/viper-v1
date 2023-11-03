'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import Image from 'next/image'

export function BlogButton({
   viperId,
   viperName,
   viperImage,
}: {
   viperId: string
   viperName: string
   viperImage: string
}) {
   const [comment, setComment] = useState<string>('')
   const [openCommentInput, setOpenCommentInput] = useState<boolean>(false)
   const [isPending, startTransition] = useTransition()

   const router = useRouter()
   const commentInput = (): void => {
      setOpenCommentInput(!openCommentInput)
   }
   const writeBlog = async (): Promise<void> => {
      // remember this for when we clear the AddComment Button
      //   if (!event && !reply && !blog) {
      const response = await fetch(`/api/viper/blog/create`, {
         method: 'POST',
         headers: {
            'content-type': 'application/json; charset=utf-8',
         },
         body: JSON.stringify({
            _id: viperId,
            content: comment,
         }),
      })
      const freshComment = await response.json()

      startTransition(() => {
         setComment('')
         setOpenCommentInput(!openCommentInput)
         router.refresh()
      })
      // }
   }
   return (
      <div>
         <button
            data-test="blog-button"
            onClick={commentInput}
            className=" text-sm text-gray-200 bg-yellow-700/70 rounded-3xl py-2 px-3 hover:bg-yellow-500/70"
         >
            Let's Blog
         </button>
         {openCommentInput ? (
            <div data-test="commentInput" className="fixed  inset-0 z-30 overflow-x-auto ">
               <div className="flex items-center min-h-screen px-4 py-4">
                  <div className="relative w-full max-w-md p-4  mx-auto bg-gray-900 rounded-xl shadow-lg">
                     <div className="space-x-2">
                        <div className=" text-center sm:ml-2 sm:text-left ">
                           <div className="grid grid-cols-9 space-y-2">
                              <button
                                 className="absolute left-2 top-2 text-gray-300 hover:text-red-700"
                                 onClick={() => setOpenCommentInput(false)}
                              >
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5 "
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       d="M6 18L18 6M6 6l12 12"
                                    />
                                 </svg>
                              </button>
                              <div className="col-start-1 col-span-2  self-center">
                                 <Image
                                    src={`/vipers/${viperImage}`}
                                    alt={`/vipers/${viperImage}`}
                                    width={50}
                                    height={50}
                                    className="rounded-full h-fit w-fit"
                                 />
                                 <span className="text-gray-300/90 text-xs flex justify-center ">
                                    {viperName}
                                 </span>
                              </div>
                              <textarea
                                 data-test="add-comment"
                                 className="h-20 p-2 col-start-3 col-span-7 text-gray-300 bg-black/30 border-[2px] rounded-lg border-transparent sm:text-xs outline-none focus:border-yellow-700/80"
                                 value={comment}
                                 onChange={(e) => setComment(e.target.value)}
                                 rows={3}
                                 placeholder={'Share your thoughts'}
                                 maxLength={160}
                                 required
                              ></textarea>
                              <button
                                 data-test="post-blog"
                                 className="col-start-5 col-span-2 relative w-full items-center space-x-2 rounded-lg bg-gray-800 px-3 py-1  text-sm font-medium text-white hover:bg-yellow-900/80 disabled:text-white/70"
                                 onClick={writeBlog}
                              >
                                 Comment
                                 {isPending ? (
                                    <div className="absolute right-2 top-1.5" role="status">
                                       <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
                                       <span className="sr-only">Loading...</span>
                                    </div>
                                 ) : null}
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         ) : null}
      </div>
   )
}
