
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Settings as SettingsIcon, 
  User, 
  CreditCard, 
  Lock, 
  Bell, 
  Save
} from 'lucide-react';

const Settings: React.FC = () => {
  const [isEmailNotifications, setIsEmailNotifications] = useState(true);
  const [is2FA, setIs2FA] = useState(false);
  
  const handleSaveProfile = () => {
    toast.success('Profile settings saved');
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-brand-500" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Lock className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Alex Johnson" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="alex@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue="Design Studio Inc." />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Architect" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="A brief description about yourself"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="account" className="mt-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Security</h3>
              
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="font-medium">Password</div>
                  <div className="text-sm text-muted-foreground">
                    Last changed 3 months ago
                  </div>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Two-factor Authentication</div>
                  <div className="text-sm text-muted-foreground">
                    Additional security for your account
                  </div>
                </div>
                <Switch 
                  checked={is2FA}
                  onCheckedChange={setIs2FA}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account Management</h3>
              
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium text-destructive">Danger Zone</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="billing" className="mt-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Plan</h3>
              
              <div className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-medium text-lg">Free Tier</div>
                    <div className="text-sm text-muted-foreground">
                      Basic access to ShapeSense features
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">$0</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                </div>
                
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Up to 5 team members
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    10 projects
                  </li>
                  <li className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Basic 3D model support
                  </li>
                </ul>
                
                <Button>Upgrade Plan</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Methods</h3>
              
              <div className="flex justify-center items-center border rounded-lg p-6 bg-muted/50">
                <div className="text-center">
                  <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <div className="font-medium">No payment methods</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Add a payment method to upgrade your plan
                  </div>
                  <Button variant="outline">Add Payment Method</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Receive emails about account activity
                    </div>
                  </div>
                  <Switch 
                    checked={isEmailNotifications}
                    onCheckedChange={setIsEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Project Updates</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified when changes are made to your projects
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Team Activity</div>
                    <div className="text-sm text-muted-foreground">
                      Receive updates about team member actions
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Marketing Communications</div>
                    <div className="text-sm text-muted-foreground">
                      Receive newsletters and product updates
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Notification settings saved')}>
                Save Preferences
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
