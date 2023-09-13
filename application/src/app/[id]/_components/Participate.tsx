"use client"

import { useTransition, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Checkout } from "@shopify/shopify-api/rest/admin/2023-01/checkout"
import { Customer } from "@shopify/shopify-api/rest/admin/2023-01/customer"
import { Shopify, Viper } from "@/types/viper"
import { Event, Product } from "@/types/event"
import Loading from "../loading"
import axios from "axios"
import { ModifyResult } from "mongodb"
// import { FulfillmentOrder } from "@shopify/shopify-api/rest/admin/2023-01/fulfillment_order"

export function Participate({
    eventId,
    product,
    viperOnList,
    isViperParticipationRequest,
    isCheckoutPaid,
    eventEntries,
    totalInventory,
}: {
    eventId: string
    product: Product
    viperOnList: boolean
    isViperParticipationRequest: boolean
    isCheckoutPaid: any
    eventEntries: number
    totalInventory: number
}): JSX.Element {
    const [isCheckout, setIsCheckout] = useState<string>("")
    const [isPending, startTransition] = useTransition()
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const isMutating = isPending || isFetching

    const router = useRouter()

    const { data: session, status } = useSession()
    const viper = session?.user
    if (!viper) return <Loading />
    const viperShopify: Shopify | undefined = viper?.shopify
    const viperAccessToken: string | undefined = viper?.shopify.customerAccessToken

    // --------------------------------------------------------------------------------
    const addParticipant = async (): Promise<void> => {
        setIsFetching(true)
        // --------------------------------------------------------------------------
        const requestCheckout = await fetch(`/api/shopify/create-checkout`, {
            method: "POST",
            headers: {
                "content-type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                product: product,
                email: viper?.email,
            }),
        })
        const { checkout, checkoutUserErrors }: { checkout: Checkout; checkoutUserErrors: [] } =
            await requestCheckout.json()
        const checkoutId: string = checkout.id

        // --------------------------------------------------------------------------
        const checkoutCustomerAssociate = await fetch(`/api/customer/associate-checkout`, {
            method: "POST",
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                checkoutId: checkoutId,
                shopify: viperShopify,
            }),
        })
        const {
            associateCheckout,
            associateUserErrors,
            customer,
        }: { associateCheckout: Checkout; associateUserErrors: []; customer: Customer } =
            await checkoutCustomerAssociate.json()
        const webUrl: string = associateCheckout.webUrl
        setIsCheckout(webUrl)

        // ------------------------------------------------------------------------------------------- //
        const { data: updatedViperParticipation } = await axios.put<ModifyResult<Viper>>(
            `/api/event/request-participation`,
            {
                viper: { _id: viper._id },
                event: { _id: eventId },
                checkoutId,
            }
        )

        setIsFetching(false)

        startTransition(() => {
            router.refresh()
        })
    }
    // --------------------------------------------------------------------------------

    const claimCard = async (): Promise<void> => {
        setIsFetching(true)
        const { data: claimEventCard } = await axios.put<ModifyResult<Event>>(
            `/api/event/claim-card`,
            {
                event: { _id: eventId },
                viper: { _id: viper._id },
            }
        )

        setIsFetching(false)
        startTransition(() => {
            router.refresh()
        })
    }

    return (
        <div className="space-y-2">
            <div
                data-test="inventory-of-entries"
                className="flex justify-start items-center xl:text-[18px] lg:text-sm text-gray-300"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="xl:w-4 xl:h-4 xl:mr-2 lg:w-3 lg:h-3 lg:mr-1 text-yellow-500"
                >
                    <path
                        fillRule="evenodd"
                        d="M13 3v1.27a.75.75 0 001.5 0V3h2.25A2.25 2.25 0 0119 5.25v2.628a.75.75 0 01-.5.707 1.5 1.5 0 000 2.83c.3.106.5.39.5.707v2.628A2.25 2.25 0 0116.75 17H14.5v-1.27a.75.75 0 00-1.5 0V17H3.25A2.25 2.25 0 011 14.75v-2.628c0-.318.2-.601.5-.707a1.5 1.5 0 000-2.83.75.75 0 01-.5-.707V5.25A2.25 2.25 0 013.25 3H13zm1.5 4.396a.75.75 0 00-1.5 0v1.042a.75.75 0 001.5 0V7.396zm0 4.167a.75.75 0 00-1.5 0v1.041a.75.75 0 001.5 0v-1.041zM6 10.75a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zm0 2.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z"
                        clipRule="evenodd"
                    />
                </svg>
                {totalInventory} of {eventEntries}
            </div>
            <div data-test="participate">
                {
                    totalInventory > 0 ? (
                        !viperOnList ? (
                            !viperAccessToken ? (
                                <Link
                                    data-test="participate-customer"
                                    href={`/${eventId}/customer`}
                                    className={` flex w-full justify-center  rounded-lg bg-gray-700  py-1  xl:text-sm lg:text-xs font-medium text-white hover:text-black hover:bg-yellow-600 disabled:text-white/70`}
                                >
                                    Participate
                                </Link>
                            ) : !isViperParticipationRequest ? (
                                <button
                                    data-test="participate-checkout"
                                    className={`${
                                        isMutating
                                            ? "bg-opacity-60 animate-pulse"
                                            : "bg-opacity-100"
                                    }  relative w-full items-center space-x-2 rounded-lg bg-gray-700 px-3 py-1  xl:text-sm lg:text-xs font-medium text-white hover:text-black hover:bg-yellow-600 disabled:text-white/70`}
                                    onClick={addParticipant}
                                    disabled={isPending}
                                >
                                    {isMutating ? "Preparing..." : "Participate"}
                                    {isPending ? (
                                        <div className="absolute right-2 top-1.5" role="status">
                                            <div
                                                className="
        h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent"
                                            />
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    ) : null}
                                </button>
                            ) : !isCheckoutPaid ? (
                                <a
                                    data-test="participate-payment"
                                    href={isCheckout}
                                    target="_blank"
                                    className="flex w-full justify-center space-x-2 rounded-lg animate-pulse px-3 py-1  xl:text-sm lg:text-xs font-medium  bg-black text-yellow-600 disabled:text-white/70"
                                >
                                    VIPER GO
                                </a>
                            ) : isCheckoutPaid !== "PAID" ? (
                                <button
                                    disabled={true}
                                    className="flex w-full justify-center space-x-2 rounded-lg  px-3 py-1  text-xs font-medium  bg-black text-gray-300 hover:animate-pulse disabled:text-white/70"
                                >
                                    PENDING
                                </button>
                            ) : (
                                <button
                                    data-test="participate-claim"
                                    onClick={claimCard}
                                    className="flex w-full justify-center space-x-2 rounded-lg  px-3 py-1  text-xs font-medium  bg-black text-green-600 hover:animate-pulse hover:cursor-grab disabled:text-white/70"
                                >
                                    {isMutating ? "Sending..." : "CLAIM CARD"}
                                    {isPending ? (
                                        <div className="absolute right-2 top-1.5" role="status">
                                            <div
                                                className="
        h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent"
                                            />
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    ) : null}
                                </button>
                            )
                        ) : (
                            <button
                                data-test="viper"
                                disabled={true}
                                className="flex w-full justify-center space-x-2 rounded-lg  px-3 py-1  xl:text-sm lg:text-xs font-medium  bg-black  hover:animate-pulse hover:cursor-grabbing disabled:text-green-600"
                            >
                                V<span className="text-yellow-400 hover:animate-none">i</span>
                                PER
                            </button>
                        )
                    ) : null
                    // <button
                    //     disabled={true}
                    //     className="flex w-full justify-center space-x-2 rounded-lg  px-3 py-1  xl:text-sm lg:text-xs font-medium  bg-black  hover:animate-pulse hover:cursor-grabbing disabled:text-yellow-400"
                    // >
                    //     full ViPERS
                    // </button>
                }
            </div>
        </div>
    )
}
