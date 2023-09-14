import CreateEventForm from "./CreateEventForm"

export default function CreateEvent(): JSX.Element {
    // ===========================================================
    return (
        <div className="py-2 flex justify-center">
            <div className="w-4/5">
                <div className="grid grid-cols-1 gap-6">
                    <CreateEventForm />
                </div>
            </div>
        </div>
    )
}
