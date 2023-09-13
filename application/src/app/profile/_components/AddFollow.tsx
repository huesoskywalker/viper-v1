"use client"

import { useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function AddFollow({
    id,
    isFollowed,
    event,
}: {
    id: string
    isFollowed: boolean
    event: boolean
}) {
    const [isPending, startTransition] = useTransition()
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const isMutating = isFetching || isPending
    const router = useRouter()

    const { data: session } = useSession()
    const viperId: string | undefined = session?.user._id

    const follow = async (): Promise<void> => {
        setIsFetching(true)
        const response = await fetch(`/api/viper/follow`, {
            method: "PUT",
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                currentViper: { _id: viperId },
                viper: { _id: id },
            }),
        })
        setIsFetching(false)

        await response.json()
        startTransition(() => {
            router.refresh()
        })
    }

    return (
        <div>
            {event ? (
                <button
                    data-test="add-follow"
                    className={
                        isFollowed
                            ? `${
                                  isMutating ? "bg-opacity-60 animate-pulse" : "bg-opacity-100"
                              } w-28 space-x-1 rounded-lg bg-yellow-800/70  hover:bg-red-600/70  px-3 py-1  text-sm font-medium text-gray-200 hover:text-white disabled:text-white/70`
                            : `${
                                  isMutating ? "bg-opacity-60 animate-pulse" : "bg-opacity-100"
                              } w-28 space-x-1 rounded-lg bg-yellow-800/70  hover:bg-yellow-600/70  px-3 py-1  text-sm font-medium text-gray-200 hover:text-white disabled:text-white/70`
                    }
                    onClick={follow}
                    disabled={isPending}
                >
                    <div className="flex justify-center space-x-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                        >
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                        {isFollowed ? <span>Following</span> : <span>Follow</span>}
                    </div>
                    {isPending ? (
                        <div className="absolute" role="status">
                            <div
                                className="
            h-4 w-4 animate-spin rounded-full border-[2.5px] border-white border-r-transparent"
                            />
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : null}
                </button>
            ) : null}
        </div>
    )
}
