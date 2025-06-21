import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Tables, Inserts } from '@/lib/supabase';

// Empty demo data for new users - no pre-populated data
const EMPTY_DEMO_DATA = {
  assets: [],
  vulnerabilities: [],
  riskScores: [],
  pentestFindings: []
};

export class SecurityDataService {
  // Organization methods
  static async getOrganization(id: string) {
    if (!isSupabaseConfigured) {
      return {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'CyberGuard Demo Corp',
        domain: 'cyberguard-demo.com',
        industry: 'Technology',
        size: 'Medium (100-500 employees)',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createOrganization(org: Inserts<'organizations'>) {
    if (!isSupabaseConfigured) {
      return { ...org, id: 'demo-org-1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    }

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
    if (!isSupabaseConfigured) {
      return EMPTY_DEMO_DATA.assets;
    }

    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createAsset(asset: Inserts<'assets'>) {
    if (!isSupabaseConfigured) {
      return { ...asset, id: `demo-asset-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    }

    const { data, error } = await supabase
      .from('assets')
      .insert(asset)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateAssetExposure(assetId: string, exposureScore: number) {
    if (!isSupabaseConfigured) {
      return EMPTY_DEMO_DATA.assets.find(a => a.id === assetId);
    }

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
    if (!isSupabaseConfigured) {
      return EMPTY_DEMO_DATA.vulnerabilities;
    }

    const { data, error } = await supabase
      .from('vulnerabilities')
      .select(`
        *,
        assets!inner(organization_id)
      `)
      .eq('assets.organization_id', organizationId)
      .order('cvss_score', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createVulnerability(vulnerability: Inserts<'vulnerabilities'>) {
    if (!isSupabaseConfigured) {
      return { ...vulnerability, id: `demo-vuln-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    }

    const { data, error } = await supabase
      .from('vulnerabilities')
      .insert(vulnerability)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateVulnerabilityStatus(vulnId: string, status: string, assignee?: string) {
    if (!isSupabaseConfigured) {
      return EMPTY_DEMO_DATA.vulnerabilities.find(v => v.id === vulnId);
    }

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
    if (!isSupabaseConfigured) {
      return EMPTY_DEMO_DATA.riskScores;
    }

    const { data, error } = await supabase
      .from('risk_scores')
      .select('*')
      .eq('organization_id', organizationId)
      .order('calculated_date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }

  static async saveRiskScore(riskScore: Inserts<'risk_scores'>) {
    if (!isSupabaseConfigured) {
      return { ...riskScore, id: `demo-risk-${Date.now()}`, created_at: new Date().toISOString() };
    }

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
    if (!isSupabaseConfigured) {
      return EMPTY_DEMO_DATA.pentestFindings;
    }

    const { data, error } = await supabase
      .from('pentest_findings')
      .select('*')
      .eq('organization_id', organizationId)
      .order('test_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createPentestFinding(finding: Inserts<'pentest_findings'>) {
    if (!isSupabaseConfigured) {
      return { ...finding, id: `demo-pentest-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    }

    const { data, error } = await supabase
      .from('pentest_findings')
      .insert(finding)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}