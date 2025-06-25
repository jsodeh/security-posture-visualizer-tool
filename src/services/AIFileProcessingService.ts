import { supabase } from '@/lib/supabase';

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
  static async processFileWithAI(file: File): Promise<AIProcessedData> {
    const fileType = this.getFileType(file.name);
    let requestBody: {
      fileContent: string;
      fileType: string;
      mediaType?: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    };

    try {
      if (fileType === 'image') {
        const base64Image = await this.fileToBase64(file);
        requestBody = {
          fileContent: base64Image,
          fileType: 'image',
          mediaType: file.type as any,
        };
      } else {
        const textContent = await this.extractTextFromFile(file, fileType);
        requestBody = {
          fileContent: textContent,
          fileType: 'text',
        };
      }

      // Invoke the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('process-file-with-ai', {
        body: requestBody,
      });

      if (error) {
        throw error;
      }
      
      return {
        ...data,
        summary: {
          ...data.summary,
          fileType: fileType,
        }
      };

    } catch (error) {
      console.error('AI file processing error:', error);
      let errorMessage = 'Failed to process file with AI.';
      if (error.message.includes('Function not found')) {
        errorMessage = "AI processing function not available. Please ensure it's deployed.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  }

  static getFileType(fileName: string): string {
    const extension = fileName.toLowerCase().split('.').pop() || '';
    const typeMap: { [key: string]: string } = {
      'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image', 'bmp': 'image', 'webp': 'image',
      'pdf': 'pdf', 'doc': 'word', 'docx': 'word', 'xls': 'excel', 'xlsx': 'excel',
      'csv': 'excel', 'ppt': 'powerpoint', 'pptx': 'powerpoint', 'txt': 'text', 'rtf': 'text', 'md': 'text',
    };
    return typeMap[extension] || 'text';
  }

  private static async extractTextFromFile(file: File, fileType: string): Promise<string> {
    switch (fileType) {
      case 'pdf':
        return this.processPDFFile(file);
      case 'excel':
        return this.processExcelFile(file);
      case 'word':
        return this.processWordFile(file);
      case 'powerpoint':
        return this.processPowerPointFile(file);
      case 'text':
        return this.processTextFile(file);
      default:
        return file.text();
    }
  }

  // Keep all the file processing and utility methods (fileToBase64, etc.)
  private static async fileToBase64(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  private static async processPDFFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    // Dummy implementation - replace with actual PDF parsing library if needed
    console.warn("PDF text extraction is a placeholder.");
    return `Extracted text from ${file.name}`;
  }

  private static async processExcelFile(file: File): Promise<string> {
    return file.text();
  }

  private static async processWordFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    // Dummy implementation
    console.warn("Word text extraction is a placeholder.");
    return `Extracted text from ${file.name}`;
  }

  private static async processPowerPointFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    // Dummy implementation
    console.warn("PowerPoint text extraction is a placeholder.");
    return `Extracted text from ${file.name}`;
  }

  private static async processTextFile(file: File): Promise<string> {
    return file.text();
  }

  static getSupportedFileTypes(): string[] {
    return ['image', 'pdf', 'word', 'excel', 'powerpoint', 'text'];
  }

  static isAIProcessingRequired(fileName: string): boolean {
    const fileType = this.getFileType(fileName);
    return this.getSupportedFileTypes().includes(fileType);
  }
}
