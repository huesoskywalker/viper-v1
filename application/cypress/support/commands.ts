/// <reference types="cypress" />

import { format, formatDuration, intervalToDuration } from "date-fns"
import _ from "lodash"
import { Session, rawSession } from "./myApp/session"
import {
    ProductInventory,
    productInventory,
    rawEvent,
    rawEventId,
    rawProduct,
} from "./myApp/event"
import { sessionKeys } from "./myApp/sessionKeys"
import { eventKeys, productInventoryKeys } from "./myApp/eventKeys"
import { Comments, EditEvent, EventInterface, Organizer } from "@/types/event"
import { content_type } from "./entryPoint"
import { ID, _ID, rawViper, rawViperId } from "./myApp/viper"
import { _idKey, viperKeys } from "./myApp/viperKeys"
import { Viper, ViperBasicProps, MyBlog, Hex24String } from "@/types/viper"
import {
    requestCreateEventKeys,
    requestEditEventKeys,
    requestEditProfileKeys,
    requestEventImageKeys,
    requestLikeBlogKeys,
    requestProductMediaKeys,
    requestProductShopifyKeys,
} from "./request/requestKeys"
import { Interception } from "cypress/types/net-stubbing"
import {
    requestEditProfile,
    requestEventImage,
    requestLikeBlog,
    requestProductMedia,
    requestProductShopify,
    typeDate,
    typeTime,
} from "./request/requestObjects"
import { CreateEvent, CustomerAddress, LikeBlog, ProfileEdit } from "./request/requestTypes"
import {
    responseCheckoutCreateKeys,
    responseCheckoutCustomerAssociateKeys,
    responseCommentEventKeys,
    responseCustomerAddressKeys,
    responseCustomerShopifyKeys,
    responseNewCustomerKeys,
    responseNewEventKeys,
    responseProductMediaKeys,
    responsePublishProductKeys,
    responseStageUploadKeys,
} from "./response/responseKeys"
import {
    responseCheckoutId,
    responseCheckoutWebUrl,
    responseCustomerShopify,
    responseProductMedia,
    responsePublishProduct,
} from "./response/responseObjects"

export {}

export type Alias<T> = {
    [K in keyof T]: `@\${string & T[K]}`
}

export type BodyType = {
    [key: string]: any
}

function isPathInTarget(object: object | string, path: string | undefined): string | undefined {
    if (!path) return undefined
    const cleanPath = path.replace(/(?:\.\w+|\[\d+\])$/, "")
    return _.has(object, cleanPath) ? cleanPath : undefined
}

Cypress.Commands.add("getByData", (selector: string) => {
    return cy.get(`[data-test=${selector}]`)
})

Cypress.Commands.add("dataInContainer", (selector: string, value: string) => {
    return cy.getByData(selector).contains(value).should("be.visible")
})

Cypress.Commands.add("dataInImage", (selector: string, src: string) => {
    cy.getByData(selector).should("have.attr", "src").should("include", src)
})

Cypress.Commands.add("clickButton", (selector: string, contains: string, href?: string) => {
    if (href) {
        return cy.getByData(selector).contains(contains).should("have.attr", "href", href).click()
    } else {
        return cy.getByData(selector).contains(contains).click()
    }
})

Cypress.Commands.add("navigate", (selector: string, contains: string, href: string) => {
    cy.clickButton(selector, contains, href)
    cy.url().should("include", href)
    cy.wait(1000)
})

Cypress.Commands.add("inputType", (selector: string, value: string) => {
    return cy.getByData(selector).clear().type(value)
})

Cypress.Commands.add("inputSelect", (selector: string, value: string) => {
    return cy.getByData(selector).select(value).should("have.value", value)
})

Cypress.Commands.add(
    "signInWithCredential",
    (username: string, password: string, sessionAlias: string, viperAlias: string) => {
        cy.session(
            username,
            () => {
                cy.log(`Viper App`)
                cy.visit("/")
                cy.clickButton("signIn", "Sign in")
                cy.url().should("include", "/api/auth/signin")
                cy.get("#input-username-for-1-test-provider").type(username)
                cy.get("#input-password-for-1-test-provider").type(password)
                cy.get(":nth-child(4) > form > button").click()
                cy.url().should("include", "/")
                cy.apiRequestAndResponse(
                    {
                        url: "/api/auth/session",
                        headers: {
                            "content-type": "application/json",
                        },
                        method: "GET",
                    },
                    {
                        status: 200,

                        expectResponse: {
                            keys: sessionKeys,
                            object: {
                                name: username,
                            },
                            path: "user",
                        },
                        build: {
                            object: rawSession,
                            alias: sessionAlias,
                        },
                    }
                )
                cy.get<Session>(`@${sessionAlias}`).then((session: Session) => {
                    cy.buildFullViper(session as Session, viperAlias)
                })

                cy.getCookie("next-auth.session-token").should("exist")
                cy.getByData("nav-item").contains(username)
                cy.log("Cypress login successful")
            },
            { cacheAcrossSpecs: true }
        )
    }
)

Cypress.Commands.add(
    "apiRequestAndResponse",
    (
        requestOptions: {
            url: string
            headers: object
            method: string
            body?: object
        },
        responseOptions: {
            status: number
            expectResponse?: {
                keys: string[]
                object?: object | Alias<string>
                path?: string
            }
            build?: {
                object: object | Alias<string>
                path?: string
                alias?: string
            }
        }
    ) => {
        const { url, headers, method, body } = requestOptions
        const { status, expectResponse, build } = responseOptions

        const request =
            method === "GET"
                ? cy.api({
                      url: url,
                      method: method,
                      headers: headers,
                  })
                : cy.api({
                      url: url,
                      method: method,
                      headers: headers,
                      body: body,
                  })

        request.then((response) => {
            const {
                status: responseStatus,
                requestHeaders,
                headers: responseHeaders,
                body: responseBody,
            } = response
            const targetBody = Array.isArray(responseBody) ? responseBody[0] : responseBody
            expect(responseStatus).to.equal(status)
            expect(requestHeaders).to.include(headers)
            if (expectResponse) {
                const { keys, object: expectObject, path } = expectResponse
                const targetValue = path ? _.get(targetBody, path) : targetBody
                expect(targetValue).to.have.all.keys(keys)
                if (expectObject) {
                    cy.expectBodyKeyEqualObjectKey(targetValue, expectObject, path)
                }
                if (build) {
                    const { object: buildObject, path: objPath, alias } = build
                    cy.buildObjectProperties(targetValue, buildObject, {
                        objPath,
                        alias,
                    })
                }
            } else if (!expectResponse && build) {
                const { object, alias } = build
                cy.buildObjectProperties(targetBody, object, { alias })
            }
        })
    }
)

Cypress.Commands.add(
    "expectBodyKeyEqualObjectKey",
    (body: BodyType, object: object | Alias<string>, path?: string) => {
        cy.isAliasObject(object).then((realObject: any) => {
            if (path && isPathInTarget(realObject, path)) {
                const targetObject = _.get(realObject, path)
                Object.keys(targetObject).forEach((key: any) => {
                    expect(body[key]).to.deep.equal(targetObject[key])
                })
            } else {
                Object.keys(realObject).forEach((key: any) => {
                    expect(body[key]).to.deep.equal(realObject[key])
                })
            }
        })
    }
)

