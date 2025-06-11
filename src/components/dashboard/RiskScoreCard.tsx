
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useSecurityData } from '@/hooks/useSecurityData';

interface RiskScoreCardProps {
  score?: number;
}

const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ score: propScore }) => {
  const { useRiskScores, useCalculateRisk } = useSecurityData();
  const { data: riskScores, isLoading } = useRiskScores();
  const calculateRisk = useCalculateRisk();

  // Use the latest risk score from database or fallback to prop
  const currentScore = riskScores && riskScores.length > 0 ? riskScores[0].overall_score : propScore || 72;
  const previousScore = riskScores && riskScores.length > 1 ? riskScores[1].overall_score : 75;

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Low', color: 'bg-green-500', textColor: 'text-green-400' };
    if (score >= 60) return { level: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
    if (score >= 40) return { level: 'High', color: 'bg-orange-500', textColor: 'text-orange-400' };
    return { level: 'Critical', color: 'bg-red-500', textColor: 'text-red-400' };
  };

  const risk = getRiskLevel(currentScore);
  const isImproving = currentScore > previousScore;

  const handleRecalculate = () => {
    calculateRisk.mutate();
  };

  const lastUpdated = riskScores && riskScores.length > 0 
    ? new Date(riskScores[0].calculated_date).toLocaleString()
    : 'Never';

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 backdrop-blur-lg shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">Risk Score</CardTitle>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <Badge className={`${risk.color} text-white`}>
              {risk.level} Risk
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {isLoading ? '...' : currentScore}
            </div>
            <div className="flex items-center justify-center text-sm">
              {isImproving ? (
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
              )}
              <span className={isImproving ? 'text-green-400' : 'text-red-400'}>
                {isImproving ? '+' : ''}{currentScore - previousScore} from last assessment
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Security Posture</span>
              <span className={risk.textColor}>{currentScore}%</span>
            </div>
            <Progress 
              value={currentScore} 
              className="bg-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 text-sm">
            <div className="text-center">
              <div className="text-white font-semibold">Last Updated</div>
              <div className="text-slate-400">{lastUpdated}</div>
            </div>
            <Button 
              onClick={handleRecalculate}
              disabled={calculateRisk.isPending}
              variant="outline"
              size="sm"
              className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${calculateRisk.isPending ? 'animate-spin' : ''}`} />
              {calculateRisk.isPending ? 'Calculating...' : 'Recalculate'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskScoreCard;
