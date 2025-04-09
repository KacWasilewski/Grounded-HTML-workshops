
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, ChevronDown, Folder, Clock, Calendar, Tag, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Extended project data
interface Project {
  id: string;
  name: string;
  thumbnail?: string;
  createdAt: Date;
  lastModified: Date;
  modelType?: 'obj' | 'stl' | 'glb' | 'gltf';
  fileSize?: number;
  category?: string;
  location?: string;
  tags?: string[];
}

// Dummy project data
const dummyProjects: Project[] = [
  {
    id: '1',
    name: 'Modern Building Concept',
    thumbnail: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800',
    createdAt: new Date('2025-03-15'),
    lastModified: new Date('2025-04-06'),
    modelType: 'obj',
    fileSize: 2400000, // 2.4 MB
    category: 'architecture',
    location: 'New York, NY',
    tags: ['modern', 'commercial', 'sustainable'],
  },
  {
    id: '2',
    name: 'Office Tower Design',
    thumbnail: 'https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=800',
    createdAt: new Date('2025-03-01'),
    lastModified: new Date('2025-03-28'),
    modelType: 'stl',
    fileSize: 3800000, // 3.8 MB
    category: 'architecture',
    location: 'Chicago, IL',
    tags: ['office', 'high-rise', 'workspace'],
  },
  {
    id: '3',
    name: 'Residential Complex',
    thumbnail: 'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=800',
    createdAt: new Date('2025-02-20'),
    lastModified: new Date('2025-04-05'),
    modelType: 'glb',
    fileSize: 4200000, // 4.2 MB
    category: 'architecture',
    location: 'Austin, TX',
    tags: ['residential', 'apartment', 'modern'],
  },
  {
    id: '4',
    name: 'Exhibition Pavilion',
    thumbnail: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=800',
    createdAt: new Date('2025-02-10'),
    lastModified: new Date('2025-03-20'),
    modelType: 'obj',
    fileSize: 1800000, // 1.8 MB
    category: 'art',
    location: 'Miami, FL',
    tags: ['exhibition', 'temporary', 'art'],
  },
  {
    id: '5',
    name: 'Container House Prototype',
    createdAt: new Date('2025-01-30'),
    lastModified: new Date('2025-03-15'),
    modelType: 'stl',
    fileSize: 2100000, // 2.1 MB
    category: 'product',
    location: 'Portland, OR',
    tags: ['container', 'sustainable', 'prefab'],
  },
];

