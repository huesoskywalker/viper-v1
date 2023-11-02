"use client"
import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

export default function RePostBlog({
    _id,
    blogOwner_id,
    viper_id,
    rePosts,
    timestamp,
    rePostCookie,
}: {
    _id: string
    blogOwner_id: string
    viper_id: string
    rePosts: number
    timestamp: number
    rePostCookie: string
}) {
    const [isPending, startTransition] = useTransition()
    const [isRePosted, setIsRePosted] = useState<string>(rePostCookie)
    const router = useRouter()

    const rePostBlog = async (): Promise<void> => {
        const response = await fetch(`/api/re-post-blog`, {
            method: "POST",
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                _id: _id,
                blogOwner_id: blogOwner_id,
                viper_id: viper_id,
            }),
        })

        await response.json()

        startTransition(() => {
            setIsRePosted(isRePosted === "none" ? "green" : "none")
            router.refresh()
        })
    }

    useEffect(() => {
        document.cookie = `_${timestamp}_is_rePosted=${isRePosted}; path=/profile; max-age=${
            60 * 60 * 24 * 30
        }}`
    }, [isRePosted])
    return (
        <div>
            <button
                onClick={rePostBlog}
                className="grid grid-cols-2 ml-1 text-gray-400 hover:text-green-700"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-6 h-6 hover:text-green-700 hover:animate-pulse ${
                        isPending ? "text-green-700" : `text-${isRePosted}-700`
                    }`}
                >
                    <path
                        fillRule="evenodd"
                        d="M10 4.5c1.215 0 2.417.055 3.604.162a.68.68 0 01.615.597c.124 1.038.208 2.088.25 3.15l-1.689-1.69a.75.75 0 00-1.06 1.061l2.999 3a.75.75 0 001.06 0l3.001-3a.75.75 0 10-1.06-1.06l-1.748 1.747a41.31 41.31 0 00-.264-3.386 2.18 2.18 0 00-1.97-1.913 41.512 41.512 0 00-7.477 0 2.18 2.18 0 00-1.969 1.913 41.16 41.16 0 00-.16 1.61.75.75 0 101.495.12c.041-.52.093-1.038.154-1.552a.68.68 0 01.615-.597A40.012 40.012 0 0110 4.5zM5.281 9.22a.75.75 0 00-1.06 0l-3.001 3a.75.75 0 101.06 1.06l1.748-1.747c.042 1.141.13 2.27.264 3.386a2.18 2.18 0 001.97 1.913 41.533 41.533 0 007.477 0 2.18 2.18 0 001.969-1.913c.064-.534.117-1.071.16-1.61a.75.75 0 10-1.495-.12c-.041.52-.093 1.037-.154 1.552a.68.68 0 01-.615.597 40.013 40.013 0 01-7.208 0 .68.68 0 01-.615-.597 39.785 39.785 0 01-.25-3.15l1.689 1.69a.75.75 0 001.06-1.061l-2.999-3z"
                        clipRule="evenodd"
                    />
                </svg>
                <span className=" text-sm text-gray-400 flex justify-start self-end ml-2">
                    {rePosts ?? "0"}
                </span>
            </button>
        </div>
    )
}
