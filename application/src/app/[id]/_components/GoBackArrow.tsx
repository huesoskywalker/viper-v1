"use client"

import { useRouter } from "next/navigation"
export default function GoBackArrow() {
    const router = useRouter()

    return (
        <div className="relative top-0 left-0">
            <button
                onClick={() => router.back()}
                className="text-gray-300 hover:text-yellow-500"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        fillRule="evenodd"
                        d="M20.25 12a.75.75 0 01-.75.75H6.31l5.47 5.47a.75.75 0 11-1.06 1.06l-6.75-6.75a.75.75 0 010-1.06l6.75-6.75a.75.75 0 111.06 1.06l-5.47 5.47H19.5a.75.75 0 01.75.75z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    )
}
