
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ThreeViewer from '@/components/ThreeViewer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, MoreVertical, FileDown, Share2, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';

// Dummy project data
const dummyProjects = {
  '1': {
    id: '1',
    name: 'Modern Building Concept',
    modelUrl: '',
    modelType: 'obj' as const,
    createdAt: new Date('2025-03-15'),
    lastModified: new Date('2025-04-06'),
  },
  '2': {
    id: '2',
    name: 'Office Tower Design',
    modelUrl: '',
    modelType: 'stl' as const,
    createdAt: new Date('2025-03-01'),
    lastModified: new Date('2025-03-28'),
  },
  'new': {
    id: 'new',
    name: 'New Project',
    modelUrl: '',
    modelType: 'obj' as const,
    createdAt: new Date(),
    lastModified: new Date(),
  }
};

const Project: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const project = id ? dummyProjects[id] : null;
  const [isEditing, setIsEditing] = useState(false);
  const [projectName, setProjectName] = useState(project?.name || 'Untitled Project');
  
  if (!project) {
    return (
      <div className="text-center p-12">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  const handleSaveName = () => {
    if (projectName.trim()) {
      // In a real app, you would update the project name in your backend here
      toast.success('Project name updated');
      setIsEditing(false);
    } else {
      toast.error('Project name cannot be empty');
    }
  };
  
  const handleDelete = () => {
    // In a real app, you would delete the project in your backend here
    toast.success('Project deleted');
    navigate('/dashboard');
  };
  
  const handleExport = () => {
    toast.success('Project exported');
  };
  
  const handleShare = () => {
    // Copy share URL to clipboard
    navigator.clipboard.writeText(`https://shapesense.example.com/shared/${id}`);
    toast.success('Share link copied to clipboard');
  };
  
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-xl font-bold"
            autoFocus
          />
          <Button onClick={handleSaveName}>Save</Button>
          <Button variant="ghost" onClick={() => {
            setProjectName(project.name);
            setIsEditing(false);
          }}>Cancel</Button>
        </div>
      ) : (
        <h1 className="text-2xl font-bold">{projectName}</h1>
      )}
      
      <div className="flex-1 min-h-[500px]">
        <ThreeViewer modelUrl={project.modelUrl} modelType={project.modelType} />
      </div>
    </div>
  );
};

export default Project;
