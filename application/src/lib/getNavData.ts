export type Item = {
    name: string
    slug: string
    description?: string
}

export const data: Item[] = [
    {
        name: "Events",
        slug: "events",
        description: "Show case of the events",
    },
    {
        name: "Dashboard",
        slug: "dashboard",
        description: "Manage content",
    },
    {
        name: "Profile",
        slug: "profile",
        description: "Profile & Blog",
    },
]
