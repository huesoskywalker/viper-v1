export const EventCountry = ({ province, country }: { province: string; country: string }) => {
    return (
        <div>
            <h1 data-test="event-country" className="xl:text-sm lg:text-xs text-gray-300">
                {province}, {country}
            </h1>
        </div>
    )
}
