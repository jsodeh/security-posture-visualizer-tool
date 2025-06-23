import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle, X, Image, FileSpreadsheet, FileImage, Brain, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedDataIngestionService } from '@/services/EnhancedDataIngestionService';
import { AIFileProcessingService } from '@/services/AIFileProcessingService';

interface EnhancedFileUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

interface UploadFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'processing' | 'ai-processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  requiresAI: boolean;
  confidence?: number;
}

const EnhancedFileUploadModal: React.FC<EnhancedFileUploadModalProps> = ({
  open,
  onOpenChange,
  onUploadComplete,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const supportedTypes = EnhancedDataIngestionService.getSupportedFileTypes();
    const validFiles = newFiles.filter(file => {
      const extension = '.' + file.name.toLowerCase().split('.').pop();
      return supportedTypes.includes(extension);
    });

    const uploadFiles = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending' as const,
      progress: 0,
      requiresAI: AIFileProcessingService.isAIProcessingRequired(file.name),
    }));

    setFiles(prev => [...prev, ...uploadFiles]);

    if (validFiles.length !== newFiles.length) {
      toast.error('Some files were skipped. Please check supported file formats.');
    }

    // Show AI processing notice if any files require AI
    const aiFiles = uploadFiles.filter(f => f.requiresAI);
    if (aiFiles.length > 0) {
      toast.info(`${aiFiles.length} file(s) will be processed using AI analysis.`);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const processFiles = async () => {
    setIsProcessing(true);
    
    for (const uploadFile of files) {
      if (uploadFile.status !== 'pending') continue;
      
      try {
        // Update status to uploading
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'uploading', progress: 25 }
            : f
        ));

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update to processing (AI or regular)
        const processingStatus = uploadFile.requiresAI ? 'ai-processing' : 'processing';
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: processingStatus, progress: 50 }
            : f
        ));

        // Process the file
        const result = await EnhancedDataIngestionService.processSecurityFile(uploadFile.file);
        
        // Update to completed with confidence if AI processed
        const confidence = 'summary' in result && 'confidence' in result.summary 
          ? result.summary.confidence 
          : undefined;
        
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'completed', progress: 100, confidence }
            : f
        ));

        const processingType = uploadFile.requiresAI ? 'AI-processed' : 'processed';
        toast.success(`Successfully ${processingType} ${uploadFile.file.name}`);
        
      } catch (error) {
        console.error('Processing error:', error);
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'error', error: error.message || 'Failed to process file' }
            : f
        ));
        toast.error(`Failed to process ${uploadFile.file.name}: ${error.message}`);
      }
    }
    
    setIsProcessing(false);
    
    // Check if all files completed successfully
    const allCompleted = files.every(f => f.status === 'completed' || f.status === 'error');
    const anyCompleted = files.some(f => f.status === 'completed');
    
    if (allCompleted && anyCompleted) {
      setTimeout(() => {
        onUploadComplete();
        onOpenChange(false);
        setFiles([]);
      }, 1000);
    }
  };

  const getFileIcon = (fileName: string, requiresAI: boolean) => {
    const extension = fileName.toLowerCase().split('.').pop();
    
    if (requiresAI) {
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
        return <FileImage className="h-5 w-5 text-purple-400" />;
      }
      if (['pdf'].includes(extension || '')) {
        return <FileText className="h-5 w-5 text-red-400" />;
      }
      if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
        return <FileSpreadsheet className="h-5 w-5 text-green-400" />;
      }
      return <FileText className="h-5 w-5 text-orange-400" />;
    }
    
    if (extension === 'xml') return <FileText className="h-5 w-5 text-blue-400" />;
    if (extension === 'nessus') return <FileText className="h-5 w-5 text-green-400" />;
    return <FileText className="h-5 w-5 text-gray-400" />;
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'ai-processing':
        return <Brain className="h-5 w-5 text-purple-400 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: UploadFile['status']) => {
    switch (status) {
      case 'ai-processing':
        return 'AI Processing';
      case 'processing':
        return 'Processing';
      case 'uploading':
        return 'Uploading';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Error';
      default:
        return 'Pending';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Security Files</span>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-400">
              <Brain className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Upload security scan files in various formats. AI will automatically extract and analyze security data from images, PDFs, documents, and traditional scan files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Drop Zone */}
          <Card className="border-dashed border-2 border-slate-600 bg-slate-700/30">
            <CardContent className="p-6">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="text-center cursor-pointer transition-colors text-slate-400 hover:text-blue-400"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept=".xml,.nessus,.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Upload className="h-12 w-12" />
                    <Zap className="h-6 w-6 absolute -top-1 -right-1 text-purple-400" />
                  </div>
                </div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop files here or click to select
                </p>
                <p className="text-sm mb-4">
                  Supports traditional security files (.xml, .nessus) and AI-powered analysis of images, PDFs, documents, and spreadsheets
                </p>
                
                {/* Supported formats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                    <FileText className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                    <div>Traditional</div>
                    <div className="text-slate-500">.xml, .nessus</div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2">
                    <FileImage className="h-4 w-4 mx-auto mb-1 text-purple-400" />
                    <div>Images</div>
                    <div className="text-slate-500">.jpg, .png, .pdf</div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                    <FileSpreadsheet className="h-4 w-4 mx-auto mb-1 text-green-400" />
                    <div>Spreadsheets</div>
                    <div className="text-slate-500">.xlsx, .csv</div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded p-2">
                    <FileText className="h-4 w-4 mx-auto mb-1 text-orange-400" />
                    <div>Documents</div>
                    <div className="text-slate-500">.docx, .pptx</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white font-medium">Files to Process</h3>
              {files.map((uploadFile) => (
                <Card key={uploadFile.id} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(uploadFile.file.name, uploadFile.requiresAI)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-white font-medium">{uploadFile.file.name}</p>
                            {uploadFile.requiresAI && (
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-400 text-xs">
                                <Brain className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm">
                            {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(uploadFile.status)}
                        <div className="text-right">
                          <span className="text-sm text-slate-400">
                            {getStatusText(uploadFile.status)}
                          </span>
                          {uploadFile.confidence !== undefined && (
                            <div className="text-xs text-purple-400">
                              {uploadFile.confidence}% confidence
                            </div>
                          )}
                        </div>
                        {uploadFile.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadFile.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {(uploadFile.status === 'uploading' || uploadFile.status === 'processing' || uploadFile.status === 'ai-processing') && (
                      <div className="mt-3">
                        <Progress value={uploadFile.progress} className="bg-slate-600" />
                        {uploadFile.status === 'ai-processing' && (
                          <p className="text-xs text-purple-400 mt-1">
                            AI is analyzing the content for security data...
                          </p>
                        )}
                      </div>
                    )}
                    
                    {uploadFile.error && (
                      <p className="text-red-400 text-sm mt-2">{uploadFile.error}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={processFiles}
              disabled={files.length === 0 || isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? 'Processing...' : `Process ${files.length} Files`}
            </Button>
          </div>

          {/* AI Notice */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Brain className="h-5 w-5 text-purple-400 mt-0.5" />
              <div className="text-sm">
                <p className="text-purple-400 font-medium mb-1">AI-Powered Analysis</p>
                <p className="text-slate-300">
                  Files that require AI processing will be analyzed using OpenAI's advanced models to extract security data from images, documents, and other non-standard formats. This may take longer but provides comprehensive data extraction capabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedFileUploadModal;
