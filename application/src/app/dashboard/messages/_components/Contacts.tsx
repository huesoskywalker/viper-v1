import { getViperBasicProps } from "@/lib/vipers"
import Image from "next/image"
import Link from "next/link"
import { ViperBasicProps } from "@/types/viper"

export default async function Contacts({ id }: { id: string }) {
    const viperId: string = id.replace(/['"]+/g, "")
    const viper: ViperBasicProps | null = await getViperBasicProps(viperId)
    if (!viper) throw new Error("No viper bro")

    return (
        <div>
            <Link
                data-test="contact-name"
                href={`/dashboard/messages/${viperId}`}
                className="flex justify-start items-center text-xs text-white "
            >
                <Image
                    data-test="contact-image"
                    src={`/vipers/${viper.image}`}
                    alt={`/vipers/${viper?.image}`}
                    width={50}
                    height={50}
                    className="lg:h-6 lg:w-6 md:h-5 md:w-5 rounded-full"
                />
                <span className="px-1 lg:text-xs md:text-[14px]">{viper.name}</span>
            </Link>
        </div>
    )
}
