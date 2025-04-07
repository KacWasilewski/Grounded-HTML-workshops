
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  id: string;
  name: string;
  thumbnail?: string;
  createdAt: Date;
  lastModified: Date;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  thumbnail,
  createdAt,
  lastModified,
  className,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
    }).format(date);
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
  
  return (
    <Link to={`/project/${id}`}>
      <Card className={cn("overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-200", className)}>
        <div className="relative aspect-square bg-muted">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-100">
              <span className="text-brand-700 text-xl font-medium">
                {name.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium truncate">{name}</h3>
          <p className="text-sm text-muted-foreground">
            Created {formatDate(createdAt)}
          </p>
        </CardContent>
        <CardFooter className="py-2 px-4 bg-muted/50 text-xs text-muted-foreground">
          Last edited {getTimeAgo(lastModified)}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
