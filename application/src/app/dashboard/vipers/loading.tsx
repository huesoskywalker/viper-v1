import { ViperSkeletonCard } from "@/ui/ViperSkeletonCard"
export default function Loading() {
    return (
        <div>
            <div className="absolute right-12 top-12" role="status">
                <div className="h-4 w-4 animate-spin rounded-full border-[3px] border-white border-r-transparent" />
                <span className="sr-only">Loading...</span>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 my-[1rem]">
                <ViperSkeletonCard isLoading={true} />
                <ViperSkeletonCard isLoading={true} />
                <ViperSkeletonCard isLoading={true} />
                <ViperSkeletonCard isLoading={true} />
                <ViperSkeletonCard isLoading={true} />
                <ViperSkeletonCard isLoading={true} />
            </div>
        </div>
    )
}
