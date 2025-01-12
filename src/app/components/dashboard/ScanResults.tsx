// components/dashboard/ScanResults.tsx
'use client';

import { Shield, AlertCircle, Clock, Loader2 } from 'lucide-react';

interface ScanResult {
  status: string;
  stats: {
    malicious: number;
    suspicious: number;
    undetected: number;
    harmless: number;
  };
  results: Record<string, {
    category: string;
    result: string | null;
    engine_name: string;
  }>;
  meta?: {
    file_info: {
      size: number;
      md5: string;
      sha1: string;
      sha256: string;
    };
  };
}

interface ScanResultsProps {
  result?: ScanResult | null;
  fileName: string;
  status?: string; // Added for pending states
}

export default function ScanResults({ result, fileName, status = 'PENDING' }: ScanResultsProps) {
  if (!result) {
    return (
      <div className="bg-black/50 backdrop-blur-md rounded-lg border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">{fileName}</h2>
              <p className="text-sm text-gray-400">Scan {status.toLowerCase()}</p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50">
              {status === 'PENDING' || status === 'SCANNING' ? (
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              ) : (
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              )}
            </div>
          </div>
        </div>

        <div className="p-12 flex flex-col items-center justify-center">
          {status === 'PENDING' || status === 'SCANNING' ? (
            <>
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-400 text-lg">
                {status === 'PENDING' ? 'Starting scan...' : 'Scanning in progress...'}
              </p>
            </>
          ) : (
            <>
              <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
              <p className="text-gray-400 text-lg">No scan results available</p>
            </>
          )}
        </div>
      </div>
    );
  }

  const totalEngines = Object.keys(result.results).length;
  const detectionScore = result.stats.malicious;
  
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

  return (
    <div className="bg-black/50 backdrop-blur-md rounded-lg border border-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">{fileName}</h2>
            <p className="text-sm text-gray-400">
              {result.meta?.file_info.size 
                ? `${(result.meta.file_info.size / 1024).toFixed(2)} KB` 
                : 'Size unknown'
              }
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
          { label: 'Malicious', value: result.stats.malicious, color: 'text-red-500' },
          { label: 'Suspicious', value: result.stats.suspicious, color: 'text-yellow-500' },
          { label: 'Harmless', value: result.stats.harmless, color: 'text-green-500' },
          { label: 'Undetected', value: result.stats.undetected, color: 'text-gray-400' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Scan Details */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Security Vendors' Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(result.results).map(([key, value]) => (
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