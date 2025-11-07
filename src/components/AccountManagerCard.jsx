"use client";

import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Call02Icon, Mail01Icon } from 'hugeicons-react';
import { useAuth } from '@/context/AuthContextProvider';
import { Loader2 } from 'lucide-react';

const AccountManagerCard = () => {
    const { agentData, isLoading } = useAuth();

    const accountManager = agentData?.account_manager;
    const managerContact = accountManager?.contact;
    
    // photo_url is a virtual field that already includes the full S3 URL
    const photoUrl = managerContact?.photo_url || "/images/girl.png";

    // Get initials for avatar fallback
    const getInitials = (name) => {
        if (!name) return 'AM';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className='text-center'>Account Manager</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center py-8">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
                </CardContent>
            </Card>
        );
    }

    if (!accountManager || !managerContact) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className='text-center'>Account Manager</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                    <p className="text-sm text-gray-500">No account manager assigned yet</p>
                </CardContent>
            </Card>
        );
    }


    return (
        <Card className="bg-linear-to-br from-primary/5 to-transparent rounded-3xl border px-4 py-2 h-full">
            <CardHeader>
                <CardTitle className='text-center'>Account Manager</CardTitle>
            </CardHeader>

            <CardContent>
                <div className='flex flex-col gap-2 justify-center items-center text-center mb-6'>
                    <Avatar className="w-20 h-20 border bg-white dark:bg-background mb-2">
                        <AvatarImage 
                            src={photoUrl} 
                            alt={managerContact.name}
                            className="w-full h-full object-cover" 
                        />
                        <AvatarFallback>{getInitials(managerContact.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className='font-semibold tracking-tight mb-1'>{managerContact.name}</div>
                        <div className='text-xs font-medium tracking-tight text-neutral-400'>{accountManager.job_title || 'Account Manager'}</div>
                    </div>
                </div>

                <div className='flex justify-center items-center gap-4'>
                    {managerContact.phone && (
                        <a href={`tel:${managerContact.phone}`}>
                            <div className='flex justify-center items-center text-primary w-12 h-12 hover:scale-125 transition-all duration-300 hover:bg-primary dark:text-neutral-300 hover:text-white rounded-full bg-white dark:bg-background border-primary/20 border'>
                                <Call02Icon />
                            </div>
                        </a>
                    )}
                    {managerContact.email && (
                        <a href={`mailto:${managerContact.email}`}>
                            <div className='flex justify-center items-center text-primary w-12 h-12 hover:scale-125 transition-all duration-300 hover:bg-primary dark:text-neutral-300 hover:text-white rounded-full bg-white dark:bg-background border-primary/20 border'>
                                <Mail01Icon />
                            </div>
                        </a>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default AccountManagerCard;
