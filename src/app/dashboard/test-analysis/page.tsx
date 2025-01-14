// app/test-analysis/page.tsx
import ScanResults from '@/app/components/dashboard/ScanResults';
import { virusTotal } from '../../../../lib/services/virustotal';

export default async function TestAnalysisPage() {
  const scanId = 'NjE2NzJmNTVhNGE0MGVkOWFiZDkzZjQ2NTM0OGMxMGI6MTczNjgzMTQxMQ==';
  
  try {
    const analysis = await virusTotal.getAnalysis(scanId);
    
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Test Analysis</h1>
          <p className="mt-1 text-gray-400">
            Viewing results for test scan
          </p>
        </div>

        <div className="mt-6">
          <ScanResults
            fileName="test-file.txt"
            fileSize={1024}
            status="COMPLETED"
            virusTotalData={analysis.data}
          />
        </div>

        {/* Raw Data (for debugging) */}
        <div className="mt-8 p-4 bg-black/50 backdrop-blur-md rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Raw Response</h2>
          <pre className="text-sm text-gray-400 overflow-auto">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8 text-red-500">
        Error: {error instanceof Error ? error.message : 'Failed to fetch analysis'}
      </div>
    );
  }
}