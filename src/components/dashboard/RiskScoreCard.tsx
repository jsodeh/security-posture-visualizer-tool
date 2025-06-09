
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, TrendingUp, TrendingDown } from 'lucide-react';

interface RiskScoreCardProps {
  score: number;
}

const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ score }) => {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Low', color: 'bg-green-500', textColor: 'text-green-400' };
    if (score >= 60) return { level: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
    if (score >= 40) return { level: 'High', color: 'bg-orange-500', textColor: 'text-orange-400' };
    return { level: 'Critical', color: 'bg-red-500', textColor: 'text-red-400' };
  };

  const risk = getRiskLevel(score);
  const previousScore = 75; // Mock previous score
  const isImproving = score > previousScore;

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
            <div className="text-4xl font-bold text-white mb-2">{score}</div>
            <div className="flex items-center justify-center text-sm">
              {isImproving ? (
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
              )}
              <span className={isImproving ? 'text-green-400' : 'text-red-400'}>
                {isImproving ? '+' : ''}{score - previousScore} from last assessment
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Security Posture</span>
              <span className={risk.textColor}>{score}%</span>
            </div>
            <Progress 
              value={score} 
              className="bg-slate-700"
              style={{
                background: 'linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 50%, #22c55e 100%)'
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-white font-semibold">Last Scan</div>
              <div className="text-slate-400">2 hours ago</div>
            </div>
            <div className="text-center">
              <div className="text-white font-semibold">Next Scan</div>
              <div className="text-slate-400">In 22 hours</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskScoreCard;
