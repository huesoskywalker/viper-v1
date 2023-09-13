export type UpdateProfileHook = {
    updateViperForm: UpdateViperType
    handleUpdateViperForm: (event: UpdateProfileInput | string, value?: string) => void
}
export type UpdateProfileInput = ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>

export type DisplayImageHook = {
    displayImage: boolean
    createObjectURL: string
    displaySelectedImage: string
    handleDisplayUploadImage: (event: ChangeEvent<HTMLInputElement>) => void
    handleAcceptImage: () => void
}
export type UploadImageHook = {
    formData: FormData
    handleFormData: (key: string, file: File) => void
}
