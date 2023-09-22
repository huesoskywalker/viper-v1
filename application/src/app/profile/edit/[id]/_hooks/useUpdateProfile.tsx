"use client"
import { UpdateProfileHook, UpdateProfileInput } from "@/types/profile-hooks"
import { UpdateViper, _ID } from "@/types/viper"
import { Session } from "next-auth"
import { useState } from "react"

const useUpdateProfile = (viper: Session["user"]): UpdateProfileHook => {
    // we should make another hook to handle the sessions and the update

    const [updateViperForm, setUpdateViperForm] = useState<UpdateViper>({
        _id: viper._id as _ID,
        name: viper.name,
        biography: "",
        location: viper.location,
        image: "",
        backgroundImage: "",
    })
    const handleUpdateViperForm = (event: UpdateProfileInput | string, value?: string): void => {
        if (typeof event === "string" && value) {
            setUpdateViperForm({
                ...updateViperForm,
                [event]: value,
            })
        } else if (typeof event === "object") {
            setUpdateViperForm({
                ...updateViperForm,
                [event.target.name]: event.target.value,
            })
        }
    }
    return { updateViperForm, handleUpdateViperForm }
}

export default useUpdateProfile
