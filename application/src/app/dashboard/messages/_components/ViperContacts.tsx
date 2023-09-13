import { Follow } from "@/types/viper"
import Contacts from "./Contacts"
import { preloadViperBasicProps } from "@/lib/vipers"
export async function ViperContacts({ contactsPromise }: { contactsPromise: Promise<Follow[]> }) {
    const viperFollows: Follow[] = await contactsPromise
    viperFollows?.map((follow: Follow) => {
        const viperId: string = JSON.stringify(follow._id).replace(/['"]+/g, "")
        preloadViperBasicProps(viperId)
    })
    return (
        <div className="space-y-2">
            {viperFollows?.map((follow: Follow) => {
                return (
                    /* @ts-expect-error Async Server Component */
                    <Contacts key={JSON.stringify(follow._id)} id={JSON.stringify(follow._id)} />
                )
            })}
        </div>
    )
}
