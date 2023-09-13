import { MyBlog } from "@/types/viper"
import { CommentCard } from "./CommentCard"
import { useViperBlogs } from "../_hooks/useViperBlogs"
import { CustomError } from "@/error/CustomError"
import ErrorDisplay from "@/app/_components/ErrorDisplay"

export async function ViperBlogs({ viperId }: { viperId: string }): Promise<JSX.Element> {
    const viperBlogs: MyBlog[] | CustomError = await useViperBlogs(viperId)

    if (viperBlogs instanceof CustomError) {
        return (
            <div className="flex items-start justify-center max-w-screen-md min-h-screen mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-7">
                <ErrorDisplay
                    name={viperBlogs.name}
                    status={viperBlogs.status}
                    message={viperBlogs.message}
                />
            </div>
        )
    } else {
        return (
            <>
                <div className="space-y-4 w-full flex-wrap">
                    {viperBlogs.map((blog: MyBlog) => {
                        return (
                            /* @ts-expect-error Server Component */
                            <CommentCard
                                key={JSON.stringify(blog._id)}
                                viperId={viperId}
                                commentId={JSON.stringify(blog._id)}
                                text={blog.content}
                                timestamp={blog.timestamp}
                                likes={blog.likes.length}
                                replies={blog.comments.length}
                                blog={true}
                            />
                        )
                    })}
                </div>
            </>
        )
    }
}
