import { CustomError } from "@/error/CustomError"
import { MyBlog } from "@/types/viper"

export async function useViperBlogs(viperId: string): Promise<MyBlog[] | CustomError> {
    try {
        const blogsResponse = await fetch(`/api/viper/blog/all`, {
            method: "post",
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                // let's change this viper: { _id: viperId }
                viper_id: viperId,
            }),
        })
        // const viperBlogs: AxiosResponse<MyBlog[], AxiosResponseHeaders> = await axios.post(
        //     "/api/viper/blog/all",
        //     {
        //         viper_id: viperId,
        //     }
        // )
        const viperBlogs = await blogsResponse.json()
        return viperBlogs
    } catch (error: unknown) {
        if (error instanceof Error) {
            const name = error.name as string
            const message = error.message as string

            const customError = new CustomError(name, message)
            return customError
        }
        throw new Error(`${error}`)
    }
}
