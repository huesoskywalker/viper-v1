import { createEventSchema } from "@/lib/zodSchemas/event/createEventSchema"
import { updateEventSchema } from "@/lib/zodSchemas/event/updateEventSchema"

export type UpdateEventInputs = z.infer<typeof updateEventSchema>
export type CreateEventInputs = z.infer<typeof createEventSchema>
