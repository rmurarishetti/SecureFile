// app/dashboard/test/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function TestPage() {
  const { user, isLoading } = useUser();
  const [testData, setTestData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTestData() {
      try {
        const response = await fetch('/api/test');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Test failed');
        }
        
        setTestData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      }
    }

    if (user) {
      fetchTestData();
    }
  }, [user]);

  if (isLoading) {
    return <div className="p-4 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Auth Test Page</h1>
      
      <div className="space-y-6">
        {/* Auth0 Session */}
        <div className="bg-black/50 backdrop-blur-md rounded-lg border border-gray-800 p-4">
          <h2 className="text-xl font-semibold text-white mb-3">Auth0 Session</h2>
          <pre className="text-gray-300 overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        {/* Database User */}
        {testData?.user && (
          <div className="bg-black/50 backdrop-blur-md rounded-lg border border-gray-800 p-4">
            <h2 className="text-xl font-semibold text-white mb-3">Database User</h2>
            <pre className="text-gray-300 overflow-auto">
              {JSON.stringify(testData.user, null, 2)}
            </pre>
          </div>
        )}

        {/* User Files */}
        {testData?.files && (
          <div className="bg-black/50 backdrop-blur-md rounded-lg border border-gray-800 p-4">
            <h2 className="text-xl font-semibold text-white mb-3">User Files</h2>
            <pre className="text-gray-300 overflow-auto">
              {JSON.stringify(testData.files, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}