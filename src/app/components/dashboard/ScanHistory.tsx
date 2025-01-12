// components/dashboard/ScanHistory.tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { 
  FileIcon, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type ScanHistoryProps = {
  initialScans: any[];
  totalPages: number;
};

export default function ScanHistory({ initialScans, totalPages }: ScanHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-500';
      case 'ERROR':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'ERROR':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-md rounded-lg border border-gray-800">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            className="ml-2 w-full bg-transparent border-none focus:outline-none dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50 dark:bg-gray-700">
              <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">File</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Size</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {initialScans.map((scan) => (
              <tr key={scan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium dark:text-white">{scan.fileName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {(scan.fileSize / 1024 / 1024).toFixed(2)} MB
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {getStatusIcon(scan.status)}
                    <span className={`ml-2 text-sm ${getStatusColor(scan.status)}`}>
                      {scan.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(scan.createdAt), 'MMM dd, yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}