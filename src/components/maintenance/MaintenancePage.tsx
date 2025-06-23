import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Wrench, Clock, Mail } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800/50 border-slate-700 backdrop-blur-lg shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Shield className="h-16 w-16 text-blue-400" />
              <Wrench className="h-8 w-8 text-yellow-400 absolute -bottom-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-3xl text-white mb-2">System Maintenance</CardTitle>
          <p className="text-slate-400 text-lg">
            CyberGuard is currently undergoing scheduled maintenance
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Maintenance in Progress</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              We're currently performing system updates and improvements to enhance your 
              cybersecurity risk management experience. During this time, the platform 
              will be temporarily unavailable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">What's Being Updated</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Enhanced security features</li>
                <li>• Improved data processing</li>
                <li>• Performance optimizations</li>
                <li>• New file format support</li>
              </ul>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">Expected Duration</h4>
              <p className="text-slate-300 text-sm">
                Maintenance is expected to complete within the next few hours. 
                We appreciate your patience as we work to improve the platform.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <div className="flex items-center justify-center space-x-2 text-slate-400 mb-4">
              <Mail className="h-5 w-5" />
              <span>Need immediate assistance?</span>
            </div>
            <p className="text-slate-300 text-sm">
              Contact our support team at{' '}
              <a href="mailto:support@cyberguard.com" className="text-blue-400 hover:text-blue-300 underline">
                support@cyberguard.com
              </a>
            </p>
          </div>

          <div className="text-center pt-6 border-t border-slate-600">
            <p className="text-slate-500 text-sm">
              Thank you for choosing CyberGuard for your cybersecurity needs
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenancePage;
