
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ThreeViewer from '@/components/ThreeViewer';
import { toast } from 'sonner';
import { ArrowLeft, Tag, MapPin, Info } from 'lucide-react';

interface UploadFormData {
  name: string;
  description: string;
  category: string;
  location: string;
  tags: string[];
}

const Upload: React.FC = () => {
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState<'obj' | 'stl' | 'glb' | 'gltf' | null>(null);
  const [fileSize, setFileSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<UploadFormData>({
    name: '',
    description: '',
    category: '',
    location: '',
    tags: [],
  });
  
  const handleUploadComplete = (name: string, url: string, type: string, size: number) => {
    setFileName(name);
    setFileUrl(url);
    setFileType(type as 'obj' | 'stl' | 'glb' | 'gltf');
    setFileSize(size);
    
    // Auto-fill project name based on file name
    if (!formData.name) {
      const baseName = name.substring(0, name.lastIndexOf('.'));
      setFormData({
        ...formData,
        name: baseName.replace(/[-_]/g, ' ')
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCreateProject = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    
    if (!fileUrl) {
      toast.error('Please upload a file');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // For now, we'll simulate the request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app with a backend, you would:
      // 1. Upload the file to a storage service (e.g., S3, Firebase Storage)
      // 2. Create a project record in your database
      // 3. Return the project ID for navigation
      
      toast.success('Project created successfully!');
      
      // Navigate to the project page
      // In a real app, you would navigate to the actual project ID
      navigate('/project/new');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FileUpload onUploadComplete={handleUploadComplete} />
          
          {fileUrl && (
            <div className="space-y-6 border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name*</Label>
                  <Input
                    id="project-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="architecture">Architecture</SelectItem>
                      <SelectItem value="product">Product Design</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="art">Art & Sculpture</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add a description for your project"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-tags" className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    Tags
                  </Label>
                  <Input
                    id="project-tags"
                    name="tags"
                    placeholder="e.g., modern, concept, draft"
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(tag => tag.trim());
                      setFormData({
                        ...formData,
                        tags
                      });
                    }}
                  />
                  <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project-location" className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    id="project-location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., New York, NY"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleCreateProject} 
                  disabled={isLoading || !formData.name.trim() || !fileUrl}
                >
                  {isLoading ? 'Creating Project...' : 'Create Project'}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="bg-secondary/30 rounded-lg p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Preview Area</h3>
              <p className="text-sm text-muted-foreground">
                Your 3D model will be displayed here after upload. You can rotate, zoom and explore the model.
              </p>
            </div>
          </div>
          
          <div className="h-[500px] border rounded-lg overflow-hidden">
            {fileUrl && fileType ? (
              <ThreeViewer modelUrl={fileUrl} modelType={fileType} />
            ) : (
              <div className="h-full flex items-center justify-center bg-accent/20 text-muted-foreground">
                <div className="text-center p-6">
                  <p className="mb-2">No model uploaded yet</p>
                  <p className="text-sm">Upload a 3D model to see preview</p>
                </div>
              </div>
            )}
          </div>
          
          {fileUrl && (
            <div className="text-sm text-muted-foreground">
              <div className="flex justify-between border-b pb-2 mb-2">
                <span>Filename:</span>
                <span className="font-mono">{fileName}</span>
              </div>
              <div className="flex justify-between border-b pb-2 mb-2">
                <span>Type:</span>
                <span className="uppercase">{fileType}</span>
              </div>
              <div className="flex justify-between">
                <span>Size:</span>
                <span>{(fileSize / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
