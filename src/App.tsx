import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginForm from "@/components/auth/LoginForm";
import ProfileSetupForm from "@/components/auth/ProfileSetupForm";
import UserProfile from "@/components/profile/UserProfile";
import LandingPage from "./pages/LandingPage";
import { useState } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading, profile, profileLoading } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Show loading spinner while authentication is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading CyberGuard...</div>
        </div>
      </div>
    );
  }

  // If no user is authenticated, show the landing page
  if (!user) {
    return (
      <>
        <LandingPage onGetStarted={() => setLoginModalOpen(true)} />
        <LoginForm open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      </>
    );
  }

  // Show loading while profile is being fetched
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading Profile...</div>
        </div>
      </div>
    );
  }

  // Check if profile setup is needed
  if (profile && !profile.profile_completed) {
    return (
      <ProfileSetupForm
        userId={user.id}
        userEmail={user.email || ''}
        onComplete={() => {
          // The profile has already been refreshed by ProfileSetupForm
        }}
      />
    );
  }

  // User is authenticated and profile is complete, show main app
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
