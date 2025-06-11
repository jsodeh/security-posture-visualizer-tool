
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          domain: string;
          industry: string;
          size: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          domain: string;
          industry: string;
          size: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: string;
          industry?: string;
          size?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          type: string;
          ip_address: string;
          hostname: string;
          ports: number[];
          services: string[];
          operating_system: string;
          criticality: number;
          exposure_score: number;
          last_scanned: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          type: string;
          ip_address: string;
          hostname?: string;
          ports?: number[];
          services?: string[];
          operating_system?: string;
          criticality: number;
          exposure_score?: number;
          last_scanned?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          type?: string;
          ip_address?: string;
          hostname?: string;
          ports?: number[];
          services?: string[];
          operating_system?: string;
          criticality?: number;
          exposure_score?: number;
          last_scanned?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      vulnerabilities: {
        Row: {
          id: string;
          asset_id: string;
          cve_id: string;
          title: string;
          description: string;
          severity: string;
          cvss_score: number;
          cvss_vector: string;
          status: string;
          assignee: string;
          discovered_date: string;
          source: string;
          component: string;
          solution: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          cve_id: string;
          title: string;
          description: string;
          severity: string;
          cvss_score: number;
          cvss_vector?: string;
          status?: string;
          assignee?: string;
          discovered_date: string;
          source: string;
          component: string;
          solution?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string;
          cve_id?: string;
          title?: string;
          description?: string;
          severity?: string;
          cvss_score?: number;
          cvss_vector?: string;
          status?: string;
          assignee?: string;
          discovered_date?: string;
          source?: string;
          component?: string;
          solution?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      risk_scores: {
        Row: {
          id: string;
          organization_id: string;
          overall_score: number;
          attack_surface_score: number;
          vulnerability_score: number;
          pentest_score: number;
          calculated_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          overall_score: number;
          attack_surface_score: number;
          vulnerability_score: number;
          pentest_score: number;
          calculated_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          overall_score?: number;
          attack_surface_score?: number;
          vulnerability_score?: number;
          pentest_score?: number;
          calculated_date?: string;
          created_at?: string;
        };
      };
      pentest_findings: {
        Row: {
          id: string;
          organization_id: string;
          finding_id: string;
          title: string;
          description: string;
          severity: string;
          risk_rating: string;
          affected_assets: string[];
          evidence: string;
          recommendation: string;
          status: string;
          tester: string;
          test_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          finding_id: string;
          title: string;
          description: string;
          severity: string;
          risk_rating: string;
          affected_assets?: string[];
          evidence?: string;
          recommendation: string;
          status?: string;
          tester: string;
          test_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          finding_id?: string;
          title?: string;
          description?: string;
          severity?: string;
          risk_rating?: string;
          affected_assets?: string[];
          evidence?: string;
          recommendation?: string;
          status?: string;
          tester?: string;
          test_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
