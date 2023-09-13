import { PageProps } from "@/lib/utils"
// import { getBlogLikesAndRePosts } from "@/lib/vipers"
// import { ExternalBlog } from "@/types/viper"
// import PostAndLikeCard from "@/app/profile/[profileSlug]/PostAndLikeCard"

export default async function ViperSlugPage({ params }: PageProps) {
    const viperId: string = params.id
    // const blogLikesAndRePosts: CommentBlog[] & ExternalBlog[] =
    //     await getBlogLikesAndRePosts(viperId)
    return (
        <h1 className="text-yellow-500 text-lg">
            Let's build this up again, Probably a 3rd commentComponent to make things clearer{" "}
        </h1>
        // <div>
        //     {blogLikesAndRePosts?.map((blog) => {
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
