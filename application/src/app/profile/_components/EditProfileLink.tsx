import Link from "next/link"

export function EditProfileLink({ href }: { href: string }) {
    return (
        <>
            <div className="relative left-10 ">
                <Link
                    data-test="edit-profile"
                    href={href}
                    className="block row-end-4 rounded-md  px-3 py-2 text-sm font-medium text-yellow-600 hover:text-gray-300"
                >
                    Edit Profile
                </Link>
            </div>
        </>
    )
}
