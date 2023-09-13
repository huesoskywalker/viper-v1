import { TabGroup } from "@/app/_components/TabGroup"
import { PageProps } from "@/lib/utils"
import { fetchCategoryBySlug, type Category } from "../_lib/getCategories"

export default async function Layout({ children, params }: PageProps) {
    const category: Category | undefined = await fetchCategoryBySlug(params.category)
    if (!category) throw new Error("No such category bro")

    return (
        <div className="space-y-9">
            <div className="flex justify-between">
                <TabGroup
                    path={`/events/${category.slug}`}
                    items={[
                        {
                            text: "All",
                        },
                        ...category.items.map((x) => ({
                            text: x.name,
                            slug: x.slug,
                        })),
                    ]}
                />
            </div>
            <div>{children}</div>
        </div>
    )
}
