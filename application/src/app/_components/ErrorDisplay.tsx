import { ErrorDisplayProps } from "@/types/error"
import React from "react"

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ name, message }) => {
    return (
        <div className="flex flex-col items-center justify-center mt-10">
            <div className="w-20 h-20 mb-4">
                <img src="/error.svg" alt="Error Icon" />
            </div>
            <div className="text-center">
                <h1 className="text-xl font-bold">
                    {name}
                    {/* : {status} */}
                </h1>
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    )
}

export default ErrorDisplay
