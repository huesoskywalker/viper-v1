import { cache } from 'react'

export type ProfileMenu = {
   name: string
   slug: string
}

export const getProfileMenu = (): ProfileMenu[] => [
   {
      name: 'Posts',
      slug: '#',
   },
   {
      name: 'Replies',
      slug: 'replies',
   },
   {
      name: 'Likes',
      slug: 'likes',
   },
]
// export const fetchProfileMenu = cache((): ProfileMenu[] => [])
