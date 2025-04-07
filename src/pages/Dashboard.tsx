
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, ChevronDown } from 'lucide-react';

// Dummy project data
const dummyProjects = [
  {
    id: '1',
    name: 'Modern Building Concept',
    thumbnail: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800',
    createdAt: new Date('2025-03-15'),
    lastModified: new Date('2025-04-06'),
  },
  {
    id: '2',
    name: 'Office Tower Design',
    thumbnail: 'https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=800',
    createdAt: new Date('2025-03-01'),
    lastModified: new Date('2025-03-28'),
  },
  {
    id: '3',
    name: 'Residential Complex',
    thumbnail: 'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=800',
    createdAt: new Date('2025-02-20'),
    lastModified: new Date('2025-04-05'),
  },
  {
    id: '4',
    name: 'Exhibition Pavilion',
    thumbnail: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=800',
    createdAt: new Date('2025-02-10'),
    lastModified: new Date('2025-03-20'),
  },
  {
    id: '5',
    name: 'Container House Prototype',
    createdAt: new Date('2025-01-30'),
    lastModified: new Date('2025-03-15'),
  },
];

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'name'>('recent');
  const navigate = useNavigate();
  
  const filteredProjects = dummyProjects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOrder === 'recent') {
      return b.lastModified.getTime() - a.lastModified.getTime();
    } else {
      return a.name.localeCompare(b.name);
    }
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage and explore your 3D projects</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects"
              className="pl-9 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                Sort by: {sortOrder === 'recent' ? 'Recent' : 'Name'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder('recent')}>
                Recently modified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('name')}>
                Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => navigate('/upload')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProjects.map(project => (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.name}
            thumbnail={project.thumbnail}
            createdAt={project.createdAt}
            lastModified={project.lastModified}
          />
        ))}
        
        <div className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-6 text-center hover:bg-secondary/50 transition-colors cursor-pointer"
             onClick={() => navigate('/upload')}>
          <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-brand-700" />
          </div>
          <h3 className="font-medium">Upload New Model</h3>
          <p className="text-sm text-muted-foreground mt-1">
            OBJ, STL, or GLB files
          </p>
        </div>
      </div>
      
      {sortedProjects.length === 0 && searchQuery && (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search query.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
