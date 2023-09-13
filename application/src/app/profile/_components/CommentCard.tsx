import { getViperById } from "@/lib/vipers"
import Image from "next/image"
import { cookies } from "next/headers"
import Link from "next/link"
import ShowViper from "../../[id]/_components/ShowViper"
import { EventDate } from "@/app/[id]/_components/EventDate"
import { Viper } from "@/types/viper"
import { AddLike } from "@/app/[id]/_components/AddLike"
import OrganizerInfo from "@/app/[id]/_components/OrganizerInfo"
import AddComment from "@/app/[id]/_components/AddComment"

export async function CommentCard({
    viperId,
    commentId,
    text,
    timestamp,
    likes,
    replies,
    blog,
}: {
    commentId: string
    viperId: string
    text: string
    timestamp: number
    likes: number
    replies: number
    blog: boolean
}) {
    const viper_id: string = viperId.replace(/['"]+/g, "")
    const comment_id: string = commentId.replace(/[\W]+/g, "")
    const viper: Viper | null = await getViperById(viper_id)
    if (!viper) throw new Error("No viper bro")

    const likedCookie: string = cookies().get(`_${timestamp}_is_liked`)?.value || "none"
    const commentCookie = cookies().get(`_${timestamp}_is_commented`)?.value || "none"
    // const rePostCookie: string =
    //     cookies().get(`_${timestamp}_is_rePosted`)?.value || "none"
    return (
        <div className="space-y-2 lg:border-b lg:border-gray-800 pb-3 ml-5">
            <div className="flex items-center w-full max-w-lg  mx-auto ">
                <div className=" text-center sm:ml-4 sm:text-left">
                    <div className="grid grid-cols-9 gap-3 space-x-4">
                        <div className="col-start-1 col-span-1 ">
                            <Link href={`/dashboard/vipers/${viper_id}`}>
                                <Image
                                    data-test="blog-viper-image"
                                    alt={viper.image}
                                    src={viper.image}
                                    width={50}
                                    height={50}
                                    loading="lazy"
                                    placeholder="blur"
                                    blurDataURL={viper.image}
                                    className="rounded-full "
                                />
                            </Link>
                        </div>
                        <div className="col-start-2 col-span-7 border-[1px] border-yellow-600/60  rounded-xl bg-gray-700/50 p-2 h-[8rem] w-[22rem] space-y-2">
                            <div className=" col-start-1 col-span-2 max-h-auto">
                                <ShowViper viperName={viper.name} event={false} blog={blog}>
                                    {/* @ts-expect-error Async Server Component */}
                                    <OrganizerInfo
                                        key={JSON.stringify(viper._id)}
                                        organizerId={JSON.stringify(viper._id)}
                                        event={false}
                                    />
                                </ShowViper>
                            </div>
                            <Link href={`/dashboard/vipers/${viper_id}`} className="space-y-2">
                                <div className="flex justify-between">
                                    <span
                                        data-test="blog-viper-name"
                                        className="flex justify-start text-yellow-500/80 text-xs ml-[5px]"
                                    >
                                        {viper.name}
                                    </span>
                                    <EventDate date={timestamp} collection={false} />
                                </div>
                                <span
                                    data-test="blog-comment"
                                    className="flex justify-start text-gray-300 text-sm mx-2  "
                                >
                                    {text}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className=" flex justify-items-start space-x-4 space-y-1 ml-24">
                <AddLike
                    eventId={viper_id}
                    commentId={comment_id}
                    replyId={viper_id}
                    likes={likes}
                    timestamp={timestamp}
                    event={false}
                    reply={false}
                    blog={blog}
                    likedCookie={likedCookie}
                />
                <AddComment
                    id={viperId}
                    commentId={comment_id}
                    commentReplies={replies}
                    viperIdName={viper.name}
                    timestamp={timestamp}
                    commentCookie={commentCookie}
                    event={false}
                    reply={false}
                    blog={blog}
                />
            </div>
        </div>
    )
}
