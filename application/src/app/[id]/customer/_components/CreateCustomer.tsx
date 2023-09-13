"use client"

import { FormEvent, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Customer } from "@shopify/shopify-api/rest/admin/2023-01/customer"
import { CustomerAddress } from "@shopify/shopify-api/rest/admin/2023-01/customer_address"
import { Shopify, Viper } from "@/types/viper"
import { useSession } from "next-auth/react"

export default function CreateCustomer({
    viperId,
    viperEmail,
    viperFirstName,
    viperLastName,
    viperLocation,
}: {
    viperId: string
    viperEmail: string
    viperFirstName: string
    viperLastName: string
    viperLocation: string
}) {
    const [email, setEmail] = useState<string>(viperEmail)
    const [password, setPassword] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    const [firstName, setFirstName] = useState<string>(viperFirstName)
    const [lastName, setLastName] = useState<string>(viperLastName)
    const [address, setAddress] = useState<string>("")
    const [city, setCity] = useState<string>("")
    const [province, setProvince] = useState<string>("")
    const [zip, setZip] = useState<string>("")
    const [country, setCountry] = useState<string>(viperLocation)

    const { data: session, status, update } = useSession()

    const [isPending, startTransition] = useTransition()
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const isMutating = isPending || isFetching

    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsFetching(true)
        try {
            const customerCreate = await fetch(`/api/customer/create-shopify`, {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    email,
                    password,
                    phone,
                    firstName,
                    lastName,
                }),
            })
            const { customer, userErrors }: { customer: Customer; userErrors: [] } =
                await customerCreate.json()
            const customerId: any = customer.id

            const customerAccessTokenCreate = await fetch(`/api/customer/create-access-token`, {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })

            const {
                customerAccessToken,
                accessTokenUserErrors,
            }: { customerAccessToken: any; accessTokenUserErrors: [] } =
                await customerAccessTokenCreate.json()
            const accessToken: string = customerAccessToken.accessToken
            // ---------------------------------------------------------------------------
            const shopify: Shopify = {
                customerAccessToken: accessToken,
                customerId: customerId,
            }
            update({ shopify: shopify })
            // ---------------------------------------------------------------------------------------
            const customerAddressCreate = await fetch(`/api/customer/create-address`, {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    lastName: lastName,
                    firstName: firstName,
                    address: {
                        phone: phone,
                        address: address,
                        province: province,
                        country: country,
                        zip: zip,
                        city: city,
                    },
                    shopify: shopify,
                }),
            })
            const {
                customerAddress,
                addressUserErrors,
            }: { customerAddress: CustomerAddress; addressUserErrors: [] } =
                await customerAddressCreate.json()
            // ---------------------------------------------------------------------------------------

            const postAccessTokenToUser = await fetch(`/api/customer/update-viper`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    _id: viperId,
                    shopify: shopify,
                    address: {
                        phone: phone,
                        address: address,
                        city: city,
                        province: province,
                        zip: zip,
                        country: country,
                    },
                }),
            })

            const updatedUser: Viper = await postAccessTokenToUser.json()
            // ---------------------------------------------------------------------------------------

            setIsFetching(false)

            startTransition(() => {
                setEmail("")
                setPassword("")
                setPhone("")
                setFirstName("")
                setLastName("")
                setAddress("")
                setCity("")
                setProvince("")
                setZip("")
                setCountry("")

                router.back()
            })
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center min-h-screen px-4 py-2 ">
                <div className="relative left-24 w-full max-w-lg p-3 mx-auto bg-gray-800 rounded-xl shadow-lg">
                    <div className="m-1 ">
                        <button
                            onClick={() => router.back()}
                            className="flex justify-start self-start w-fit text-gray-400 hover:text-red-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.7}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <span className="flex justify-center text-gray-100">Join the store</span>

                        <div className="flex justify-center">
                            <div className="w-full mx-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <form onSubmit={(e) => handleSubmit(e)} className="text-sm">
                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">
                                                First name
                                            </span>
                                            <input
                                                className="block p-1 w-full  hover:cursor-pointer  rounded-lg border  sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                type={"string"}
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            ></input>
                                        </label>

                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">
                                                Last name
                                            </span>
                                            <input
                                                className="block p-1 w-full  hover:cursor-pointer  rounded-lg border  sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                type={"string"}
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            ></input>
                                        </label>

                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">Email</span>
                                            <input
                                                type="email"
                                                className="block p-1 w-full hover:cursor-pointer rounded-lg border sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </label>

                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">
                                                Password
                                            </span>
                                            <input
                                                data-test="password"
                                                type="password"
                                                className="block p-1 w-full hover:cursor-pointer rounded-lg border sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </label>

                                        <label className="block py-1 ">
                                            <span className="text-gray-300 ml-[4px]">Phone</span>
                                            <input
                                                data-test="customer-phone"
                                                type="tel"
                                                className=" block p-1 w-full hover:cursor-pointer rounded-lg border sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500 "
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            ></input>
                                        </label>

                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">Address</span>
                                            <input
                                                data-test="customer-address"
                                                className=" block p-1 w-full  hover:cursor-pointer  rounded-lg border  sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                type={"text"}
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                            ></input>
                                        </label>

                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">City</span>
                                            <input
                                                data-test="customer-city"
                                                className="block p-1 w-full  hover:cursor-pointer  rounded-lg border  sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                type={"text"}
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                            ></input>
                                        </label>

                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">
                                                Province
                                            </span>
                                            <input
                                                data-test="customer-province"
                                                className="block p-1 w-full  hover:cursor-pointer  rounded-lg border  sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                type={"text"}
                                                value={province}
                                                onChange={(e) => setProvince(e.target.value)}
                                            ></input>
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">
                                                Zip Code
                                            </span>
                                            <input
                                                data-test="customer-zip-code"
                                                className="block p-1 w-full  hover:cursor-pointer  rounded-lg border sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                type={"text"}
                                                value={zip}
                                                onChange={(e) => setZip(e.target.value)}
                                            ></input>
                                        </label>
                                        <label className="block py-1">
                                            <span className="text-gray-300 ml-[4px]">Country</span>
                                            <select
                                                data-test="customer-country"
                                                className="block p-1 w-full  rounded-lg border  sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                required
                                            >
                                                <option value={"Nowhere"}>Select an Option</option>
                                                <option value={"Argentina"}>Argentina</option>
                                                <option value={"California"}>California</option>
                                                <option value={"Uruguay"}>Uruguay</option>
                                                <option value={"Spain"}>Spain</option>
                                                <option value={"Italy"}>Italy</option>
                                                <option value={"Greece"}>Greece</option>
                                                <option value={"New Zealand"}>New Zealand</option>
                                            </select>
                                        </label>
                                        <div className="flex justify-center">
                                            <button
                                                data-test="create-customer"
                                                className={`${
                                                    isMutating ? "opacity-70" : "opacity-100"
                                                } relative w-fit items-center space-x-3 rounded-lg bg-gray-700 my-3 py-2 px-5 text-sm font-medium text-white hover:bg-black hover:text-yellow-600 disabled:text-white/70`}
                                                disabled={isPending}
                                                // onClick={(e) => handleSubmit}
                                                type={"submit"}
                                            >
                                                {isMutating ? "Proceeding..." : "Create Customer"}
                                                {isPending ? (
                                                    <div
                                                        className="absolute right-2 top-1.5"
                                                        role="status"
                                                    >
                                                        <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                ) : null}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
