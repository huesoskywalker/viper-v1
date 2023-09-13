import { Session } from "next-auth"
import { getCurrentViper } from "@/lib/session"
import CreateCustomer from "./_components/CreateCustomer"
import { PageProps } from "@/lib/utils"

export default async function CustomerCreatePage({ params }: PageProps) {
    // const eventId = params.id
    const viperSession: Session | null = await getCurrentViper()
    const viper = viperSession?.user
    console.log(viper)
    if (!viper) throw new Error("No viper bro")
    const splitFullName: string[] = viper.name.split(/\s+/)
    const firstName: string = splitFullName[0]
    const lastName: string = splitFullName[1]
    return (
        <div>
            <CreateCustomer
                viperId={viper._id}
                viperFirstName={firstName}
                viperLastName={lastName}
                viperEmail={viper.email}
                viperLocation={viper.location}
                // pageBack={eventId}
            />
        </div>
    )
}
