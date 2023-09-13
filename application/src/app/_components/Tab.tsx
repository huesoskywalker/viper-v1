"use client"

import type { Item } from "./TabGroup"
import clsx from "clsx"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

export const Tab = ({ path, item: { slug, text } }: { path: string; item: Item }) => {
    const segment = useSelectedLayoutSegment()
    const href = slug ? path + "/" + slug : path
    const isActive = (!slug && segment === null) || segment === slug

    return (
        <Link
            data-test={`tab-${slug}`}
            href={href}
            className={clsx("mt-2 mr-2 rounded-lg lg:px-3 md:px-2 py-1 text-sm font-medium", {
                "bg-gray-700 text-gray-100 hover:bg-gray-500 hover:text-white": !isActive,
                "bg-vercel-blue text-white": isActive,
            })}
        >
            {text}
        </Link>
    )
}