Cypress.Commands.add(
    "checkProfileComponent",
    (
        viper: Viper | ViperBasicProps | Alias<string>,
        button: "Edit Profile" | "Follow" | "Following"
    ) => {
        cy.isAliasObject(viper).then((realViper: Viper | ViperBasicProps) => {
            cy.dataInImage("profile-image", realViper.image)
            cy.dataInImage("background-image", realViper.backgroundImage)
            cy.dataInContainer("viper-name", realViper.name)
            cy.dataInContainer("viper-location", realViper.location)
            cy.dataInContainer("viper-biography", realViper.biography)
            cy.getByData("display-show-follow").eq(0).should("exist").and("be.visible")
            cy.getByData("display-show-follow").eq(1).should("exist").and("be.visible")
            if (button === "Edit Profile") {
                cy.dataInContainer("edit-profile", button as "Edit Profile")
            } else {
                cy.dataInContainer("add-follow", button as "Follow" | "Following")
            }
        })
    }
)
Cypress.Commands.add("buildEventFromUrl", (alias: string) => {
    cy.url()
        .should((url) => {
            expect(url).to.match(/\/[a-f\d]{24}$/)
        })
        .then((url) => {
            const id = {
                _id: url.split("/").pop(),
            }
            if (id)
                cy.buildObjectProperties(id, rawEventId, {
                    propKeys: {
                        reqKey: "_id",
                        objKey: "_id",
                    },
                    alias: `${alias}Id`,
                })
        })
    cy.get<ID>(`@${alias}Id`).then((event: ID) => {
        cy.apiRequestAndResponse(
            {
                url: `/api/event/${event._id}`,
                headers: {
                    "content-type": content_type,
                },
                method: "GET",
            },
            {
                status: 200,
                expectResponse: {
                    keys: eventKeys,
                    object: { _id: event._id },
                },
                build: {
                    object: rawEvent,
                    alias: alias,
                },
            }
        )
    })
})

Cypress.Commands.add(
    "likeEvent",
    (resBody: (EventInterface | Alias<string>) & (Viper | Alias<string>)[]) => {
        const event = resBody[0]
        const viper = resBody[1]
        cy.isAliasObject(event).then((event: EventInterface) => {
            cy.isAliasObject(viper).then((viper: Viper) => {
                cy.intercept(`/api/event/like`).as("like-event")
                cy.getByData("like-event").click()
                cy.wait("@like-event").then((interception) => {
                    cy.verifyInterceptionRequestAndResponse(
                        interception,
                        {
                            reqUrl: `/api/event/like`,
                            reqMethod: "POST",
                            reqHeaders: {
                                "content-type": content_type,
                            },
                            reqBody: [
                                { event: { _id: event._id } },
                                { viper: { _id: viper._id } },
                            ],
                            reqKeys: ["event", "viper"],
                        },
                        {
                            resStatus: 200,
                            resHeaders: {
                                "content-type": content_type,
                            },
                            resKeys: [eventKeys, viperKeys],
                            resBody: [event, viper],
                        },
                        [
                            {
                                source: "mongodb",
                                action: "edit",
                            },
                            {
                                source: "mongodb",
                                action: "edit",
                            },
                        ],
                        [
                            {
                                body: "request",
                                propKeys: {
                                    reqKey: "viper._id",
                                    objKey: "_id",
                                },
                                object: event,
                                objPath: "likes[0]",
                            },
                            {
                                body: "request",
                                propKeys: {
                                    reqKey: "event._id",
                                    objKey: "_id",
                                },
                                object: viper,
                                objPath: "myEvents.likes[0]",
                            },
                        ]
                    )
                })
                cy.apiRequestAndResponse(
                    {
                        url: `/api/event/${event._id}`,
                        method: "GET",
                        headers: {
                            "content-type": content_type,
                        },
                    },
                    {
                        status: 200,
                        expectResponse: {
                            keys: ["_id"],
                            object: { _id: viper._id },
                            path: "likes[0]",
                        },
                    }
                )
                cy.apiRequestAndResponse(
                    {
                        url: `/api/viper/${viper._id}`,
                        method: "GET",
                        headers: {
                            "content-type": content_type,
                        },
                    },
                    {
                        status: 200,
                        expectResponse: {
                            keys: ["_id"],
                            object: { _id: event._id },
                            path: "myEvents.likes[0]",
                        },
                    }
                )
            })
        })
    }
)

