
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ThreeBackground from '@/components/ThreeBackground';
import { Play } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ThreeBackground />
      
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/70 to-brand-900/90 -z-10" />
      
      <header className="container py-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">
            grounded.ai
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/tutorials" className="text-white/80 hover:text-white transition-colors">
              Tutorials
            </Link>
            <Link to="/about" className="text-white/80 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/faq" className="text-white/80 hover:text-white transition-colors">
              FAQ
            </Link>
            <Link to="/dashboard" className="text-white/80 hover:text-white transition-colors">
              Login
            </Link>
            <Button asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </nav>
          
          <Button className="md:hidden" variant="ghost" size="icon">
            <span className="sr-only">Open menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>
      
      <main className="container mt-20 md:mt-32 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
          Simplify complexity to reduce misdirection
        </h1>
        
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12">
          A tool that refines your early-stage designs by providing powerful 3D model visualization.
          Fast, intelligent, and intuitive.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/dashboard">Start Designing</Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 text-white border-white/30 hover:bg-white/10 opacity-50 hover:opacity-100 transition-all duration-300"
          >
            <Link to="/tutorials" className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              <span>Watch Tutorials</span>
            </Link>
          </Button>
        </div>
        
        <div className="px-4 py-8 sm:px-6 sm:py-12 glass-card max-w-5xl mx-auto relative z-10 bg-white/5 backdrop-blur-md border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Upload 3D Files</h3>
              <p className="text-white/70 text-center">
                Import OBJ, STL, and GLB files with ease
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
                  <path d="M14.5 7.5a4 4 0 1 0 0 9 4 4 0 0 0 0-9z" />
                  <path d="M12 4V2" />
                  <path d="M12 22v-2" />
                  <path d="M4 12H2" />
                  <path d="M22 12h-2" />
                  <path d="M19.778 19.778l-1.414-1.414" />
                  <path d="M19.778 4.222l-1.414 1.414" />
                  <path d="M4.222 19.778l1.414-1.414" />
                  <path d="M4.222 4.222l1.414 1.414" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Explore Models</h3>
              <p className="text-white/70 text-center">
                Interact with 3D models using intuitive controls
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M12 2v8" />
                  <path d="m4.93 10.93 1.41 1.41" />
                  <path d="M2 18h2" />
                  <path d="M20 18h2" />
                  <path d="m19.07 10.93-1.41 1.41" />
                  <path d="M22 22H2" />
                  <path d="m16 16-4 4-4-4" />
                  <path d="M16 6a4 4 0 0 0-8 0v10h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Instant Insights</h3>
              <p className="text-white/70 text-center">
                Gain valuable information about your designs
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="container py-12 mt-20">
        <div className="text-center text-white/60 text-sm">
          &copy; 2025 grounded.ai. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
