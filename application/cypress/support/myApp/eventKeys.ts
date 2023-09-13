import { EventInterface } from "@/types/event"
import { ProductInventory } from "./event"

export const eventKeys: (keyof EventInterface)[] = [
    "_id",
    "organizer",
    "title",
    "content",
    "location",
    "address",
    "date",
    "category",
    "creationDate",
    "image",
    "price",
    "entries",
    "participants",
    "editionDate",
    "likes",
    "comments",
    "product",
]

export const productInventoryKeys: (keyof ProductInventory)[] = ["totalInventory"]
