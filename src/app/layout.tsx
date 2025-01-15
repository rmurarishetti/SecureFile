// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from './providers';

const inter = Inter({ subsets: ["latin"] });

/**
 * Application metadata configuration
 * Defines SEO and PWA-related properties
 */
export const metadata: Metadata = {
  title: "SecureFile",
  description: "Secure File Scanning Platform",
  icons: {
    icon: [
      {
        url: '/logo.svg',
        href: '/logo.svg',
      }
    ]
  }
};

/**
 * Root layout component that wraps all pages
 * Implements HTML structure, theme support, and global font
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @returns {JSX.Element} Root HTML structure with theme and font support
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white dark:bg-black`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}