import Link from "next/link"
import { EventShowTime } from "./EventShowTime"
import Image from "next/image"

export const EventCard = ({
    image,
    title,
    content,
    province,
    country,
    date,
    href,
}: {
    image: string
    title: string
    content: string
    province: string
    country: string
    date: string
    href: string
}) => {
    const words = content.split(" ")
    const twentyWords = words.slice(0, 27).join(" ")
    return (
        <Link data-test="select-event" href={href} className="group block">
            <div className="lg:space-y-3 overflow-hidden">
                <Image
                    data-test="event-card-image"
                    alt={title}
                    src={image}
                    width={300}
                    height={300}
                    loading="lazy"
                    style={{
                        objectFit: "contain",
                        objectPosition: "center",
                    }}
                    placeholder="blur"
                    blurDataURL={image}
                    className="rounded-xl max-h-36 max-w-auto group-hover:opacity-80"
                />
                <h2 data-test="event-card-title" className="font-bold text-gray-100">
                    {title}
                </h2>
                <div
                    data-test="event-card-content"
                    className="xl:text-sm lg:text-xs font-bold leading-snug text-white "
                >
                    {twentyWords}...
                </div>
                <p
                    data-test="event-card-province-country"
                    className="xl:text-sm md:text-xs text-gray-300"
                >
                    {province}, {country}
                </p>
                <EventShowTime dateTime={date} />
            </div>
        </Link>
    )
}
