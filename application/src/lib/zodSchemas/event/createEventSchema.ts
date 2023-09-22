import { z } from "zod"

const organizerSchema = z.object({
    _id: z.string().nonempty(),
    name: z.string().nonempty(),
    email: z.string().email().nonempty(),
})

const addressSchema = z.object({
    street: z.string().nonempty("Street is required"),
    postalCode: z.string().nonempty("Postal code is required"),
    province: z.string().nonempty("Province is required"),
    country: z.string().nonempty("Country is required"),
})
const coordinatesSchema = z.object({
    lat: z
        .number()
        .min(0, "Latitude must be greater or equal to 0")
        .refine(
            (value) => {
                value === undefined || value === null
            },
            {
                message: "Latitude is required",
            }
        ),
    lng: z
        .number()
        .min(0, "Longitude must be greater or equal to 0")
        .refine(
            (value) => {
                value === undefined || value === null
            },
            {
                message: "Longitude is required",
            }
        ),
})
// Thing in here is that this will work in the endpoint I guess since we are splitting the location from google api
// and using a custom hook to retrieve the location
const locationSchema = z.object({
    address: addressSchema,
    coordinates: coordinatesSchema,
    url: z.string().nonempty("Url must be provided"),
})

const productSchema = z.object({
    _id: z.string().nonempty("Product _id must be provided"),
    variant_id: z.string().nonempty("Product variant _id must be provided"),
})
const isValidTimeFormat = (value: string): boolean => {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)
}
export const createEventSchema = z.object({
    organizer: organizerSchema,
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
    time: z
        .string()
        .nonempty("Time is required")
        .refine(
            (value) => {
                return isValidTimeFormat(value)
            },
            {
                message: "Invalid time format HH:mm",
            }
        ),
    location: locationSchema,
    category: z.string().nonempty("Category is required"),
    image: z.string().nonempty("Image url must be provided"),
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
    entries: z
        .number()
        .min(0, "Entries must be greater or equal to 0")
        .refine(
            (value) => {
                value === undefined || value === null
            },
            {
                message: "Entries is required",
            }
        ),
    product: productSchema,
})
