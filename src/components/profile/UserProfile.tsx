import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Globe, Calendar, ArrowLeft, Loader2, User, Mail, Phone, Briefcase, MapPin, Edit, Save, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const UserProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    company_name: '',
    company_domain: '',
    industry: '',
    company_size: '',
    job_title: '',
    phone: '',
    country: '',
  });

  // Initialize profile data when component mounts or profile changes
  useEffect(() => {
    if (profile) {
      setProfileData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        company_name: profile.company_name || '',
        company_domain: profile.company_domain || '',
        industry: profile.industry || '',
        company_size: profile.company_size || '',
        job_title: profile.job_title || '',
        phone: profile.phone || '',
        country: profile.country || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      await refreshProfile();
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    if (profile) {
      setProfileData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        company_name: profile.company_name || '',
        company_domain: profile.company_domain || '',
        industry: profile.industry || '',
        company_size: profile.company_size || '',
        job_title: profile.job_title || '',
        phone: profile.phone || '',
        country: profile.country || '',
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const industries = [
    'Technology',
    'Finance & Banking',
    'Healthcare',
    'Manufacturing',
    'Retail & E-commerce',
    'Education',
    'Government',
    'Energy & Utilities',
    'Transportation',
    'Real Estate',
    'Media & Entertainment',
    'Non-profit',
    'Other'
  ];

  const companySizes = [
    'Startup (1-10 employees)',
    'Small (11-50 employees)',
    'Medium (51-200 employees)',
    'Large (201-1000 employees)',
    'Enterprise (1000+ employees)'
  ];

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Australia',
    'Japan',
    'Singapore',
    'Netherlands',
    'Sweden',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header - Matching dashboard styling */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="bg-slate-800 text-white border-slate-600 hover:bg-slate-700 hover:text-white hover:border-slate-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">User Profile</h1>
              <p className="text-slate-400 text-sm">Manage your account and company information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <User className="h-8 w-8 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">
                      {profileData.first_name && profileData.last_name 
                        ? `${profileData.first_name} ${profileData.last_name}`
                        : user?.email?.split('@')[0] || 'User Profile'
                      }
                    </CardTitle>
                    <p className="text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={profile?.profile_completed ? "bg-green-500/20 text-green-400 border-green-400" : "bg-yellow-500/20 text-yellow-400 border-yellow-400"}>
                    {profile?.profile_completed ? 'Complete' : 'Incomplete'}
                  </Badge>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="bg-slate-700 text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg shadow-xl">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-white">Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">First Name</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {profileData.first_name || 'Not specified'}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-slate-400">Last Name</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {profileData.last_name || 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-slate-400">Email Address</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <p className="text-white font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">Job Title</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.job_title}
                        onChange={(e) => handleInputChange('job_title', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        placeholder="e.g., Security Manager"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <Briefcase className="h-4 w-4 text-slate-400" />
                        <p className="text-white font-medium">
                          {profileData.job_title || 'Not specified'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-slate-400">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        placeholder="+1 (555) 123-4567"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <p className="text-white font-medium">
                          {profileData.phone || 'Not specified'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-slate-400">Country</Label>
                  {isEditing ? (
                    <Select value={profileData.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <p className="text-white font-medium">
                        {profileData.country || 'Not specified'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg shadow-xl">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-white">Company Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-400">Company Name</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="Enter your company name"
                    />
                  ) : (
                    <p className="text-white font-medium mt-1">
                      {profileData.company_name || 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-slate-400">Company Domain</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.company_domain}
                      onChange={(e) => handleInputChange('company_domain', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="example.com"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 mt-1">
                      <Globe className="h-4 w-4 text-slate-400" />
                      <p className="text-white font-medium">
                        {profileData.company_domain || 'Not specified'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-slate-400">Industry</Label>
                  {isEditing ? (
                    <Select value={profileData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-white font-medium mt-1">
                      {profileData.industry || 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-slate-400">Company Size</Label>
                  {isEditing ? (
                    <Select value={profileData.company_size} onValueChange={(value) => handleInputChange('company_size', value)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2 mt-1">
                      <Users className="h-4 w-4 text-slate-400" />
                      <p className="text-white font-medium">
                        {profileData.company_size || 'Not specified'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg shadow-xl">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">Account Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="text-lg font-bold text-white">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                  </div>
                  <div className="text-sm text-slate-400">Account Created</div>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="text-lg font-bold text-white">
                    {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}
                  </div>
                  <div className="text-sm text-slate-400">Last Updated</div>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="text-lg font-bold text-blue-400">Active</div>
                  <div className="text-sm text-slate-400">Account Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
