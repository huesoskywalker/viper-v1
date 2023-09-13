import Image from "next/image"
import React from "react"

const DisplayImage = ({
    displayImage,
    createObjectURL,
    displaySelectedImage,
    handleAcceptImage,
}: {
    displayImage: boolean
    createObjectURL: string
    displaySelectedImage: string
    handleAcceptImage: () => void
}) => {
    return (
        <div>
            {displayImage ? (
                <div className="fixed top-60 left-50 z-10">
                    <div className="flex justify-start">
                        <button
                            data-test="accept-edit-image"
                            onClick={handleAcceptImage}
                            className="fixed rounded-full bg-black z-10"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5 text-yellow-300 hover:text-yellow-300/80"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        {displaySelectedImage === "image" ? (
                            <Image
                                src={createObjectURL}
                                className={`max-h-24 max-w-24 hidden rounded-full border-solid border-2 border-yellow-600 lg:block`}
                                alt={createObjectURL}
                                width={100}
                                height={100}
                                placeholder="blur"
                                blurDataURL={createObjectURL}
                                loading="lazy"
                            />
                        ) : displaySelectedImage === "backgroundImage" ? (
                            <Image
                                src={createObjectURL}
                                className={`max-h-32 max-w-auto hidden rounded-full border-solid border-2 border-yellow-600 lg:block `}
                                alt={createObjectURL}
                                width={580}
                                height={100}
                                placeholder="blur"
                                blurDataURL={createObjectURL}
                                loading="lazy"
                            />
                        ) : displaySelectedImage === "file" ? (
                            // Check if this file (needed for shopify) works fine
                            // It is the eventImage
                            // mostly for the wrap of the div
                            <Image
                                src={createObjectURL}
                                alt={createObjectURL}
                                height={400}
                                width={400}
                                loading="lazy"
                                className="hidden rounded-lg  lg:block max-h-36 max-w-auto object-cover object-center"
                            />
                        ) : null}
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default DisplayImage