Cypress.Commands.add(
    "commentEvent",
    (requestComment: string, event: EventInterface | Alias<string>, viper: _ID) => {
        cy.getByData("comment-event").click()
        cy.getByData("comment-input").should("exist").and("be.visible")
        cy.getByData("close-input").should("exist").and("be.visible")
        cy.getByData("viper-image").should("exist").and("be.visible")
        cy.inputType("write-comment", requestComment)
        cy.intercept(`/api/event/comment/post`).as("comment-event")
        cy.clickButton("post-comment", "Comment")
        cy.isAliasObject(event).then((event: EventInterface) => {
            cy.isAliasObject(viper).then((viper: _ID) => {
                cy.wait("@comment-event").then((interception) => {
                    cy.verifyInterceptionRequestAndResponse(
                        interception,
                        {
                            reqUrl: `/api/event/comment/post`,
                            reqMethod: "POST",
                            reqHeaders: {
                                "content-type": content_type,
                            },
                            reqBody: [
                                {
                                    event: { _id: event._id },
                                },
                                {
                                    viper: { _id: viper._id },
                                },
                                {
                                    comment: requestComment,
                                },
                            ],
                            reqKeys: ["event", "viper", "comment"],
                        },
                        {
                            resStatus: 200,
                            resHeaders: {
                                "content-type": content_type,
                            },
                            resKeys: eventKeys,
                            resBody: event,
                        },
                        {
                            source: "mongodb",
                            action: "edit",
                        }
                    )
                })
                cy.apiRequestAndResponse(
                    {
                        url: `/api/event/comment/${event._id}`,
                        method: "GET",
                        headers: {
                            "content-type": content_type,
                        },
                    },
                    {
                        status: 200,
                        expectResponse: {
                            keys: responseCommentEventKeys,
                            object: {
                                viperId: viper._id,
                                text: requestComment,
                            },
                            path: "comment",
                        },
                        build: {
                            object: event,
                            path: "comments[0]",
                        },
                    }
                )
            })

            cy.apiRequestAndResponse(
                {
                    url: `/api/event/${event._id}`,
                    method: "GET",
                    headers: {
                        "content-type": content_type,
                    },
                },
                {
                    status: 200,
                    expectResponse: {
                        keys: responseCommentEventKeys,
                        object: event,
                        path: "comments[0]",
                    },
                }
            )
            cy.getByData("comment-input").should("not.exist")
            cy.getByData("event-comment-card").should("exist").and("be.visible")
        })
    }
)
Cypress.Commands.add(
    "checkEventCommentCard",
    (session: Session | Alias<string>, comment: Comments, title: string) => {
        cy.isAliasObject(session).then((session: Session) => {
            cy.dataInImage("viper-image", session.image)
            cy.dataInContainer("commentator-name", session.name)
            cy.dataInContainer("comment-on", title)
            cy.dataInContainer("comment-timestamp", format(comment.timestamp, "MMM d, yyyy"))
            cy.dataInContainer("event-comment", comment.text)
            cy.getByData("like-comment").should("exist").and("be.visible")
            cy.dataInContainer("like-count", comment.likes.length.toString())
            cy.getByData("comment-comment").should("exist").and("be.visible")
            cy.dataInContainer("comment-comment-count", comment.replies.length.toString())
        })
    }
)
Cypress.Commands.add(
    "likeEventCommentCard",
    (viper: _ID | Alias<string>, event: EventInterface | Alias<string>) => {
        cy.isAliasObject(event).then((event: EventInterface) => {
            cy.intercept(`/api/event/comment/like`).as("like-comment")
            cy.getByData("like-comment").click()
            cy.wait("@like-comment").then((interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/event/comment/like`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: [
                            {
                                viper: viper,
                            },
                            {
                                event: { _id: event._id },
                            },
                            {
                                comment: { _id: event.comments[0]._id },
                            },
                        ],
                        reqKeys: ["viper", "event", "comment"],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: eventKeys,
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    },
                    {
                        body: "request",
                        propKeys: {
                            reqKey: "viper._id",
                            objKey: "_id",
                        },
                        object: event,
                        objPath: "comments[0].likes[0]",
                    }
                )
            })
        })
    }
)

Cypress.Commands.add("displayViper", (viper: ViperBasicProps | Viper | Alias<string>) => {
    cy.isAliasObject(viper).then((viper: ViperBasicProps) => {
        cy.getByData("hover-organizer").trigger("mouseover")
        cy.getByData("display-viper").should("exist").and("be.visible")
        cy.dataInImage("display-organizer-image", viper.image)
        cy.getByData("add-follow").should("exist").should("be.visible").and("contain", "Follow")
        cy.getByData("display-organizer-name")
            .should("have.attr", "href", `/dashboard/vipers/${viper._id}`)
            .should("contain", viper.name)
        cy.dataInContainer("display-organizer-location", viper.location)
        cy.dataInContainer("display-organizer-biography", viper.biography)
        cy.getByData("display-show-follow").eq(0).should("exist").and("be.visible")
        cy.dataInContainer("follow-count", viper.follows.length.toString())
        cy.getByData("display-show-follow").eq(1).should("exist").and("be.visible")
        cy.dataInContainer("follow-count", viper.followers.length.toString())
    })
})

Cypress.Commands.add(
    "addFollow",
    (currentViper: Viper | Alias<string>, viper: Viper | Alias<string>) => {
        cy.isAliasObject(currentViper).then((currentViper: Viper) => {
            cy.isAliasObject(viper).then((viper: Viper) => {
                cy.intercept(`/api/viper/follow`).as("follow-viper")
                cy.clickButton("add-follow", "Follow")
                cy.wait("@follow-viper").then((interception) => {
                    cy.verifyInterceptionRequestAndResponse(
                        interception,
                        {
                            reqUrl: `/api/viper/follow`,
                            reqMethod: "PUT",
                            reqHeaders: {
                                "content-type": content_type,
                            },
                            reqBody: [
                                {
                                    currentViper: { _id: currentViper._id },
                                },
                                {
                                    viper: { _id: viper._id },
                                },
                            ],
                            reqKeys: ["currentViper", "viper"],
                        },
                        {
                            resStatus: 200,
                            resHeaders: {
                                "content-type": content_type,
                            },
                            resKeys: [viperKeys, viperKeys],
                            resBody: [viper, currentViper],
                        },
                        [
                            {
                                source: "mongodb",
                                action: "edit",
                            },
                            {
                                source: "mongodb",
                                action: "edit",
                            },
                        ],
                        [
                            {
                                body: "request",
                                propKeys: {
                                    reqKey: "currentViper._id",
                                    objKey: "_id",
                                },
                                object: viper,
                                objPath: "followers[0]",
                            },
                            {
                                body: "request",
                                propKeys: {
                                    reqKey: "viper._id",
                                    objKey: "_id",
                                },
                                object: currentViper,
                                objPath: "follows[0]",
                            },
                        ]
                    )
                })
            })
        })
    }
)

Cypress.Commands.add(
    "verifyInterceptionRequestAndResponse",
    (
        interception,
        requestOptions: {
            reqUrl: string
            reqHeaders: object
            reqMethod: string
            reqBody: object | Alias<string> | (object | Alias<string>)[]
            reqKeys: (string | number)[]
        },
        responseOptions: {
            resStatus: number
            resHeaders: object
            resKeys: (string | number)[] | (string | number)[][]
            resBody?: object | Alias<string> | (object | Alias<string>)[]
        },
        dataOptions:
            | {
                  source: "mongodb" | "shopify"
                  action?: "create" | "edit"
              }
            | {
                  source: "mongodb" | "shopify"
                  action?: "create" | "edit"
              }[],
        buildProperty?:
            | {
                  body: "response" | "request"
                  propKeys:
                      | {
                            reqKey: string
                            objKey: string
                        }
                      | {
                            reqKey: string
                            objKey: string
                        }[]
                  object: object | Alias<string> | (object | Alias<string>)[]
                  objPath?: string | (string | undefined)[]
                  alias?: string | (string | undefined)[]
              }
            | ({
                  body: "response" | "request"
                  propKeys:
                      | {
                            reqKey: string
                            objKey: string
                        }
                      | {
                            reqKey: string
                            objKey: string
                        }[]
                  object: object | Alias<string> | (object | Alias<string>)[]
                  objPath?: string | (string | undefined)[]
                  alias?: string | (string | undefined)[]
              } | null)[]
    ) => {
        const {
            statusCode: statusCode,
            headers: responseHeaders,
            body: responseBody,
        } = interception.response
        const { resStatus, resHeaders, resBody, resKeys } = responseOptions
        const { body: requestBody } = interception.request

        const isResponseBodyArray = Array.isArray(responseBody)
        const isResKeysArray = Array.isArray(resKeys)
        const isResBodyArray = Array.isArray(resBody)
        const isDataOptionsArray = Array.isArray(dataOptions)
        const isBuildPropertyArray = Array.isArray(buildProperty)

        if (
            isResponseBodyArray &&
            isResKeysArray &&
            isResBodyArray &&
            isDataOptionsArray &&
            isBuildPropertyArray
        ) {
            for (let i = 0; i < responseBody.length; i++) {
                const { source, action } = dataOptions[i]
                const isMongoEditDoc = source === "mongodb" && action === "edit"
                const document = isMongoEditDoc ? responseBody[i].value : responseBody[i]
                cy.expectInterceptionEqualRequestOptions(interception.request, requestOptions)
                expect(statusCode).to.equal(resStatus)
                expect(responseHeaders).to.include(resHeaders)
                expect(document).to.have.all.keys(resKeys[i])

                if (resBody[i]) {
                    cy.expectBodyKeyEqualObjectKey(document, resBody[i])
                }

                cy.expectMongoDBResponse(responseBody[i], action)

                if (buildProperty[i]) {
                    const { body, propKeys, object, objPath, alias } = buildProperty[i]!
                    const buildProps = {
                        propKeys,
                        realObject: object,
                        expectProperty: body,
                        objPath,
                        alias,
                    }

                    const bodyValue = body === "response" ? document : requestBody
                    cy.handleBuildProperty(bodyValue, buildProps)
                }
            }
        } else if (!isDataOptionsArray) {
            const { source, action } = dataOptions
            const isMongoEditDoc = source === "mongodb" && action === "edit"
            const responseValue = isMongoEditDoc ? responseBody.value : responseBody

            expect(statusCode).to.equal(resStatus)
            expect(responseHeaders).to.include(resHeaders)
            expect(responseValue).to.have.all.keys(resKeys)
            cy.expectInterceptionEqualRequestOptions(interception.request, requestOptions)
            if (resBody) {
                cy.expectBodyKeyEqualObjectKey(responseValue, resBody)
            }
            if (source === "mongodb") {
                cy.expectMongoDBResponse(responseBody, action)
            }
            if (buildProperty && !isBuildPropertyArray) {
                const { body, propKeys, object, objPath, alias } = buildProperty
                const bodyValue = body === "response" ? responseValue : requestBody
                const buildProps = {
                    propKeys,
                    expectProperty: body,
                    realObject: object,
                    objPath,
                    alias,
                }
                cy.handleBuildProperty(bodyValue, buildProps)
            }
        }
    }
)

Cypress.Commands.add(
    "expectInterceptionEqualRequestOptions",
    (
        interceptionRequest,
        requestOptions: {
            reqUrl: string
            reqHeaders: object
            reqMethod: string
            reqBody: object | Alias<string> | (object | Alias<string>)[]
            reqKeys: (string | number)[]
        }
    ) => {
        const {
            url: requestUrl,
            method: requestMethod,
            headers: requestHeaders,
            body: requestBody,
        } = interceptionRequest
        const { reqUrl, reqHeaders, reqMethod, reqBody, reqKeys } = requestOptions
        expect(requestUrl).to.include(reqUrl)
        expect(requestMethod).to.equal(reqMethod)
        expect(requestHeaders).to.include(reqHeaders)
        expect(requestBody).to.have.all.keys(reqKeys)
        if (Array.isArray(reqBody)) {
            reqBody.forEach((body) => {
                cy.expectBodyKeyEqualObjectKey(requestBody, body)
            })
        } else {
            cy.expectBodyKeyEqualObjectKey(requestBody, reqBody)
        }
    }
)

Cypress.Commands.add("expectMongoDBResponse", (response, action?: "edit" | "create") => {
    if (action === "edit") {
        expect(response.ok).to.equal(1)
        expect(response.lastErrorObject.n).to.equal(1)
        expect(response.lastErrorObject.updatedExisting).to.equal(true)
    } else {
        expect(response.acknowledged).to.equal(true)
    }
})

Cypress.Commands.add("checkEventComponentProps", (event: EventInterface | Alias<string>) => {
    cy.isAliasObject(event).then((event: EventInterface) => {
        cy.apiRequestAndResponse(
            {
                url: `/api/event/${event._id}`,
                headers: {
                    "content-type": content_type,
                },
                method: "GET",
            },
            {
                status: 200,
                expectResponse: {
                    keys: eventKeys,
                    object: event,
                },
            }
        )
        cy.dataInImage("event-image", event.image)
        cy.dataInContainer("event-title", event.title)
        cy.dataInContainer("event-content", event.content)
        cy.dataInContainer("event-address", event.address)

        cy.apiRequestAndResponse(
            {
                url: `/api/product/inventory/${event.product._id.toString().match(/\d+/g)}`,
                headers: {
                    "content-type": content_type,
                },
                method: "POST",
            },
            {
                status: 200,
                expectResponse: {
                    keys: productInventoryKeys,
                },
                build: {
                    object: productInventory,
                    alias: "productInventory",
                },
            }
        )

        const checkDate = format(new Date(event.date.split("T")[0]), "MMM do, yyyy")
        const checkSchedule = format(new Date(event.date.split("T")[0]), "ccc p")
        cy.dataInContainer("event-date", checkDate)
        cy.dataInContainer("event-schedule", checkSchedule)
        cy.dataInContainer("event-location", event.location)
        cy.dataInContainer("event-price", `$${event.price}`)
        cy.get<ProductInventory>("@productInventory").then((product) => {
            cy.dataInContainer(
                "inventory-of-entries",
                `${product.totalInventory} of ${event.entries}`
            )
        })
        cy.getByData("participate").should("exist").and("be.visible")
        cy.dataInContainer("show-viper", `Organized by:${event.organizer.name}`)
        cy.getByData("like-event").should("exist").and("be.visible")
        cy.dataInContainer("like-count", event.likes.length.toString())
        cy.getByData("comment-event").should("exist").and("be.visible")
        cy.dataInContainer("comment-event-count", event.comments.length.toString())
    })
})

Cypress.Commands.add(
    "checkEventCard",
    (event: EventInterface | Alias<string>, editEvent?: EditEvent) => {
        const eventAlias = typeof event === "string" ? event.replace(/@/g, "") : `${event}`
        cy.isAliasObject(event).then((realEvent: EventInterface) => {
            cy.dataInImage("event-card-image", realEvent.image)
            cy.dataInContainer("event-card-title", realEvent.title).eq(0)
            cy.dataInContainer("event-card-content", realEvent.content).eq(0)
            cy.dataInContainer("event-card-location", realEvent.location).eq(0)
            const date: Duration = intervalToDuration({
                start: new Date(),
                end: new Date(realEvent.date.split("T")[0]),
            })
            cy.dataInContainer(
                "event-show-time",
                formatDuration(date, {
                    format: ["months", "days", "hours"],
                    zero: true,
                    delimiter: ", ",
                })
            )
            if (editEvent) {
                cy.navigate("edit", "Edit", `/dashboard/myevents/${realEvent._id}`)
                cy.inputType("event-title", `${editEvent.title}`)
                cy.inputType("event-content", `${editEvent.content}`)
                cy.inputSelect("event-location", `${editEvent.location}`)
                cy.inputType("event-price", `${editEvent.price}`)
                cy.intercept("PUT", `/api/event/create/submit`).as("edit-event")
                cy.clickButton("edit-event-button", "Submit Edition")

                cy.wait("@edit-event").then((interception: Interception) => {
                    cy.verifyInterceptionRequestAndResponse(
                        interception,
                        {
                            reqUrl: `/api/event/create/submit`,
                            reqHeaders: {
                                "content-type": content_type,
                            },
                            reqMethod: "PUT",
                            reqBody: [{ _id: realEvent._id }, editEvent],

                            reqKeys: ["_id", ...requestEditEventKeys, "dateNow"],
                        },
                        {
                            resStatus: 200,
                            resHeaders: {
                                "content-type": content_type,
                            },
                            resKeys: eventKeys,
                            resBody: realEvent,
                        },
                        {
                            source: "mongodb",
                            action: "edit",
                        },
                        {
                            body: "request",
                            propKeys: [
                                {
                                    reqKey: "dateNow",
                                    objKey: "editionDate",
                                },
                                {
                                    reqKey: "title",
                                    objKey: "title",
                                },
                                {
                                    reqKey: "content",
                                    objKey: "content",
                                },
                                {
                                    reqKey: "location",
                                    objKey: "location",
                                },
                                {
                                    reqKey: "price",
                                    objKey: "price",
                                },
                            ],
                            object: realEvent,
                            alias: eventAlias,
                        }
                    )
                })
                cy.wait(2000)
            }
        })
    }
)

Cypress.Commands.add(
    "createCustomer",
    (
        password: string,
        customerAddress: CustomerAddress,
        session: Session | Alias<string>,
        viper: Viper | Alias<string>
    ) => {
        cy.inputType("password", password)
        cy.inputType("customer-phone", customerAddress.phone)
        cy.inputType("customer-address", customerAddress.address)
        cy.inputType("customer-city", customerAddress.city)
        cy.inputType("customer-province", customerAddress.province)
        cy.inputType("customer-zip-code", customerAddress.zip)
        cy.inputSelect("customer-country", customerAddress.country)
        cy.intercept("POST", `/api/customer/create-shopify`).as("customer-shopify")
        cy.intercept("POST", `/api/customer/create-access-token`).as("access-token")
        cy.intercept("POST", `/api/customer/create-address`).as("create-address")
        cy.intercept("PUT", `/api/customer/update-viper`).as("update-viper")
        cy.clickButton("create-customer", "Create Customer")
        cy.isAliasObject(session).then((session: Session) => {
            const [firstName, lastName] = session.name.split(" ")
            cy.wait("@customer-shopify").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/customer/create-shopify`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: {
                            email: session.email,
                            password: password,
                            phone: customerAddress.phone,
                            firstName: firstName,
                            lastName: lastName,
                        },
                        reqKeys: ["email", "password", "phone", "firstName", "lastName"],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: responseNewCustomerKeys,
                    },
                    {
                        source: "shopify",
                    },
                    {
                        body: "response",
                        propKeys: {
                            reqKey: "customer.id",
                            objKey: "customerId",
                        },
                        object: responseCustomerShopify,
                        objPath: "shopify",
                        alias: "responseCustomerShopify",
                    }
                )
            })
            cy.wait("@access-token").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/customer/create-access-token`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: {
                            email: session.email,
                            password: password,
                        },
                        reqKeys: ["email", "password"],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: ["accessTokenUserErrors", "customerAccessToken"],
                    },
                    {
                        source: "shopify",
                    },
                    {
                        body: "response",
                        propKeys: {
                            reqKey: "customerAccessToken.accessToken",
                            objKey: "customerAccessToken",
                        },
                        object: "@responseCustomerShopify",
                        objPath: "shopify",
                    }
                )
            })

            cy.wait("@create-address").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/customer/create-address`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "POST",
                        reqBody: [
                            { firstName: firstName, lastName: lastName },
                            { address: customerAddress },
                            "@responseCustomerShopify",
                        ],
                        reqKeys: [
                            "firstName",
                            "lastName",
                            "address",
                            ...responseCustomerShopifyKeys,
                        ],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: responseCustomerAddressKeys,
                    },
                    {
                        source: "shopify",
                    }
                )
            })

            cy.wait("@update-viper").then((interception: Interception) => {
                cy.verifyInterceptionRequestAndResponse(
                    interception,
                    {
                        reqUrl: `/api/customer/update-viper`,
                        reqHeaders: {
                            "content-type": content_type,
                        },
                        reqMethod: "PUT",
                        reqBody: [
                            { _id: session._id },
                            "@responseCustomerShopify",
                            { address: customerAddress },
                        ],
                        reqKeys: [..._idKey, ...responseCustomerShopifyKeys, "address"],
                    },
                    {
                        resStatus: 200,
                        resHeaders: {
                            "content-type": content_type,
                        },
                        resKeys: viperKeys,
                        resBody: viper,
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    },

                    {
                        body: "request",
                        propKeys: [
                            {
                                reqKey: "shopify",
                                objKey: "shopify",
                            },
                            {
                                reqKey: "address",
                                objKey: "address",
                            },
                        ],
                        object: viper,
                    }
                )
            })

            cy.apiRequestAndResponse(
                {
                    url: `/api/viper/${session._id}`,
                    headers: {
                        "content-type": content_type,
                    },
                    method: "GET",
                },
                {
                    status: 200,
                    expectResponse: {
                        keys: viperKeys,
                        object: viper,
                    },
                }
            )
            cy.apiRequestAndResponse(
                {
                    url: "/api/auth/session",
                    method: "GET",
                    headers: {
                        "content-type": content_type,
                    },
                },
                {
                    status: 200,
                    expectResponse: {
                        keys: sessionKeys,
                        object: "@responseCustomerShopify",
                        path: "user",
                    },
                    build: {
                        object: session,
                    },
                }
            )
        })
    }
)

