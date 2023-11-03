'use client'

import { Location } from '@/types/event'
import { AutocompleteType, PlaceType } from '@/types/google-maps-api'
import { useState } from 'react'

const useOnPlaceChanged = (): {
   location: Location
   onLoad: (authC: AutocompleteType) => void
   onPlaceChanged: () => void
} => {
   const [autocomplete, setAutocomplete] = useState<AutocompleteType>()
   const [location, setLocation] = useState<Location>({
      address: {
         street: '',
         postalCode: '',
         province: '',
         country: '',
      },
      coordinates: {
         lat: 0,
         lng: 0,
      },
      url: '',
   })
   const onLoad = (autoC: AutocompleteType) => setAutocomplete(autoC)
   const onPlaceChanged = () => {
      if (autocomplete) {
         const place: PlaceType = autocomplete.getPlace()
         if (!place.geometry || !place.geometry.location) {
            window.alert('No Details available for input')
         } else {
            const lat: number = place.geometry.location.lat()
            const lng: number = place.geometry.location.lng()
            setLocation({
               ...location,
               coordinates: { lat: lat, lng: lng },
            })
         }
         if (!place.formatted_address) {
            window.alert('No Address available for input')
         } else {
            const fullAddress = place.formatted_address.split(', ')
            const street = fullAddress[0]
            const [postalCode, province] = fullAddress[1].split(' ')
            const country = fullAddress[2]
            setLocation({
               ...location,
               address: {
                  street: street,
                  postalCode: postalCode,
                  province: province,
                  country: country,
               },
               url: place.url,
            })
         }
      }
   }
   return { location, onLoad, onPlaceChanged }
}
export default useOnPlaceChanged
