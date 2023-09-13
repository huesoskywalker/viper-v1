"use client"

import { useState, useTransition } from "react"
import { PageProps } from "@/lib/utils"

export default function PreviewEventButton({ children }: PageProps) {
    const [newEventPreview, setNewEventPreview] = useState<boolean>(false)
    const [isPending, startTransition] = useTransition()
    const showPreview = (): void => {
        startTransition(() => {
            setNewEventPreview(!newEventPreview)
        })
    }

    return (
        <div>
            <button
                data-test="preview-button"
                className=" items-center w-fit rounded-lg bg-gray-700 my-3 p-2 py-2 text-sm font-medium text-white hover:bg-yellow-800/80 disabled:text-white/70"
                disabled={isPending}
                onClick={() => showPreview()}
            >
                Preview
                {isPending ? (
                    <div className="absolute right-2 top-1.5" role="status">
                        <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : null}
            </button>
            {newEventPreview ? children : null}
        </div>
    )
}