Cypress.Commands.add("checkCollectionEventCard", (event: EventInterface | Alias<string>) => {
    cy.isAliasObject(event).then((event: EventInterface) => {
        cy.dataInImage("event-image", event.image)
        cy.dataInContainer("event-title", event.title)
        cy.dataInContainer("event-location", event.location)
        const checkDate = format(new Date(event.date.split("T")[0]), "MMM do, yyyy")
        cy.dataInContainer("event-date", checkDate)
    })
})

Cypress.Commands.add(
    "checkCommentCardComponent",
    (viper: Viper | ViperBasicProps | Session, blog: MyBlog, request?: string) => {
        const value = request ? request : blog.content
        cy.dataInImage("blog-viper-image", viper.image)
        cy.dataInContainer("blog-viper-name", viper.name)
        cy.dataInContainer("comment-timestamp", format(blog.timestamp, "MMM d, yyyy"))
        cy.getByData("blog-comment").eq(0).should("contain", value)
        cy.getByData("like-blog").should("exist").and("be.visible")
        cy.dataInContainer("like-count", blog.likes.length.toString())
        cy.getByData("comment-blog").should("exist").and("be.visible")
        cy.dataInContainer("blog-comment-count", blog.comments.length.toString())
    }
)

Cypress.Commands.add(
    "participateEvent",
    (event: EventInterface | Alias<string>, viper: Viper | Alias<string>) => {
        const viperAlias = typeof viper === "string" ? viper.replace(/@/g, "") : `${viper}`
        cy.isAliasObject(event).then((event: EventInterface) => {
            cy.isAliasObject(viper).then((viper: Viper) => {
                cy.url().should("contain", `${event._id}`)
                cy.buildObjectProperties(
                    event,
                    { product: rawProduct },
                    {
                        propKeys: {
                            reqKey: "product",
                            objKey: "product",
                        },
                        alias: "selectedProduct",
                    }
                )

                cy.intercept("POST", `/api/shopify/create-checkout`).as("create-checkout")
                cy.intercept("POST", `/api/customer/associate-checkout`).as("associate-checkout")
                cy.intercept("PUT", `/api/event/request-participation`).as("request-participation")
                cy.clickButton("participate-checkout", "Participate")

                cy.wait("@create-checkout").then((interception: Interception) => {
                    cy.verifyInterceptionRequestAndResponse(
                        interception,
                        {
                            reqUrl: `/api/shopify/create-checkout`,
                            reqHeaders: {
                                "content-type": content_type,
                            },
                            reqMethod: "POST",
                            reqBody: ["@selectedProduct", { email: viper.email }],
                            reqKeys: ["product", "email"],
                        },
                        {
                            resStatus: 200,
                            resHeaders: {
                                "content-type": content_type,
                            },
                            resKeys: responseCheckoutCreateKeys,
                        },
                        {
                            source: "shopify",
                        },
                        {
                            body: "response",
                            propKeys: {
                                reqKey: "checkout.id",
                                objKey: "checkoutId",
                            },
                            object: responseCheckoutId,
                            alias: "responseCheckoutId",
                        }
                    )
                })

                cy.wait("@associate-checkout").then((interception: Interception) => {
                    cy.verifyInterceptionRequestAndResponse(
                        interception,
                        {
                            reqUrl: `/api/customer/associate-checkout`,
                            reqHeaders: {
                                "content-type": content_type,
                            },
                            reqMethod: "POST",
                            reqBody: ["@responseCheckoutId", "@responseCustomerShopify"],
                            reqKeys: ["checkoutId", ...responseCustomerShopifyKeys],
                        },
                        {
                            resStatus: 200,
                            resHeaders: {
                                "content-type": content_type,
                            },
                            resKeys: responseCheckoutCustomerAssociateKeys,
                        },
                        {
                            source: "shopify",
                        },
                        {
                            body: "response",
                            propKeys: {
                                reqKey: "associateCheckout.webUrl",
                                objKey: "webUrl",
                            },
                            object: responseCheckoutWebUrl,
                            alias: "responseCheckoutWebUrl",
                        }
                    )
                })

                cy.wait("@request-participation").then((interception: Interception) => {
                    cy.verifyInterceptionRequestAndResponse(
                        interception,
                        {
                            reqUrl: `/api/event/request-participation`,
                            reqHeaders: {
                                "content-type": content_type,
                            },
                            reqMethod: "PUT",
                            reqBody: [
                                {
                                    viper: { _id: viper._id },
                                },

                                {
                                    event: { _id: event._id },
                                },
                                "@responseCheckoutId",
                            ],
                            reqKeys: ["viper", "event", "checkoutId"],
                        },
                        {
                            resStatus: 200,
                            resHeaders: {
                                "content-type": content_type,
                            },
                            resKeys: viperKeys,
                            resBody: viper,
                        },
                        {
                            source: "mongodb",
                            action: "edit",
                        },
                        {
                            body: "request",
                            propKeys: [
                                {
                                    reqKey: "event._id",
                                    objKey: "_id",
                                },
                                {
                                    reqKey: "checkoutId",
                                    objKey: "checkoutId",
                                },
                            ],
                            object: viper,
                            objPath: "myEvents.collection[0]",
                            alias: viperAlias,
                        }
                    )
                })
                cy.get<ID>("@responseCheckoutWebUrl").then((checkout: ID) => {
                    cy.clickButton("participate-payment", "VIPER GO", checkout.webUrl)
                    cy.pause()
                })
            })
        })
    }
)

