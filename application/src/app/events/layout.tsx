import { Category, fetchCategories } from "./_lib/getCategories"
import { PageProps } from "../../lib/utils"
import { TabGroup } from "../_components/TabGroup"
import { preloadEventsByCategory } from "../../lib/events"

export default async function Layout({ children }: PageProps) {
    const categories: Category[] = await fetchCategories()
    categories.map((x: Category) => {
        preloadEventsByCategory(x.slug)
    })
    return (
        <div className="space-y-9">
            <div className="flex justify-between">
                <TabGroup
                    path="/events"
                    items={[
                        {
                            text: "Home",
                        },
                        ...categories.map((x: Category) => ({
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
