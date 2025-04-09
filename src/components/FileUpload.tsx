import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { Upload, X, FileUp, File } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onUploadComplete?: (fileName: string, fileUrl: string, fileType: string, fileSize: number) => void;
  accept?: string;
  maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadComplete,
  accept = ".obj,.stl,.glb,.gltf",
  maxSize = 50 // Default 50MB limit
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  
  const validFileTypes = accept.split(',').map(type => type.trim().replace('.', ''));
  
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  
  const validateAndSetFile = (selectedFile: File) => {
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      toast.error(`File size exceeds the maximum limit of ${maxSize}MB`);
      return;
    }
    
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !validFileTypes.includes(fileExtension)) {
      toast.error(`Only ${validFileTypes.join(', ')} files are allowed`);
      return;
    }
    
    setFile(selectedFile);
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    const totalSteps = 10;
    for (let i = 1; i <= totalSteps; i++) {
      setUploadProgress((i / totalSteps) * 100);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    const fileUrl = URL.createObjectURL(file);
    const fileType = file.name.split('.').pop()?.toLowerCase() as string;
    
    if (onUploadComplete) {
      onUploadComplete(file.name, fileUrl, fileType, file.size);
    }
    
    toast.success('Upload complete!');
    setIsUploading(false);
    setFile(null);
    setUploadProgress(0);
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };
  
  const handleCancel = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };
  
  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        isDragging ? 'border-brand-500 bg-brand-50/10' : 'border-border'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
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
          <div className="flex items-start justify-between bg-secondary p-3 rounded-lg">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-md mr-3">
                <File className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium truncate max-w-xs">{file.name}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="uppercase mr-2">{file.name.split('.').pop()}</span>
                  <span>•</span>
                  <span className="ml-2">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
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
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
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
              {isUploading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Uploading...
                </>
              ) : 'Upload Model'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-brand-100/20 flex items-center justify-center">
            <Upload className="h-8 w-8 text-brand-700" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Upload your 3D model</h3>
            <p className="text-muted-foreground mt-1">
              Drag and drop your file here, or click to browse
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Supports {validFileTypes.join(', ')} files up to {maxSize}MB
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="mt-2"
          >
            Choose File
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
