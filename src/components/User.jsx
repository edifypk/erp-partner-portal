"use client"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { cn } from '@/lib/utils'

const User = ({user}) => {



    return (
        <div className='flex items-center gap-2'>
            <div>
                <Avatar className='w-7 h-7 bg-white rounded-full border'>
                    <AvatarImage className='object-cover' src={user?.contact?.photo_url || `/images/placeholder/male.png`} />
                    <AvatarFallback>{user?.contact?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            <div className='text-left'>
                <div className={cn('text-gray-700 text-xs font-medium  whitespace-nowrap tracking-tight')}>{user?.contact?.name}</div>
                <div className={cn('text-[10px] leading-none text-gray-700  whitespace-nowrap')}>{user?.job_title}</div>
            </div>
        </div>
    )
}

export default User
