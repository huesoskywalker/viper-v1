"use client"

import { ReactNode, useState } from "react"

export function ShowFollows({
    children,
    follows,
    followers,
    profile,
}: {
    children: ReactNode
    follows: number
    followers: boolean
    profile: boolean
}) {
    const [openFollows, setOpenFollows] = useState<boolean>(false)
    const showFollows = (): void => {
        setOpenFollows(!openFollows)
    }
    return (
        <span>
            <button data-test="display-show-follow" onClick={showFollows}>
                <span>
                    <span data-test="follow-count" className="text-sm">
                        {follows ?? "0"}
                    </span>{" "}
                    {followers ? "Followers" : "Following"}
                </span>
            </button>

            {openFollows ? (
                profile ? (
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex items-center min-h-screen px-4 py-8">
                            <div className="relative w-full max-w-lg p-4 mx-auto bg-gray-800 rounded-xl shadow-lg">
                                <button
                                    className="flex justify-start self-start mb-3"
                                    onClick={() => setOpenFollows(false)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                                <div className="mx-10 ">
                                    <div className=" text-center sm:ml-4 sm:text-left">
                                        <div className="items-center gap-2 mt-3 grid grid-rows-2 grid-cols-4 ">
                                            {children}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative top-0 left-0 z-10 overflow-y-auto">
                        <div className="flex items-center min-h-screen px-4 py-8">
                            <div className="relative w-[14rem] h-[11rem] max-w-lg p-4 mx-auto bg-gray-800 rounded-xl shadow-lg">
                                <button
                                    className="flex justify-start self-start mb-3"
                                    onClick={() => setOpenFollows(false)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4 absolute top-[10px] left-[10px]"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                                <div className=" text-center sm:ml-4 sm:text-left">
                                    <div className="items-center align-bottom gap-3 mt-3 grid grid-rows-1 grid-cols-3 ">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            ) : null}
        </span>
    )
}
