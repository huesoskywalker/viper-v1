import { Organizer, Product } from "@/types/event"
import { ObjectId } from "mongodb"

export type ProfileEdit = {
    name: string
    biography: string
    image: string
    backgroundImage: string
    location: string
}

export type CreateEvent = {
    title: string
    content: string
    category: string
    date: string
    location: string
    address: string
    price: number | string
    entries: number | string
    organizer: Organizer
    image: JQuery<string> | string
    product: Product
}

export type EditEvent = {
    title: string
    content: string
    location: string
    price: number
}

export type Comment = {
    comment: string
}

export type LikeBlog = {
    _id: string | ObjectId
    blogOwner_id: string | undefined
    viper_id: string | ObjectId
}

export type File = {
    data: {
        url: string
        fileName: string
        fileSize: string
        fileType: string
    }
}

export type ProductMedia = {
    product: Product
    resourceUrl: string
}

export type CustomerAddress = {
    phone: string
    address: string
    city: string
    province: string
    zip: string
    country: string
}

export type ProductShopify = {
    organizer: string
    resourceUrl: string
    title: string
    description: string
    location: string
    address: string
    category: string
    price: number | string
    entries: number | string
}
