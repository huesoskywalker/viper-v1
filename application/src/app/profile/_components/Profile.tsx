import Image from "next/image"
import { getViperBasicProps, preloadViperFollowed } from "@/lib/vipers"
import ViperInfo from "./ViperInfo"
import { Follow, ViperBasicProps } from "@/types/viper"
import { EditProfileLink } from "./EditProfileLink"
import { CheckFollow } from "./CheckFollow"
import { ShowFollows } from "./ShowFollows"

export const Profile = async ({ viperId, profile }: { viperId: string; profile: boolean }) => {
    const fullViper: ViperBasicProps | null = await getViperBasicProps(viperId)
    if (!fullViper) throw new Error("No viper bro")
    preloadViperFollowed(viperId)

    return (
        <div className="grid lg:grid-cols-4">
            <div className="lg:col-span-4 overflow-hidden">
                <div className="">
                    <Image
                        data-test="background-image"
                        alt={fullViper.name}
                        src={fullViper.backgroundImage}
                        width={700}
                        height={560}
                        placeholder="blur"
                        loading="lazy"
                        blurDataURL={fullViper.image}
                        quality={100}
                        style={{
                            objectFit: "cover",
                            objectPosition: "center",
                            maxHeight: "12rem",
                        }}
                        className="-z-10 rounded-xl  group-hover:opacity-80 -mb-2"
                    />
                </div>
                <div className="z-10 relative bottom-9 left-7">
                    <Image
                        data-test="profile-image"
                        alt={fullViper.name}
                        src={`${fullViper.image}`}
                        width={120}
                        height={120}
                        placeholder="blur"
                        loading="lazy"
                        blurDataURL={fullViper.image}
                        quality={100}
                        style={{
                            objectFit: "contain",
                            objectPosition: "top",
                        }}
                        className="  rounded-full border-solid border-2 border-yellow-600 group-hover:opacity-80"
                    />
                    <div className="grid grid-cols-2">
                        <h1 data-test="viper-name" className="text-sm text-yellow-700 mt-4">
                            {fullViper.name}
                            <p className="text-xs text-gray-300 mt-1">{fullViper.email}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                Settled in{" "}
                                <span data-test="viper-location" className="text-gray-200 ">
                                    {fullViper.address.country ?? "Planet Earth"}
                                </span>
                            </p>
                        </h1>
                        {profile ? (
                            <EditProfileLink href={`/profile/edit/${viperId}`} />
                        ) : (
                            /* @ts-expect-error Server Component */
                            <CheckFollow viperId={viperId} />
                        )}
                    </div>
                    <div className="break-after-column">
                        <h1 data-test="viper-biography" className="text-gray-300 text-sm mt-5">
                            {fullViper.biography}
                        </h1>
                    </div>
                    <div className="mt-5 space-x-8 text-gray-300 text-xs">
                        <ShowFollows
                            follows={fullViper.follows.length}
                            followers={false}
                            profile={true}
                        >
                            {fullViper.follows.map((follows: Follow) => {
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
                            follows={fullViper.followers.length}
                            followers={true}
                            profile={true}
                        >
                            {fullViper.followers.map((followers: Follow) => {
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
        </div>
    )
}
