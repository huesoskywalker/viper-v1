"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UpdateEventInputs } from "@/types/zod"
import { updateEventSchema } from "@/lib/zodSchemas/event/updateEventSchema"

export function UpdateEventForm({
    eventId,
    eventOrganizerId,
    eventTitle,
    eventContent,
    eventDate,
    eventCategory,
    eventImage,
    eventPrice,
}: {
    eventId: string
    eventOrganizerId: string
    eventTitle: string
    eventContent: string
    eventDate: string
    eventCategory: string
    eventImage: string
    eventPrice: number
}) {
    const [pendingEdit, setPendingEdit] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        setError,
    } = useForm<UpdateEventInputs>({
        resolver: zodResolver(updateEventSchema),
        defaultValues: {
            _id: eventId,
            title: eventTitle,
            content: eventContent,
            date: new Date(eventDate),
            category: eventCategory,
            price: eventPrice,
        },
    })

    const processForm: SubmitHandler<UpdateEventInputs> = async (payload: UpdateEventInputs) => {
        setPendingEdit(!pendingEdit)
        try {
            setValue("updatedDate", Date.now())
            const updateEventResponse = await fetch(`/api/event/create/submit`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(payload),
            })
            const updatedEvent = await updateEventResponse.json()
            if (!updateEventResponse.ok) {
                // throw new Error will trigger the closest Error.ts Error Boundary
                alert("Updating event failed")
                return
            }
            if (updatedEvent.errors) {
                // Check the endpoint, add the type and continue
                const errors = updatedEvent.errors
                if (errors.title) {
                    setError("title", {
                        type: "server",
                        message: errors.title,
                    })
                } else if (errors.content) {
                    // and continue, check if content is the variable
                }
            }
            // same is data is successfully we should do something instead of instant router.push()
            reset()
            // We need to manage the errors in the endpoint and use the setError from react hook form in here
            // if (updatedEvent.errors) {
            // implement the return type to axios and also in the endpoint
            // probably with the app route will be easier to handle different methods
            // in the same endpoint and the return types
            // }

            router.prefetch(`/${eventId}`)
            router.push(`/${eventId}`)
        } catch (error) {
            console.error(error)
        }
    }

    // const [isFetching, setIsFetching] = useState<boolean>(false)

    // const isMutating = isFetching || isSubmitting

    const router = useRouter()

    const deleteEvent = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/event/create/submit`, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    eventId: eventId,
                    eventOrganizerId: eventOrganizerId,
                    image: eventImage,
                }),
            })

            await response.json()
            reset()
            router.prefetch("/dashboard/myevents")
            router.push("/dashboard/myevents")
        } catch (error) {
            console.error(error)
        }
    }

    // const showPreview = () => {
    //     setNewEventPreview(!newEventPreview)
    // }

    // const uploadToClient = (event: any) => {
    //     if (event.target.files && event.target.files[0]) {
    //         const i = event.target.files[0]

    //         setImage(i)
    //         setCreateObjectURL(URL.createObjectURL(i))
    //     }
    // }

    return (
        <div className="py-2 flex justify-center">
            <div className="w-4/5">
                <div className="grid grid-cols-1 gap-6">
                    <form onSubmit={handleSubmit(processForm)} className="text-sm">
                        <label className="block py-1">
                            <span className="text-gray-300">Event name</span>
                            <input
                                data-test="event-title"
                                type="text"
                                className="block p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                {...register("title")}
                            />
                            {errors.title ? (
                                <span className="text-red-500 text-xs">{`${errors.title.message}`}</span>
                            ) : null}
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">Additional details</span>
                            <textarea
                                data-test="event-content"
                                className="block p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                rows={3}
                                {...register("content")}
                            ></textarea>
                            {errors.content ? (
                                <span className="text-red-500 text-xs">{`${errors.content.message}`}</span>
                            ) : null}
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">What type of event is it?</span>
                            <select
                                data-test="event-category"
                                className="block p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                {...register("category")}
                            >
                                <option value={"All"}>Select an Option</option>
                                <option value={"bars"}>Bars</option>
                                <option value={"clubs"}>Clubs</option>
                                <option value={"music"}>Music</option>
                                <option value={"sports"}>Sport</option>
                                <option value={"art"}>Art</option>
                            </select>
                            {errors.category ? (
                                <span className="text-red-500 text-xs">{`${errors.category.message}`}</span>
                            ) : null}
                        </label>
                        <label className="block py-1">
                            <span className="text-gray-300">When is your event?</span>
                            <input
                                data-test="event-date"
                                type="date"
                                className="block p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                {...register("date")}
                            />
                            {errors.date ? (
                                <span className="text-red-500 text-xs">{`${errors.date.message}`}</span>
                            ) : null}
                        </label>
                        <label className="text-gray-300">
                            Price
                            <input
                                data-test="event-price"
                                type="number"
                                className="block p-1 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                pattern="^[1-9]\d*$"
                                {...register("price")}
                            />
                            {errors.price ? (
                                <span className="text-red-500 text-xs">{`${errors.price.message}`}</span>
                            ) : null}
                        </label>
                        <input
                            type="hidden"
                            style={{
                                width: "0",
                                height: "0",
                                padding: "0",
                                margin: "0",
                                border: "none",
                            }}
                            {...register("updatedDate")}
                        />
                        <div className="flex justify-center gap-6">
                            <button
                                data-test="edit-event-button"
                                className={`${
                                    isSubmitting ? "bg-opacity-60" : "bg-opacity-100"
                                } relative w-2/6 items-center space-x-2 rounded-lg bg-gray-700 my-3  py-2 text-sm font-medium text-gray-200 hover:bg-yellow-700 hover:text-white disabled:text-white/70`}
                                disabled={isSubmitting}
                                type={"submit"}
                            >
                                Submit Edition
                                {isSubmitting && pendingEdit ? (
                                    <div className="absolute right-2 top-1.5" role="status">
                                        <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                ) : null}
                            </button>
                            <button
                                data-test="delete-event-button"
                                className="relative w-2/6 items-center  space-x-2 rounded-lg bg-red-800 my-3  py-2 text-sm font-medium text-black hover:bg-red-600 hover:text-white disabled:text-white/70"
                                disabled={isSubmitting}
                                onClick={deleteEvent}
                                type={"button"}
                            >
                                Delete
                                {isSubmitting && !pendingEdit ? (
                                    <div className="absolute right-10 top-1.5" role="status">
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