Cypress.Commands.add("claimEventCard", (event: EventInterface | Alias<string>, viper: _ID) => {
    const eventAlias = typeof event === "string" ? event.replace(/@/g, "") : `${event}`
    cy.isAliasObject(event).then((event: EventInterface) => {
        cy.intercept(`/api/event/claim-card`).as("claim-card")
        cy.clickButton("participate-claim", "CLAIM CARD")

        cy.wait("@claim-card").then((interception) => {
            cy.verifyInterceptionRequestAndResponse(
                interception,
                {
                    reqUrl: `/api/event/claim-card`,
                    reqHeaders: {
                        "content-type": content_type,
                    },
                    reqMethod: "POST",
                    reqBody: [{ event: { _id: event._id } }, { viper: viper }],
                    reqKeys: ["event", "viper"],
                },
                {
                    resStatus: 200,
                    resHeaders: {
                        "content-type": content_type,
                    },
                    resKeys: eventKeys,
                    resBody: event,
                },
                {
                    source: "mongodb",
                    action: "edit",
                },
                {
                    body: "request",
                    propKeys: {
                        reqKey: "viper._id",
                        objKey: "_id",
                    },
                    object: event,
                    objPath: "participants",
                    alias: eventAlias,
                }
            )
        })
        cy.wait(1000)
        cy.dataInContainer("viper", "ViPER")
    })
})

