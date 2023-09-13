// reference code is written like below to avoid the clash in mocha types.
// in most of the cases, simple <reference types="cypress" /> will do.
/// <reference path="../../../node_modules/cypress/types/cy-blob-util.d.ts" />
/// <reference path="../../../node_modules/cypress/types/cy-bluebird.d.ts" />
/// <reference path="../../../node_modules/cypress/types/cy-minimatch.d.ts" />
/// <reference path="../../../node_modules/cypress/types/lodash/index.d.ts" />
/// <reference path="../../../node_modules/cypress/types/sinon/index.d.ts" />
/// <reference path="../../../node_modules/cypress/types/jquery/index.d.ts" />
/// <reference path="../../../node_modules/cypress/types/cypress.d.ts" />
/// <reference path="../../../node_modules/cypress/types/cypress-type-helpers.d.ts" />
/// <reference path="../../../node_modules/cypress/types/cypress-global-vars.d.ts" />

declare namespace Cypress {
    interface Chainable<Subject = any> {
        getByData(selector: string): Cypress.Chainable

        dataInContainer(selector: string, value: string): Cypress.Chainable

        dataInImage(selector: string, src: string): Cypress.Chainable

        clickButton(selector: string, contains: string, href?: string): Cypress.Chainable

        navigate(selector: string, contains: string, href: string): Cypress.Chainable

        inputType(selector: string, value: string): Cypress.Chainable

        inputSelect(selector: string, value: string): Cypress.Chainable

        signInWithCredential(
            username: string,
            password: string,
            sessionAlias: string,
            viperAlias: string
        ): Cypress.Chainable

        apiRequestAndResponse(
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
        ): Cypress.Chainable

        expectBodyKeyEqualObjectKey(
            body: BodyType,
            object: object | Alias<string>,
            path?: string
        ): void

        checkProfileComponent(
            viper: Viper | ViperBasicProps | Alias<string>,
            button: "Edit Profile" | "Follow" | "Following"
        )

        buildEventFromUrl(alias: string): Cypress.Chainable

        likeEvent(resBody: (EventInterface | Alias<string>) & (Viper | Alias<string>)[])

        commentEvent(requestComment: string, event: EventInterface | Alias<string>, viper: _ID)

        checkEventCommentCard(session: Session | Alias<string>, comment: Comments, title: string)

        likeEventCommentCard(viper: _ID, event: EventInterface | Alias<string>)

        displayViper(viper: Session | ViperBasicProps)

        addFollow(currentViper: Viper | Alias<string>, viper: Viper | Alias<string>)

        verifyInterceptionRequestAndResponse(
            interception: Interception,
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
        ): Cypress.Chainable

        expectInterceptionEqualRequestOptions(
            interception: Interception,
            requestOptions: {
                reqUrl: string
                reqHeaders: object
                reqMethod: string
                reqBody: object | Alias<string> | (object | Alias<string>)[]
                reqKeys: (string | number)[]
            }
        ): void

        expectMongoDBResponse(response: Response, action?: "edit" | "create")

        checkEventComponentProps(event: EventInterface | Alias<string>): Cypress.Chainable

        checkEventCard(
            event: EventInterface | Alias<string>,
            editEvent?: EditEvent
        ): Cypress.Chainable

        createCustomer(
            password: string,
            customerAddress: CustomerAddress,
            session: Session | Alias<string>,
            viper: Viper | Alias<string>
        )

        checkCollectionEventCard(event: EventInterface | Alias<string>): Cypress.Chainable

        checkCommentCardComponent(
            viper: Viper | ViperBasicProps | Session,
            blog: MyBlog,
            request?: string
        )

        participateEvent(event: EventInterface | Alias<string>, viper: Viper | Alias<string>)

        claimEventCard(event: EventInterface | Alias<string>, viper: _ID)

        likeCommentCard(blog: MyBlog, profiles: (Viper | Alias<string>)[])

        handleBuildProperty(
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
        )

        handleAndExpectKeys(
            body: BodyType,
            propKeys: { reqKey: string; objKey: string } | { reqKey: string; objKey: string }[]
        )

        buildObjectProperties(
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
        )

        isAliasObject(object: BodyType | Alias<string>): Cypress.Chainable

        buildProps(
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
        )

        handleKeys(
            body: object,
            object: object,
            keys: { reqKey: string; objKey: string } | { reqKey: string; objKey: string }[],
            path: string | undefined
        )

        handlePath(object: object, path: string, value: object)

        handleObject(object: object, value: object)

        buildFullViper(object: Session | ViperBasicProps | Organizer, alias: string)

        editProfile(requestEdit: ProfileEdit, viper: Viper | Alias<string>, _id: Hex24String)

        createBlog(requestComment: string, _id: _ID, viper: Viper | Alias<string>)

        createEvent(
            requestEvent: CreateEvent,
            organizer: Session | Alias<string>,
            viper: Viper | Alias<string>,
            eventAlias: string
        )
        buildFullEvent(event: ID, alias: string)
        // =================
    }
    interface ApplicationWindow {
        // let TS know the application's code will add
        // method window.add with the following signature
        add(a: number, b: number): number
    }
}
