import { formatDuration, isTomorrow, intervalToDuration } from "date-fns"

export const EventShowTime = ({ dateTime }: { dateTime: string }) => {
    const date: Duration = intervalToDuration({
        start: new Date(),
        end: new Date(dateTime.split("T")[0]),
    })
    return (
        <div className="xl:text-sm lg:text-xs text-gray-300">
            <strong data-test="event-show-time" className="font-bold text-gray-100">
                {isTomorrow(new Date(dateTime)) ? "Tomorrow, " : null}
                In{" "}
                {formatDuration(date, {
                    format: ["months", "days", "hours"],
                    zero: true,
                    delimiter: ", ",
                })}
            </strong>
        </div>
    )
}