Cypress.Commands.add("likeCommentCard", (blog: MyBlog, profiles: (Viper | Alias<string>)[]) => {
    const regex = /\/[a-f\d]{24}$/
    cy.intercept("POST", `/api/viper/blog/like`).as("like-blog")
    cy.getByData("like-blog").eq(0).click()

    cy.url().then((url) => {
        cy.get<Session>("@session").then((session: Session) => {
            if (regex.test(url)) {
                const id = url.split("/").pop()
                cy.wrap<LikeBlog>(requestLikeBlog)
                    .then((likeRequest: LikeBlog) => {
                        likeRequest._id = blog._id
                        likeRequest.blogOwner_id = id
                        likeRequest.viper_id = session._id
                        return likeRequest
                    })
                    .as("requestLikeBlog")
            } else {
                cy.wrap<LikeBlog>(requestLikeBlog)
                    .then((likeRequest: LikeBlog) => {
                        likeRequest._id = blog._id
                        likeRequest.blogOwner_id = session._id
                        likeRequest.viper_id = session._id
                        return likeRequest
                    })
                    .as("requestLikeBlog")
            }
        })

        const blogOwner = profiles[0]
        const viper = profiles[1]
        cy.wait("@like-blog").then((interception: Interception) => {
            cy.verifyInterceptionRequestAndResponse(
                interception,
                {
                    reqUrl: `/api/viper/blog/like`,
                    reqHeaders: {
                        "content-type": content_type,
                    },
                    reqMethod: "POST",
                    reqBody: "@requestLikeBlog",
                    reqKeys: [...requestLikeBlogKeys, "timestamp"],
                },
                {
                    resStatus: 200,
                    resHeaders: {
                        "content-type": content_type,
                    },
                    resKeys: [viperKeys, viperKeys],
                    resBody: [blogOwner, viper],
                },
                [
                    {
                        source: "mongodb",
                        action: "edit",
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    },
                ],
                [
                    {
                        body: "request",
                        propKeys: {
                            reqKey: "viper_id",
                            objKey: "_id",
                        },
                        object: blogOwner,
                        objPath: `blog.myBlog[0].likes[0]`,
                    },
                    {
                        body: "request",
                        propKeys: [
                            {
                                reqKey: "blogOwner_id",
                                objKey: "blogOwner_id",
                            },
                            {
                                reqKey: "_id",
                                objKey: "_id",
                            },
                            {
                                reqKey: "viper_id",
                                objKey: "viper_id",
                            },
                            {
                                reqKey: "timestamp",
                                objKey: "timestamp",
                            },
                        ],
                        object: viper,
                        objPath: "blog.likes[0]",
                    },
                ]
            )
        })
    })
})

Cypress.Commands.add(
    "handleBuildProperty",
    (
        body: BodyType,
        buildProperty: {
            propKeys:
                | {
                      reqKey: string
                      objKey: string
                  }
                | {
                      reqKey: string
                      objKey: string
                  }[]
            realObject: object | Alias<string> | (object | Alias<string>)[]
            expectProperty: "response" | "request"
            objPath?: string | (string | undefined)[]
            alias?: string | (string | undefined)[]
        }
    ) => {
        const { propKeys, realObject, expectProperty, objPath, alias } = buildProperty

        if (expectProperty === "response") {
            cy.handleAndExpectKeys(body, propKeys)
        }

        const isObjectArray = Array.isArray(realObject)
        const isAliasArray = Array.isArray(alias)
        const isPathArray = Array.isArray(objPath)

        if (isObjectArray && isAliasArray && isPathArray) {
            for (let i = 0; i < realObject.length && alias.length && objPath.length; i++) {
                const object = realObject[i]
                const objAlias = alias[i]
                const path = objPath[i]
                const wrapProperties = { propKeys, objPath: path, alias: objAlias }
                cy.buildObjectProperties(body, object, wrapProperties)
            }
        } else if (isObjectArray && isAliasArray && !isPathArray) {
            for (let i = 0; i < realObject.length && alias.length; i++) {
                const object = realObject[i]
                const objAlias = alias[i]
                const path = objPath
                const wrapProperties = { propKeys, objPath: path, alias: objAlias }
                cy.buildObjectProperties(body, object, wrapProperties)
            }
        } else if (!isObjectArray && !isAliasArray && !isPathArray) {
            const properties = { propKeys, objPath, alias }
            cy.buildObjectProperties(body, realObject, properties)
        } else if (isObjectArray && !alias && !isPathArray) {
            const properties = { propKeys, objPath }
            cy.buildObjectProperties(body, realObject, properties)
        }
    }
)

Cypress.Commands.add(
    "handleAndExpectKeys",
    (
        body: BodyType,
        propKeys: { reqKey: string; objKey: string } | { reqKey: string; objKey: string }[]
    ) => {
        if (Array.isArray(propKeys)) {
            propKeys.forEach((keyPair) => {
                const { reqKey, objKey } = keyPair
                const [parentKey, ...childKeys] = reqKey.split(".")
                if (childKeys.length) {
                    const childKey = childKeys.join(".")
                    expect(body[parentKey]).to.have.deep.property(childKey)
                } else {
                    expect(body).to.have.deep.property(parentKey)
                }
            })
        } else {
            const { reqKey, objKey } = propKeys
            const [parentKey, ...childKeys] = reqKey.split(".")
            if (childKeys.length) {
                const childKey = childKeys.join(".")
                expect(body[parentKey]).to.have.deep.property(childKey)
            } else {
                expect(body).to.have.deep.property(parentKey)
            }
        }
    }
)

Cypress.Commands.add(
    "buildObjectProperties",
    (
        body: BodyType,
        object: object | Alias<string>,
        properties: {
            propKeys?:
                | {
                      reqKey: string
                      objKey: string
                  }
                | {
                      reqKey: string
                      objKey: string
                  }[]
            objPath?: string
            alias?: string
        }
    ) => {
        const { propKeys, objPath, alias } = properties

        const objectProps = { propKeys, objPath }
        if (alias && typeof object === "object") {
            cy.wrap(object)
                .then((object) => {
                    cy.buildProps(body, object, objectProps)
                })
                .as(alias)
        } else {
            cy.isAliasObject(object).then((realObject) => {
                cy.buildProps(body, realObject, objectProps)
            })
        }
    }
)

Cypress.Commands.add("isAliasObject", (object: BodyType | Alias<string>) => {
    const result: any = {}

    if (typeof object === "string" && object.startsWith("@")) {
        cy.get(`${object}`).then((realObject) => {
            return realObject
        })
    } else if (typeof object === "object") {
        Object.keys(object).forEach((key) => {
            if (typeof object[key] === "string" && object[key].startsWith("@")) {
                cy.get(`${object[key]}`).then((realObj) => {
                    result[key] = realObj
                })
            } else if (
                typeof object[key] === "object" &&
                !Array.isArray(object[key]) &&
                object[key] !== null
            ) {
                cy.isAliasObject(object[key]).then((realObj) => {
                    result[key] = realObj
                })
            } else {
                result[key] = object[key]
            }
        })
        return cy.wrap(result)
    }
})

