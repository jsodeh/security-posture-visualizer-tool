
import { SecurityDataService } from './SecurityDataService';

export interface RiskCalculationResult {
  overallScore: number;
  attackSurfaceScore: number;
  vulnerabilityScore: number;
  pentestScore: number;
  breakdown: {
    criticalVulns: number;
    highVulns: number;
    mediumVulns: number;
    lowVulns: number;
    totalAssets: number;
    exposedAssets: number;
  };
}

export class RiskCalculationService {
  static async calculateRiskScore(organizationId: string): Promise<RiskCalculationResult> {
    try {
      // Fetch all necessary data
      const [assets, vulnerabilities, pentestFindings] = await Promise.all([
        SecurityDataService.getAssets(organizationId),
        SecurityDataService.getVulnerabilities(organizationId),
        SecurityDataService.getPentestFindings(organizationId)
      ]);

      // Calculate attack surface score
      const attackSurfaceScore = this.calculateAttackSurfaceScore(assets);
      
      // Calculate vulnerability score
      const vulnerabilityScore = this.calculateVulnerabilityScore(vulnerabilities);
      
      // Calculate pentest score
      const pentestScore = this.calculatePentestScore(pentestFindings);
      
      // Calculate overall risk score (weighted average)
      const overallScore = Math.round(
        (attackSurfaceScore * 0.3) + 
        (vulnerabilityScore * 0.4) + 
        (pentestScore * 0.3)
      );

      // Generate breakdown
      const breakdown = this.generateBreakdown(assets, vulnerabilities);

      return {
        overallScore,
        attackSurfaceScore,
        vulnerabilityScore,
        pentestScore,
        breakdown
      };
    } catch (error) {
      console.error('Error calculating risk score:', error);
      throw new Error('Failed to calculate risk score');
    }
  }

  private static calculateAttackSurfaceScore(assets: any[]): number {
    if (!assets.length) return 100;

    const totalAssets = assets.length;
    const exposedAssets = assets.filter(asset => (asset.exposure_score || 0) > 50).length;
    const avgExposure = assets.reduce((sum, asset) => sum + (asset.exposure_score || 0), 0) / totalAssets;
    
    // Higher exposure = lower score (inverted)
    return Math.max(0, Math.min(100, 100 - avgExposure));
  }

  private static calculateVulnerabilityScore(vulnerabilities: any[]): number {
    if (!vulnerabilities.length) return 100;

    const criticalCount = vulnerabilities.filter(v => v.severity === 'Critical').length;
    const highCount = vulnerabilities.filter(v => v.severity === 'High').length;
    const mediumCount = vulnerabilities.filter(v => v.severity === 'Medium').length;
    const lowCount = vulnerabilities.filter(v => v.severity === 'Low').length;

    // Weighted scoring: Critical = 10, High = 5, Medium = 2, Low = 1
    const weightedScore = (criticalCount * 10) + (highCount * 5) + (mediumCount * 2) + (lowCount * 1);
    
    // Normalize to 0-100 scale (inverted - higher vulns = lower score)
    const maxPossibleScore = vulnerabilities.length * 10;
    return Math.max(0, Math.min(100, 100 - ((weightedScore / maxPossibleScore) * 100)));
  }

  private static calculatePentestScore(findings: any[]): number {
    if (!findings.length) return 75; // Default score when no pentest data

    const criticalFindings = findings.filter(f => f.severity === 'Critical').length;
    const highFindings = findings.filter(f => f.severity === 'High').length;
    const mediumFindings = findings.filter(f => f.severity === 'Medium').length;
    const lowFindings = findings.filter(f => f.severity === 'Low').length;

    // Similar weighted approach as vulnerabilities
    const weightedScore = (criticalFindings * 10) + (highFindings * 5) + (mediumFindings * 2) + (lowFindings * 1);
    const maxPossibleScore = findings.length * 10;
    
    return Math.max(0, Math.min(100, 100 - ((weightedScore / maxPossibleScore) * 100)));
  }

  private static generateBreakdown(assets: any[], vulnerabilities: any[]) {
    return {
      criticalVulns: vulnerabilities.filter(v => v.severity === 'Critical').length,
      highVulns: vulnerabilities.filter(v => v.severity === 'High').length,
      mediumVulns: vulnerabilities.filter(v => v.severity === 'Medium').length,
      lowVulns: vulnerabilities.filter(v => v.severity === 'Low').length,
      totalAssets: assets.length,
      exposedAssets: assets.filter(asset => (asset.exposure_score || 0) > 50).length
    };
  }

  static async saveCalculatedRisk(organizationId: string, result: RiskCalculationResult) {
    const riskScore = {
      organization_id: organizationId,
      overall_score: result.overallScore,
      attack_surface_score: result.attackSurfaceScore,
      vulnerability_score: result.vulnerabilityScore,
      pentest_score: result.pentestScore,
      calculated_date: new Date().toISOString()
    };

    return await SecurityDataService.saveRiskScore(riskScore);
  }
}
