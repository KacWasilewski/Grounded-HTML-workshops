
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { File, MapPin, Calendar } from 'lucide-react';

interface ProjectCardProps {
  id: string;
  name: string;
  thumbnail?: string;
  createdAt: Date;
  lastModified: Date;
  modelType?: string;
  category?: string;
  location?: string;
  tags?: string[];
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  thumbnail,
  createdAt,
  lastModified,
  modelType,
  category,
  location,
  tags,
  className,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
    }).format(date);
  };
  
  // Set of architectural 3D model preview images - updated with more realistic architectural models
  const modelPreviewImages = [
    'https://media.sketchfab.com/models/78352d6c89734f4e9a956979393b72a6/thumbnails/71c92d0aff764dddb37a5646ec44d8e2/f92aca2eab5e4e9e92a72b157415a879.jpeg', // modern building
    'https://media.sketchfab.com/models/ac8f21739d264c87bea55b66c8a9d0ba/thumbnails/d2998adadb0948ada71b618a7cce6b33/36516a1dc4794b73976045b57b2ce5a3.jpeg', // apartment building
    'https://media.sketchfab.com/models/1834bdfb7aad44aaa16c41d8f7b54815/thumbnails/edb87e53a8cc49c2a45db6301e09e4e6/8bdf87d2157d463084efd4302295f39d.jpeg', // house model
    'https://media.sketchfab.com/models/7e99f9e40f294beead90db8216218c45/thumbnails/8ef3a9e2086841898c57c84e3bb2e51e/79ed3bec1f7f4f7da5c0b6e1b61bad96.jpeg', // modern home
    'https://media.sketchfab.com/models/27a428162ee04e17abef5d2757f8885e/thumbnails/b31b210dfae14d34bd7ebfcf245134a4/c46dbbcbee3240b3aa79e4b61adbaba8.jpeg', // house facade
    'https://media.sketchfab.com/models/cb07df5fc86a41f4823e68f6c8fe8bf6/thumbnails/97b2c7e85ede4d9b9176af10d4fd59c6/6ccb5dae3ffe4a11b7aed056afadf13e.jpeg', // building exterior
    'https://media.sketchfab.com/models/9d72f13c88fb4b72894b1bd2db4988b6/thumbnails/d4d8b62e83694d059e6d46a2b2d7cdbd/1024x576.jpeg'  // architectural model
  ];
  
  // Get a deterministic thumbnail based on the project ID
  const getDefaultThumbnail = () => {
    // Convert the id to a number by summing character codes
    const idSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    // Use the sum to pick an image from the array
    return modelPreviewImages[idSum % modelPreviewImages.length];
  };
  
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays)} days ago`;
    } else {
      return formatDate(date);
    }
  };
  
  // Use provided thumbnail or get a default one
  const displayThumbnail = thumbnail || getDefaultThumbnail();
  
  return (
    <Link to={`/project/${id}`}>
      <Card className={cn("overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-200", className)}>
        <div className="relative aspect-square bg-muted">
          {displayThumbnail ? (
            <img
              src={displayThumbnail}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-brand-100/20 p-4 relative">
              <div className="absolute top-2 right-2 flex items-center">
                {modelType && (
                  <Badge variant="outline" className="uppercase text-xs">
                    {modelType}
                  </Badge>
                )}
              </div>
              <File className="h-12 w-12 text-brand-700 mb-2" />
              <span className="text-brand-900 text-center font-medium line-clamp-2">
                {name}
              </span>
            </div>
          )}
          
          {/* Add a badge for model type overlay on the thumbnail */}
          {displayThumbnail && modelType && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="uppercase text-xs bg-black/40 text-white border-none">
                {modelType}
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium truncate">{name}</h3>
          
          {category && (
            <Badge variant="secondary" className="mt-2 capitalize text-xs">
              {category}
            </Badge>
          )}
          
          {location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            <Calendar className="h-3 w-3" />
            <span>Created {formatDate(createdAt)}</span>
          </div>
          
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="py-2 px-4 bg-muted/50 text-xs text-muted-foreground">
          Last edited {getTimeAgo(lastModified)}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
