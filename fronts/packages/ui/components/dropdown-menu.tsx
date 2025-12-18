'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

export function DropdownMenu({ children, trigger, align = 'end' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-2 z-50 min-w-[12rem] overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg',
            align === 'start' && 'left-0',
            align === 'center' && 'left-1/2 -translate-x-1/2',
            align === 'end' && 'right-0'
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  destructive?: boolean;
}

export function DropdownMenuItem({
  children,
  icon,
  destructive,
  className,
  ...props
}: DropdownMenuItemProps) {
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none transition-colors hover:bg-gray-100',
        destructive && 'text-red-600 hover:bg-red-50',
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-gray-200" />;
}
