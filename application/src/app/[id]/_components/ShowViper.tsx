"use client"
import { ReactNode, useState } from "react"
import { delay } from "../_lib/delay"

export default function ShowViper({
    viperName,
    event,
    blog,
    children,
}: {
    viperName: string
    event: boolean
    blog: boolean
    children: ReactNode
}) {
    const [isDisplay, setIsDisplay] = useState<boolean>(false)

    const displayOrganizer = async (): Promise<void> => {
        await delay(300)
        setIsDisplay(!isDisplay)
        await delay(100)
        setIsDisplay(true)
    }

    const closeOrganizer = async (): Promise<void> => {
        await delay(100)
        setIsDisplay(false)
    }
    return (
        <div
            data-test="show-viper"
            className="max-w-fit max-h-fit relative"
            onMouseLeave={closeOrganizer}
        >
            {event ? (
                <div
                    data-test="organizer-name"
                    className="relative grid grid-flow-row z-0 w-full h-full "
                >
                    <h1 className="text-gray-300 text-xs ">
                        Organized by:
                        <span className="text-yellow-700/80 text-xs px-1  hover:text-yellow-400 hover:underline">
                            <button
                                data-test="hover-organizer"
                                onMouseEnter={displayOrganizer}
                                className="max-h-fit max-w-fit"
                            >
                                {viperName}
                            </button>
                        </span>
                    </h1>
                </div>
            ) : blog ? null : (
                <div
                    data-test="commentator-name"
                    className="relative grid md:grid-flow-row z-0 w-full h-full p-0.5"
                >
                    <button
                        data-test="hover-blogger"
                        onMouseEnter={displayOrganizer}
                        className="max-h-fit max-w-fit font-normal flex justify-end text-yellow-800/90 text-xs  hover:text-yellow-400 "
                    >
                        <span data-test="blog-viperName">{viperName}</span>
                    </button>
                </div>
            )}

            {isDisplay ? (
                <div
                    data-test="display-viper"
                    className={
                        event
                            ? "absolute top-[1rem] left-[1rem] z-20 overflow-y-hidden  max-h-[14rem]"
                            : "absolute bottom-[0.7rem] left-[-1rem] z-20  overflow-y-hidden  max-h-[14rem]"
                    }
                >
                    <div className="flex items-center px-2 py-2">
                        <div
                            className=" w-[14rem] max-h-fit max-w-lg p-4 mx-auto bg-gray-800 border-[1px] border-gray-700 rounded-xl shadow-lg"
                            onMouseLeave={closeOrganizer}
                        >
                            {children}
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
