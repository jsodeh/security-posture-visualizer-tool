import { SecurityDataService } from './SecurityDataService';
import { RiskCalculationService } from './RiskCalculationService';

export interface ProcessedData {
  assets: any[];
  vulnerabilities: any[];
  summary: {
    assetsFound: number;
    vulnerabilitiesFound: number;
    criticalVulns: number;
    highVulns: number;
  };
}

export class DataIngestionService {
  static async processSecurityFile(file: File): Promise<ProcessedData> {
    const fileContent = await this.readFileContent(file);
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.xml')) {
      if (fileContent.includes('<nmaprun')) {
        return this.processNmapXML(fileContent);
      } else if (fileContent.includes('<NessusClientData')) {
        return this.processNessusXML(fileContent);
      } else {
        return this.processOpenVASXML(fileContent);
      }
    } else if (fileName.endsWith('.nessus')) {
      return this.processNessusFile(fileContent);
    }

    throw new Error('Unsupported file format');
  }

  private static async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  private static async processNmapXML(content: string): Promise<ProcessedData> {
    // Parse Nmap XML for asset discovery
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');
    
    const hosts = doc.querySelectorAll('host');
    const assets: any[] = [];
    
    hosts.forEach((host, index) => {
      const addressElement = host.querySelector('address[addrtype="ipv4"]');
      const hostnameElement = host.querySelector('hostname');
      const portsElement = host.querySelectorAll('port[protocol="tcp"]');
      
      if (addressElement) {
        const ipAddress = addressElement.getAttribute('addr') || '';
        const hostname = hostnameElement?.getAttribute('name') || `host-${index + 1}`;
        
        const ports: number[] = [];
        const services: string[] = [];
        
        portsElement.forEach(port => {
          const portId = port.getAttribute('portid');
          const service = port.querySelector('service');
          
          if (portId) {
            ports.push(parseInt(portId));
          }
          
          if (service) {
            const serviceName = service.getAttribute('name');
            if (serviceName) {
              services.push(serviceName);
            }
          }
        });

        assets.push({
          organization_id: '550e8400-e29b-41d4-a716-446655440000', // Demo org
          name: hostname,
          type: this.determineAssetType(services),
          ip_address: ipAddress,
          hostname: hostname,
          ports: ports,
          services: services,
          operating_system: this.extractOS(host),
          criticality: this.calculateCriticality(services, ports),
          exposure_score: this.calculateExposureScore(ports, services),
          last_scanned: new Date().toISOString(),
        });
      }
    });

    // Save assets to database
    for (const asset of assets) {
      await SecurityDataService.createAsset(asset);
    }

    return {
      assets,
      vulnerabilities: [],
      summary: {
        assetsFound: assets.length,
        vulnerabilitiesFound: 0,
        criticalVulns: 0,
        highVulns: 0,
      },
    };
  }

  private static async processNessusFile(content: string): Promise<ProcessedData> {
    // Parse Nessus file for vulnerabilities
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');
    
    const reportItems = doc.querySelectorAll('ReportItem');
    const vulnerabilities: any[] = [];
    
    for (const item of reportItems) {
      const pluginId = item.getAttribute('pluginID');
      const severity = item.getAttribute('severity');
      const pluginName = item.getAttribute('pluginName');
      
      if (pluginId && severity && parseInt(severity) > 0) {
        // Find corresponding asset
        const hostElement = item.closest('ReportHost');
        const hostName = hostElement?.getAttribute('name') || '';
        
        // Get asset from database
        const assets = await SecurityDataService.getAssets('550e8400-e29b-41d4-a716-446655440000');
        const asset = assets.find(a => a.ip_address === hostName || a.hostname === hostName);
        
        if (asset) {
          const description = item.querySelector('description')?.textContent || '';
          const solution = item.querySelector('solution')?.textContent || '';
          const cvssScore = this.extractCVSSScore(item);
          
          vulnerabilities.push({
            asset_id: asset.id,
            cve_id: this.extractCVE(item) || `NESSUS-${pluginId}`,
            title: pluginName || 'Unknown Vulnerability',
            description: description,
            severity: this.mapNessusSeverity(parseInt(severity)),
            cvss_score: cvssScore,
            cvss_vector: this.extractCVSSVector(item),
            status: 'Open',
            discovered_date: new Date().toISOString(),
            source: 'Nessus Scanner',
            component: this.extractComponent(item),
            solution: solution,
          });
        }
      }
    }

    // Save vulnerabilities to database
    for (const vuln of vulnerabilities) {
      await SecurityDataService.createVulnerability(vuln);
    }

    const criticalVulns = vulnerabilities.filter(v => v.severity === 'Critical').length;
    const highVulns = vulnerabilities.filter(v => v.severity === 'High').length;

    return {
      assets: [],
      vulnerabilities,
      summary: {
        assetsFound: 0,
        vulnerabilitiesFound: vulnerabilities.length,
        criticalVulns,
        highVulns,
      },
    };
  }

  private static async processNessusXML(content: string): Promise<ProcessedData> {
    return this.processNessusFile(content);
  }

  private static async processOpenVASXML(content: string): Promise<ProcessedData> {
    // Similar to Nessus but for OpenVAS format
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');
    
    const results = doc.querySelectorAll('result');
    const vulnerabilities: any[] = [];
    
    // Process OpenVAS results...
    // Implementation similar to Nessus but adapted for OpenVAS XML structure
    
    return {
      assets: [],
      vulnerabilities,
      summary: {
        assetsFound: 0,
        vulnerabilitiesFound: vulnerabilities.length,
        criticalVulns: 0,
        highVulns: 0,
      },
    };
  }

  // Helper methods
  private static determineAssetType(services: string[]): string {
    if (services.some(s => s.includes('http') || s.includes('web'))) return 'Server';
    if (services.some(s => s.includes('database') || s.includes('mysql') || s.includes('postgres'))) return 'Database';
    if (services.some(s => s.includes('ssh') || s.includes('telnet'))) return 'Server';
    return 'Workstation';
  }

  private static extractOS(host: Element): string {
    const osElement = host.querySelector('os osmatch');
    return osElement?.getAttribute('name') || 'Unknown';
  }

  private static calculateCriticality(services: string[], ports: number[]): number {
    let criticality = 1;
    
    // Web services are more critical
    if (services.some(s => s.includes('http'))) criticality += 2;
    
    // Database services are critical
    if (services.some(s => s.includes('database') || s.includes('mysql'))) criticality += 3;
    
    // SSH access increases criticality
    if (ports.includes(22)) criticality += 1;
    
    return Math.min(criticality, 5);
  }

  private static calculateExposureScore(ports: number[], services: string[]): number {
    let exposure = 0;
    
    // Common vulnerable ports
    const vulnerablePorts = [21, 23, 80, 443, 3389, 5900];
    exposure += ports.filter(p => vulnerablePorts.includes(p)).length * 15;
    
    // Web services increase exposure
    if (services.some(s => s.includes('http'))) exposure += 20;
    
    // Remote access services
    if (ports.includes(3389) || ports.includes(5900)) exposure += 25;
    
    return Math.min(exposure, 100);
  }

  private static extractCVSSScore(item: Element): number {
    const cvssElement = item.querySelector('cvss_base_score');
    return parseFloat(cvssElement?.textContent || '0');
  }

  private static extractCVE(item: Element): string | null {
    const cveElement = item.querySelector('cve');
    return cveElement?.textContent || null;
  }

  private static extractCVSSVector(item: Element): string {
    const vectorElement = item.querySelector('cvss_vector');
    return vectorElement?.textContent || '';
  }

  private static extractComponent(item: Element): string {
    const serviceElement = item.querySelector('svc_name');
    return serviceElement?.textContent || 'Unknown';
  }

  private static mapNessusSeverity(severity: number): string {
    switch (severity) {
      case 4: return 'Critical';
      case 3: return 'High';
      case 2: return 'Medium';
      case 1: return 'Low';
      default: return 'Info';
    }
  }
}
