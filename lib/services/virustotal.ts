// lib/services/virustotal.ts

// Environment variables for API configuration
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const VIRUSTOTAL_API_URL = 'https://www.virustotal.com/api/v3';

/**
* VirusTotal API wrapper class
* Provides methods for file scanning and analysis retrieval
*/
export class VirusTotalAPI {
  private headers: HeadersInit;

  /**
  * Initialize API client with authentication headers
  * Requires VIRUSTOTAL_API_KEY environment variable
  */
  constructor() {
    this.headers = {
      'x-apikey': VIRUSTOTAL_API_KEY!,
      'accept': 'application/json'
    };
  }

  /**
  * Uploads a file to VirusTotal for scanning
  * 
  * @param file - File buffer to upload
  * @param filename - Name of the file
  * @returns Object containing scan and analysis IDs
  * @throws Error if upload fails
  */
  async uploadFile(file: Buffer, filename: string) {
    try {
      const formData = new FormData();
      const blob = new Blob([file], { type: 'application/octet-stream' });
      formData.append('file', blob, filename);

      const response = await fetch(`${VIRUSTOTAL_API_URL}/files`, {
        method: 'POST',
        headers: this.headers,
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        scanId: data.data.id,
        analysisId: data.data.links?.self?.split('/').pop(),
        ...data
      };
    } catch (error) {
      console.error('VirusTotal upload error:', error);
      throw error;
    }
  }

  /**
  * Retrieves analysis results for a previously uploaded file
  * Implements cache-busting to ensure fresh results
  * 
  * @param analysisId - ID of the analysis to retrieve
  * @returns Analysis results from VirusTotal
  * @throws Error if analysis retrieval fails
  */
  async getAnalysis(analysisId: string) {
    try {
      const response = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
        method: 'GET',
        headers: {
          'x-apikey': VIRUSTOTAL_API_KEY!,
          'accept': 'application/json',
          // Cache-busting headers
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          // Timestamp to force fresh request
          'X-Timestamp': Date.now().toString()
        },
        // Disable response caching
        cache: 'no-store'
      });
  
      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Source Analysis:', data);
      return data;
    } catch (error) {
      console.error('VirusTotal analysis error:', error);
      throw error;
    }
  }
}

export const virusTotal = new VirusTotalAPI();