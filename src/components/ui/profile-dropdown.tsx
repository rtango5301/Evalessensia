'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface User {
  name: string;
  role: string;
  avatarUrl?: string;
  email?: string;
}

interface ProfileDropdownProps {
  user: User;
  onLogout?: () => void;
}

/**
 * Extracts initials from a user's name for avatar fallback.
 * Takes first letter of first name and first letter of last name.
 */
function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function ProfileDropdown({ user, onLogout }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click-outside detection to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout?.();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center size-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:ring-offset-2 transition-all"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Open profile menu"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`${user.name}'s avatar`}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <div className="size-8 rounded-full bg-[#135bec] flex items-center justify-center text-white text-xs font-semibold">
            {getInitials(user.name)}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info Header */}
          <div className="px-3 py-2 border-b border-slate-200">
            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
            {user.email && <p className="text-xs text-slate-500 truncate">{user.email}</p>}
            <p className="text-xs text-slate-400 mt-0.5">{user.role}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50',
                'transition-colors'
              )}
              role="menuitem"
            >
              <span className="material-symbols-outlined text-base">settings</span>
              Settings
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 my-1" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm w-full text-left',
              'text-red-600 hover:bg-red-50 transition-colors'
            )}
            role="menuitem"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