type SortOrder = 'recent' | 'name' | 'created' | 'size';
type ViewMode = 'grid' | 'list';

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState<{
    categories: string[];
    types: string[];
  }>({
    categories: [],
    types: [],
  });
  
  const navigate = useNavigate();
  
  // Extract unique categories and file types for filters
  const categories = Array.from(new Set(dummyProjects.map(p => p.category).filter(Boolean))) as string[];
  const fileTypes = Array.from(new Set(dummyProjects.map(p => p.modelType).filter(Boolean))) as string[];
  
  // Filter projects based on search query and active tab
  let filteredProjects = dummyProjects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    project.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Apply tab filters
  if (activeTab === 'recent') {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    filteredProjects = filteredProjects.filter(p => p.lastModified >= oneWeekAgo);
  } else if (activeTab === 'architecture') {
    filteredProjects = filteredProjects.filter(p => p.category === 'architecture');
  } else if (activeTab === 'product') {
    filteredProjects = filteredProjects.filter(p => p.category === 'product');
  }
  
  // Apply category filters
  if (selectedFilters.categories.length > 0) {
    filteredProjects = filteredProjects.filter(p => 
      p.category && selectedFilters.categories.includes(p.category)
    );
  }
  
  // Apply file type filters
  if (selectedFilters.types.length > 0) {
    filteredProjects = filteredProjects.filter(p => 
      p.modelType && selectedFilters.types.includes(p.modelType)
    );
  }
  
  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOrder === 'recent') {
      return b.lastModified.getTime() - a.lastModified.getTime();
    } else if (sortOrder === 'created') {
      return b.createdAt.getTime() - a.createdAt.getTime();
    } else if (sortOrder === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'size') {
      return (b.fileSize || 0) - (a.fileSize || 0);
    }
    return 0;
  });
  
  const toggleCategoryFilter = (category: string) => {
    setSelectedFilters(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return { ...prev, categories };
    });
  };
  
  const toggleTypeFilter = (type: string) => {
    setSelectedFilters(prev => {
      const types = prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type];
      
      return { ...prev, types };
    });
  };
  
  const clearFilters = () => {
    setSelectedFilters({ categories: [], types: [] });
    setSearchQuery('');
    setActiveTab('all');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage and explore your 3D models and designs</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects, tags, locations..."
              className="pl-9 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button onClick={() => navigate('/upload')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="product">Product Design</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>Filter</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <div className="font-medium mb-1">Categories</div>
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2 my-1">
                      <Checkbox 
                        id={`category-${category}`} 
                        checked={selectedFilters.categories.includes(category)}
                        onCheckedChange={() => toggleCategoryFilter(category)}
                      />
                      <Label 
                        htmlFor={`category-${category}`}
                        className="text-sm capitalize cursor-pointer flex-1"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                  
                  <div className="font-medium mb-1 mt-3">File Types</div>
                  {fileTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2 my-1">
                      <Checkbox 
                        id={`type-${type}`} 
                        checked={selectedFilters.types.includes(type)}
                        onCheckedChange={() => toggleTypeFilter(type)}
                      />
                      <Label 
                        htmlFor={`type-${type}`}
                        className="text-sm uppercase cursor-pointer flex-1"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                  
                  {(selectedFilters.categories.length > 0 || selectedFilters.types.length > 0) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <span className="hidden sm:inline">Sort:</span>
                  <span className="capitalize">
                    {sortOrder === 'recent' ? 'Recent' : 
                     sortOrder === 'created' ? 'Created' : 
                     sortOrder === 'size' ? 'Size' : 'Name'}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                  <DropdownMenuRadioItem value="recent">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Recently modified</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="created">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Date created</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name">
                    <span className="mr-2 h-4 w-4">A-Z</span>
                    <span>Name</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="size">
                    <Folder className="mr-2 h-4 w-4" />
                    <span>File size</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="mt-4">
          {(selectedFilters.categories.length > 0 || selectedFilters.types.length > 0) && (
            <div className="p-2 bg-muted/50 rounded-md mb-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Active filters:</span>
              {selectedFilters.categories.map(cat => (
                <Button 
                  key={`cat-${cat}`}
                  variant="secondary"
                  size="sm"
                  className="h-7 capitalize text-xs"
                  onClick={() => toggleCategoryFilter(cat)}
                >
                  {cat}
                  <X className="ml-1 h-3 w-3" />
                </Button>
              ))}
              {selectedFilters.types.map(type => (
                <Button 
                  key={`type-${type}`}
                  variant="secondary"
                  size="sm"
                  className="h-7 uppercase text-xs"
                  onClick={() => toggleTypeFilter(type)}
                >
                  {type}
                  <X className="ml-1 h-3 w-3" />
                </Button>
              ))}
              <Button 
                variant="ghost"
                size="sm"
                className="h-7 text-xs ml-auto"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
          
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProjects.map(project => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                thumbnail={project.thumbnail}
                createdAt={project.createdAt}
                lastModified={project.lastModified}
                modelType={project.modelType}
                category={project.category}
                location={project.location}
                tags={project.tags}
              />
            ))}
            
            <div className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-6 text-center hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => navigate('/upload')}>
              <div className="w-12 h-12 rounded-full bg-brand-100/20 flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-brand-700" />
              </div>
              <h3 className="font-medium">Upload New Model</h3>
              <p className="text-sm text-muted-foreground mt-1">
                OBJ, STL, GLB, or GLTF files
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProjects.map(project => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                thumbnail={project.thumbnail}
                createdAt={project.createdAt}
                lastModified={project.lastModified}
                modelType={project.modelType}
                category={project.category}
                location={project.location}
                tags={project.tags}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="architecture" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProjects.map(project => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                thumbnail={project.thumbnail}
                createdAt={project.createdAt}
                lastModified={project.lastModified}
                modelType={project.modelType}
                category={project.category}
                location={project.location}
                tags={project.tags}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="product" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProjects.map(project => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                thumbnail={project.thumbnail}
                createdAt={project.createdAt}
                lastModified={project.lastModified}
                modelType={project.modelType}
                category={project.category}
                location={project.location}
                tags={project.tags}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {sortedProjects.length === 0 && (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery 
              ? "Try adjusting your search query or filters."
              : "Start by uploading your first 3D model."
            }
          </p>
          <Button onClick={() => navigate('/upload')}>
            Upload New Model
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
