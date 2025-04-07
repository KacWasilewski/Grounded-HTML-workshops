
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, FileUp } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onUploadComplete?: (fileName: string, fileUrl: string, fileType: string) => void;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadComplete,
  accept = ".obj,.stl,.glb" 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileSelect = (selectedFile: File) => {
    // Check if file extension is allowed
    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
    const allowedExts = accept.split(',').map(ext => ext.replace('.', ''));
    
    if (fileExt && allowedExts.includes(fileExt)) {
      setFile(selectedFile);
    } else {
      toast.error(`Only ${accept} files are allowed`);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate file upload with progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // In a real app, you would upload to your backend here
    // const formData = new FormData();
    // formData.append('file', file);
    // const response = await fetch('your-backend-url/upload', {
    //   method: 'POST',
    //   body: formData,
    // });
    
    // Simulate successful upload
    const fileUrl = URL.createObjectURL(file);
    const fileType = file.name.split('.').pop()?.toLowerCase() as 'obj' | 'stl' | 'glb';
    
    if (onUploadComplete) {
      onUploadComplete(file.name, fileUrl, fileType);
    }
    
    toast.success('Upload complete!');
    setIsUploading(false);
    setFile(null);
    setUploadProgress(0);
  };
  
  const handleCancel = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };
  
  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        isDragging ? 'border-brand-500 bg-brand-50' : 'border-border'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
      
      {file ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-secondary p-3 rounded-lg">
            <div className="flex items-center">
              <FileUp className="h-6 w-6 text-brand-700 mr-3" />
              <div className="text-left">
                <p className="font-medium truncate max-w-xs">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCancel}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {isUploading && (
            <Progress value={uploadProgress} className="h-2" />
          )}
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
            <Upload className="h-6 w-6 text-brand-700" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Upload your 3D model</h3>
            <p className="text-muted-foreground mt-1">
              Drag and drop your file here, or click to browse
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Supports {accept} files
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            Choose File
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
