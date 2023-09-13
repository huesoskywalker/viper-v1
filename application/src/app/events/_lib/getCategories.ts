import { cache } from "react"

export type Category = {
    name: string
    slug: string
    items: Omit<Category, "items">[]
}

export const getCategories = cache((): Category[] => [
    {
        name: "Bars",
        slug: "Bars",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
        ],
    },

    {
        name: "Clubs",
        slug: "Clubs",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
        ],
    },
    {
        name: "Music",
        slug: "Music",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
        ],
    },
    {
        name: "Sports",
        slug: "Sports",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
        ],
    },
    {
        name: "Art",
        slug: "Art",
        items: [
            { name: "Most Liked", slug: "likes" },
            { name: "Closer to Date", slug: "date" },
        ],
    },
])

export async function fetchCategoryBySlug(slug: string | undefined) {
    // Assuming it always return expected categories
    return getCategories().find((category) => category.slug === slug)
}

export async function fetchCategories(): Promise<Category[]> {
    return getCategories()
}

async function findSubCategory(
    category: Category | undefined,
    subCategorySlug: string | undefined
) {
    return category?.items.find((category) => category.slug === subCategorySlug)
}

export async function fetchSubCategory(
    categorySlug: string | undefined,
    subCategorySlug: string | undefined
) {
    const category = await fetchCategoryBySlug(categorySlug)
    return findSubCategory(category, subCategorySlug)
}
