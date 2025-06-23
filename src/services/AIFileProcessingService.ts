import OpenAI from 'openai';

export interface AIProcessedData {
  assets: any[];
  vulnerabilities: any[];
  pentestFindings: any[];
  summary: {
    fileType: string;
    assetsFound: number;
    vulnerabilitiesFound: number;
    pentestFindingsFound: number;
    criticalVulns: number;
    highVulns: number;
    confidence: number;
  };
}

export class AIFileProcessingService {
  private static openai: OpenAI | null = null;

  private static initializeOpenAI() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your environment variables.');
    }
    
    if (!this.openai) {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
      });
    }
    return this.openai;
  }

  static async processFileWithAI(file: File): Promise<AIProcessedData> {
    const openai = this.initializeOpenAI();
    const fileType = this.getFileType(file.name);
    
    let extractedText = '';
    
    try {
      switch (fileType) {
        case 'image':
          extractedText = await this.processImageFile(file, openai);
          break;
        case 'pdf':
          extractedText = await this.processPDFFile(file);
          break;
        case 'excel':
          extractedText = await this.processExcelFile(file);
          break;
        case 'word':
          extractedText = await this.processWordFile(file);
          break;
        case 'powerpoint':
          extractedText = await this.processPowerPointFile(file);
          break;
        case 'text':
          extractedText = await this.processTextFile(file);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      // Use OpenAI to analyze and structure the extracted content
      const structuredData = await this.analyzeSecurityContent(extractedText, openai);
      
      return {
        ...structuredData,
        summary: {
          ...structuredData.summary,
          fileType: fileType,
        }
      };
    } catch (error) {
      console.error('AI file processing error:', error);
      throw new Error(`Failed to process ${fileType} file: ${error.message}`);
    }
  }

  private static getFileType(fileName: string): string {
    const extension = fileName.toLowerCase().split('.').pop();
    
    const typeMap: { [key: string]: string } = {
      // Images
      'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image', 'bmp': 'image', 'webp': 'image',
      // Documents
      'pdf': 'pdf',
      'doc': 'word', 'docx': 'word',
      'xls': 'excel', 'xlsx': 'excel', 'csv': 'excel',
      'ppt': 'powerpoint', 'pptx': 'powerpoint',
      // Text
      'txt': 'text', 'rtf': 'text', 'md': 'text',
    };
    
    return typeMap[extension || ''] || 'unknown';
  }

  private static async processImageFile(file: File, openai: OpenAI): Promise<string> {
    // Convert image to base64
    const base64Image = await this.fileToBase64(file);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all cybersecurity-related information from this image. Look for vulnerability scans, penetration test results, security assessments, network diagrams, asset inventories, or any security-related data. Provide detailed text extraction of all visible content."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${file.type};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 4000
    });

    return response.choices[0]?.message?.content || '';
  }

  private static async processPDFFile(file: File): Promise<string> {
    // For PDF processing, we'll use a simple text extraction approach
    // In a production environment, you might want to use a dedicated PDF parsing library
    const arrayBuffer = await file.arrayBuffer();
    const text = await this.extractTextFromPDF(arrayBuffer);
    return text;
  }

  private static async processExcelFile(file: File): Promise<string> {
    // For Excel files, we'll read as text and let AI interpret the structure
    const text = await file.text();
    return text;
  }

  private static async processWordFile(file: File): Promise<string> {
    // For Word files, we'll attempt text extraction
    const arrayBuffer = await file.arrayBuffer();
    return this.extractTextFromWord(arrayBuffer);
  }

  private static async processPowerPointFile(file: File): Promise<string> {
    // For PowerPoint files, we'll attempt text extraction
    const arrayBuffer = await file.arrayBuffer();
    return this.extractTextFromPowerPoint(arrayBuffer);
  }

  private static async processTextFile(file: File): Promise<string> {
    return await file.text();
  }

  private static async analyzeSecurityContent(content: string, openai: OpenAI): Promise<Omit<AIProcessedData, 'summary'> & { summary: Omit<AIProcessedData['summary'], 'fileType'> }> {
    const prompt = `
Analyze the following cybersecurity content and extract structured data. Return a JSON object with the following structure:

{
  "assets": [
    {
      "name": "asset name",
      "type": "Server|Database|Network|Workstation|Web|Application|Cloud|Mobile|IoT",
      "ip_address": "IP address if available",
      "hostname": "hostname if available",
      "ports": [array of port numbers],
      "services": [array of service names],
      "operating_system": "OS if mentioned",
      "criticality": 1-5,
      "exposure_score": 0-100
    }
  ],
  "vulnerabilities": [
    {
      "cve_id": "CVE ID if available or generate one",
      "title": "vulnerability title",
      "description": "detailed description",
      "severity": "Critical|High|Medium|Low",
      "cvss_score": 0.0-10.0,
      "cvss_vector": "CVSS vector if available",
      "status": "Open|In Progress|Resolved",
      "source": "source of discovery",
      "component": "affected component",
      "solution": "recommended solution"
    }
  ],
  "pentestFindings": [
    {
      "finding_id": "unique finding ID",
      "title": "finding title",
      "description": "detailed description",
      "severity": "Critical|High|Medium|Low",
      "risk_rating": "Critical|High|Medium|Low",
      "affected_assets": [array of asset names],
      "evidence": "evidence description",
      "recommendation": "remediation recommendation",
      "status": "Open|In Progress|Resolved",
      "tester": "tester name if available"
    }
  ],
  "summary": {
    "assetsFound": number,
    "vulnerabilitiesFound": number,
    "pentestFindingsFound": number,
    "criticalVulns": number,
    "highVulns": number,
    "confidence": 0-100
  }
}

Content to analyze:
${content}

Important: 
- Only extract actual security-related information
- If no relevant data is found, return empty arrays
- Assign realistic CVSS scores based on severity
- Generate meaningful asset names and IPs when not explicitly provided
- Ensure all required fields are present
- Set confidence based on how clear and complete the extracted data is
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a cybersecurity expert specializing in parsing and structuring security assessment data. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000
    });

    const responseContent = response.choices[0]?.message?.content || '{}';
    
    try {
      const parsedData = JSON.parse(responseContent);
      
      // Validate and sanitize the response
      return {
        assets: Array.isArray(parsedData.assets) ? parsedData.assets : [],
        vulnerabilities: Array.isArray(parsedData.vulnerabilities) ? parsedData.vulnerabilities : [],
        pentestFindings: Array.isArray(parsedData.pentestFindings) ? parsedData.pentestFindings : [],
        summary: {
          assetsFound: parsedData.summary?.assetsFound || 0,
          vulnerabilitiesFound: parsedData.summary?.vulnerabilitiesFound || 0,
          pentestFindingsFound: parsedData.summary?.pentestFindingsFound || 0,
          criticalVulns: parsedData.summary?.criticalVulns || 0,
          highVulns: parsedData.summary?.highVulns || 0,
          confidence: parsedData.summary?.confidence || 0
        }
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('AI returned invalid response format');
    }
  }

  // Helper methods for file processing
  private static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private static async extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
    // Simple PDF text extraction - in production, use a proper PDF library like pdf-parse
    const uint8Array = new Uint8Array(arrayBuffer);
    const text = new TextDecoder().decode(uint8Array);
    
    // Basic PDF text extraction (this is simplified)
    const textMatch = text.match(/stream\s*(.*?)\s*endstream/gs);
    if (textMatch) {
      return textMatch.map(match => 
        match.replace(/stream\s*|\s*endstream/g, '')
             .replace(/[^\x20-\x7E]/g, ' ')
             .trim()
      ).join(' ');
    }
    
    return text.replace(/[^\x20-\x7E\n\r]/g, ' ').trim();
  }

  private static async extractTextFromWord(arrayBuffer: ArrayBuffer): Promise<string> {
    // Simple Word document text extraction
    const uint8Array = new Uint8Array(arrayBuffer);
    const text = new TextDecoder().decode(uint8Array);
    
    // Basic text extraction from Word documents
    return text.replace(/[^\x20-\x7E\n\r]/g, ' ')
               .replace(/\s+/g, ' ')
               .trim();
  }

  private static async extractTextFromPowerPoint(arrayBuffer: ArrayBuffer): Promise<string> {
    // Simple PowerPoint text extraction
    const uint8Array = new Uint8Array(arrayBuffer);
    const text = new TextDecoder().decode(uint8Array);
    
    // Basic text extraction from PowerPoint
    return text.replace(/[^\x20-\x7E\n\r]/g, ' ')
               .replace(/\s+/g, ' ')
               .trim();
  }

  static getSupportedFileTypes(): string[] {
    return [
      // Images
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp',
      // Documents
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv',
      '.ppt', '.pptx', '.txt', '.rtf', '.md',
      // Traditional security files
      '.xml', '.nessus'
    ];
  }

  static isAIProcessingRequired(fileName: string): boolean {
    const extension = fileName.toLowerCase().split('.').pop();
    const aiRequiredExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'rtf', 'md'];
    return aiRequiredExtensions.includes(extension || '');
  }
}
