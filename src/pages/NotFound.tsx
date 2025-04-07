
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileWarning } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-20 h-20 mb-6 rounded-full bg-brand-100 flex items-center justify-center">
        <FileWarning className="h-10 w-10 text-brand-700" />
      </div>
      
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Oops! We couldn't find this page.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/">Go to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
