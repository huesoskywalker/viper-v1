"use client"

import { PageProps } from "@/lib/utils"
import { Chats, Message } from "@/types/viper"
import { useSubscription } from "@apollo/client"
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr"
import Chat from "./_components/Chat"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { CHAT_QUERY } from "@/graphql/query/chats"
import Loading from "../../loading"
import { MESSAGE_SUBSCRIPTION } from "@/graphql/subscriptions/new-message"

export default function chatIdPage({ params }: PageProps) {
    const contactId: string = params._id

    const { data: session, status } = useSession({ required: true })
    const viperId: string | undefined = session?.user._id
    if (status === "loading") return <Loading />

    const [newMessages, setNewMessages] = useState<Message[]>([])

    const {
        ref: scrollRef,
        inView,
        entry,
    } = useInView({
        trackVisibility: true,
        initialInView: true,
        threshold: 0,
        delay: 100,
    })
    const { data: initialChat }: { data: { chat: Chats } } = useSuspenseQuery(CHAT_QUERY, {
        variables: {
            viperId: viperId,
            contactId: contactId,
        },
    })

    const { data: subscriptionChat }: { data?: { messageAdded: Message } } =
        useSubscription(MESSAGE_SUBSCRIPTION)

    useEffect(() => {
        if (subscriptionChat) {
            setNewMessages((prevMessage) => [...prevMessage, subscriptionChat.messageAdded])
        }

        setTimeout(() => {
            if (entry?.target) {
                entry?.target.scrollIntoView({ behavior: "smooth", block: "end" })
            }
        }, 100)
    }, [subscriptionChat, entry?.target])

    return (
        <div className="flex h-[20.5rem] ">
            {!inView && (
                <div className="py-1.5 w-full px-3 z-10 text-xs absolute flex justify-center bottom-0 mb-[120px] inset-x-0">
                    <button
                        className="py-1.5 px-3 text-xs bg-[#1c1c1f] border border-[#363739] rounded-full text-white font-medium"
                        onClick={() => {
                            entry?.target.scrollIntoView({
                                behavior: "smooth",
                                block: "end",
                            })
                        }}
                    >
                        Scroll to see latest messages
                    </button>
                </div>
            )}
            <div className="overflow-y-scroll space-y-2 text-gray-300 text-sm w-full max-h-[20.5rem] ">
                {initialChat?.chat.messages.map((message: Message) => {
                    return (
                        <Chat
                            key={JSON.stringify(message._id)}
                            messageId={JSON.stringify(message._id)}
                            sender={JSON.stringify(message.sender)}
                            message={message.message}
                            timestamp={Number(message.timestamp)}
                        />
                    )
                })}
                {newMessages?.map((message) => {
                    return (
                        <Chat
                            key={JSON.stringify(message._id)}
                            messageId={JSON.stringify(message._id)}
                            sender={JSON.stringify(message.sender)}
                            message={message.message}
                            timestamp={Number(message.timestamp)}
                        />
                    )
                })}
                <div className="py-0.5" ref={scrollRef} />
            </div>
        </div>
    )
}
