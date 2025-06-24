import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LoginFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ open, onOpenChange }) => {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        if (!organizationName) {
          toast.error("Organization name is required for sign up.");
          setLoading(false);
          return;
        }
        await signUp(email, password, organizationName);
        toast.success("Check your email for a confirmation link!");
        onOpenChange(false); // Close modal on success
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success("Signed in successfully!");
        onOpenChange(false); // Close modal on success
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-400" />
          </div>
          <DialogTitle className="text-2xl text-center text-white">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            {isSignUp ? 'Join CyberGuard to start managing your cyber risk.' : 'Sign in to access your dashboard.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="org-name" className="text-white">Organization Name</Label>
              <Input
                id="org-name"
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-1"
                placeholder="Your Company Inc."
                required={isSignUp}
              />
            </div>
          )}
          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-1"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-1"
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <span className="text-slate-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <Button variant="link" onClick={() => setIsSignUp(!isSignUp)} className="text-blue-400">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginForm;
