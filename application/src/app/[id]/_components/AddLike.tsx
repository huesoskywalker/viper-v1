"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTransition, useState, useEffect } from "react"

export function AddLike({
    eventId,
    commentId,
    replyId,
    likes,
    timestamp,
    event,
    reply,
    blog,
    likedCookie,
}: {
    eventId: string | null
    commentId: string
    replyId: string | undefined
    likes: number
    timestamp: number | Date | string
    event: boolean
    reply: boolean
    blog: boolean
    likedCookie: string
}) {
    const [isPending, startTransition] = useTransition()

    const [isLiked, setIsLiked] = useState<string>(likedCookie)

    const toggleLike = (): void => {
        if (event || blog) {
            setIsLiked(isLiked === "none" ? "red" : "none")
        } else {
            setIsLiked(isLiked === "none" ? "yellow" : "none")
        }
    }

    const viper = useSession()
    if (!viper) throw new Error("No viper bro")
    const viperId = viper.data?.user._id

    const router = useRouter()

    const addLike = async (): Promise<void> => {
        if (event && !reply && !blog) {
            try {
                const response = await fetch(`http://localhost:3000/api/event/like`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json; charset=utf-8",
                    },
                    body: JSON.stringify({
                        event: { _id: eventId },
                        viper: { _id: viperId },
                    }),
                })

                const eventLiked = await response.json()
            } catch (error: unknown) {
                console.error(error)
            }
        } else if (!event && !reply && !blog) {
            try {
                const response = await fetch(`/api/event/comment/like`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json; charset=utf-8",
                    },
                    body: JSON.stringify({
                        event: { _id: eventId },
                        comment: { _id: commentId },
                        viper: { _id: viperId },
                    }),
                })

                await response.json()
            } catch (error: unknown) {
                console.error(error)
            }
        } else if (!event && reply && !blog) {
            try {
                const response = await fetch(`/api/comment/reply/like`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json; charset=utf-8",
                    },
                    body: JSON.stringify({
                        event: { _id: eventId },
                        comment: { _id: commentId },
                        reply: { _id: replyId },
                        viper: { _id: viperId },
                    }),
                })
                await response.json()
            } catch (error: unknown) {
                console.error(error)
            }
        } else if (!event && blog) {
            try {
                const response = await fetch(`/api/viper/blog/like`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json; charset=utf-8",
                    },
                    body: JSON.stringify({
                        comment: { _id: commentId },
                        blogOwner: { _id: eventId },
                        viper: { _id: viperId },
                    }),
                })
                const freshLikedBlog = await response.json()
            } catch (error: unknown) {
                console.error(error)
            }
        }

        toggleLike()
        startTransition(() => {
            router.refresh()
        })
    }

    useEffect(() => {
        if (event && !reply && !blog) {
            document.cookie = `_is_liked=${isLiked}; path=/${eventId}; max-age=${
                60 * 60 * 24 * 30
            }}`
        } else if (!event && !reply && !blog) {
            document.cookie = `_${commentId}_is_liked=${isLiked}; path=/${eventId}; max-age=${
                60 * 60 * 24 * 30
            }}`
        } else if (!event && reply && !blog) {
            document.cookie = `_${replyId}_is_liked=${isLiked}; path=/${eventId}; max-age=${
                60 * 60 * 24 * 30
            }}`
        } else if (!event && blog) {
            document.cookie = `_${timestamp}_is_liked=${isLiked}; path=/profile; max-age=${
                60 * 60 * 24 * 30
            }}`
        }
    }, [isLiked])

    return (
        <div className="flex justify-start">
            <button onClick={addLike} className=" text-gray-400">
                <div className="flex justify-center space-x-1">
                    {event ? (
                        <svg
                            data-test="like-event"
                            xmlns="http://www.w3.org/2000/svg"
                            fill={` ${isPending ? "rgb(64,0,0)" : likedCookie}`}
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={`w-6 h-6 hover:text-red-700 hover:animate-pulse ${
                                isPending ? "text-red-700" : `text-${likedCookie}-700`
                            }`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                        </svg>
                    ) : blog ? (
                        <svg
                            data-test="like-blog"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={`w-6 h-6 hover:text-red-700 hover:animate-pulse ${
                                isPending ? "text-red-700" : `text-${likedCookie}-700`
                            }`}
                        >
                            <path
                                fillRule="evenodd"
                                d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 01.572-2.759 6.026 6.026 0 012.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0013.5 4.938zM14 12a4 4 0 01-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 001.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 011.315-4.192.447.447 0 01.431-.16A4.001 4.001 0 0114 12z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ) : (
                        <svg
                            data-test="like-comment"
                            xmlns="http://www.w3.org/2000/svg"
                            fill={` ${isPending ? "rgb(64,0,0)" : isLiked}`}
                            fillOpacity="0.77"
                            viewBox="0 0 24 24"
                            strokeWidth={1.8}
                            stroke="currentColor"
                            className={`w-5 h-5 mt-1 text-gray-400 hover:text-yellow-900 ${
                                isPending ? "text-yellow-600" : `text-${isLiked}-700`
                            }`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                            />
                        </svg>
                    )}
                    <span
                        data-test="like-count"
                        className=" text-sm text-gray-400 flex justify-start self-end ml-2"
                    >
                        {likes ?? "0"}
                    </span>
                </div>
            </button>
        </div>
    )
}
