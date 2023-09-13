import { Session } from "next-auth"
import { getCurrentViper } from "@/lib/session"
import { ExternalBlog } from "@/types/viper"

export default async function ProfileSlugPage() {
    const viperSession: Session | null = await getCurrentViper()
    if (!viperSession) throw new Error("No Viper bro")
    const viper = viperSession?.user
    // const blogLikesAndRePosts: CommentBlog[] & ExternalBlog[] =
    //     await getBlogLikesAndRePosts(viper!.id)

    return (
        <>
            <h1 className="text-yellow-400 text-lg">Let's build it up again</h1>
        </>
        // <div className="space-y-4">
        //     {blogLikesAndRePosts?.map((blog: CommentBlog) => {
        //         return (
        //             /* @ts-expect-error Server Component */
        //             <PostAndLikeCard
        //                 key={JSON.stringify(blog.bloggerId)}
        //                 bloggerId={JSON.stringify(blog.bloggerId)}
        //                 blogId={JSON.stringify(blog.blogId)}
        //                 timestamp={blog.timestamp}
        //                 viperId={JSON.stringify(blog.viperId)}
        //                 showComment={blog.comment}
        //             />
        //         )
        //     })}
        // </div>
    )
}
