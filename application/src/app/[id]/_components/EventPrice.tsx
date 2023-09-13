export const EventPrice = ({ price }: { price: number }) => {
    return (
        <div className="flex" data-test="event-price">
            {price === 0 ? (
                <h1 className="xl:text-lg lg:text-base font-bold leading-snug text-white">
                    FREE{" "}
                </h1>
            ) : (
                <div>
                    <div className=" xl:text-sm lg:text-xs leading-snug text-white">
                        $<span className="ml-1 xl:text-base lg:text-sm">{price}</span>
                    </div>
                </div>
            )}
        </div>
    )
}
