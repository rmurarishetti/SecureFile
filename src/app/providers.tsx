// app/providers.tsx
'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';

/**
 * Root providers wrapper component
 * Configures Auth0 authentication context for the application
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to be wrapped with Auth0
 * @returns {JSX.Element} Auth0 provider wrapped around children
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}