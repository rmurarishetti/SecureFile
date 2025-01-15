// components/dashboard/ScanResults.tsx
'use client';

import { AlertCircle, Loader2 } from 'lucide-react';

/**
* Props interface for ScanResults component
*/
interface ScanResultsProps {
  fileName: string;
  fileSize: number;
  status: string;
  virusTotalData: any | null;
}

/**
* Displays detailed virus scan results for a file
* Shows loading states, errors, and comprehensive scan data
*/
export default function ScanResults({ 
  fileName, 
  fileSize, 
  status, 
  virusTotalData 
}: ScanResultsProps) {
  /**
  * Loading state view
  * Displayed during PENDING or SCANNING status
  */
  if (status === 'PENDING' || status === 'SCANNING') {
    return (
      <div className="bg-black/50 backdrop-blur-md rounded-lg border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">{fileName}</h2>
              <p className="text-sm text-gray-400">
                {(fileSize / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          </div>
        </div>
        <div className="p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-400 text-lg">
            {status === 'PENDING' ? 'Preparing scan...' : 'Scanning in progress...'}
          </p>
        </div>
      </div>
    );
  }

  /**
  * Error state view
  * Displayed when no VirusTotal data is available
  */
  if (!virusTotalData) {
    return (
      <div className="bg-black/50 backdrop-blur-md rounded-lg border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">{fileName}</h2>
              <p className="text-sm text-gray-400">
                {(fileSize / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
        <div className="p-12 flex flex-col items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-gray-400 text-lg">
            Unable to retrieve scan results
          </p>
        </div>
      </div>
    );
  }

  const stats = virusTotalData.attributes.stats;
  const detectionScore = stats.malicious;

  const getScoreColor = (score: number) => {
    if (score === 0) return 'text-green-500';
    if (score < 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBackground = (score: number) => {
    if (score === 0) return 'bg-green-500/20';
    if (score < 3) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  /**
  * Success state view with complete scan results
  */
  return (
    <div className="bg-black/50 backdrop-blur-md rounded-lg border border-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">{fileName}</h2>
            <p className="text-sm text-gray-400">
              {(fileSize / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <div className={`flex items-center justify-center w-16 h-16 rounded-full ${getScoreBackground(detectionScore)}`}>
            <span className={`text-2xl font-bold ${getScoreColor(detectionScore)}`}>
              {detectionScore}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-800">
        {[
          { label: 'Malicious', value: stats.malicious, color: 'text-red-500' },
          { label: 'Suspicious', value: stats.suspicious, color: 'text-yellow-500' },
          { label: 'Harmless', value: stats.harmless, color: 'text-green-500' },
          { label: 'Undetected', value: stats.undetected, color: 'text-gray-400' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Scan Details */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Security Vendors&apos; Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(virusTotalData.attributes.results).map(([key, value]: [string, any]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
              <span className="text-sm text-gray-300">{value.engine_name}</span>
              <span className={`text-sm ${
                value.category === 'harmless' ? 'text-green-500' :
                value.category === 'malicious' ? 'text-red-500' :
                'text-gray-400'
              }`}>
                {value.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}