// lib/services/virustotal.ts
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const VIRUSTOTAL_API_URL = 'https://www.virustotal.com/api/v3';

export class VirusTotalAPI {
  private headers: HeadersInit;

  constructor() {
    this.headers = {
      'x-apikey': VIRUSTOTAL_API_KEY!,
      'accept': 'application/json'
    };
  }

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

  async getAnalysis(analysisId: string) {
    try {
      const response = await fetch(`${VIRUSTOTAL_API_URL}/analyses/${analysisId}`, {
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('VirusTotal analysis error:', error);
      throw error;
    }
  }
}

export const virusTotal = new VirusTotalAPI();