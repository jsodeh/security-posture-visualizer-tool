
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SecurityDataService } from '@/services/SecurityDataService';
import { RiskCalculationService } from '@/services/RiskCalculationService';

// For demo purposes, using a fixed organization ID
const DEMO_ORG_ID = 'demo-org-123';

export const useSecurityData = () => {
  const queryClient = useQueryClient();

  // Assets
  const useAssets = () => useQuery({
    queryKey: ['assets', DEMO_ORG_ID],
    queryFn: () => SecurityDataService.getAssets(DEMO_ORG_ID),
  });

  // Vulnerabilities
  const useVulnerabilities = () => useQuery({
    queryKey: ['vulnerabilities', DEMO_ORG_ID],
    queryFn: () => SecurityDataService.getVulnerabilities(DEMO_ORG_ID),
  });

  // Risk Scores
  const useRiskScores = () => useQuery({
    queryKey: ['riskScores', DEMO_ORG_ID],
    queryFn: () => SecurityDataService.getRiskScores(DEMO_ORG_ID),
  });

  // Pentest Findings
  const usePentestFindings = () => useQuery({
    queryKey: ['pentestFindings', DEMO_ORG_ID],
    queryFn: () => SecurityDataService.getPentestFindings(DEMO_ORG_ID),
  });

  // Calculate Risk Score
  const useCalculateRisk = () => useMutation({
    mutationFn: () => RiskCalculationService.calculateRiskScore(DEMO_ORG_ID),
    onSuccess: (result) => {
      // Save the calculated risk and refresh queries
      RiskCalculationService.saveCalculatedRisk(DEMO_ORG_ID, result);
      queryClient.invalidateQueries({ queryKey: ['riskScores'] });
    },
  });

  // Update Vulnerability Status
  const useUpdateVulnerability = () => useMutation({
    mutationFn: ({ vulnId, status, assignee }: { vulnId: string; status: string; assignee?: string }) =>
      SecurityDataService.updateVulnerabilityStatus(vulnId, status, assignee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vulnerabilities'] });
    },
  });

  return {
    useAssets,
    useVulnerabilities,
    useRiskScores,
    usePentestFindings,
    useCalculateRisk,
    useUpdateVulnerability,
    organizationId: DEMO_ORG_ID,
  };
};
