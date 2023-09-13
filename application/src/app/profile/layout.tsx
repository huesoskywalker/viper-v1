import { PageProps } from "../../lib/utils"
import { ProfileMenu, fetchProfileMenu } from "./_lib/getProfile"
import { getCurrentViper } from "../../lib/session"
import { Profile } from "./_components/Profile"
import { BlogButton } from "./_components/BlogButton"
import { Session } from "next-auth"
import { preloadViperById } from "../../lib/vipers"
import { TabGroup } from "../_components/TabGroup"

export default async function Layout({ children }: PageProps) {
    // this is not a promise fetchProfileMenu it is all static data
    const profileCategory: ProfileMenu[] = fetchProfileMenu()
    const viper: Session | null = await getCurrentViper()
    // const [category, viper] = await Promise.all([categoryData, viperSession])

    if (!viper) throw new Error("No viper bro")

    // In here as well, we can filter some data, too much data without using it
    preloadViperById(viper.user._id)
    return (
        <div className="justify-center flex-wrap xl:px-20 lg:px-10">
            <div className=" lg:border-x  lg:border-gray-800 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20 md:py-2 md:px-8">
                {/* @ts-expect-error Async Server Component */}
                <Profile viperId={viper.user._id} profile={true} />
                <div className="flex justify-center lg:border-b lg:border-gray-800 pb-3 lg:ml-4">
                    <BlogButton
                        viperId={viper.user._id}
                        viperName={viper.user.name}
                        viperImage={viper.user.image}
                    />
                    <TabGroup
                        path={`/profile`}
                        items={[
                            {
                                text: "Blog",
                            },
                            ...profileCategory.map((x) => ({
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
