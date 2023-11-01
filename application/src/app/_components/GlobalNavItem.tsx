import { type Item } from '@/lib/getNavData';
import clsx from 'clsx';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

export function GlobalNavItem({
  item,
  viperName,
}: {
  item: Item;
  viperName: string | undefined;
}) {
  const segment = useSelectedLayoutSegment();
  const isActive = item.slug === segment;

  const profileName = viperName ? viperName : 'Welcome';

  return (
    <Link
      data-test="nav-item"
      href={`/${item.slug}`}
      className={clsx(
        'block rounded-md px-3 py-2 text-sm font-medium hover:text-gray-300 ',
        {
          'text-gray-400 hover:bg-gray-800': !isActive,
          'text-white': isActive,
        },
      )}
    >
      {item.name === 'Profile' ? profileName : item.name}
    </Link>
  );
}
