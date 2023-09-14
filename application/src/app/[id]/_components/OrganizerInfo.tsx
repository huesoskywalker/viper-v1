import Link from "next/link"
import Image from "next/image"
import { getViperFollowById } from "@/lib/vipers"
import { Follow, ViperBasicProps } from "@/types/viper"
import ViperInfo from "../../profile/_components/ViperInfo"
import { AddFollow } from "../../profile/_components/AddFollow"
import { ShowFollows } from "@/app/profile/_components/ShowFollows"

export default async function OrganizerInfo({
    organizerId,
    event,
}: {
    organizerId: string
    event: boolean
}) {
    const organizer_id: string = organizerId.replace(/["']+/g, "")
    const organizerPromise = fetch(`/api/viper/${organizer_id}?props=basic-props`, {
        method: "GET",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    })

    const isOrganizerFollowedPromise: Promise<boolean> = getViperFollowById(organizer_id)

    const [organizerData, isOrganizerFollowed] = await Promise.all([
        organizerPromise,
        isOrganizerFollowedPromise,
    ])
    const organizer: ViperBasicProps = await organizerData.json()
    return (
        <div className="grid grid-cols-3 ">
            <div className="space-y-3 col-span-3 text-xs text-gray-300">
                <div className="flex justify-between ">
                    <Image
                        data-test="display-organizer-image"
                        src={organizer.image}
                        width={50}
                        height={50}
                        className="rounded-full group-hover:opacity-80 h-[50px] w-[50px]"
                        alt={organizer.name}
                        placeholder="blur"
                        blurDataURL={"organizer.imageBlur"}
                    />
                    <AddFollow id={organizer_id} isFollowed={isOrganizerFollowed} event={event} />
                </div>
                <div className="h-fit w-fit">
                    <Link
                        data-test="display-organizer-name"
                        href={`/dashboard/vipers/${organizer_id}`}
                        className="hover:underline text-yellow-600 hover:text-gray-200"
                    >
                        {organizer.name}
                    </Link>
                </div>
                <p data-test="display-organizer-location" className="text-gray-200">
                    {organizer.address.country}
                </p>
                <p data-test="display-organizer-biography" className="text-white">
                    {organizer.biography}
                </p>
                <div className="mt-5 space-x-8 text-gray-300 text-xs">
                    <ShowFollows
                        follows={organizer.follows?.length}
                        followers={false}
                        profile={false}
                    >
                        {organizer.follows?.map((follows: Follow) => {
                            return (
                                /* @ts-expect-error Async Server Component */
                                <ViperInfo
                                    key={JSON.stringify(follows._id)}
                                    id={JSON.stringify(follows._id)}
                                />
                            )
                        })}
                    </ShowFollows>

                    <ShowFollows
                        follows={organizer.followers.length}
                        followers={true}
                        profile={false}
                    >
                        {organizer.followers.map((followers: Follow) => {
                            return (
                                /* @ts-expect-error Async Server Component */
                                <ViperInfo
                                    key={JSON.stringify(followers._id)}
                                    id={JSON.stringify(followers._id)}
                                />
                            )
                        })}
                    </ShowFollows>
                </div>
            </div>
        </div>
    )
}
