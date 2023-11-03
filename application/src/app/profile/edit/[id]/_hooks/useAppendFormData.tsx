'use client'

import { UploadImageHook } from '@/types/profile-hooks'
import { useState } from 'react'

const useAppendFormData = (): UploadImageHook => {
   const [formData, setFormData] = useState<FormData>(new FormData())
   const handleFormData = (key: string, file: File) => {
      formData.append(key, file)
   }
   return { formData, handleFormData }
}

export default useAppendFormData
