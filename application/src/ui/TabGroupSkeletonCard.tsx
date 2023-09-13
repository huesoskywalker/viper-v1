export const TabGroupCard = ({ isLoading }: { isLoading?: boolean }) => (
    <div className="space-y-3 grid grid-cols-3 mb-8 ml-2">
        <div className="flex justify-start space-x-2">
            <div className="h-7 w-4/12 rounded-lg " />
            <div className="h-7 w-9/12 rounded-lg bg-gray-700" />
            <div className="h-7 w-10/12 rounded-lg bg-gray-700" />
        </div>
    </div>
)
