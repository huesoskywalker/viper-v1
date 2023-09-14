import { PageProps } from "@/lib/utils"
import { preloadViperBasicProps } from "@/lib/vipers"
import { fetchProfileMenu, type ProfileMenu } from "@/app/profile/_lib/getProfile"
import { Profile } from "@/app/profile/_components/Profile"
import { TabGroup } from "@/app/_components/TabGroup"

export default async function Layout({ children, params }: PageProps) {
    const viperId: string = params.id
    const category: ProfileMenu[] = fetchProfileMenu()
    preloadViperBasicProps(viperId)

    return (
        <div className="lg:px-4">
            <div className="lg:border-r  lg:border-gray-800 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 lg:py-2 lg:px-8">
                {/* @ts-expect-error Async Server Component */}

                <Profile viperId={viperId} profile={false} />
                <div className="flex justify-center lg:border-b lg:border-gray-800 pb-3 mr-10">
                    <TabGroup
                        path={`/dashboard/vipers/${viperId}`}
                        items={[
                            {
                                text: "Blog",
                            },
                            ...category.map((x) => ({
                                text: x.name,
                                slug: x.slug,
                            })),
                        ]}
                    />
                </div>
                <div className="mt-3">{children}</div>
            </div>
        </div>
    )
}
