import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Tables, Inserts } from '@/lib/supabase';

// Demo data for when Supabase is not configured
const DEMO_ASSETS = [
  {
    id: 'demo-asset-1',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Web Server 01',
    type: 'Server',
    ip_address: '192.168.1.10',
    hostname: 'web01.cyberguard-demo.com',
    ports: [80, 443, 22],
    services: ['HTTP', 'HTTPS', 'SSH'],
    operating_system: 'Ubuntu 20.04',
    criticality: 5,
    exposure_score: 75,
    last_scanned: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'demo-asset-2',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Database Server',
    type: 'Database',
    ip_address: '192.168.1.20',
    hostname: 'db01.cyberguard-demo.com',
    ports: [3306, 22],
    services: ['MySQL', 'SSH'],
    operating_system: 'CentOS 8',
    criticality: 5,
    exposure_score: 25,
    last_scanned: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEMO_VULNERABILITIES = [
  {
    id: 'demo-vuln-1',
    asset_id: 'demo-asset-1',
    cve_id: 'CVE-2024-1234',
    title: 'SQL Injection in User Authentication',
    description: 'The user authentication module is vulnerable to SQL injection attacks.',
    severity: 'Critical',
    cvss_score: 9.8,
    cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    status: 'Open',
    assignee: 'John Doe',
    discovered_date: new Date().toISOString(),
    source: 'Pentest',
    component: 'Web Application',
    solution: 'Implement prepared statements',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEMO_RISK_SCORES = [
  {
    id: 'demo-risk-1',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    overall_score: 72,
    attack_surface_score: 65,
    vulnerability_score: 68,
    pentest_score: 82,
    calculated_date: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

const DEMO_PENTEST_FINDINGS = [
  {
    id: 'demo-pentest-1',
    organization_id: '550e8400-e29b-41d4-a716-446655440000',
    finding_id: 'PT-2024-001',
    title: 'Privilege Escalation via Misconfigured Service',
    description: 'Local privilege escalation vulnerability found.',
    severity: 'High',
    risk_rating: 'High',
    affected_assets: ['web01.cyberguard-demo.com'],
    evidence: 'Service running with excessive privileges.',
    recommendation: 'Configure service with minimum privileges.',
    status: 'Open',
    tester: 'Alex Chen',
    test_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

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
      return DEMO_ASSETS;
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
      return DEMO_ASSETS.find(a => a.id === assetId);
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
      return DEMO_VULNERABILITIES;
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
      return DEMO_VULNERABILITIES.find(v => v.id === vulnId);
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
      return DEMO_RISK_SCORES;
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
      return DEMO_PENTEST_FINDINGS;
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