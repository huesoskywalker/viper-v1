import { TabGroup } from "@/app/_components/TabGroup"
import { fetchDashboardBySlug, type Dashboard } from "../_lib/getDashboard"
import { PageProps } from "@/lib/utils"

export default async function Layout({ children, params }: PageProps) {
    const category: Dashboard | undefined = await fetchDashboardBySlug(params.dashboardSlug)

    if (!category) throw new Error("No such category bro")

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <TabGroup
                    path={`/dashboard/${category.slug}`}
                    items={[
                        {
                            text: "My Events",
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
