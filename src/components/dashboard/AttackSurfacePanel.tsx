
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, Server, Cloud, Smartphone, Wifi, AlertTriangle, Shield } from 'lucide-react';

interface AttackSurfaceData {
  name: string;
  exposed: number;
  secured: number;
  risk: string;
}

interface AttackSurfacePanelProps {
  data: AttackSurfaceData[];
}

const AttackSurfacePanel: React.FC<AttackSurfacePanelProps> = ({ data }) => {
  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'web applications': return <Globe className="h-5 w-5" />;
      case 'network services': return <Server className="h-5 w-5" />;
      case 'cloud infrastructure': return <Cloud className="h-5 w-5" />;
      case 'mobile apps': return <Smartphone className="h-5 w-5" />;
      case 'iot devices': return <Wifi className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    const styles = {
      critical: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-green-500 text-white'
    };
    return styles[risk as keyof typeof styles] || styles.medium;
  };

  const chartData = data.map(item => ({
    name: item.name.split(' ')[0], // Shortened for chart
    exposed: item.exposed,
    secured: item.secured
  }));

  return (
    <div className="space-y-6">
      {/* Attack Surface Overview Chart */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white">Attack Surface Exposure</CardTitle>
          <CardDescription className="text-slate-400">
            Security coverage across different asset categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="exposed" fill="#ef4444" name="Exposed" />
              <Bar dataKey="secured" fill="#22c55e" name="Secured" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Asset Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((asset, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-blue-400">
                    {getIcon(asset.name)}
                  </div>
                  <CardTitle className="text-lg text-white">{asset.name}</CardTitle>
                </div>
                <Badge className={getRiskBadge(asset.risk)}>
                  {asset.risk.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Exposure Level</span>
                  <span className="text-sm font-medium text-white">{asset.exposed}%</span>
                </div>
                <Progress 
                  value={asset.exposed} 
                  className="bg-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 font-medium">Exposed</span>
                  </div>
                  <div className="text-2xl font-bold text-red-400">{asset.exposed}%</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 font-medium">Secured</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">{asset.secured}%</div>
                </div>
              </div>

              {asset.risk === 'critical' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Immediate attention required</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white">Attack Surface Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">245</div>
              <div className="text-sm text-slate-400">Total Assets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">42</div>
              <div className="text-sm text-slate-400">High Risk Assets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">89</div>
              <div className="text-sm text-slate-400">Medium Risk Assets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">114</div>
              <div className="text-sm text-slate-400">Low Risk Assets</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttackSurfacePanel;
