
import { supabase } from '@/lib/supabase';
import { Tables, Inserts } from '@/lib/supabase';

export class SecurityDataService {
  // Organization methods
  static async getOrganization(id: string) {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createOrganization(org: Inserts<'organizations'>) {
    const { data, error } = await supabase
      .from('organizations')
      .insert(org)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Asset methods
  static async getAssets(organizationId: string) {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createAsset(asset: Inserts<'assets'>) {
    const { data, error } = await supabase
      .from('assets')
      .insert(asset)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateAssetExposure(assetId: string, exposureScore: number) {
    const { data, error } = await supabase
      .from('assets')
      .update({ exposure_score: exposureScore, updated_at: new Date().toISOString() })
      .eq('id', assetId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Vulnerability methods
  static async getVulnerabilities(organizationId: string) {
    const { data, error } = await supabase
      .from('vulnerabilities')
      .select(`
        *,
        assets!inner(organization_id)
      `)
      .eq('assets.organization_id', organizationId)
      .order('cvss_score', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createVulnerability(vulnerability: Inserts<'vulnerabilities'>) {
    const { data, error } = await supabase
      .from('vulnerabilities')
      .insert(vulnerability)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateVulnerabilityStatus(vulnId: string, status: string, assignee?: string) {
    const { data, error } = await supabase
      .from('vulnerabilities')
      .update({ 
        status, 
        assignee: assignee || null,
        updated_at: new Date().toISOString() 
      })
      .eq('id', vulnId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Risk score methods
  static async getRiskScores(organizationId: string, limit = 10) {
    const { data, error } = await supabase
      .from('risk_scores')
      .select('*')
      .eq('organization_id', organizationId)
      .order('calculated_date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  static async saveRiskScore(riskScore: Inserts<'risk_scores'>) {
    const { data, error } = await supabase
      .from('risk_scores')
      .insert(riskScore)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Pentest finding methods
  static async getPentestFindings(organizationId: string) {
    const { data, error } = await supabase
      .from('pentest_findings')
      .select('*')
      .eq('organization_id', organizationId)
      .order('test_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createPentestFinding(finding: Inserts<'pentest_findings'>) {
    const { data, error } = await supabase
      .from('pentest_findings')
      .insert(finding)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
