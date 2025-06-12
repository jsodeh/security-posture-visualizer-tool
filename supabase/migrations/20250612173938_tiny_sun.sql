/*
  # Create Cybersecurity Risk Management Schema

  1. New Tables
    - `organizations` - Multi-tenant organization support
      - `id` (uuid, primary key)
      - `name` (text)
      - `domain` (text)
      - `industry` (text)
      - `size` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `assets` - IT assets and attack surface tracking
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key)
      - `name` (text)
      - `type` (text)
      - `ip_address` (text)
      - `hostname` (text)
      - `ports` (integer array)
      - `services` (text array)
      - `operating_system` (text)
      - `criticality` (integer)
      - `exposure_score` (integer)
      - `last_scanned` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `vulnerabilities` - Security vulnerabilities tracking
      - `id` (uuid, primary key)
      - `asset_id` (uuid, foreign key)
      - `cve_id` (text)
      - `title` (text)
      - `description` (text)
      - `severity` (text)
      - `cvss_score` (numeric)
      - `cvss_vector` (text)
      - `status` (text)
      - `assignee` (text)
      - `discovered_date` (timestamptz)
      - `source` (text)
      - `component` (text)
      - `solution` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `risk_scores` - Historical risk score tracking
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key)
      - `overall_score` (integer)
      - `attack_surface_score` (integer)
      - `vulnerability_score` (integer)
      - `pentest_score` (integer)
      - `calculated_date` (timestamptz)
      - `created_at` (timestamptz)
    
    - `pentest_findings` - Penetration test results
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key)
      - `finding_id` (text)
      - `title` (text)
      - `description` (text)
      - `severity` (text)
      - `risk_rating` (text)
      - `affected_assets` (text array)
      - `evidence` (text)
      - `recommendation` (text)
      - `status` (text)
      - `tester` (text)
      - `test_date` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add performance indexes
    - Insert demo data with proper UUID format

  3. Sample Data
    - Demo organization with proper UUID
    - Sample assets, vulnerabilities, risk scores, and pentest findings
*/

-- Create organizations table for multi-tenant support
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  industry TEXT NOT NULL,
  size TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assets table for attack surface tracking
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  hostname TEXT,
  ports INTEGER[],
  services TEXT[],
  operating_system TEXT,
  criticality INTEGER NOT NULL,
  exposure_score INTEGER DEFAULT 0,
  last_scanned TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vulnerabilities table for security findings
CREATE TABLE IF NOT EXISTS public.vulnerabilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  cve_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL,
  cvss_score NUMERIC NOT NULL,
  cvss_vector TEXT,
  status TEXT DEFAULT 'Open',
  assignee TEXT,
  discovered_date TIMESTAMP WITH TIME ZONE NOT NULL,
  source TEXT NOT NULL,
  component TEXT NOT NULL,
  solution TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create risk_scores table for historical tracking
CREATE TABLE IF NOT EXISTS public.risk_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL,
  attack_surface_score INTEGER NOT NULL,
  vulnerability_score INTEGER NOT NULL,
  pentest_score INTEGER NOT NULL,
  calculated_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pentest_findings table for manual test results
CREATE TABLE IF NOT EXISTS public.pentest_findings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  finding_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL,
  risk_rating TEXT NOT NULL,
  affected_assets TEXT[],
  evidence TEXT,
  recommendation TEXT NOT NULL,
  status TEXT DEFAULT 'Open',
  tester TEXT NOT NULL,
  test_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pentest_findings ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assets_organization_id ON public.assets(organization_id);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_asset_id ON public.vulnerabilities(asset_id);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON public.vulnerabilities(severity);
CREATE INDEX IF NOT EXISTS idx_risk_scores_organization_id ON public.risk_scores(organization_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_calculated_date ON public.risk_scores(calculated_date);
CREATE INDEX IF NOT EXISTS idx_pentest_findings_organization_id ON public.pentest_findings(organization_id);

-- Insert sample cybersecurity data for testing (using proper UUID format)
INSERT INTO public.organizations (id, name, domain, industry, size) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'CyberGuard Demo Corp', 'cyberguard-demo.com', 'Technology', 'Medium (100-500 employees)')
ON CONFLICT (id) DO NOTHING;

-- Insert sample assets
INSERT INTO public.assets (organization_id, name, type, ip_address, hostname, ports, services, operating_system, criticality, exposure_score, last_scanned) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Web Server 01', 'Server', '192.168.1.10', 'web01.cyberguard-demo.com', ARRAY[80, 443, 22], ARRAY['HTTP', 'HTTPS', 'SSH'], 'Ubuntu 20.04', 5, 75, now() - interval '2 days'),
('550e8400-e29b-41d4-a716-446655440000', 'Database Server', 'Database', '192.168.1.20', 'db01.cyberguard-demo.com', ARRAY[3306, 22], ARRAY['MySQL', 'SSH'], 'CentOS 8', 5, 25, now() - interval '1 day'),
('550e8400-e29b-41d4-a716-446655440000', 'Load Balancer', 'Network', '203.0.113.10', 'lb01.cyberguard-demo.com', ARRAY[80, 443, 8080], ARRAY['HTTP', 'HTTPS', 'Management'], 'pfSense', 4, 85, now() - interval '3 hours'),
('550e8400-e29b-41d4-a716-446655440000', 'Employee Workstation', 'Workstation', '192.168.1.100', 'ws-john.cyberguard-demo.com', ARRAY[135, 139, 445], ARRAY['RPC', 'NetBIOS', 'SMB'], 'Windows 10', 2, 15, now() - interval '1 week')
ON CONFLICT DO NOTHING;

