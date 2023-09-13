"use client"

import { useState, useTransition, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Organizer } from "@/types/event"
import { Autocomplete, LoadScript } from "@react-google-maps/api"
import {
    type LatLngLiteral,
    type AutocompleteType,
    type FormattedAddress,
    type FormattedAddressURL,
    type PlaceType,
} from "@/types/google-maps-api"

export default function CreateEvent(): JSX.Element {
    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    // const [location, setLocation] = useState<string>("")
    const [date, setDate] = useState<string>("")
    const [time, setTime] = useState<string>("")
    const [category, setCategory] = useState<string>("")
    const [image, setImage] = useState<string>("")
    const [createObjectURL, setCreateObjectURL] = useState<string>("")
    const [price, setPrice] = useState<string>("")
    const [entries, setEntries] = useState<string>("")

    const [isPending, startTransition] = useTransition()
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const isMutating = isFetching || isPending

    //============================== GOOGLE MAP
    const [street, setStreet] = useState<string>()
    const [postalCode, setPostalCode] = useState<string>()
    const [province, setProvince] = useState<string>()
    const [country, setCountry] = useState<string>()
    const [addressCoords, setAddressCoords] = useState<LatLngLiteral>()
    const [addressURL, setAddressURL] = useState<FormattedAddressURL>()
    const [autocomplete, setAutocomplete] = useState<AutocompleteType>()

    const router = useRouter()

    const { data: session } = useSession()
    const viper = session?.user
    if (!viper) throw new Error("No viper bro")

    const organizer: Organizer = {
        _id: viper._id,
        name: viper.name,
        email: viper.email,
    }
    // ======================================================================
    // BEFORE DELETING, Please check that it works

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        setIsFetching(true)
        // At some point integrate the image in the other api
        // figure out a way to resolve the promise and get the url
        try {
            const file = new FormData()
            file.append("file", image)

            const uploadImage = await fetch(`/api/event/create/upload-image`, {
                method: "POST",
                body: file,
            })

            const {
                data,
                error,
            }: {
                data: {
                    url: string | string[]
                    filename: string | null
                    type: string | null
                    size: string
                    // file: File
                } | null
                error: string | null
            } = await uploadImage.json()

            const imageUrl: string | string[] | undefined = data?.url

            // ----------------------------------------------------------------------------------
            const stageUploadCreate = await fetch(`/api/product/stage-upload`, {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    data: data,
                }),
            })

            const {
                stageUpload,
            }: {
                stageUpload: {
                    parameters: object[]
                    url: string
                    resourceUrl: string
                }
            } = await stageUploadCreate.json()
            const url = stageUpload.url
            const resourceUrl = stageUpload.resourceUrl
            const parameters = stageUpload.parameters

            parameters.forEach(({ name, value }: any) => {
                file.append(name, value)
            })
            //---------------------------------------------------------------------------------
            //IMAGE must be resized. height: 150px, width: 100px works fine for both.
            const stageUploadUrl = await fetch(url, {
                headers: {
                    "Content-Length": data!.size + 5000,
                },
                method: "POST",
                body: file,
            })
            // Don't await here for a response
            // ------------------------------------------------------------------------------
            const createProduct = await fetch(`/api/product/create-shopify`, {
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                method: "POST",

                body: JSON.stringify({
                    organizer: organizer._id,
                    resourceUrl: resourceUrl,
                    title: title,
                    description: content,
                    // location: location,
                    // address: address,
                    // category: category,
                    price: price,
                    entries: entries,
                }),
            })

            const { product }: { product: { _id: string; variant_id: string } } =
                await createProduct.json()
            const productId: string = product._id
            const variantId: string = product.variant_id
            const newProduct = {
                _id: productId,
                variant_id: variantId,
            }
            // ------------------------------------------------------------------------------
            const productCreateMedia = await fetch(`/api/product/create-media`, {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    product: newProduct,
                    // productId: productId,
                    resourceUrl: resourceUrl,
                }),
            })
            await productCreateMedia.json()
            // --------------------------------------------------------------------------
            const publishProduct = await fetch(`/api/product/publish-shopify`, {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    product: newProduct,
                    // productId: productId,
                }),
            })
            const freshProductInStore = await publishProduct.json()
            // ---------------------------------------------------------------------------------------------

            const createEvent = await fetch(`/api/event/create/submit`, {
                method: "POST",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    organizer: organizer,
                    title: title,
                    content: content,
                    location: {
                        address: {
                            street: street,
                            postalCode: postalCode,
                            province: province,
                            country: country,
                        },
                        coordinates: addressCoords,
                        url: addressURL,
                    },
                    // address: address,
                    date: `${date}T${time}.000Z`,
                    category: category,
                    price: Number(price),
                    entries: Number(entries),
                    image: imageUrl,
                    product: newProduct,
                }),
            })

            const freshEvent = await createEvent.json()
            console.log(`-------freshEvent--CreateEvent-------`)
            console.log(freshEvent)

            setIsFetching(false)

            startTransition(() => {
                setTitle("")
                setContent("")
                setDate("")
                setTime("")
                setCategory("")
                setImage("")
                setCreateObjectURL("")
                setPrice("")
                setEntries("")

                router.refresh()
            })
        } catch (error) {
            console.error(error)
        }
    }

    const uploadToClient = (event: any): void => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0]

            setImage(i)
            setCreateObjectURL(URL.createObjectURL(i))
        }
    }

    const onLoad = (autoC: any) => setAutocomplete(autoC)
    const onPlaceChanged = () => {
        if (autocomplete) {
            const place: PlaceType = autocomplete.getPlace()
            if (!place.geometry || !place.geometry.location) {
                window.alert("No Details available for input")
            } else {
                const lat: number = place.geometry.location.lat()
                const lng: number = place.geometry.location.lng()
                setAddressCoords({ lat: lat, lng: lng })
            }
            if (!place.formatted_address) {
                window.alert("No Address available for input")
            } else {
                const fullAddress = place.formatted_address.split(", ")
                setStreet(fullAddress[0])
                const [postalCodeAddress, provinceAddress] = fullAddress[1].split(" ")
                setPostalCode(postalCodeAddress)
                setProvince(provinceAddress)
                setCountry(fullAddress[2])
                setAddressURL(place.url)
            }
        }
    }

    // ===========================================================
    return (
        <div className="py-2 flex justify-center">
            <div className="w-4/5">
                <div className="grid grid-cols-1 gap-6">
                    <form onSubmit={(e) => handleSubmit(e)} className="text-sm">
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">Event name</span>
                            <input
                                data-test="title"
                                type="text"
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">Additional details</span>
                            <textarea
                                data-test="content"
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={3}
                                required
                            ></textarea>
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">What type of event is it?</span>
                            <select
                                data-test="category"
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value={"All"}>Select an Option</option>
                                <option value={"Bars"}>Bars</option>
                                <option value={"Clubs"}>Clubs</option>
                                <option value={"Music"}>Music</option>
                                <option value={"Sports"}>Sports</option>
                                <option value={"Art"}>Art</option>
                            </select>
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">When is your event?</span>
                            <input
                                data-test="date"
                                type="date"
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">At what time?</span>
                            <input
                                data-test="time"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                required
                            />
                        </label>
                        <LoadScript
                            googleMapsApiKey={`${process.env.GOOGLE_MAPS_API_KEY}`}
                            libraries={["places"]}
                        >
                            <label className="block py-1">
                                <span className="text-gray-300 ml-1">Address</span>
                                <Autocomplete
                                    onLoad={onLoad}
                                    onPlaceChanged={onPlaceChanged}
                                    restrictions={{ country: "ar" }}
                                >
                                    <input
                                        data-test="address"
                                        type="text"
                                        // value={address}
                                        // onChange={(e) => setAddress(e.target.value)}
                                        className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                        required
                                    />
                                </Autocomplete>
                            </label>
                        </LoadScript>
                        {/*  */}
                        <div>
                            {createObjectURL !== "" ? (
                                <Image
                                    src={createObjectURL}
                                    alt={createObjectURL}
                                    height={400}
                                    width={400}
                                    loading="lazy"
                                    className="hidden rounded-lg  lg:block max-h-36 max-w-auto object-cover object-center"
                                />
                            ) : null}
                        </div>
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">Select an image</span>
                            <input
                                data-test="image"
                                type="file"
                                name="myImage"
                                onChange={uploadToClient}
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                            />
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300 ml-1">Price</span>
                            <input
                                data-test="price"
                                type="number"
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </label>
                        {price && price !== "0" ? (
                            <label className="block py-1">
                                <span className="text-gray-300 ml-1">Entries</span>
                                <input
                                    data-test="entries"
                                    type="number"
                                    className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                    value={entries}
                                    onChange={(e) => setEntries(e.target.value)}
                                />
                            </label>
                        ) : null}

                        <div className={`flex justify-center`}>
                            <button
                                data-test="create-event"
                                className={`${
                                    isMutating ? "bg-opacity-60 animate-pulse" : "bg-opacity-100"
                                } relative w-full items-center space-x-2 rounded-lg bg-gray-700 my-3 mx-32 py-2 text-sm font-medium text-gray-100 hover:bg-yellow-600/80 hover:text-white disabled:text-white/70`}
                                disabled={isPending}
                                // onClick={handleSubmit}
                                type={"submit"}
                            >
                                {isMutating ? "Creating..." : "Create Event"}
                                {isPending ? (
                                    <div className="absolute right-2 top-1.5" role="status">
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
    )
}
