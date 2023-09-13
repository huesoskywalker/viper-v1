import { PageProps } from "@/lib/utils"
import CreateEvent from "./_components/CreateEvent"

export default async function Layout({ children, params }: PageProps) {
    return (
        <div>
            <CreateEvent />
            <div>{children}</div>
        </div>
    )
}
