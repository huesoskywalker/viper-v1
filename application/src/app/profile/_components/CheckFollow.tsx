import { AddFollow } from "@/app/profile/_components/AddFollow"
import { getViperFollowById } from "@/lib/vipers"
export async function CheckFollow({ viperId }: { viperId: string }) {
    const isViperFollowed: boolean = await getViperFollowById(viperId)

    return (
        <>
            <div className="flex justify-start">
                <AddFollow id={viperId} isFollowed={isViperFollowed} event={true} />
            </div>
        </>
    )
}
