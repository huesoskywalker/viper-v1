"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AddComment({
    id,
    commentId,
    viperIdName,
    commentReplies,
    timestamp,
    commentCookie,
    event,
    reply,
    blog,
}: {
    id: string | null
    commentId: string | null
    viperIdName: string | undefined
    commentReplies: number | null
    timestamp: number | null
    commentCookie: string | "none"
    event: boolean
    reply: boolean
    blog: boolean
}) {
    const [comment, setComment] = useState<string>("")
    const [openCommentInput, setOpenCommentInput] = useState<boolean>(false)
    const [pendingComment, setPendingComment] = useState<boolean>(false)
    const [isCommented, setIsCommented] = useState<string>(commentCookie)

    const [isPending, startTransition] = useTransition()

    const router = useRouter()

    const viper = useSession()
    if (!viper) throw new Error("No viper bro")
    const viperId: string | undefined = viper.data?.user._id
    const viperImage: string | undefined = viper.data?.user.image

    const submitComment = async (e: any): Promise<void> => {
        e.preventDefault()
        if (event && !reply && !blog) {
            const eventComment = await fetch(`http://localhost:3000/api/event/comment/post`, {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    event: { _id: id },
                    viper: { _id: viperId },
                    comment: comment,
                }),
            })
            const newComment: Comment = await eventComment.json()
        } else if (!event && reply && !blog) {
            const replyComment = await fetch(`/api/event/comment/reply/post`, {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    event: { _id: id },
                    viper: { _id: viperId },
                    comment: { _id: commentId, content: comment },
                }),
            })

            await replyComment.json()
        } else if (blog) {
            const blogComment = await fetch(`/api/viper/blog/comment`, {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    comment: { _id: commentId, content: comment },
                    blogOwner: { _id: id },
                    viper: { _id: viperId },
                }),
            })

            await blogComment.json()
        }
        setIsCommented(isCommented === "none" ? "blue" : "none")
        startTransition(() => {
            setPendingComment(false)
            setComment("")
            setOpenCommentInput(false)
            router.refresh()
        })
    }

    const writeComment = (): void => {
        setPendingComment(true)
        setOpenCommentInput(!openCommentInput)
    }

    useEffect(() => {
        document.cookie = `_${timestamp}_is_commented=${isCommented}; path=/profile; max-age=${
            60 * 60 * 24 * 30
        }}`
    }, [isCommented])

    return (
        <div className="flex justify-start">
            {blog ? (
                <button
                    data-test="comment-blog"
                    onClick={writeComment}
                    className=" text-gray-400 hover:text-blue-500/75"
                >
                    {blog && !reply ? (
                        <div className="flex justify-center space-x-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={`w-6 h-6 hover:animate-pulse ${
                                    isPending && pendingComment
                                        ? "text-blue-700"
                                        : `text-${isCommented}-700`
                                }`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                                />
                            </svg>
                            <span
                                data-test="blog-comment-count"
                                className=" text-sm text-gray-400 flex justify-start self-end ml-2"
                            >
                                {commentReplies}
                            </span>
                        </div>
                    ) : (
                        <div className="flex justify-center space-x-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={`w-6 h-6 hover:animate-pulse ${
                                    isPending && pendingComment
                                        ? "text-blue-700"
                                        : `text-${isCommented}-700`
                                }`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                                />
                            </svg>
                            <span className=" text-sm text-gray-400 flex justify-start self-end ml-2">
                                {commentReplies ?? "0"}
                            </span>
                        </div>
                    )}
                </button>
            ) : event ? (
                <button
                    data-test="comment-event"
                    onClick={writeComment}
                    className=" text-gray-400 hover:text-blue-700"
                >
                    <div className="flex justify-center space-x-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 "
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                            />
                        </svg>
                        <span
                            data-test="comment-event-count"
                            className=" text-xs text-gray-400 flex justify-start self-end ml-2"
                        >
                            {commentReplies ?? "0"}
                        </span>
                    </div>
                </button>
            ) : (
                <button
                    data-test="comment-comment"
                    onClick={writeComment}
                    className=" text-gray-400 hover:text-blue-700"
                >
                    <div className="flex justify-center space-x-1">
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
                                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                            />
                        </svg>
                        <span
                            data-test="comment-comment-count"
                            className=" text-xs text-gray-400 flex justify-start self-end ml-2"
                        >
                            {commentReplies ?? "0"}
                        </span>
                    </div>
                </button>
            )}
            <div>
                {openCommentInput ? (
                    <div
                        className="fixed  inset-0 z-30 overflow-x-auto "
                        data-test="comment-input"
                    >
                        <div className="flex items-center min-h-screen px-4 py-4">
                            <div className="relative w-full max-w-md p-4  mx-auto bg-gray-900 rounded-xl shadow-lg">
                                <div className="space-x-2">
                                    <div className=" text-center sm:ml-2 sm:text-left ">
                                        <div className="grid grid-cols-9 space-y-2">
                                            <button
                                                data-test="close-input"
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
                                                    data-test="viper-image"
                                                    src={`/vipers/${viperImage}`}
                                                    // src={`${
                                                    //     firstLogin(viperImage!)
                                                    //         ? viperImage
                                                    //         : `/vipers/${viperImage}`
                                                    // }`}
                                                    alt={`/vipers/${viperImage}`}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full h-fit w-fit"
                                                />
                                                <span
                                                    data-test="viper-name"
                                                    className="text-gray-300/90 text-xs flex justify-center "
                                                >
                                                    {viperIdName}
                                                </span>
                                            </div>
                                            <textarea
                                                data-test="write-comment"
                                                className="h-20 p-2 col-start-3 col-span-7 text-gray-300 bg-black/30 border-[2px] rounded-lg border-transparent sm:text-xs outline-none focus:border-yellow-700/80"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                rows={3}
                                                placeholder={
                                                    !event && !reply
                                                        ? "What's happening?"
                                                        : "Share your thoughts"
                                                }
                                                maxLength={160}
                                                required
                                            ></textarea>
                                            <button
                                                data-test="post-comment"
                                                className="col-start-5 col-span-2 relative w-full items-center space-x-2 rounded-lg bg-gray-800 px-3 py-1  text-sm font-medium text-white hover:bg-yellow-900/80 disabled:text-white/70"
                                                onClick={(e) => submitComment(e)}
                                            >
                                                Comment
                                                {isPending ? (
                                                    <div
                                                        className="absolute right-2 top-1.5"
                                                        role="status"
                                                    >
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
        </div>
    )
}
