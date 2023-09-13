"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import { data } from "../../lib/getNavData"
import Link from "next/link"
import { GlobalNavItem } from "./GlobalNavItem"

export default function GlobalNav() {
    const { data: session, status } = useSession()

    if (status === "unauthenticated") {
        return (
            <div className="fixed top-0 flex z-10 xl:w-48 flex-col border-b border-gray-800 bg-black lg:bottom-0 lg:z-10 lg:w-40 md:w-32 lg:border-r lg:border-gray-800">
                <div className="flex h-14 items-center py-4 px-4 lg:h-auto">
                    <Link
                        href="#"
                        data-test="signIn"
                        onClick={() => signIn()}
                        className="group flex w-full items-center space-x-2.5"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="rgba(255, 255, 128, 0.8)"
                            className="w-5 h-5 text-gray-400"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.606 12.97a.75.75 0 01-.134 1.051 2.494 2.494 0 00-.93 2.437 2.494 2.494 0 002.437-.93.75.75 0 111.186.918 3.995 3.995 0 01-4.482 1.332.75.75 0 01-.461-.461 3.994 3.994 0 011.332-4.482.75.75 0 011.052.134z"
                                clipRule="evenodd"
                            />
                            <path
                                fillRule="evenodd"
                                d="M5.752 12A13.07 13.07 0 008 14.248v4.002c0 .414.336.75.75.75a5 5 0 004.797-6.414 12.984 12.984 0 005.45-10.848.75.75 0 00-.735-.735 12.984 12.984 0 00-10.849 5.45A5 5 0 001 11.25c.001.414.337.75.751.75h4.002zM13 9a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <h3 className="font-semibold tracking-wide text-gray-400 group-hover:text-gray-50">
                            <span className="Work in progress">Sign in</span>
                        </h3>
                    </Link>
                </div>
            </div>
        )
    }
    // if (!session) throw new Error("Something wrong bro")
    return (
        <div className="fixed top-0 z-100 flex xl:w-44 bottom-0 flex-col border-b border-gray-800 bg-black lg:bottom-0 lg:z-auto lg:w-40 md:w-32 lg:border-r lg:border-gray-800">
            <div className="group flex h-14 items-center py-4 px-4 lg:h-auto">
                <Link
                    data-test="viper"
                    href="/"
                    className=" flex w-full items-center space-x-2.5 font-semibold tracking-wide text-gray-400 group-hover:text-gray-50"
                    // onClick={close}
                >
                    {/* <ViperLogo /> */}v
                    <span className="text-yellow-300/80 hover:text-yellow-300">i</span>
                    per
                </Link>
            </div>
            <div
                className="overflow-y-auto lg:static lg:block"
                // className={clsx('overflow-y-auto lg:static lg:block', {
                //   'fixed inset-x-0 bottom-0 top-14 mt-px bg-black': isOpen,
                //   hidden: !isOpen,
                // })}
            >
                <nav className="space-y-6 px-2 py-5">
                    {data.map((item) => (
                        <GlobalNavItem
                            key={item.slug}
                            item={item}
                            viperName={session?.user.name}
                        />
                    ))}
                    {status === "loading" ? (
                        <li>
                            <Link
                                href="#"
                                onClick={() => signIn()}
                                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                            >
                                <span className="opacity-80 animate-pulse">Sign out</span>
                            </Link>
                        </li>
                    ) : session ? (
                        <li>
                            <Link
                                href="/"
                                onClick={() => signOut()}
                                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                            >
                                Sign out
                            </Link>
                        </li>
                    ) : (
                        <li>
                            <Link
                                href="#"
                                onClick={() => signIn()}
                                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                            >
                                Sign in
                            </Link>
                        </li>
                    )}
                </nav>
            </div>
        </div>
    )
}
