import { Address } from "@/types/viper"

export type ProductMedia = {
    media: { mediaContentType: string; status: string }
    product: {
        title: string
    }
}

export type PublishProduct = {
    publishable: {
        publishedOnCurrentPublication: boolean
    }
    shop: {
        url: string
    }
    userErrors: Array<object>
}

export type NewEventId = {
    insertedId: string
    acknowledged: boolean
}

export type NewCustomer = {
    customer: {
        id: string
    }
    userErrors: []
}

export type CustomerAddress = {
    customerAddressCreate: {
        customerAccessToken: string
        address: Address
    }
    customerUserErrors: {
        code: number
        field: []
        message: string
    }
    customerAddress: {
        id: string
    }
}

export type checkoutCreate = {
    checkoutUserErrors: {
        code: number
        field: []
        message: string
    }
    checkout: {
        id: string
        webUrl: string
        orderStatusUrl: string
        lineItems: []
    }
}

export type checkoutCustomerAssociate = {
    associateCheckout: {
        id: string
        webUrl: string
        orderStatusUrl: string
    }
    associateUserErrors: {
        code: number
        field: []
        message: string
    }
    customer: {
        id: string
        orders: []
    }
}

export type CustomerShopify = {
    shopify: {
        customerId: string
        customerAccessToken: string
    }
}
