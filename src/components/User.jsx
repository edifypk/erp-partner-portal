"use client"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { cn } from '@/lib/utils'

const User = ({user, theme="dark"}) => {

    return (
        <div className='flex items-center gap-2'>
            <div>
                <Avatar className='w-8 h-8 bg-background rounded-full border'>
                    <AvatarImage className='object-cover' src={user?.contact?.photo_url || `/images/placeholder/male.png`} />
                    <AvatarFallback>{user?.contact?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            <div className='text-left'>
                <div className={cn('text-xs dark:text-neutral-300 text-neutral-600 font-medium  whitespace-nowrap tracking-tight', theme === "light" ? "text-white" : "text-black")}>{user?.contact?.name}</div>
                <div className={cn('text-[10px] font-medium translate-y-[2px] leading-none dark:text-neutral-400 text-neutral-600  whitespace-nowrap', theme === "light" ? "text-white" : "text-black")}>{user?.job_title || "--"}</div>
            </div>
        </div>
    )
}

export default User
