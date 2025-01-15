// components/dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Upload, History, LogOut, User } from 'lucide-react';
import Logo from '../Logo';

/**
* Navigation items configuration for the sidebar
* Each item defines a route, label and associated icon
*/
const navItems = [
  { href: '/dashboard', label: 'Upload File', icon: Upload },
  { href: '/dashboard/history', label: 'Scan History', icon: History },
];

/**
* Props interface for the Sidebar component
*/
interface SidebarProps {
  name:string;
  email:string;
}

/**
* Dashboard sidebar component providing navigation and user info
* Features a fixed position sidebar with backdrop blur effect
*/
export default function DashboardSidebar({ name, email }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-black/40 backdrop-blur-xl border-r border-gray-800">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Logo />
      </div>
      
      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {name || 'User'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {email}
            </p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors
              ${pathname === href 
                ? 'text-white bg-white/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}

        <div className="absolute bottom-4 left-0 right-0 px-6">
          <Link
            href="/api/auth/logout"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </nav>
    </aside>
  );
}