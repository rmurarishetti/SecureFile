// app/dashboard/history/loading.tsx
export default function Loading() {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-800 rounded animate-pulse" />
          <div className="mt-1 h-4 w-96 bg-gray-800 rounded animate-pulse" />
        </div>
  
        <div className="mt-6">
          <div className="bg-black/50 backdrop-blur-md rounded-lg border border-gray-800">
            {/* Skeleton table header */}
            <div className="p-4 border-b border-gray-800">
              <div className="h-8 w-64 bg-gray-800 rounded animate-pulse" />
            </div>
  
            {/* Skeleton rows */}
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="p-4 border-b border-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
  
            {/* Skeleton pagination */}
            <div className="p-4 flex items-center justify-between">
              <div className="h-8 w-24 bg-gray-800 rounded animate-pulse" />
              <div className="h-8 w-24 bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }