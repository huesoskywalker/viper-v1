"use client"
import { MESSAGE_SENDER } from "@/graphql/query/chats"
import { Sender } from "@/types/viper"
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr"
import { differenceInHours, formatDistance, formatRelative } from "date-fns"
import { useSession } from "next-auth/react"

export default function Chat({
    messageId,
    sender,
    message,
    timestamp,
}: {
    messageId: string
    sender: string
    message: string
    timestamp: number
}) {
    const { data: session } = useSession()
    const senderId: string = sender.replace(/['"]+/g, "")

    const { data }: { data: { sender: Sender } } = useSuspenseQuery(MESSAGE_SENDER, {
        variables: { _id: senderId },
    })

    const isCurrentViper: boolean = session?.user.name === data?.sender.name

    return (
        <div
            key={messageId}
            className={`flex flex-col relative space-x-1 space-y-1 px-3 ${
                isCurrentViper ? "text-right" : "text-left"
            }`}
        >
            {!isCurrentViper && (
                <span data-test="viper-name" className="text-[14px]">
                    {data.sender.name}
                </span>
            )}
            <div>
                <span
                    data-test="viper-message"
                    className={`inline-flex rounded-xl space-x-1 items-start p-2 text-xs text-white ${
                        isCurrentViper ? "bg-blue-400/75" : "bg-gray-700"
                    } `}
                >
                    {message}
                </span>
            </div>
            <p data-test="chat-timestamp" className="text-[11px]">
                {" "}
                {differenceInHours(new Date(), new Date(timestamp)) >= 1
                    ? formatRelative(new Date(timestamp), new Date())
                    : formatDistance(new Date(timestamp), new Date(), {
                          addSuffix: true,
                      })}
            </p>
        </div>
    )
}
