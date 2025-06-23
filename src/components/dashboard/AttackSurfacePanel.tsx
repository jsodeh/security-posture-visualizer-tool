import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, Server, Cloud, Smartphone, Wifi, AlertTriangle, Shield, Loader2 } from 'lucide-react';
import { useSecurityData } from '@/hooks/useSecurityData';

const AttackSurfacePanel: React.FC = () => {
  const { useAssets } = useSecurityData();
  const { data: assets = [], isLoading, error } = useAssets();

  // Transform assets data into attack surface categories
  const attackSurfaceData = React.useMemo(() => {
    if (!assets.length) {
      // Fallback data when no real data is available
      return [
        { name: 'Web Applications', exposed: 45, secured: 55, risk: 'high', count: 3 },
        { name: 'Network Services', exposed: 30, secured: 70, risk: 'medium', count: 5 },
        { name: 'Cloud Infrastructure', exposed: 25, secured: 75, risk: 'medium', count: 2 },
        { name: 'Mobile Apps', exposed: 15, secured: 85, risk: 'low', count: 1 },
        { name: 'IoT Devices', exposed: 60, secured: 40, risk: 'critical', count: 4 },
      ];
    }

    // Group assets by type and calculate exposure
    const assetGroups = assets.reduce((groups: any, asset) => {
      const category = getCategoryFromType(asset.type);
      if (!groups[category]) {
        groups[category] = { assets: [], totalExposure: 0, count: 0 };
      }
      groups[category].assets.push(asset);
      groups[category].totalExposure += asset.exposure_score || 0;
      groups[category].count += 1;
      return groups;
    }, {});

    return Object.entries(assetGroups).map(([category, data]: [string, any]) => {
      const avgExposure = data.totalExposure / data.count;
      const exposed = Math.round(avgExposure);
      const secured = Math.round(100 - avgExposure);
      const risk = getRiskLevel(avgExposure);

      return {
        name: category,
        exposed,
        secured,
        risk,
        count: data.count
      };
    });
  }, [assets]);

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

  const chartData = attackSurfaceData.map(item => ({
    name: item.name.split(' ')[0], // Shortened for chart
    exposed: item.exposed,
    secured: item.secured
  }));

  // Calculate summary statistics
  const totalAssets = assets.length || 245; // Fallback for demo
  const highRiskAssets = attackSurfaceData.filter(item => item.risk === 'critical' || item.risk === 'high').reduce((sum, item) => sum + item.count, 0) || 42;
  const mediumRiskAssets = attackSurfaceData.filter(item => item.risk === 'medium').reduce((sum, item) => sum + item.count, 0) || 89;
  const lowRiskAssets = attackSurfaceData.filter(item => item.risk === 'low').reduce((sum, item) => sum + item.count, 0) || 114;

  if (error) {
    console.error('Error loading assets:', error);
  }

  return (
    <div className="space-y-6">
      {/* Attack Surface Overview Chart */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white">Attack Surface Exposure</CardTitle>
          <CardDescription className="text-slate-400">
            Security coverage across different asset categories
            {isLoading && ' (Loading...)'}
            {error && ' (Using demo data)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="ml-2 text-slate-400">Loading attack surface data...</span>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>

      {/* Detailed Asset Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attackSurfaceData.map((asset, index) => (
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

              <div className="text-center text-sm text-slate-400">
                {asset.count} {asset.count === 1 ? 'asset' : 'assets'} in this category
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
              <div className="text-3xl font-bold text-white mb-2">{totalAssets}</div>
              <div className="text-sm text-slate-400">Total Assets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">{highRiskAssets}</div>
              <div className="text-sm text-slate-400">High Risk Assets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{mediumRiskAssets}</div>
              <div className="text-sm text-slate-400">Medium Risk Assets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{lowRiskAssets}</div>
              <div className="text-sm text-slate-400">Low Risk Assets</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper functions
function getCategoryFromType(type: string): string {
  const typeMap: { [key: string]: string } = {
    'Server': 'Network Services',
    'Database': 'Network Services',
    'Network': 'Network Services',
    'Workstation': 'Network Services',
    'Web': 'Web Applications',
    'Application': 'Web Applications',
    'Cloud': 'Cloud Infrastructure',
    'Mobile': 'Mobile Apps',
    'IoT': 'IoT Devices'
  };

  for (const [key, category] of Object.entries(typeMap)) {
    if (type.toLowerCase().includes(key.toLowerCase())) {
      return category;
    }
  }
  
  return 'Network Services'; // Default category
}

function getRiskLevel(exposureScore: number): string {
  if (exposureScore >= 80) return 'critical';
  if (exposureScore >= 60) return 'high';
  if (exposureScore >= 40) return 'medium';
  return 'low';
}

export default AttackSurfacePanel;
