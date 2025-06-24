import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SecurityDataService } from '@/services/SecurityDataService';
import { RiskCalculationService } from '@/services/RiskCalculationService';

export const useSecurityData = (organizationId: string | null) => {
  const queryClient = useQueryClient();
  const isEnabled = !!organizationId; // Queries will only run if an organizationId is present

  // Assets
  const useAssets = () => useQuery({
    queryKey: ['assets', organizationId],
    queryFn: () => SecurityDataService.getAssets(organizationId!),
    enabled: isEnabled,
  });

  // Vulnerabilities
  const useVulnerabilities = () => useQuery({
    queryKey: ['vulnerabilities', organizationId],
    queryFn: () => SecurityDataService.getVulnerabilities(organizationId!),
    enabled: isEnabled,
  });

  // Risk Scores
  const useRiskScores = () => useQuery({
    queryKey: ['riskScores', organizationId],
    queryFn: () => SecurityDataService.getRiskScores(organizationId!),
    enabled: isEnabled,
  });

  // Pentest Findings
  const usePentestFindings = () => useQuery({
    queryKey: ['pentestFindings', organizationId],
    queryFn: () => SecurityDataService.getPentestFindings(organizationId!),
    enabled: isEnabled,
  });

  // Calculate Risk Score
  const useCalculateRisk = () => useMutation({
    mutationFn: () => {
      if (!organizationId) throw new Error("Organization not loaded.");
      return RiskCalculationService.calculateRiskScore(organizationId);
    },
    onSuccess: (result) => {
      if (!organizationId) return;
      RiskCalculationService.saveCalculatedRisk(organizationId, result);
      queryClient.invalidateQueries({ queryKey: ['riskScores', organizationId] });
    },
  });

  // Update Vulnerability Status
  const useUpdateVulnerability = () => useMutation({
    mutationFn: ({ vulnId, status, assignee }: { vulnId: string; status: string; assignee?: string }) =>
      SecurityDataService.updateVulnerabilityStatus(vulnId, status, assignee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vulnerabilities', organizationId] });
    },
  });

  return {
    useAssets,
    useVulnerabilities,
    useRiskScores,
    usePentestFindings,
    useCalculateRisk,
    useUpdateVulnerability,
  };
};