Cypress.Commands.add(
    "buildProps",
    (
        body: BodyType,
        object: object,
        properties: {
            propKeys?:
                | {
                      reqKey: string
                      objKey: string
                  }
                | {
                      reqKey: string
                      objKey: string
                  }[]
            objPath?: string | undefined
        }
    ) => {
        const { propKeys, objPath } = properties

        if (propKeys) {
            cy.handleKeys(body, object, propKeys, objPath)
        } else if (objPath) {
            if (isPathInTarget(object, objPath)) {
                cy.handlePath(object, objPath, body)
            } else {
                cy.handleObject(object, body)
            }
        } else {
            cy.handleObject(object, body)
        }
    }
)

Cypress.Commands.add(
    "handleKeys",
    (
        body: object,
        object: object,
        keys: { reqKey: string; objKey: string } | { reqKey: string; objKey: string }[],
        path: string | undefined
    ) => {
        const propertyValues: { [key: string]: any } = {}

        if (Array.isArray(keys)) {
            keys.forEach((keyPair) => {
                const { reqKey, objKey } = keyPair
                propertyValues[objKey] = _.get(body, reqKey)
            })
        } else {
            const { objKey, reqKey } = keys
            propertyValues[objKey] = _.get(body, reqKey)
        }
        if (path) {
            if (isPathInTarget(object, path)) {
                cy.handlePath(object, path, propertyValues)
            } else {
                const bodyValue = _.get(body, path)
                cy.handleObject(object, bodyValue)
            }
        } else {
            cy.handleObject(object, propertyValues)
        }
    }
)

Cypress.Commands.add("handlePath", (object: object, path: string, value: object) => {
    _.update(object, path, (currentValue) => {
        const action = Array.isArray(currentValue)
            ? _.concat(currentValue, value)
            : { ...currentValue, ...value }
        return action
    })
    return object
})

Cypress.Commands.add("handleObject", (object: object, value: object) => {
    Object.assign(object, value)
    return object
})

Cypress.Commands.add(
    "buildFullViper",
    (object: Session | ViperBasicProps | Organizer, alias: string) => {
        cy.apiRequestAndResponse(
            {
                url: `/api/viper/${object._id}`,
                headers: {
                    "content-type": content_type,
                },
                method: "GET",
            },
            {
                status: 200,
                expectResponse: {
                    keys: viperKeys,
                    object: object,
                },
                build: {
                    object: rawViper,
                    alias: alias,
                },
            }
        )
        cy.buildObjectProperties(object, rawViperId, {
            propKeys: {
                reqKey: "_id",
                objKey: "_id",
            },
            alias: `${alias}Id`,
        })
    }
)

Cypress.Commands.add(
    "editProfile",
    (requestEdit: ProfileEdit, viper: Viper | Alias<string>, _id: Hex24String) => {
        cy.inputType("new-name", requestEdit.name)
        cy.inputType("new-biography", requestEdit.biography)
        cy.inputSelect("new-location", requestEdit.location)
        cy.getByData("new-profile-image").selectFile([
            {
                contents: "cypress/fixtures/images/profile.jpg",
                fileName: "profile.jpg",
                mimeType: "image/jpg",
                lastModified: new Date("Feb 18 2023").valueOf(),
            },
        ])
        cy.getByData("accept-edit-image").click()

        cy.getByData("new-background-image").selectFile([
            {
                contents: "cypress/fixtures/images/woodstock.jpg",
                fileName: "woodstock.jpg",
                mimeType: "image/jpg",
                lastModified: new Date("Feb 18 2023").valueOf(),
            },
        ])
        cy.getByData("accept-edit-image").click()

        cy.intercept("PUT", "/api/viper/profile-image").as("profile-image")
        cy.intercept("PUT", "/api/viper/background-image").as("background-image")
        cy.intercept("PUT", `/api/viper/edit`).as("edit-viper")
        cy.clickButton("submit-button", "Edit")

        cy.wait("@profile-image").then((interception: Interception) => {
            const statusCode = interception.response!.statusCode
            const responseBody = interception.response!.body
            expect(statusCode).eq(200)
            expect(responseBody.data.url).to.be.a("string")

            cy.buildObjectProperties(responseBody, requestEdit, {
                propKeys: {
                    reqKey: "data.url",
                    objKey: "image",
                },
                alias: "requestEditProfile",
            })
        })
        cy.wait("@background-image").then((interception: Interception) => {
            const statusCode = interception.response!.statusCode
            const responseBody = interception.response!.body
            expect(statusCode).eq(200)
            expect(responseBody.bgData.url).to.be.a("string")
            cy.buildObjectProperties(responseBody, "@requestEditProfile", {
                propKeys: {
                    reqKey: "bgData.url",
                    objKey: "backgroundImage",
                },
            })
        })
        cy.wait("@edit-viper").then((interception: Interception) => {
            cy.verifyInterceptionRequestAndResponse(
                interception,
                {
                    reqUrl: `/api/viper/edit`,
                    reqHeaders: {
                        "content-type": content_type,
                    },
                    reqMethod: "PUT",
                    reqBody: [{ _id: _id }, "@requestEditProfile"],
                    reqKeys: [..._idKey, ...requestEditProfileKeys],
                },
                {
                    resStatus: 200,
                    resHeaders: {
                        "content-type": content_type,
                    },
                    resKeys: viperKeys,
                    resBody: viper,
                },
                {
                    source: "mongodb",
                    action: "edit",
                }
            )

            cy.apiRequestAndResponse(
                {
                    url: `/api/viper/${_id}`,

                    headers: {
                        "content-type": content_type,
                    },
                    method: "GET",
                },
                {
                    status: 200,
                    expectResponse: {
                        keys: viperKeys,
                        object: "@requestEditProfile",
                    },
                    build: {
                        object: viper,
                    },
                }
            )
            cy.wait(1000)
            cy.apiRequestAndResponse(
                {
                    url: "/api/auth/session",
                    method: "GET",
                    headers: {
                        "content-type": content_type,
                    },
                },
                {
                    status: 200,
                    expectResponse: {
                        keys: sessionKeys,
                        object: {
                            name: requestEditProfile.name,
                            biography: requestEditProfile.biography,
                            location: requestEditProfile.location,
                        },
                        path: "user",
                    },
                    build: {
                        object: "@session",
                    },
                }
            )
        })
    }
)

Cypress.Commands.add(
    "createBlog",
    (requestComment: string, _id: _ID, viper: Viper | Alias<string>) => {
        cy.clickButton("blog-button", "Let's Blog")
        cy.getByData("commentInput").should("exist")
        cy.inputType("add-comment", requestComment)
        cy.intercept("POST", `/api/viper/blog/create`).as("create-blog")
        cy.clickButton("post-blog", "Comment")
        cy.wait("@create-blog").then((interception: Interception) => {
            cy.verifyInterceptionRequestAndResponse(
                interception,
                {
                    reqUrl: `/api/viper/blog/create`,
                    reqHeaders: {
                        "content-type": content_type,
                    },
                    reqMethod: "POST",
                    reqBody: [_id, { content: requestComment }],
                    reqKeys: ["_id", "content"],
                },
                {
                    resStatus: 200,
                    resHeaders: {
                        "content-type": content_type,
                    },
                    resKeys: viperKeys,
                    resBody: viper,
                },
                {
                    source: "mongodb",
                    action: "edit",
                }
            )
        })
        cy.getByData("commentInput").should("not.exist")
    }
)

