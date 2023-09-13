import { CustomError } from "@/error/CustomError"
import { AxiosResponseHeaders } from "@/types/axios"
import { MyBlog } from "@/types/viper"
import axios, { AxiosError, isAxiosError, AxiosResponse } from "axios"

export async function useViperBlogs(viperId: string): Promise<MyBlog[] | CustomError> {
    try {
        const viperBlogs: AxiosResponse<MyBlog[], AxiosResponseHeaders> = await axios.post(
            "http://localhost:3000/api/viper/blog/all",
            {
                viper_id: viperId,
            }
        )
        return viperBlogs.data
    } catch (error) {
        if (isAxiosError(error)) {
            const axiosError: AxiosError = error
            if (axiosError.response) {
                const status = axiosError.response.status
                const message = axiosError.response.data as string

                const customError = new CustomError(status, message)
                return customError
            }
        }
        throw new Error(`${error}`)
    }
}
