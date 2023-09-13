import { _ID } from "@/types/viper"
import { z } from "zod"

export const updateEventSchema = z.object({
    _id: z.string().transform((value) => value as _ID),
    title: z.string().nonempty("Title is required"),
    content: z.string().nonempty("Description is required"),
    date: z
        .date()
        .refine(
            (value) => {
                const currentDate = new Date()
                return value >= currentDate
            },
            {
                message: "Date must be today or later",
            }
        )
        .transform((value) => value.toISOString()),
    category: z.string().nonempty("Category is required"),
    price: z
        .number()
        .min(0, "Price must be greater or equal to 0")
        .refine(
            (value) => {
                value === undefined || value === null
            },
            {
                message: "Price is required",
            }
        ),
    updatedDate: z.number(),
})
