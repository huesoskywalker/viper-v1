import { PubSub } from "graphql-subscriptions"
import { getViperBasicProps, getVipersMessenger, sendViperMessage } from "../../utils/functions"
import { Chats, Message, ViperBasicProps } from "../../types/viper"

const pubsub = new PubSub()
export const resolvers = {
    Query: {
        chat: async (
            _: any,
            { viperId, contactId }: { viperId: string; contactId: string }
        ): Promise<Chats | null> => {
            const chat: Chats | null = await getVipersMessenger(viperId, contactId)
            return chat
        },
        sender: async (_: any, { _id }: { _id: string }): Promise<ViperBasicProps> => {
            const sender: ViperBasicProps = await getViperBasicProps(_id)
            return sender
        },
    },
    Mutation: {
        sendMessage: async (
            _: any,
            {
                viperId,
                contactId,
                message,
            }: { viperId: string; contactId: string; message: string }
        ): Promise<Message | undefined> => {
            const newMessage: Message | undefined = await sendViperMessage(
                viperId,
                contactId,
                message
            )
            pubsub.publish("NEW_MESSAGE", { messageAdded: newMessage })

            return newMessage
        },
    },
    Subscription: {
        messageAdded: {
            subscribe: () => pubsub.asyncIterator("NEW_MESSAGE"),
        },
    },
}
