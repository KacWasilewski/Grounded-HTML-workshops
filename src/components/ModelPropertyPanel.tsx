
import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

interface ModelPropertyPanelProps {
  projectName?: string;
  onClose: () => void;
}

export const ModelPropertyPanel: React.FC<ModelPropertyPanelProps> = ({
  projectName = "Untitled Project",
  onClose
}) => {
  // Mock values for visualization
  const modelProperties = {
    volume: "22.4 m³",
    surfaceArea: "186.7 m²",
    height: "11.2 m",
    baseDimensions: "8.5 x 7.3 m",
    location: "New York, NY",
    structureType: "Steel Frame"
  };

  return (
    <div className="bg-background border-l border-border w-72 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Properties</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="project-name">Project Name</Label>
          <p id="project-name" className="font-medium mt-1">{projectName}</p>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">DIMENSIONS</h4>
          
          <div className="space-y-1">
            <Label className="text-xs">Volume</Label>
            <p className="text-sm font-medium">{modelProperties.volume}</p>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs">Surface Area</Label>
            <p className="text-sm font-medium">{modelProperties.surfaceArea}</p>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs">Height</Label>
            <p className="text-sm font-medium">{modelProperties.height}</p>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs">Base Dimensions</Label>
            <p className="text-sm font-medium">{modelProperties.baseDimensions}</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">PROPERTIES</h4>
          
          <div className="space-y-1">
            <Label htmlFor="location" className="text-xs">Location</Label>
            <Select defaultValue={modelProperties.location}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New York, NY">New York, NY</SelectItem>
                <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                <SelectItem value="Miami, FL">Miami, FL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="structure-type" className="text-xs">Structure Type</Label>
            <Select defaultValue={modelProperties.structureType}>
              <SelectTrigger id="structure-type">
                <SelectValue placeholder="Select structure type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Steel Frame">Steel Frame</SelectItem>
                <SelectItem value="Concrete">Concrete</SelectItem>
                <SelectItem value="Wood Frame">Wood Frame</SelectItem>
                <SelectItem value="Masonry">Masonry</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-end">
          <Button variant="outline" size="sm">Calculate Values</Button>
        </div>
      </div>
    </div>
  );
};
