import { Comments, EventInterface, Organizer, Product, Reply } from "@/types/event"
import { ID } from "./viper"
export type ProductInventory = {
    totalInventory: JQuery<number> | undefined
}

export const organizer: Organizer = {
    _id: "",
    name: "",
    email: "",
}

export const comment: Comments = {
    _id: "",
    viperId: "",
    text: "",
    likes: [],
    replies: [],
    timestamp: 0,
}

export const rawEventId: ID = {
    _id: "",
}

export const rawProduct: Product = {
    _id: "",
    variant_id: "",
}

export const rawEvent: EventInterface = {
    _id: "",
    organizer: organizer,
    title: "",
    content: "",
    location: "",
    address: "",
    date: "",
    category: "",
    creationDate: 0,
    image: "",
    price: 0,
    entries: 0,
    participants: [],
    editionDate: 0,
    likes: [],
    comments: [],
    product: {
        _id: "",
        variant_id: "",
    },
}

export const productInventory: ProductInventory = {
    totalInventory: undefined,
}
