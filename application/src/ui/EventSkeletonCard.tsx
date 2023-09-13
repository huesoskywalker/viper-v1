import clsx from "clsx"

export const EventSkeletonCard = ({ isLoading }: { isLoading?: boolean }) => (
    <div
        className={clsx("rounded-2xl bg-gray-900/80 p-2 max-w-screen-lg ", {
            "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent":
                isLoading,
        })}
    >
        <div className=" grid grid-cols-2 gap-3">
            <div className="h-32  rounded-lg bg-gray-700" />
            <div className="space-y-3">
                <div className="h-6 w-8/12 rounded-lg bg-gray-700" />
                <div className="h-5 w-6/12 rounded-lg bg-gray-700" />
                <div className="h-16 w-11/12 rounded-lg bg-gray-700" />
            </div>
        </div>
    </div>
)
