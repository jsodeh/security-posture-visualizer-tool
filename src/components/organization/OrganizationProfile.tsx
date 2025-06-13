import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Globe, Calendar, Download, Settings, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const OrganizationProfile = () => {
  const { user, organizationName } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [orgData, setOrgData] = useState({
    name: '',
    domain: '',
    industry: '',
    size: '',
    address: '',
    contactEmail: '',
    phone: '',
  });

  // Initialize organization data when component mounts or user data changes
  useEffect(() => {
    if (user && organizationName) {
      setOrgData({
        name: organizationName,
        domain: organizationName.toLowerCase().replace(/\s+/g, '-') + '.com',
        industry: 'Technology',
        size: 'Medium (100-500 employees)',
        address: '123 Security Street, Cyber City, CC 12345',
        contactEmail: user.email || '',
        phone: '+1 (555) 123-4567',
      });
    }
  }, [user, organizationName]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      toast.success('Organization details updated successfully!');
    } catch (error) {
      toast.error('Failed to update organization details');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setOrgData(prev => ({ ...prev, [field]: value }));
  };

  const handleDownloadReport = (reportType: string) => {
    toast.info(`Generating ${reportType}...`);
    setTimeout(() => {
      toast.success(`${reportType} downloaded successfully!`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header - FIXED to match main dashboard styling */}
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
              <h1 className="text-2xl font-bold text-white">Organization Profile</h1>
              <p className="text-slate-400 text-sm">Manage your organization settings and information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Organization Header - FIXED styling to match dashboard */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Building className="h-8 w-8 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">
                      {orgData.name || 'Your Organization'}
                    </CardTitle>
                    <p className="text-slate-400">{orgData.domain || 'your-domain.com'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-500/20 text-green-400 border-green-400">
                    Active
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isSaving}
                    className="bg-slate-700 text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Organization Details - FIXED styling */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Organization Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">Organization Name</Label>
                    {isEditing ? (
                      <Input
                        value={orgData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        placeholder="Enter organization name"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {orgData.name || 'Not specified'}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-slate-400">Domain</Label>
                    {isEditing ? (
                      <Input
                        value={orgData.domain}
                        onChange={(e) => handleInputChange('domain', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        placeholder="Enter domain"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {orgData.domain || 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">Industry</Label>
                    {isEditing ? (
                      <Select value={orgData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Government">Government</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {orgData.industry || 'Not specified'}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-slate-400">Company Size</Label>
                    {isEditing ? (
                      <Select value={orgData.size} onValueChange={(value) => handleInputChange('size', value)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="Small (1-50 employees)">Small (1-50 employees)</SelectItem>
                          <SelectItem value="Medium (51-500 employees)">Medium (51-500 employees)</SelectItem>
                          <SelectItem value="Large (501-5000 employees)">Large (501-5000 employees)</SelectItem>
                          <SelectItem value="Enterprise (5000+ employees)">Enterprise (5000+ employees)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {orgData.size || 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-slate-400">Address</Label>
                  {isEditing ? (
                    <Input
                      value={orgData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="Enter address"
                    />
                  ) : (
                    <p className="text-white font-medium mt-1">
                      {orgData.address || 'Not specified'}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">Contact Email</Label>
                    {isEditing ? (
                      <Input
                        value={orgData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        placeholder="Enter contact email"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {orgData.contactEmail || 'Not specified'}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-slate-400">Phone</Label>
                    {isEditing ? (
                      <Input
                        value={orgData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {orgData.phone || 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600"
                    >
                      Cancel
                    </Button>
                    <Button
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
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Statistics - FIXED styling */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Security Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="text-2xl font-bold text-blue-400">245</div>
                    <div className="text-sm text-slate-400">Total Assets</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="text-2xl font-bold text-orange-400">76</div>
                    <div className="text-sm text-slate-400">Open Vulnerabilities</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="text-2xl font-bold text-green-400">72</div>
                    <div className="text-sm text-slate-400">Risk Score</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="text-2xl font-bold text-purple-400">B+</div>
                    <div className="text-sm text-slate-400">Pentest Grade</div>
                  </div>
                </div>

                <div className="pt-4 space-y-3 border-t border-slate-600">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Last Security Scan</span>
                    <span className="text-white">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Last Pentest</span>
                    <span className="text-white">15 days ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Next Scheduled Scan</span>
                    <span className="text-white">Tomorrow 2:00 AM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reports and Exports - FIXED styling */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-lg shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Reports & Exports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="bg-slate-700 text-blue-400 border-blue-400 h-20 flex-col hover:bg-blue-400 hover:text-white transition-all duration-200"
                  onClick={() => handleDownloadReport('Executive Summary')}
                >
                  <Download className="h-6 w-6 mb-2" />
                  <span>Executive Summary</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-slate-700 text-blue-400 border-blue-400 h-20 flex-col hover:bg-blue-400 hover:text-white transition-all duration-200"
                  onClick={() => handleDownloadReport('Technical Report')}
                >
                  <Download className="h-6 w-6 mb-2" />
                  <span>Technical Report</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-slate-700 text-blue-400 border-blue-400 h-20 flex-col hover:bg-blue-400 hover:text-white transition-all duration-200"
                  onClick={() => handleDownloadReport('Compliance Report')}
                >
                  <Download className="h-6 w-6 mb-2" />
                  <span>Compliance Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;