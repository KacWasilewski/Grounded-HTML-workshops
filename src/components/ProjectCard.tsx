
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
  
  // Set of architectural 3D model preview images
  const modelPreviewImages = [
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800', // white concrete building
    'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=800', // white concrete building
    'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=800', // bottom view of glass building
    'https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?w=800', // worm's eye view of glass building
    'https://images.unsplash.com/photo-1551038247-3d9af20df552?w=800', // blue and white building
    'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800', // white concrete building
    'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=800'  // building with wavy lines
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
