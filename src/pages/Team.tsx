
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Users, 
  UserPlus, 
  Mail, 
  MoreHorizontal 
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const teamMembers = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'Admin',
    avatar: 'AJ',
    lastActive: '2 hours ago',
  },
  {
    id: 2,
    name: 'Sam Williams',
    email: 'sam@example.com',
    role: 'Editor',
    avatar: 'SW',
    lastActive: 'Yesterday',
  },
  {
    id: 3,
    name: 'Taylor Chen',
    email: 'taylor@example.com',
    role: 'Viewer',
    avatar: 'TC',
    lastActive: '3 days ago',
  },
  {
    id: 4,
    name: 'Jordan Smith',
    email: 'jordan@example.com',
    role: 'Editor',
    avatar: 'JS',
    lastActive: '1 week ago',
  },
];

const Team: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-brand-500" />
            Team Members
          </h1>
          <p className="text-muted-foreground">
            Manage your team and their access levels
          </p>
        </div>
        
        <Button className="flex items-center gap-2 md:self-start">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map(member => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-medium text-sm">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                      member.role === 'Admin' 
                        ? 'bg-brand-100 text-brand-700' 
                        : member.role === 'Editor'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {member.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {member.lastActive}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuItem>Resend Invite</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Free tier: 5 team members maximum
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Team;
