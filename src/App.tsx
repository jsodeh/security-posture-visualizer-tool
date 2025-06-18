import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginForm from "@/components/auth/LoginForm";
import ProfileSetupForm from "@/components/auth/ProfileSetupForm";
import UserProfile from "@/components/profile/UserProfile";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading, profile, profileLoading } = useAuth();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  // Check if profile setup is needed
  if (profile && !profile.profile_completed) {
    return (
      <ProfileSetupForm
        userId={user.id}
        userEmail={user.email || ''}
        onComplete={() => window.location.reload()}
      />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
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