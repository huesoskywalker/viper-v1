import { PageProps } from "../../lib/utils"

export default async function DashboardPage({ params }: PageProps) {
    return (
        <div className="space-y-1 md:flex md:align-center md:justify-center md:h-screen">
            <span className="text-gray-300 text-center mx-5 py-8">
                Welcome to the dashboard, where you can manage your events or keep swimming
            </span>
        </div>
    )
}
