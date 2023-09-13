import { rawProduct } from "../myApp/event"
import { ID } from "../myApp/viper"
import {
    Comment,
    CreateEvent,
    EditEvent,
    File,
    LikeBlog,
    ProfileEdit,
    ProductMedia,
    ProductShopify,
    CustomerAddress,
} from "./requestTypes"

export const requestEditProfile: ProfileEdit = {
    name: "Hueso Skywalker",
    biography: "Hey ho, let's go",
    image: "",
    backgroundImage: "",
    location: "Argentina",
}

export const typeDate: string = "2023-08-28"
export const typeTime: string = "20:00:00"

export const requestCreateEvent: CreateEvent = {
    title: "Le Femmes",
    content:
        "Todas tienen algo como que el diablo en los genes Y el poder de poder levantarte el ánimo si quieren. Mujeres, mujeres preciosas nos invaden.",
    category: "Art",
    date: `${typeDate}T${typeTime}.000Z`,
    location: "Argentina",
    address: "Carrer de Petons, 5, Barcelona",
    price: 23,
    entries: 100,
    organizer: {
        _id: "",
        name: "",
        email: "",
    },
    image: "",
    product: rawProduct,
}

export const requestEditEvent: EditEvent = {
    title: "Le Femmes, Fatale",
    content:
        "Out of my head it's glowing. Es que son como el aroma de la fresca brisa cuando te asomas. En la orilla de la playa y el aire tomas",
    location: "Spain",
    price: 34,
}

export const requestCreateBlog: ID = {
    content: "Cypress is a pretty cool feature",
}

export const requestLikeBlog: LikeBlog = {
    _id: "",
    blogOwner_id: "",
    viper_id: "",
}

export const requestEventImage: File = {
    data: {
        url: "",
        fileName: "",
        fileSize: "",
        fileType: "",
    },
}

export const requestProductMedia: ProductMedia = {
    product: {
        _id: "",
        variant_id: "",
    },
    resourceUrl: "",
}

export const requestCustomerAddress: CustomerAddress = {
    phone: `+5493543555713`,
    address: `Los Algarrobos`,
    city: `Los Hornillos`,
    province: `Córdoba`,
    zip: `5100`,
    country: `Argentina`,
}

export const requestProductShopify: ProductShopify = {
    organizer: "",
    resourceUrl: "",
    title: requestCreateEvent.title,
    description: requestCreateEvent.content,
    location: requestCreateEvent.location,
    address: requestCreateEvent.address,
    category: requestCreateEvent.category,
    price: requestCreateEvent.price.toString(),
    entries: requestCreateEvent.entries.toString(),
}

export const requestCommentEvent: Comment = {
    comment: "see y'all there",
}

export const requestChatContact: ID = {
    message: "Hey pal, bla bla bla",
}
