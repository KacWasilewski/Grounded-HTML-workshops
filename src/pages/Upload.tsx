
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const Upload: React.FC = () => {
  const [fileName, setFileName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState<'obj' | 'stl' | 'glb' | ''>('');
  const navigate = useNavigate();
  
  const handleUploadComplete = (name: string, url: string, type: string) => {
    setFileName(name);
    setFileUrl(url);
    setFileType(type as 'obj' | 'stl' | 'glb');
    
    // Auto-fill project name based on file name
    if (!projectName) {
      const baseName = name.substring(0, name.lastIndexOf('.'));
      setProjectName(baseName.replace(/[-_]/g, ' '));
    }
  };
  
  const handleCreateProject = () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    
    if (!fileUrl) {
      toast.error('Please upload a file');
      return;
    }
    
    // In a real app, you would create a project in your backend here
    
    toast.success('Project created!');
    
    // Redirect to the project page or dashboard
    navigate('/project/new');
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 mb-4"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
        
        <h1 className="text-3xl font-bold">Upload New Project</h1>
        <p className="text-muted-foreground">
          Start a new project by uploading your 3D model
        </p>
      </div>
      
      <div className="space-y-6">
        <FileUpload onUploadComplete={handleUploadComplete} />
        
        {fileUrl && (
          <div className="space-y-4 border rounded-lg p-6">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleCreateProject}>
                Create Project
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
