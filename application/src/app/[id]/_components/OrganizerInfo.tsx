import Link from "next/link"
import Image from "next/image"
import { getViperFollowById } from "@/lib/vipers"
import { Follow, ViperBasicProps } from "@/types/viper"
import ViperInfo from "../../profile/_components/ViperInfo"
import { AddFollow } from "../../profile/_components/AddFollow"
import { ShowFollows } from "@/app/profile/_components/ShowFollows"
import axios, { AxiosResponse } from "axios"

export default async function OrganizerInfo({
    organizerId,
    event,
}: {
    organizerId: string
    event: boolean
}) {
    const organizer_id: string = organizerId.replace(/["']+/g, "")
    const organizerPromise: Promise<AxiosResponse<ViperBasicProps>> = axios.get<ViperBasicProps>(
        `/api/viper/${organizer_id}?props=basic-props`
    )

    const isOrganizerFollowedPromise: Promise<boolean> = getViperFollowById(organizer_id)

    const [organizer, isOrganizerFollowed] = await Promise.all([
        organizerPromise,
        isOrganizerFollowedPromise,
    ])
    const organizerData = organizer.data
    return (
        <div className="grid grid-cols-3 ">
            <div className="space-y-3 col-span-3 text-xs text-gray-300">
                <div className="flex justify-between ">
                    <Image
                        data-test="display-organizer-image"
                        src={organizerData.image}
                        width={50}
                        height={50}
                        className="rounded-full group-hover:opacity-80 h-[50px] w-[50px]"
                        alt={organizerData.name}
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
                        {organizerData.name}
                    </Link>
                </div>
                <p data-test="display-organizer-location" className="text-gray-200">
                    {organizerData.address.country}
                </p>
                <p data-test="display-organizer-biography" className="text-white">
                    {organizerData.biography}
                </p>
                <div className="mt-5 space-x-8 text-gray-300 text-xs">
                    <ShowFollows
                        follows={organizerData.follows?.length}
                        followers={false}
                        profile={false}
                    >
                        {organizerData.follows?.map((follows: Follow) => {
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
                        follows={organizerData.followers.length}
                        followers={true}
                        profile={false}
                    >
                        {organizerData.followers.map((followers: Follow) => {
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
