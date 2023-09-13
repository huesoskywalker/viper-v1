import { Session } from "next-auth"
import { PageProps } from "@/lib/utils"
import { getCurrentViper } from "@/lib/session"
import ChatInput from "./_components/ChatInput"
import { ApolloWrapper } from "@/utils/ApolloWrapper"

export default async function Layout({ children, params }: PageProps) {
    const contact_id: string = params._id
    const viperSession: Session | null = await getCurrentViper()
    if (!viperSession) throw new Error("No Viper bro")
    const viper = viperSession?.user

    return (
        <div>
            <ApolloWrapper>
                <div className="my-5 max-h-screen">{children}</div>
                <ChatInput contactId={contact_id} viperId={viper._id} />
            </ApolloWrapper>
        </div>
    )
}
