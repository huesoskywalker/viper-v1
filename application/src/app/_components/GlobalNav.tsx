'use client';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { GlobalNavItem } from './GlobalNavItem';
import { data } from '../../lib/getNavData';

export function GlobalNav() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div className="fixed top-0 z-10 flex w-full flex-col border-b border-gray-800 bg-black lg:bottom-0 lg:z-auto lg:w-40 lg:border-b-0 lg:border-r lg:border-gray-800">
      <div className="flex h-14 items-center px-4 py-4 lg:h-auto">
        <Link
          href="/"
          className="group flex w-full items-center gap-x-2.5"
          onClick={close}
        >
          {/* Should add a logo in here */}
          <h3 className="font-semibold tracking-wide text-gray-400 group-hover:text-gray-50">
            v<span className="text-yellow-300/80 hover:text-yellow-300">i</span>
            per
          </h3>
        </Link>
      </div>
      <button
        type="button"
        className="group absolute right-0 top-0 flex h-14 items-center gap-x-2 px-4 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-medium text-gray-100 group-hover:text-gray-400">
          Menu
        </div>
        {isOpen ? (
          <XMarkIcon className="block w-6 text-gray-400" />
        ) : (
          <Bars3Icon className="block w-6 text-gray-400" />
        )}
      </button>

      <div
        className={clsx('overflow-y-auto lg:static lg:block', {
          'fixed inset-x-0 bottom-0 top-14 mt-px bg-black': isOpen,
          hidden: !isOpen,
        })}
      >
        {status !== 'unauthenticated' ? (
          <nav className="space-y-6 px-2 pb-24 pt-5">
            {data.map((item) => (
              <GlobalNavItem
                key={item.slug}
                item={item}
                viperName={session?.user.name}
              />
            ))}
            {session || status === 'loading' ? (
              <li>
                <Link
                  href="/"
                  onClick={() => signOut()}
                  className="block rounded-md px-3 py-2  text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                >
                  Sign out
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  href="#"
                  onClick={() => signIn()}
                  className="block rounded-md px-3 py-2  text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                >
                  Sign in
                </Link>
              </li>
            )}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
