// app/dashboard/test/page.tsx
import ScanResults from '@/app/components/dashboard/ScanResults';

const testResult = {
  "status": "completed",
  "stats": {
    "malicious": 1,
    "suspicious": 1,
    "undetected": 66,
    "harmless": 0
  },
  "results": {
    "Bitdefender": {
      "category": "undetected",
      "engine_name": "Bitdefender",
      "result": null
    },
    "Kaspersky": {
      "category": "undetected",
      "engine_name": "Kaspersky",
      "result": null
    },
    "McAfee": {
      "category": "undetected",
      "engine_name": "McAfee",
      "result": null
    },
    "CrowdStrike": {
      "category": "malicious",
      "engine_name": "CrowdStrike Falcon",
      "result": "malicious"
    },
    "Symantec": {
      "category": "suspicious",
      "engine_name": "Symantec",
      "result": "suspicious"
    }
  },
  "meta": {
    "file_info": {
      "size": 13946,
      "md5": "e7a3021779ce48df7fc34995f9d71e04",
      "sha1": "2796c923c381271cabc06cfcf217c5e435deda55",
      "sha256": "ff4e79f9b32eca0beabcc376f07723815d8c8ff06832f067f3445f7f871c54c9"
    }
  }
};

export default function TestPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Test Scan Results</h1>
        <p className="mt-1 text-gray-400">
          Sample scan result display
        </p>
      </div>

      <ScanResults 
        result={testResult}
        fileName="test-malicious-file.exe"
      />
    </div>
  );
}