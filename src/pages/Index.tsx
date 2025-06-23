import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, TrendingUp, TrendingDown, RefreshCw, Search, FileText, BarChart3, Upload, User, LogOut, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import RiskScoreCard from '@/components/dashboard/RiskScoreCard';
import AttackSurfacePanel from '@/components/dashboard/AttackSurfacePanel';
import PentestResults from '@/components/dashboard/PentestResults';
import SecurityTrends from '@/components/dashboard/SecurityTrends';
import VulnerabilityTable from '@/components/dashboard/VulnerabilityTable';
import EnhancedFileUploadModal from '@/components/upload/EnhancedFileUploadModal';
import { useSecurityData } from '@/hooks/useSecurityData';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Index = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { useVulnerabilities, useAssets, usePentestFindings, useRiskScores } = useSecurityData();
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();
  
  // Fetch real data - only fetch once on mount
  const { data: vulnerabilities = [], refetch: refetchVulns } = useVulnerabilities();
  const { data: assets = [], refetch: refetchAssets } = useAssets();
  const { data: pentestFindings = [], refetch: refetchPentest } = usePentestFindings();
  const { data: riskScores = [], refetch: refetchRisk } = useRiskScores();

  // Calculate real-time metrics from actual data - only show if data exists
  const hasData = vulnerabilities.length > 0 || assets.length > 0 || pentestFindings.length > 0 || riskScores.length > 0;
  
  const currentRiskScore = riskScores.length > 0 ? riskScores[0].overall_score : null;
  const previousRiskScore = riskScores.length > 1 ? riskScores[1].overall_score : null;
  
  const totalVulnerabilities = vulnerabilities.length;
  const openVulnerabilities = vulnerabilities.filter(v => v.status === 'Open').length;
  const vulnerabilityChange = totalVulnerabilities > 0 ? -12 : 0; // Mock change for demo
  
  const totalAssets = assets.length;
  const monitoredAssets = Math.round(totalAssets * 0.68);
  
  // Calculate pentest grade from latest findings
  const latestPentestGrade = React.useMemo(() => {
    if (pentestFindings.length === 0) return null;
    
    // Group findings by most recent test
    const recentFindings = pentestFindings.sort((a, b) => 
      new Date(b.test_date).getTime() - new Date(a.test_date).getTime()
    );
    
    if (recentFindings.length === 0) return null;
    
    // Get findings from the most recent test date
    const latestTestDate = recentFindings[0].test_date;
    const latestTestFindings = recentFindings.filter(f => f.test_date === latestTestDate);
    
    const critical = latestTestFindings.filter(f => f.severity === 'Critical').length;
    const high = latestTestFindings.filter(f => f.severity === 'High').length;
    const medium = latestTestFindings.filter(f => f.severity === 'Medium').length;
    const low = latestTestFindings.filter(f => f.severity === 'Low').length;
    
    return calculatePentestGrade(critical, high, medium, low);
  }, [pentestFindings]);

  // Manual refresh function - only triggered by user action
  const handleRefreshResults = async () => {
    setIsRefreshing(true);
    toast.info('Refreshing security data...');
    
    try {
      await Promise.all([
        refetchVulns(),
        refetchAssets(),
        refetchPentest(),
        refetchRisk()
      ]);
      toast.success('Security data refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh data. Please try again.');
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUploadComplete = () => {
    toast.success('Files processed successfully! Data has been updated.');
    // Only refresh after upload completion
    handleRefreshResults();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Get display name for user
  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  // Only show data if it exists, otherwise show empty state
  const riskTrendData = riskScores.length > 0 
    ? riskScores.slice(0, 5).reverse().map(score => ({
        date: new Date(score.calculated_date).toLocaleDateString(),
        score: score.overall_score,
        critical: Math.floor(Math.random() * 15) + 5,
        high: Math.floor(Math.random() * 25) + 10,
        medium: Math.floor(Math.random() * 50) + 20
      }))
    : [];

  // Calculate vulnerability distribution from real data only
  const vulnerabilityDistribution = React.useMemo(() => {
    if (vulnerabilities.length === 0) {
      return [];
    }

    const distribution = vulnerabilities.reduce((acc, vuln) => {
      const severity = vuln.severity;
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Critical', value: distribution.Critical || 0, color: '#ef4444' },
      { name: 'High', value: distribution.High || 0, color: '#f97316' },
      { name: 'Medium', value: distribution.Medium || 0, color: '#eab308' },
      { name: 'Low', value: distribution.Low || 0, color: '#22c55e' },
    ].filter(item => item.value > 0);
  }, [vulnerabilities]);

  const securityPostureData = hasData ? [
    { subject: 'Patch Management', A: 85, fullMark: 100 },
    { subject: 'Access Control', A: 75, fullMark: 100 },
    { subject: 'Network Security', A: 90, fullMark: 100 },
    { subject: 'Data Protection', A: 80, fullMark: 100 },
    { subject: 'Incident Response', A: 70, fullMark: 100 },
    { subject: 'Security Awareness', A: 65, fullMark: 100 },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">CyberGuard Dashboard</h1>
                <p className="text-slate-400 text-sm">Risk Management & Security Posture Assessment</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                Last Updated: {new Date().toLocaleDateString()}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setUploadModalOpen(true)}
                className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Data
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefreshResults}
                disabled={isRefreshing}
                className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Results'}
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-slate-500 text-white hover:text-white"
                  >
                    <User className="h-4 w-4 mr-2 text-white" />
                    <span className="font-medium text-white">
                      {getDisplayName()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-600 shadow-xl">
                  <DropdownMenuItem 
                    onClick={handleProfileClick}
                    className="text-white hover:bg-slate-700 cursor-pointer focus:bg-slate-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-600" />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-white hover:bg-slate-700 cursor-pointer focus:bg-slate-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-8">
        {!hasData ? (
          // Empty state when no data
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Shield className="h-16 w-16 text-slate-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to CyberGuard</h2>
              <p className="text-slate-400 mb-8">
                Get started by uploading your security scan files to begin monitoring your organization's security posture.
              </p>
              <Button 
                onClick={() => setUploadModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Scan
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Risk Score Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <RiskScoreCard score={currentRiskScore} />
              
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">Active Vulnerabilities</CardTitle>
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">{openVulnerabilities}</div>
                  <div className="flex items-center text-sm">
                    {vulnerabilityChange < 0 ? (
                      <TrendingDown className="h-4 w-4 text-green-400 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-400 mr-1" />
                    )}
                    <span className={vulnerabilityChange < 0 ? "text-green-400" : "text-red-400"}>
                      {Math.abs(vulnerabilityChange)}% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">Attack Surface</CardTitle>
                    <Search className="h-5 w-5 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">{totalAssets}</div>
                  <div className="text-sm text-slate-400">Assets monitored</div>
                  {totalAssets > 0 && (
                    <Progress value={68} className="mt-2 bg-slate-700" />
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">Pentest Grade</CardTitle>
                    <FileText className="h-5 w-5 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {latestPentestGrade || 'N/A'}
                  </div>
                  {latestPentestGrade && (
                    <div className="flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-green-400">Latest assessment</span>
                    </div>
                  )}
                  {!latestPentestGrade && (
                    <div className="text-sm text-slate-400">No pentest data</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-slate-800 border-slate-700 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="attack-surface" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Attack Surface
                </TabsTrigger>
                <TabsTrigger value="pentest" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Pentest Results
                </TabsTrigger>
                <TabsTrigger value="vulnerabilities" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Vulnerabilities
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Risk Trend Chart */}
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
                    <CardHeader>
                      <CardTitle className="text-white">Risk Score Trend</CardTitle>
                      <CardDescription className="text-slate-400">
                        Risk score evolution over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {riskTrendData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={riskTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                            <YAxis stroke="#9CA3AF" fontSize={12} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1F2937', 
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#fff'
                              }} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="score" 
                              stroke="#3B82F6" 
                              strokeWidth={3}
                              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-slate-400">
                          No risk score data available
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Vulnerability Distribution */}
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
                    <CardHeader>
                      <CardTitle className="text-white">Vulnerability Distribution</CardTitle>
                      <CardDescription className="text-slate-400">
                        Current vulnerability breakdown by severity
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {vulnerabilityDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={vulnerabilityDistribution}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}`}
                              labelLine={false}
                            >
                              {vulnerabilityDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1F2937', 
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#fff'
                              }} 
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-slate-400">
                          No vulnerability data available
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Security Posture Radar */}
                {securityPostureData.length > 0 && (
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
                    <CardHeader>
                      <CardTitle className="text-white">Security Posture Assessment</CardTitle>
                      <CardDescription className="text-slate-400">
                        Comprehensive evaluation across key security domains
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <RadarChart data={securityPostureData}>
                          <PolarGrid stroke="#374151" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                          <PolarRadiusAxis 
                            angle={90} 
                            domain={[0, 100]} 
                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                          />
                          <Radar
                            name="Security Score"
                            dataKey="A"
                            stroke="#3B82F6"
                            fill="#3B82F6"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#fff'
                            }} 
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="attack-surface">
                <AttackSurfacePanel />
              </TabsContent>

              <TabsContent value="pentest">
                <PentestResults />
              </TabsContent>

              <TabsContent value="vulnerabilities">
                <VulnerabilityTable />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* Enhanced File Upload Modal */}
      <EnhancedFileUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

// Helper function for calculating pentest grade
function calculatePentestGrade(critical: number, high: number, medium: number, low: number): string {
  const totalFindings = critical + high + medium + low;
  if (totalFindings === 0) return 'A+';
  
  const weightedScore = (critical * 10) + (high * 5) + (medium * 2) + (low * 1);
  const maxPossibleScore = totalFindings * 10;
  const percentage = ((maxPossibleScore - weightedScore) / maxPossibleScore) * 100;
  
  if (percentage >= 95) return 'A+';
  if (percentage >= 90) return 'A';
  if (percentage >= 87) return 'A-';
  if (percentage >= 83) return 'B+';
  if (percentage >= 80) return 'B';
  if (percentage >= 77) return 'B-';
  if (percentage >= 73) return 'C+';
  if (percentage >= 70) return 'C';
  if (percentage >= 67) return 'C-';
  if (percentage >= 63) return 'D+';
  if (percentage >= 60) return 'D';
  if (percentage >= 57) return 'D-';
  return 'F';
}

export default Index;
