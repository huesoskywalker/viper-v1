'use client'

import { ChangeEvent, useState } from 'react'
import useAppendFormData from './useAppendFormData'
import { DisplayImageHook } from '@/types/profile-hooks'

const useDisplayImage = (): DisplayImageHook => {
   const [displayImage, setDisplayImage] = useState<boolean>(false)
   const [createObjectURL, setCreateObjectURL] = useState<string>('')
   const [displaySelectedImage, setDisplaySelectedImage] = useState<string>(
      'image' || 'backgroundImage' || 'eventImage',
   )

   const { formData, handleFormData } = useAppendFormData()

   const handleDisplayUploadImage = (event: ChangeEvent<HTMLInputElement>): void => {
      if (event.target.files && event.target.files[0]) {
         const imageFile = event.target.files[0]
         handleFormData(event.target.name, imageFile)
         setDisplaySelectedImage(event.target.name)
         setCreateObjectURL(URL.createObjectURL(imageFile))
         setDisplayImage(!displayImage)
      }
   }
   const handleAcceptImage = (): void => {
      setDisplayImage(!displayImage)
      setCreateObjectURL('')
      setDisplaySelectedImage('')
   }
   return {
      displayImage,
      createObjectURL,
      displaySelectedImage,
      handleDisplayUploadImage,
      handleAcceptImage,
   }
}

export default useDisplayImage
