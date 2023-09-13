import { EventUploadImage, Organizer } from "@/types/event"

import { Autocomplete, LoadScript } from "@react-google-maps/api"
import React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { CreateEventInputs } from "@/types/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createEventSchema } from "@/lib/zodSchemas/event/createEventSchema"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { Session } from "next-auth"
import DisplayImage from "@/app/profile/edit/[id]/_components/DisplayImage"
import useDisplayImage from "@/app/profile/edit/[id]/_hooks/useDisplayImage"
import useOnPlaceChanged from "../_hooks/useOnPlaceChanged"
import useAppendFormData from "@/app/profile/edit/[id]/_hooks/useAppendFormData"

const CreateEventForm = () => {
    const { data: session } = useSession()
    const viper: Session["user"] | undefined = session?.user
    if (!viper) throw new Error("No viper bro")

    const organizer: Organizer = {
        _id: viper._id,
        name: viper.name,
        email: viper.email,
    }
    const { formData, handleFormData } = useAppendFormData()
    const {
        displayImage,
        createObjectURL,
        displaySelectedImage,
        handleDisplayUploadImage,
        handleAcceptImage,
    } = useDisplayImage()

    const { location, onLoad, onPlaceChanged } = useOnPlaceChanged()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        setValue,
        getValues,
        reset,
    } = useForm<CreateEventInputs>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            organizer: organizer,
        },
    })

    const processForm: SubmitHandler<CreateEventInputs> = async (eventData: CreateEventInputs) => {
        try {
            if (formData.has("eventImage")) {
                const eventImageFormData = formData.get("eventImage")
                const { data: uploadEventImage, status: eventImageStatus } =
                    await axios.post<EventUploadImage>(
                        `/api/event/create/upload-image`,
                        eventImageFormData
                    )
                const eventImageUrl: string | undefined = uploadEventImage.data?.url
                if (uploadEventImage.error) {
                }
                // we can modify the return value of this for a better lecture
                const { data: stageUploadCreate } = await axios.post<{
                    stageUpload: {
                        parameters: object[]
                        url: string
                        resourceUrl: string
                    }
                }>(`/api/product/stage-upload`, {
                    data: uploadEventImage.data,
                })
                const url: string = stageUploadCreate.stageUpload.url
                const resourceUrl: string = stageUploadCreate.stageUpload.resourceUrl
                const parameters: object[] = stageUploadCreate.stageUpload.parameters
                parameters.forEach(({ name, value }: any) => {
                    handleFormData(name, value)
                })
                // -----------------------------------
                const stageUploadUrl = await axios.post(url, formData)
                // -----------------------------------
                const { data: createProduct } = await axios.post<{
                    product: {
                        _id: string
                        variant_id: string
                    }
                }>(`/api/product/create-shopify`, {
                    organizer: organizer._id,
                    resourceUrl: resourceUrl,
                    title: getValues("title"),
                    description: getValues("content"),
                    price: getValues("price"),
                    entries: getValues("entries"),
                })
                const newProduct = {
                    _id: createProduct.product._id,
                    variant_id: createProduct.product.variant_id,
                }
                // --------------------------------------------
                const { data: productCreateMedia } = await axios.post(
                    `/api/product/create-media`,
                    {
                        product: newProduct,
                        resourceUrl: resourceUrl,
                    }
                )
                // -----------------------------------------------
                const { data: publishProduct } = await axios.post(`/api/product/publish-shopify`, {
                    product: newProduct,
                })
                // -----------------------------------------------
                setValue("image", eventImageUrl)
                setValue("location", location)
                // Check if everything is fine before making the changes
                // we might be missing the product id
                const { data: newEvent } = await axios.post(`/api/event/create/submit`, eventData)
            }
            // Also let's build a try catch block for each axios
            reset()
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
            }
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit(processForm)} className="text-sm">
                <label className="block py-1">
                    <span className="text-gray-300 ml-1">Event name</span>
                    <input
                        data-test="title"
                        type="text"
                        className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                        {...register("title")}
                    />
                </label>
                <label className="block py-1">
                    <span className="text-gray-300 ml-1">Additional details</span>
                    <textarea
                        data-test="content"
                        className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                        rows={3}
                        {...register("content")}
                    ></textarea>
                </label>
                <label className="block py-1">
                    <span className="text-gray-300 ml-1">What type of event is it?</span>
                    <select
                        data-test="category"
                        className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                        {...register("category")}
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
                        {...register("date")}
                    />
                </label>
                <label className="block py-1">
                    <span className="text-gray-300 ml-1">At what time?</span>
                    <input
                        data-test="time"
                        type="time"
                        className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                        {...register("time")}
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
                                className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                                required
                            />
                        </Autocomplete>
                    </label>
                </LoadScript>
                <div>
                    {/* Check if this DisplayImage does work */}
                    <DisplayImage
                        displayImage={displayImage}
                        createObjectURL={createObjectURL}
                        displaySelectedImage={displaySelectedImage}
                        handleAcceptImage={handleAcceptImage}
                    />
                    {/* {createObjectURL !== "" ? (
                        <Image
                            src={createObjectURL}
                            alt={createObjectURL}
                            height={400}
                            width={400}
                            loading="lazy"
                            className="hidden rounded-lg  lg:block max-h-36 max-w-auto object-cover object-center"
                        />
                    ) : null} */}
                </div>
                <label className="block py-1">
                    <span className="text-gray-300 ml-1">Select an image</span>
                    <input
                        data-test="image"
                        type="file"
                        // this name needed for stageUploadUrl shopify
                        name="file"
                        onChange={handleDisplayUploadImage}
                        className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                    />
                </label>
                <label className="block py-1">
                    <span className="text-gray-300 ml-1">Price</span>
                    <input
                        data-test="price"
                        type="number"
                        className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                        {...register("price")}
                    />
                </label>
                <label className="block py-1">
                    <span className="text-gray-300 ml-1">Entries</span>
                    <input
                        data-test="entries"
                        type="number"
                        className="block  p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs outline-none focus:ring-blue-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:yellow-blue-500"
                        {...register("entries")}
                    />
                </label>

                <div className={`flex justify-center`}>
                    <button
                        data-test="create-event"
                        className={`${
                            isSubmitting ? "bg-opacity-60 animate-pulse" : "bg-opacity-100"
                        } relative w-full items-center space-x-2 rounded-lg bg-gray-700 my-3 mx-32 py-2 text-sm font-medium text-gray-100 hover:bg-yellow-600/80 hover:text-white disabled:text-white/70`}
                        disabled={isSubmitting}
                        type={"submit"}
                    >
                        {isSubmitting ? "Creating..." : "Create Event"}
                        {isSubmitting ? (
                            <div className="absolute right-2 top-1.5" role="status">
                                <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : null}
                    </button>
                </div>
            </form>
        </>
    )
}

export default CreateEventForm