Cypress.Commands.add(
    "createEvent",
    (
        requestEvent: CreateEvent,
        organizer: Session | Alias<string>,
        viper: Viper | Alias<string>,
        eventAlias: string
    ) => {
        cy.inputType("title", requestEvent.title)
        cy.inputType("content", requestEvent.content)
        cy.inputSelect("category", requestEvent.category)
        cy.inputType("date", typeDate)
        cy.inputType("time", typeTime)
        cy.inputSelect("location", requestEvent.location)
        cy.inputType("address", requestEvent.address)
        cy.intercept("POST", "/api/event/create/upload-image").as("event-image")
        cy.getByData("image").selectFile([
            {
                contents: "cypress/fixtures/images/les-femmes.jpg",
                fileName: "les-femmes.jpg",
                mimeType: "image/jpg",
                lastModified: new Date("Feb 18 2023").valueOf(),
            },
        ])
        cy.inputType("price", `${requestEvent.price}`)
        cy.inputType("entries", `${requestEvent.entries}`)

        cy.intercept("POST", `/api/product/stage-upload`).as("stage-upload")
        cy.intercept("POST", `/api/product/create-shopify`).as("create-shopify")
        cy.intercept("POST", `/api/product/create-media`).as("product-media")
        cy.intercept("POST", `/api/product/publish-shopify`).as("publish-product")
        cy.intercept("POST", `/api/event/create/submit`).as("create-event")
        cy.clickButton("create-event", "Create Event")

        cy.isAliasObject(organizer).then((session: Session) => {
            cy.buildObjectProperties(session, requestEvent, {
                propKeys: [
                    { reqKey: "_id", objKey: "_id" },
                    { reqKey: "name", objKey: "name" },
                    { reqKey: "email", objKey: "email" },
                ],
                objPath: "organizer",
                alias: "requestCreateEvent",
            })

            cy.buildObjectProperties(session, requestProductShopify, {
                propKeys: {
                    reqKey: "_id",
                    objKey: "organizer",
                },
                alias: "requestProductShopify",
            })
        })

        cy.wait("@event-image").then((interception: Interception) => {
            const statusCode = interception.response!.statusCode
            const responseBody = interception.response!.body
            expect(statusCode).eq(200)
            expect(responseBody.data).to.exist
            cy.buildObjectProperties(responseBody, requestEventImage, {
                propKeys: {
                    reqKey: "data",
                    objKey: "data",
                },
                alias: "requestEventImage",
            })
            cy.buildObjectProperties(responseBody, "@requestCreateEvent", {
                propKeys: {
                    reqKey: "data.url",
                    objKey: "image",
                },
            })
        })
        cy.wait("@stage-upload").then((interception: Interception) => {
            cy.verifyInterceptionRequestAndResponse(
                interception,
                {
                    reqUrl: `/api/product/stage-upload`,
                    reqHeaders: {
                        "content-type": content_type,
                    },
                    reqMethod: "POST",
                    reqBody: "@requestEventImage",
                    reqKeys: requestEventImageKeys,
                },
                {
                    resStatus: 200,
                    resHeaders: {
                        "content-type": content_type,
                    },
                    resKeys: responseStageUploadKeys,
                },
                {
                    source: "shopify",
                },
                {
                    body: "response",
                    propKeys: {
                        reqKey: `stageUpload.resourceUrl`,
                        objKey: `resourceUrl`,
                    },
                    object: ["@requestProductShopify", requestProductMedia],
                    alias: [undefined, "requestProductMedia"],
                }
            )
        })
        cy.wait("@create-shopify").then((interception: Interception) => {
            cy.verifyInterceptionRequestAndResponse(
                interception,
                {
                    reqUrl: `/api/product/create-shopify`,
                    reqHeaders: {
                        "content-type": content_type,
                    },
                    reqMethod: "POST",
                    reqBody: "@requestProductShopify",
                    reqKeys: requestProductShopifyKeys,
                },
                {
                    resStatus: 200,
                    resHeaders: {
                        "content-type": content_type,
                    },
                    resKeys: ["product"],
                },
                {
                    source: "shopify",
                },
                {
                    body: "response",
                    propKeys: [
                        {
                            reqKey: "product._id",
                            objKey: "_id",
                        },
                        {
                            reqKey: "product.variant_id",
                            objKey: "variant_id",
                        },
                    ],
                    object: [
                        { product: rawProduct },
                        "@requestProductMedia",
                        "@requestCreateEvent",
                    ],
                    objPath: "product",
                    alias: ["eventProduct", undefined, undefined],
                }
            )
        })

        cy.wait("@product-media").then((interception: Interception) => {
            cy.verifyInterceptionRequestAndResponse(
                interception,
                {
                    reqUrl: `/api/product/create-media`,
                    reqHeaders: {
                        "content-type": content_type,
                    },
                    reqMethod: "POST",
                    reqBody: "@requestProductMedia",
                    reqKeys: requestProductMediaKeys,
                },
                {
                    resStatus: 200,
                    resHeaders: {
                        "content-type": content_type,
                    },
                    resKeys: responseProductMediaKeys,
                    resBody: responseProductMedia,
                },
                {
                    source: "shopify",
                }
            )
        })

        cy.wait("@publish-product").then((interception: Interception) => {
            cy.verifyInterceptionRequestAndResponse(
                interception,
                {
                    reqUrl: `/api/product/publish-shopify`,
                    reqHeaders: {
                        "content-type": content_type,
                    },
                    reqMethod: "POST",
                    reqBody: "@eventProduct",
                    reqKeys: ["product"],
                },
                {
                    resStatus: 200,
                    resHeaders: {
                        "content-type": content_type,
                    },
                    resKeys: responsePublishProductKeys,
                    resBody: responsePublishProduct,
                },
                {
                    source: "shopify",
                }
            )
        })

        cy.wait("@create-event").then((interception: Interception) => {
            cy.verifyInterceptionRequestAndResponse(
                interception,
                {
                    reqUrl: `/api/event/create/submit`,
                    reqHeaders: {
                        "content-type": content_type,
                    },
                    reqMethod: "POST",
                    reqBody: "@requestCreateEvent",
                    reqKeys: requestCreateEventKeys,
                },
                {
                    resStatus: 200,
                    resHeaders: {
                        "content-type": content_type,
                    },
                    resKeys: [responseNewEventKeys, viperKeys],
                    resBody: [undefined, viper],
                },
                [
                    {
                        source: "mongodb",
                        action: "create",
                    },
                    {
                        source: "mongodb",
                        action: "edit",
                    },
                ],
                [
                    {
                        body: "response",
                        propKeys: {
                            reqKey: "insertedId",
                            objKey: "_id",
                        },
                        object: rawEventId,
                        alias: `${eventAlias}Id`,
                    },
                    null,
                ]
            )
        })

        cy.get<_ID>(`@${eventAlias}Id`).then((createdEvent: _ID) => {
            cy.buildObjectProperties(createdEvent, viper, {
                propKeys: {
                    reqKey: "_id",
                    objKey: "_id",
                },
                objPath: "myEvents.created[0]",
            })

            cy.apiRequestAndResponse(
                {
                    url: `/api/event/${createdEvent._id}`,
                    headers: {
                        "content-type": content_type,
                    },
                    method: "GET",
                },
                {
                    status: 200,
                    expectResponse: {
                        keys: eventKeys,
                        object: "@requestCreateEvent",
                    },
                    build: {
                        object: rawEvent,
                        alias: eventAlias,
                    },
                }
            )
        })
    }
)

Cypress.Commands.add("buildFullEvent", (event: ID, alias: string) => {
    cy.apiRequestAndResponse(
        {
            url: `/api/event/${event._id}`,
            headers: {
                "content-type": content_type,
            },
            method: "GET",
        },
        {
            status: 200,
            expectResponse: {
                keys: eventKeys,
                object: event,
            },
            build: {
                object: rawEvent,
                alias: alias,
            },
        }
    )
})
