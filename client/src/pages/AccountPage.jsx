import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Bell, ShieldCheckIcon, User } from 'lucide-react';
import AccountMain from '@/components/account-main';
import AccountPassword from '@/components/account-password';
import NotificationsSettings from '@/components/NotificationsSettings';

export default function SidebarTabs() {
    const [selectedTab, setSelectedTab] = useState('account');

    return (
        <div className="flex h-full">
            {/* Main Content */}
            <div className="flex-1 p-2 h-full">
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full  h-full gap-4">
                    <div className="bg-[#ffffff] rounded-2xl w-[20%] flex  pr-2">
                        <TabsList className="flex  bg-[#ffffff] ">
                            <TabsTrigger value="account" className="w-full justify-start cursor-pointer data-[state=active]:bg-secondary py-2 px-4 hover:underline data-[state=active]:hover:no-underline"> <User/> Account</TabsTrigger>
                            <TabsTrigger value="security" className="w-full justify-start cursor-pointer data-[state=active]:bg-secondary py-2 px-4  hover:underline data-[state=active]:hover:no-underline"><ShieldCheckIcon/> Security</TabsTrigger>
                            <TabsTrigger value="notifications" className="w-full justify-start cursor-pointer data-[state=active]:bg-secondary py-2 px-4  hover:underline data-[state=active]:hover:no-underline"><Bell/> Notifications</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="account" >
                      <AccountMain />
                    </TabsContent>
                    <TabsContent value="security">
                    <AccountPassword />
                    </TabsContent>
                    <TabsContent value="notifications">
                       <NotificationsSettings />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
