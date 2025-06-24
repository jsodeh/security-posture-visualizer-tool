import React from 'react';
import { Shield, TrendingUp, Upload, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
    <div className="flex justify-center items-center h-12 w-12 rounded-full bg-blue-500/20 text-blue-400 mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-slate-900/50 backdrop-blur-lg z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">CyberGuard</h1>
          </div>
          <Button onClick={onGetStarted}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-32 pb-16 text-center">
        <h2 className="text-5xl font-extrabold text-white mb-4">
          Understand Your Cyber Risk in Minutes
        </h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
          CyberGuard translates complex security data from any source into a clear, actionable risk score. Upload scans, reports, or even screenshots, and let our AI do the rest.
        </p>
        <Button onClick={onGetStarted} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg">
          Start Your Free Analysis
        </Button>
      </main>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Upload className="h-6 w-6" />}
            title="Unified Data Ingestion"
            description="Upload security data in any format—Nessus, Nmap, PDFs, or even screenshots. We'll parse it all."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="AI-Powered Analysis"
            description="Our advanced AI, powered by Claude 3, extracts and structures security findings from any document."
          />
          <FeatureCard
            icon={<TrendingUp className="h-6 w-6" />}
            title="Actionable Risk Scoring"
            description="Go beyond vulnerability counts with a dynamic risk score that reflects your true security posture."
          />
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 