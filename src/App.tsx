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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    },
  },
});

const AppContent = () => {
  const { user, loading, profile, profileLoading } = useAuth();

  console.log('AppContent render:', { 
    user: user ? 'exists' : 'null', 
    loading, 
    profile: profile ? 'exists' : 'null', 
    profileLoading,
    profileCompleted: profile?.profile_completed 
  });

  // Show loading spinner while authentication is being determined
  if (loading) {
    console.log('Showing loading screen - auth loading');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading CyberGuard...</div>
          <div className="text-slate-400 text-sm mt-2">Initializing security dashboard</div>
        </div>
      </div>
    );
  }

  // If no user is authenticated, show login form
  if (!user) {
    console.log('Showing login form - no user');
    return <LoginForm />;
  }

  // Show loading while profile is being fetched
  if (profileLoading) {
    console.log('Showing loading screen - profile loading');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading Profile...</div>
          <div className="text-slate-400 text-sm mt-2">Setting up your account</div>
        </div>
      </div>
    );
  }

  // Check if profile setup is needed (only if profile exists and is not completed)
  if (profile && !profile.profile_completed) {
    console.log('Showing profile setup form - profile incomplete');
    return (
      <ProfileSetupForm
        userId={user.id}
        userEmail={user.email || ''}
        onComplete={() => {
          console.log('Profile setup completed, reloading...');
          // Force a page reload to refresh the auth state
          window.location.reload();
        }}
      />
    );
  }

  // User is authenticated and profile is complete (or demo mode), show main app
  console.log('Showing main app - user authenticated and profile complete');
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