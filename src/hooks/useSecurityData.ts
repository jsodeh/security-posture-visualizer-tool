import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SecurityDataService } from '@/services/SecurityDataService';
import { RiskCalculationService } from '@/services/RiskCalculationService';

// Updated to use the proper UUID format for the demo organization
const DEMO_ORG_ID = '550e8400-e29b-41d4-a716-446655440000';

export const useSecurityData = () => {
  const queryClient = useQueryClient();

  // Assets - disable automatic refetching
  const useAssets = () => useQuery({
    queryKey: ['assets', DEMO_ORG_ID],
    queryFn: () => SecurityDataService.getAssets(DEMO_ORG_ID),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity, // Data never becomes stale
  });

  // Vulnerabilities - disable automatic refetching
  const useVulnerabilities = () => useQuery({
    queryKey: ['vulnerabilities', DEMO_ORG_ID],
    queryFn: () => SecurityDataService.getVulnerabilities(DEMO_ORG_ID),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  // Risk Scores - disable automatic refetching
  const useRiskScores = () => useQuery({
    queryKey: ['riskScores', DEMO_ORG_ID],
    queryFn: () => SecurityDataService.getRiskScores(DEMO_ORG_ID),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  // Pentest Findings - disable automatic refetching
  const usePentestFindings = () => useQuery({
    queryKey: ['pentestFindings', DEMO_ORG_ID],
    queryFn: () => SecurityDataService.getPentestFindings(DEMO_ORG_ID),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
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
