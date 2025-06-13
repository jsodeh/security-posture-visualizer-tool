import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { DataIngestionService } from '@/services/DataIngestionService';

interface FileUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

interface UploadFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  open,
  onOpenChange,
  onUploadComplete,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending' as const,
      progress: 0,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/xml': ['.xml'],
      'application/xml': ['.xml'],
      'text/plain': ['.nessus'],
    },
    multiple: true,
  });

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

        // Simulate file processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update to processing
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'processing', progress: 50 }
            : f
        ));

        // Process the file
        const result = await DataIngestionService.processSecurityFile(uploadFile.file);
        
        // Update to completed
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'completed', progress: 100 }
            : f
        ));

        toast.success(`Successfully processed ${uploadFile.file.name}`);
        
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'error', error: 'Failed to process file' }
            : f
        ));
        toast.error(`Failed to process ${uploadFile.file.name}`);
      }
    }
    
    setIsProcessing(false);
    
    // Check if all files completed successfully
    const allCompleted = files.every(f => f.status === 'completed');
    if (allCompleted) {
      setTimeout(() => {
        onUploadComplete();
        onOpenChange(false);
        setFiles([]);
      }, 1000);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.xml')) return <FileText className="h-5 w-5 text-blue-400" />;
    if (fileName.endsWith('.nessus')) return <FileText className="h-5 w-5 text-green-400" />;
    return <FileText className="h-5 w-5 text-gray-400" />;
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Upload Security Scan Files</DialogTitle>
          <DialogDescription className="text-slate-400">
            Upload Nmap XML, Nessus .nessus, or OpenVAS XML files to update your security data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Drop Zone */}
          <Card className="border-dashed border-2 border-slate-600 bg-slate-700/30">
            <CardContent className="p-6">
              <div
                {...getRootProps()}
                className={`text-center cursor-pointer transition-colors ${
                  isDragActive ? 'text-blue-400' : 'text-slate-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-sm">
                  or click to select files (.xml, .nessus files supported)
                </p>
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
                        {getFileIcon(uploadFile.file.name)}
                        <div>
                          <p className="text-white font-medium">{uploadFile.file.name}</p>
                          <p className="text-slate-400 text-sm">
                            {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(uploadFile.status)}
                        <span className="text-sm text-slate-400 capitalize">
                          {uploadFile.status}
                        </span>
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
                    
                    {(uploadFile.status === 'uploading' || uploadFile.status === 'processing') && (
                      <div className="mt-3">
                        <Progress value={uploadFile.progress} className="bg-slate-600" />
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;