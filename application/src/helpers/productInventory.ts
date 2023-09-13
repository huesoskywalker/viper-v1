import { storefrontClient } from "@/utils/storefrontApi"
import PRODUCT_INVENTORY_GET from "@/graphql/query/productInventory"
import { InventoryItem } from "@shopify/shopify-api/rest/admin/2023-01/inventory_item"
import { RequestReturn } from "@shopify/shopify-api"

export const getProductInventoryCount = async (productId: string): Promise<InventoryItem> => {
    const PRODUCT_INPUT = {
        id: productId,
    }

    const productInventory: RequestReturn<InventoryItem> = await storefrontClient.query({
        data: {
            query: PRODUCT_INVENTORY_GET,
            variables: PRODUCT_INPUT,
        },
    })

    return productInventory.body.data.product.totalInventory
}
