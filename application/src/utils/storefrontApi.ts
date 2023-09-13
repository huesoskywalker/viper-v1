import { ApiVersion } from "@shopify/shopify-api"
import { shopifyAdmin } from "./adminApi"

const shop = process.env.SHOPIFY_HOST!
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!

export const storefrontClient = new shopifyAdmin.clients.Storefront({
    domain: shop,
    storefrontAccessToken,
    apiVersion: ApiVersion.January23,
})
