import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ThreeViewer from '@/components/ThreeViewer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  MoreVertical,
  FileDown,
  Share2,
  Trash2,
  Pencil,
  Tag,
  MapPin,
  ClipboardCopy,
  Clock,
  ExternalLink,
  Copy,
  Save,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ProjectData {
  id: string;
  name: string;
  description: string;
  modelUrl: string;
  modelType: 'obj' | 'stl' | 'glb' | 'gltf';
  fileSize: number;
  createdAt: Date;
  lastModified: Date;
  category?: string;
  location?: string;
  tags?: string[];
  thumbnail?: string;
}

const dummyProjects: Record<string, ProjectData> = {
  '1': {
    id: '1',
    name: 'Modern Building Concept',
    description: 'A conceptual design for a modern commercial building featuring glass facades and sustainable elements.',
    modelUrl: '',
    modelType: 'obj',
    fileSize: 2400000, // 2.4 MB
    createdAt: new Date('2025-03-15'),
    lastModified: new Date('2025-04-06'),
    category: 'architecture',
    location: 'New York, NY',
    tags: ['modern', 'commercial', 'sustainable'],
  },
  '2': {
    id: '2',
    name: 'Office Tower Design',
    description: 'High-rise office tower with innovative workspace solutions and communal areas.',
    modelUrl: '',
    modelType: 'stl',
    fileSize: 3800000, // 3.8 MB
    createdAt: new Date('2025-03-01'),
    lastModified: new Date('2025-03-28'),
    category: 'architecture',
    location: 'Chicago, IL',
    tags: ['office', 'high-rise', 'workspace'],
  },
  'new': {
    id: 'new',
    name: 'New Project',
    description: 'Recently uploaded 3D model project.',
    modelUrl: '',
    modelType: 'glb',
    fileSize: 1500000, // 1.5 MB
    createdAt: new Date(),
    lastModified: new Date(),
    category: 'product',
    tags: ['draft', 'concept'],
  }
};

const Project: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    tags: [] as string[],
  });
  
  useEffect(() => {
    if (id) {
      const projectData = dummyProjects[id];
      
      if (projectData) {
        setProject(projectData);
        setFormData({
          name: projectData.name,
          description: projectData.description || '',
          category: projectData.category || '',
          location: projectData.location || '',
          tags: projectData.tags || [],
        });
      }
    }
  }, [id]);
  
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
  
  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Project name cannot be empty');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProject({
        ...project,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        tags: formData.tags,
        lastModified: new Date(),
      });
      
      setIsEditing(false);
      setIsMetadataOpen(false);
      toast.success('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      name: project.name,
      description: project.description || '',
      category: project.category || '',
      location: project.location || '',
      tags: project.tags || [],
    });
    
    setIsEditing(false);
  };
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Project deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = () => {
    if (project.modelUrl) {
      const link = document.createElement('a');
      link.href = project.modelUrl;
      link.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}.${project.modelType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Model download started');
    } else {
      toast.error('Model file not available for download');
    }
  };
  
  const handleShare = () => {
    const shareUrl = `https://grounded.ai/shared/${project.id}`;
    
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard');
  };
  
  const handleDuplicate = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Project duplicated successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error duplicating project:', error);
      toast.error('Failed to duplicate project');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const MetadataPanel = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Project Properties</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsMetadataOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator />
      
      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Project Name*</Label>
            <Input
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter project name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add a description for your project"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger id="edit-category">
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
          
          <div className="space-y-2">
            <Label htmlFor="edit-location" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              id="edit-location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., New York, NY"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-tags" className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <Input
              id="edit-tags"
              name="tags"
              value={formData.tags.join(', ')}
              placeholder="e.g., modern, concept, draft"
              onChange={(e) => {
                const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                setFormData({
                  ...formData,
                  tags
                });
              }}
            />
            <p className="text-xs text-muted-foreground">Separate tags with commas</p>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading || !formData.name.trim()}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">
              {project.description || 'No description provided'}
            </p>
          </div>
          
          {project.category && (
            <div>
              <h4 className="text-sm font-medium mb-1">Category</h4>
              <p className="text-sm text-muted-foreground capitalize">
                {project.category}
              </p>
            </div>
          )}
          
          {project.location && (
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" /> Location
              </h4>
              <p className="text-sm text-muted-foreground">
                {project.location}
              </p>
            </div>
          )}
          
          {project.tags && project.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                <Tag className="h-4 w-4" /> Tags
              </h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {project.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
              <Clock className="h-4 w-4" /> Created
            </h4>
            <p className="text-sm text-muted-foreground">
              {formatDate(project.createdAt)}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
              <Clock className="h-4 w-4" /> Last Modified
            </h4>
            <p className="text-sm text-muted-foreground">
              {formatDate(project.lastModified)}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">File Information</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Type: <span className="uppercase">{project.modelType}</span></p>
              <p>Size: {(project.fileSize / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
              Edit Project Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
  
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
            disabled={!project.modelUrl}
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
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="text-xl font-bold"
            autoFocus
          />
          <Button onClick={handleSave} disabled={isLoading || !formData.name.trim()}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <Sheet open={isMetadataOpen} onOpenChange={setIsMetadataOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">Project Details</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <MetadataPanel />
            </SheetContent>
          </Sheet>
        </div>
      )}
      
      <div className="flex-1 min-h-[500px]">
        <ThreeViewer 
          modelUrl={project.modelUrl} 
          modelType={project.modelType}
          showStats={false}
          projectName={project.name}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {project.tags?.map((tag) => (
          <Badge key={tag} variant="secondary">{tag}</Badge>
        ))}
      </div>
    </div>
  );
};

export default Project;
