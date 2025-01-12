// components/dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Upload, History, LogOut } from 'lucide-react';
import Logo from '../Logo';

const navItems = [
  { href: '/dashboard', label: 'Upload File', icon: Upload },
  { href: '/dashboard/history', label: 'Scan History', icon: History },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-black/40 backdrop-blur-xl border-r border-gray-800">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Logo />
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