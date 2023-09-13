import Link from "next/link"
import UpdateProfileForm from "./UpdateProfileForm"

export default function UpdateProfile() {
    return (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center min-h-screen px-4 py-2 ">
                <div className="relative left-24 w-full max-w-lg p-3 mx-auto bg-gray-800 rounded-xl shadow-lg">
                    <div className="m-1 ">
                        <Link
                            href={`/profile`}
                            className="flex justify-start self-start w-fit text-gray-400 hover:text-red-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.7}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </Link>

                        <div className="flex justify-center">
                            <div className="w-full mx-6">
                                {/* <div className="grid grid-cols-1 gap-6"> */}
                                <UpdateProfileForm />
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
