
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Book, 
  Users, 
  Settings, 
  Plus,
  FileUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
  const location = useLocation();
  
  const links = [
    { 
      name: 'Projects', 
      href: '/dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      name: 'Tutorials', 
      href: '/tutorials', 
      icon: <Book className="w-5 h-5" /> 
    },
    { 
      name: 'Team', 
      href: '/team', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: <Settings className="w-5 h-5" /> 
    },
  ];

  return (
    <div 
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center px-4 py-6">
        {!collapsed && (
          <Link to="/" className="text-2xl font-bold text-brand-900">
            grounded.ai
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="text-2xl font-bold text-brand-900 mx-auto">
            g
          </Link>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                to={link.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  location.pathname === link.href
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary",
                  collapsed ? "justify-center" : ""
                )}
              >
                {link.icon}
                {!collapsed && <span className="ml-3">{link.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Add project button */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <Link
          to="/upload"
          className={cn(
            "flex items-center px-3 py-2 bg-brand-700 text-white rounded-md transition-colors hover:bg-brand-800",
            collapsed ? "justify-center" : ""
          )}
        >
          {collapsed ? <FileUp className="w-5 h-5" /> : (
            <>
              <Plus className="w-5 h-5" />
              <span className="ml-2">New Project</span>
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
