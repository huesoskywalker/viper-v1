'use client'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { ProfileMenu, getProfileMenu } from '../_lib/getProfileMenu'
import Link from 'next/link'
import { SyntheticEvent, useState } from 'react'

function samePageLinkNavigation(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
   if (
      event.defaultPrevented ||
      event.button !== 0 || // ignore everything but left-click
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
   ) {
      return false
   }
   return true
}

export const ProfileNavTabs = () => {
   const [value, setValue] = useState(0)
   const profileCategories: ProfileMenu[] = getProfileMenu()

   //    Once we migrate to a dynamic route we should
   // replace usePathname for useParams() and get the username

   const handleChange = (event: SyntheticEvent, newValue: number) => {
      if (
         event.type !== 'click' ||
         (event.type === 'click' &&
            samePageLinkNavigation(event as React.MouseEvent<HTMLAnchorElement, MouseEvent>))
      ) {
         setValue(newValue)
      }
   }

   return (
      <Box>
         <Tabs value={value} onChange={handleChange} aria-label="blog nav tabs">
            {profileCategories.map((category) => {
               return (
                  <Tab
                     key={category.name}
                     LinkComponent={Link}
                     label={category.name}
                     //  with useParams this will be built better
                     href={'profile' + '/' + category.slug}
                  />
               )
            })}
         </Tabs>
      </Box>
   )
}