-- Insert sample vulnerabilities
DO $$
DECLARE
    web_server_id UUID;
    db_server_id UUID;
    lb_server_id UUID;
BEGIN
    -- Get asset IDs
    SELECT id INTO web_server_id FROM public.assets WHERE name = 'Web Server 01' AND organization_id = '550e8400-e29b-41d4-a716-446655440000';
    SELECT id INTO db_server_id FROM public.assets WHERE name = 'Database Server' AND organization_id = '550e8400-e29b-41d4-a716-446655440000';
    SELECT id INTO lb_server_id FROM public.assets WHERE name = 'Load Balancer' AND organization_id = '550e8400-e29b-41d4-a716-446655440000';
    
    -- Insert vulnerabilities if assets exist
    IF web_server_id IS NOT NULL THEN
        INSERT INTO public.vulnerabilities (asset_id, cve_id, title, description, severity, cvss_score, cvss_vector, status, assignee, discovered_date, source, component, solution) VALUES 
        (web_server_id, 'CVE-2024-1234', 'SQL Injection in User Authentication', 'The user authentication module is vulnerable to SQL injection attacks allowing unauthorized access.', 'Critical', 9.8, 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H', 'Open', 'John Doe', now() - interval '5 days', 'Pentest', 'Web Application', 'Implement prepared statements and input validation'),
        (web_server_id, 'CVE-2024-5678', 'Cross-Site Scripting (XSS) in Comments', 'User comments section is vulnerable to stored XSS attacks.', 'High', 7.4, 'CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N', 'In Progress', 'Jane Smith', now() - interval '3 days', 'Scanner', 'Web Application', 'Implement proper output encoding and CSP headers')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF db_server_id IS NOT NULL THEN
        INSERT INTO public.vulnerabilities (asset_id, cve_id, title, description, severity, cvss_score, cvss_vector, status, assignee, discovered_date, source, component, solution) VALUES 
        (db_server_id, 'CVE-2024-9012', 'Unencrypted Data Transmission', 'Database connections are not using SSL/TLS encryption.', 'High', 7.2, 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N', 'Resolved', 'Mike Johnson', now() - interval '1 week', 'Pentest', 'Database', 'Configure SSL/TLS for all database connections')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF lb_server_id IS NOT NULL THEN
        INSERT INTO public.vulnerabilities (asset_id, cve_id, title, description, severity, cvss_score, cvss_vector, status, assignee, discovered_date, source, component, solution) VALUES 
        (lb_server_id, 'CVE-2024-3456', 'Weak SSL Configuration', 'SSL/TLS configuration allows weak ciphers and protocols.', 'Medium', 5.3, 'CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:N/A:N', 'Open', 'Alice Brown', now() - interval '2 days', 'Scanner', 'Network', 'Update SSL configuration to use strong ciphers only')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Insert sample risk scores
INSERT INTO public.risk_scores (organization_id, overall_score, attack_surface_score, vulnerability_score, pentest_score, calculated_date) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 85, 78, 82, 95, now() - interval '4 months'),
('550e8400-e29b-41d4-a716-446655440000', 82, 75, 79, 92, now() - interval '3 months'),
('550e8400-e29b-41d4-a716-446655440000', 78, 72, 75, 88, now() - interval '2 months'),
('550e8400-e29b-41d4-a716-446655440000', 75, 68, 72, 85, now() - interval '1 month'),
('550e8400-e29b-41d4-a716-446655440000', 72, 65, 68, 82, now())
ON CONFLICT DO NOTHING;

-- Insert sample pentest findings
INSERT INTO public.pentest_findings (organization_id, finding_id, title, description, severity, risk_rating, affected_assets, evidence, recommendation, status, tester, test_date) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'PT-2024-001', 'Privilege Escalation via Misconfigured Service', 'Local privilege escalation vulnerability found in web application service configuration.', 'High', 'High', ARRAY['web01.cyberguard-demo.com'], 'Service running with excessive privileges, allows local users to gain system access.', 'Configure service to run with minimum required privileges and implement proper access controls.', 'Open', 'Alex Chen', now() - interval '1 week'),
('550e8400-e29b-41d4-a716-446655440000', 'PT-2024-002', 'Weak Password Policy Implementation', 'Password policy enforcement is insufficient across multiple systems.', 'Medium', 'Medium', ARRAY['web01.cyberguard-demo.com', 'db01.cyberguard-demo.com'], 'Users able to set weak passwords, no complexity requirements enforced.', 'Implement and enforce strong password policy with complexity requirements, length minimums, and regular rotation.', 'In Progress', 'Sarah Wilson', now() - interval '5 days'),
('550e8400-e29b-41d4-a716-446655440000', 'PT-2024-003', 'Exposed Administrative Interface', 'Administrative interface accessible without proper authentication from external networks.', 'Critical', 'Critical', ARRAY['lb01.cyberguard-demo.com'], 'Management interface on port 8080 accessible externally without authentication.', 'Restrict administrative interface access to internal networks only and implement strong authentication.', 'Resolved', 'David Kim', now() - interval '2 weeks')
ON CONFLICT DO NOTHING;