import Link from "next/link"
import Image from "next/image"
import { getViperBasicProps } from "@/lib/vipers"
import { ViperBasicProps } from "@/types/viper"
import axios from "axios"

export default async function ViperInfo({ id }: { id: string }) {
    const viperId: string = id.replace(/['"]+/g, "")
    // const viper: ViperBasicProps | null = await getViperBasicProps(viperId)
    const { data: viper } = await axios.get<ViperBasicProps>(
        `/api/viper/${viperId}?props=basic-props`
    )
    if (!viper) return

    return (
        <div>
            <Link href={`/dashboard/vipers/${viperId}`} className="group-block">
                <div className="space-y-4">
                    <Image
                        alt={viper.name}
                        src={viper.image}
                        width={50}
                        height={50}
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={"viper.imageBlur"}
                        className="rounded-full  group-hover:opacity-80"
                    />
                    <p className="text-xs text-gray-300">{viper?.name}</p>
                </div>
            </Link>
        </div>
    )
}
