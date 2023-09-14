"use client"
import { redirect, useRouter } from "next/navigation"
import React, { FormEvent, useState, useTransition } from "react"
import DisplayImage from "./DisplayImage"
import useUpdateProfile from "../_hooks/useUpdateProfile"
import useDisplayImage from "../_hooks/useDisplayImage"
import { UploadViperImage, Viper } from "@/types/viper"
import { ModifyResult } from "mongodb"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import useAppendFormData from "../_hooks/useAppendFormData"

const UpdateProfileForm = () => {
    const { data: session, status: sessionStatus, update: updateSession } = useSession()
    if (!session || !session.user) {
        redirect(`/api/auth/signin`)
    }
    const viper: Session["user"] = session.user

    const { updateViperForm, handleUpdateViperForm } = useUpdateProfile(viper)
    const {
        displayImage,
        createObjectURL,
        displaySelectedImage,
        handleDisplayUploadImage,
        handleAcceptImage,
    } = useDisplayImage()

    const { formData, handleFormData } = useAppendFormData()

    const router = useRouter()

    const [isPending, startTransition] = useTransition()
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const isMutating = isFetching || isPending

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        setIsFetching(true)

        try {
            if (formData.has("image")) {
                const profileImageFormData = formData.get("image")
                const profileImageResponse = await fetch(`/api/viper/profile-image`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json; charset=utf-8",
                    },
                    body: profileImageFormData,
                })
                const profileImage: UploadViperImage = await profileImageResponse.json()

                // gotta figure out which is the best approach if ok or status as in backgroundImage
                if (profileImage.data !== null && profileImageResponse.ok) {
                    handleUpdateViperForm(`image`, profileImage.data.url)
                }
            }

            // ---------------------------------------------------------------
            if (formData.has("backgroundImage")) {
                const backgroundImageFormData = formData.get("backgroundImage")
                const backgroundImageResponse = await fetch(`/api/viper/background-image`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json; charset=utf-8",
                    },
                    body: backgroundImageFormData,
                })
                const backgroundImage: UploadViperImage = await backgroundImageResponse.json()
                if (!backgroundImageResponse.ok) {
                    // do something here
                    // backgroundImage.error ? what we do think?
                }

                if (backgroundImage.data !== null && backgroundImageResponse.status === 200) {
                    handleUpdateViperForm("backgroundImage", backgroundImage.data.url)
                }
            }
            // -----------------------------------------------
            const updateViperResponse = await fetch(`/api/viper/update`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(updateViperForm),
            })
            const updatedViper = await updateViperResponse.json()
            if (!updateViperResponse.ok) {
                // do something
                // setError? what eva
            }
            // ----------------------------------------------
            updateSession({
                name: updateViperForm.name,
                image: updateViperForm.image,
            })

            setIsFetching(false)

            startTransition(() => {
                router.refresh()
            })
            router.prefetch("/profile")
            router.push(`/profile`)
        } catch (error) {
            // let's handle the error in a some better way bro
            console.error(error)
        }
    }

    return (
        // <UploadViperImage>
        <div className="grid grid-cols-1 gap-6">
            <form onSubmit={handleSubmit} className="text-sm">
                <label className="block py-1">
                    <span className="text-gray-300">Full name</span>
                    <input
                        data-test="new-name"
                        type="text"
                        className="block p-1 w-full   rounded-lg border    sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900  dark:focus:border-yellow-500"
                        value={updateViperForm.name}
                        name="name"
                        onChange={handleUpdateViperForm}
                    />
                </label>
                <label className="block py-1">
                    <span className="text-gray-300">Add a biography</span>
                    <textarea
                        data-test="new-biography"
                        className="block p-1 w-full   rounded-lg border    sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                        value={updateViperForm.biography}
                        name="biography"
                        onChange={handleUpdateViperForm}
                        rows={2}
                    ></textarea>
                </label>
                <label className="block py-1">
                    <span className="text-gray-300">Where are you located?</span>
                    <select
                        data-test="new-location"
                        className="block p-1 w-full rounded-lg border   sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:bg-gray-900 dark:focus:border-yellow-500"
                        name="location"
                        onChange={handleUpdateViperForm}
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
                    <label className="block py-1">
                        <span className="text-gray-300">Profile Image</span>
                        <input
                            data-test="new-profile-image"
                            className="block p-1 w-full hover:cursor-pointer  rounded-lg border    sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900  dark:focus:border-yellow-500"
                            type={"file"}
                            name="image"
                            onChange={handleDisplayUploadImage}
                        />
                    </label>

                    <label className="block py-1">
                        <span className="text-gray-300">Background Image</span>
                        <input
                            data-test="new-background-image"
                            className="block p-1 w-full hover:cursor-pointer  rounded-lg border    sm:text-xs outline-none   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-900  dark:focus:border-yellow-500"
                            type={"file"}
                            name="backgroundImage"
                            onChange={handleDisplayUploadImage}
                        ></input>
                    </label>
                </label>
                <div className="flex justify-center">
                    <button
                        data-test="submit-button"
                        className={`${
                            isMutating ? "bg-opacity-60 animate-pulse" : "bg-opacity-100"
                        } relative w-fit items-center space-x-3 rounded-lg bg-gray-700 my-3 py-2 px-5 text-sm font-medium text-gray-200 hover:text-white hover:bg-yellow-600/80 disabled:text-white/70`}
                        disabled={isPending}
                        type={"submit"}
                    >
                        {isMutating ? "Editing..." : "Edit"}
                        {isPending ? (
                            <div className="absolute right-2 top-1.5" role="status">
                                <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : null}
                    </button>
                </div>
            </form>
            <DisplayImage
                displayImage={displayImage}
                createObjectURL={createObjectURL}
                displaySelectedImage={displaySelectedImage}
                handleAcceptImage={handleAcceptImage}
            />
        </div>
    )
}

export default UpdateProfileForm
