import { Comments } from "@/types/event"
import { ID } from "../myApp/viper"
import { requestCommentEvent, requestCreateEvent } from "../request/requestObjects"
import { CustomerShopify, NewCustomer, ProductMedia, PublishProduct } from "./responseTypes"

export const responseProductMedia: ProductMedia = {
    media: { mediaContentType: "IMAGE", status: "UPLOADED" },
    product: {
        title: requestCreateEvent.title,
    },
}

export const responsePublishProduct: PublishProduct = {
    publishable: {
        publishedOnCurrentPublication: true,
    },
    shop: {
        url: `https://vipers-go.myshopify.com`,
        // url: `https://${process.env.SHOPIFY_HOST}`,
    },
    userErrors: [],
}

export const responseNewCustomer: NewCustomer = {
    customer: {
        id: "",
    },
    userErrors: [],
}

export const responseCustomerShopify: CustomerShopify = {
    shopify: {
        customerId: "",
        customerAccessToken: "",
    },
}

export const responseCheckoutId: ID = {
    checkoutId: "",
}

export const responseCheckoutWebUrl: ID = {
    webUrl: "",
}

export const responseCommentEvent: Comments = {
    _id: "",
    viperId: "",
    text: requestCommentEvent.comment,
    likes: [],
    replies: [],
    timestamp: 0,
}
