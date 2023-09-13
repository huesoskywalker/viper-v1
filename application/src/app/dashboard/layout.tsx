import { ReactNode } from "react"
import { Dashboard, fetchDashboard } from "./_lib/getDashboard"
import { DashGroup } from "./_components/DashGroup"

export default async function Layout({ children }: { children: ReactNode }) {
    const categories: Dashboard[] = await fetchDashboard()
    return (
        <>
            <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-2">
                <div className="border-r col-span-1  border-gray-800 z-10">
                    <DashGroup
                        path={`/dashboard`}
                        items={[
                            { text: "Board" },
                            ...categories.map((x) => ({ text: x.name, slug: x.slug })),
                        ]}
                    />
                </div>
                <div className=" md:col-span-3 lg:col-span-4 max-w-6xl space-y-8 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-2">
                    {children}
                </div>
            </div>
        </>
    )
}
