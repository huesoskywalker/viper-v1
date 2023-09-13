import { format } from "date-fns"

export const EventDate = ({
    date,
    collection,
}: {
    date: string | number
    collection: boolean
}) => {
    return (
        <div>
            {typeof date === "string" ? (
                <div className="grid">
                    <strong
                        data-test="event-date"
                        className="font-bold xl:text-sm lg:text-xs text-gray-100"
                    >
                        {format(new Date(date.split("T")[0]), " MMM do, yyyy")}
                    </strong>
                    {!collection ? (
                        <strong
                            data-test="event-schedule"
                            className="font-semibold text-xs text-gray-100"
                        >
                            {format(new Date(date.split("T")[0]), " ccc p")}
                        </strong>
                    ) : null}
                </div>
            ) : typeof date === "number" ? (
                <span
                    data-test="comment-timestamp"
                    className="flex justify-end text-xs text-gray-400 "
                >
                    {format(date, "MMM d, yyyy")}
                </span>
            ) : null}
        </div>
    )
}
