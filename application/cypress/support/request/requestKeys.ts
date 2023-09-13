import {
    Comment,
    CreateEvent,
    CustomerAddress,
    File,
    LikeBlog,
    ProductMedia,
    ProductShopify,
    ProfileEdit,
} from "./requestTypes"

export const requestEditProfileKeys: (keyof ProfileEdit)[] = [
    "name",
    "biography",
    "image",
    "backgroundImage",
    "location",
]

export const requestCreateEventKeys: (keyof CreateEvent)[] = [
    "title",
    "content",
    "category",
    "date",
    "location",
    "address",
    "price",
    "entries",
    "organizer",
    "image",
    "product",
]
export const requestEditEventKeys: string[] = [
    "category",
    "content",
    "date",
    "location",
    "price",
    "title",
]

export const requestCommentKeys: (keyof Comment)[] = ["comment"]

export const requestLikeBlogKeys: (keyof LikeBlog)[] = ["_id", "blogOwner_id", "viper_id"]

export const requestEventImageKeys: (keyof File)[] = ["data"]

export const requestProductMediaKeys: (keyof ProductMedia)[] = ["product", "resourceUrl"]

export const requestCustomerAddressKeys: (keyof CustomerAddress)[] = [
    "phone",
    "address",
    "city",
    "province",
    "zip",
    "country",
]

export const requestProductShopifyKeys: (keyof ProductShopify)[] = [
    "organizer",
    "resourceUrl",
    "title",
    "description",
    "location",
    "address",
    "category",
    "price",
    "entries",
]
