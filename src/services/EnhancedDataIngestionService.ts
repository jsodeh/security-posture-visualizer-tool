import { DataIngestionService, ProcessedData } from './DataIngestionService';
import { AIFileProcessingService, AIProcessedData } from './AIFileProcessingService';
import { SecurityDataService } from './SecurityDataService';

export class EnhancedDataIngestionService {
  static async processSecurityFile(file: File, organizationId: string): Promise<ProcessedData | AIProcessedData> {
    const fileName = file.name.toLowerCase();
    
    // Check if this is a traditional security file format
    if (fileName.endsWith('.xml') || fileName.endsWith('.nessus')) {
      return await DataIngestionService.processSecurityFile(file, organizationId);
    }
    
    // Check if AI processing is required
    if (AIFileProcessingService.isAIProcessingRequired(fileName)) {
      return await this.processFileWithAI(file, organizationId);
    }
    
    throw new Error('Unsupported file format');
  }

  private static async processFileWithAI(file: File, organizationId: string): Promise<AIProcessedData> {
    try {
      // Process file with AI
      const aiResult = await AIFileProcessingService.processFileWithAI(file);
      
      // Save the processed data to the database under the correct organization
      await this.saveAIProcessedData(aiResult, organizationId);
      
      return aiResult;
    } catch (error) {
      console.error('AI processing error:', error);
      throw error;
    }
  }

  private static async saveAIProcessedData(data: AIProcessedData, organizationId: string): Promise<void> {
    try {
      // Save assets
      for (const assetData of data.assets) {
        const asset = {
          organization_id: organizationId,
          name: assetData.name,
          type: assetData.type,
          ip_address: assetData.ip_address || this.generateRandomIP(),
          hostname: assetData.hostname || assetData.name,
          ports: assetData.ports || [],
          services: assetData.services || [],
          operating_system: assetData.operating_system || 'Unknown',
          criticality: assetData.criticality || 3,
          exposure_score: assetData.exposure_score || 50,
          last_scanned: new Date().toISOString(),
        };
        
        await SecurityDataService.createAsset(asset);
      }

      // Save vulnerabilities (need to link to assets)
      const assets = await SecurityDataService.getAssets(organizationId);
      
      for (const vulnData of data.vulnerabilities) {
        // Find matching asset or use the first one
        const asset = assets.find(a => 
          vulnData.component && a.name.toLowerCase().includes(vulnData.component.toLowerCase())
        ) || assets[0];
        
        if (asset) {
          const vulnerability = {
            asset_id: asset.id,
            cve_id: vulnData.cve_id || `AI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: vulnData.title,
            description: vulnData.description,
            severity: vulnData.severity,
            cvss_score: vulnData.cvss_score || this.severityToCVSS(vulnData.severity),
            cvss_vector: vulnData.cvss_vector || '',
            status: vulnData.status || 'Open',
            assignee: null,
            discovered_date: new Date().toISOString(),
            source: vulnData.source || 'AI Analysis',
            component: vulnData.component || 'Unknown',
            solution: vulnData.solution || 'Review and remediate as needed',
          };
          
          await SecurityDataService.createVulnerability(vulnerability);
        }
      }

      // Save pentest findings
      for (const findingData of data.pentestFindings) {
        const finding = {
          organization_id: organizationId,
          finding_id: findingData.finding_id || `AI-PT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: findingData.title,
          description: findingData.description,
          severity: findingData.severity,
          risk_rating: findingData.risk_rating,
          affected_assets: findingData.affected_assets || [],
          evidence: findingData.evidence || 'Extracted from uploaded document',
          recommendation: findingData.recommendation,
          status: findingData.status || 'Open',
          tester: findingData.tester || 'AI Analysis',
          test_date: new Date().toISOString(),
        };
        
        await SecurityDataService.createPentestFinding(finding);
      }
    } catch (error) {
      console.error('Error saving AI processed data:', error);
      throw new Error('Failed to save processed data to database');
    }
  }

  private static generateRandomIP(): string {
    return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }

  private static severityToCVSS(severity: string): number {
    const severityMap: { [key: string]: number } = {
      'Critical': 9.0 + Math.random(),
      'High': 7.0 + Math.random() * 2,
      'Medium': 4.0 + Math.random() * 3,
      'Low': 0.1 + Math.random() * 3.9,
    };
    
    return Math.min(10.0, severityMap[severity] || 5.0);
  }

  static getSupportedFileTypes(): string[] {
    return AIFileProcessingService.getSupportedFileTypes();
  }
}
