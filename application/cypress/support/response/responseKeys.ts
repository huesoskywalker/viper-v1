import { Comments } from "@/types/event"
import {
    CustomerShopify,
    NewCustomer,
    NewEventId,
    ProductMedia,
    PublishProduct,
    checkoutCreate,
    checkoutCustomerAssociate,
} from "./responseTypes"

export const responseProductMediaKeys: (keyof ProductMedia)[] = ["media", "product"]

export const responsePublishProductKeys: (keyof PublishProduct)[] = [
    "publishable",
    "shop",
    "userErrors",
]

export const responseNewEventKeys: (keyof NewEventId)[] = ["insertedId", "acknowledged"]

export const responseNewCustomerKeys: (keyof NewCustomer)[] = ["customer", "userErrors"]

export const responseCustomerShopifyKeys: (keyof CustomerShopify)[] = ["shopify"]

export const responseCustomerAddressKeys: string[] = ["addressUserErrors", "customerAddress"]

export const responseCheckoutCreateKeys: (keyof checkoutCreate)[] = [
    "checkoutUserErrors",
    "checkout",
]

export const responseCheckoutCustomerAssociateKeys: (keyof checkoutCustomerAssociate)[] = [
    "associateCheckout",
    "associateUserErrors",
    "customer",
]

export const responseCommentEventKeys: (keyof Comments)[] = [
    "_id",
    "viperId",
    "text",
    "likes",
    "replies",
    "timestamp",
]
export const responseStageUploadKeys = ["stageUpload"]
