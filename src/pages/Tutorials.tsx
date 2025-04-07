
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Play, Clock } from 'lucide-react';

const tutorials = [
  {
    id: 1,
    title: 'Getting Started with ShapeSense',
    description: 'Learn the basics of uploading and viewing 3D models',
    thumbnail: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=800',
    duration: '5 min',
  },
  {
    id: 2,
    title: 'Advanced Model Manipulation',
    description: 'Master the controls for rotating, zooming and inspecting models',
    thumbnail: 'https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=800',
    duration: '8 min',
  },
  {
    id: 3,
    title: 'File Formats & Compatibility',
    description: 'Understanding OBJ, STL, and GLB file formats',
    thumbnail: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800',
    duration: '7 min',
  },
  {
    id: 4,
    title: 'Collaborative Design Workflows',
    description: 'How to share and collaborate on 3D models with your team',
    thumbnail: 'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=800',
    duration: '10 min',
  },
];

const Tutorials: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tutorials</h1>
        <p className="text-muted-foreground">
          Learn how to get the most out of ShapeSense
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map(tutorial => (
          <Card key={tutorial.id} className="overflow-hidden card-hover">
            <div className="relative aspect-video">
              <img
                src={tutorial.thumbnail}
                alt={tutorial.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="h-8 w-8 text-white fill-white" />
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium">{tutorial.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {tutorial.description}
              </p>
            </CardContent>
            <CardFooter className="px-4 py-2 border-t flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {tutorial.duration}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tutorials;
