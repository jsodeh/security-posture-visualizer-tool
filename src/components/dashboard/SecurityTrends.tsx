
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SecurityTrends = () => {
  const trendData = [
    { date: '2024-01-01', riskScore: 85, vulnerabilities: 52, incidents: 3 },
    { date: '2024-02-01', riskScore: 82, vulnerabilities: 48, incidents: 2 },
    { date: '2024-03-01', riskScore: 78, vulnerabilities: 45, incidents: 1 },
    { date: '2024-04-01', riskScore: 75, vulnerabilities: 42, incidents: 2 },
    { date: '2024-05-01', riskScore: 72, vulnerabilities: 38, incidents: 1 },
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-white">Security Trends</CardTitle>
        <CardDescription className="text-slate-400">
          Historical view of key security metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendData}>
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
              dataKey="riskScore" 
              stroke="#3B82F6" 
              strokeWidth={3}
              name="Risk Score"
            />
            <Line 
              type="monotone" 
              dataKey="vulnerabilities" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Vulnerabilities"
            />
            <Line 
              type="monotone" 
              dataKey="incidents" 
              stroke="#F59E0B" 
              strokeWidth={2}
              name="Incidents"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SecurityTrends;
