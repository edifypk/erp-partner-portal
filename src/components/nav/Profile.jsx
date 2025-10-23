"use client"
import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/context/AuthContextProvider'
import Link from 'next/link'

const Profile = () => {

    const { user, isLoading } = useAuth()



    var accountLinks = [
        {
            name: 'Account',
            short: 'A',
            slug: '/dashboard/settings/account'
        },
        {
            name: 'Contract',
            short: 'C',
            slug: '/dashboard/settings/contract'
        },
        {
            name: 'Team Members',
            short: 'T',
            slug: '/dashboard/settings/team-members'
        },
        {
            name: 'Support',
            short: 'S',
            slug: '/dashboard/settings/support'
        },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>


            <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>
                    <div className='flex items-center gap-2'>
                        <div>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            <div className='text-sm translate-y-[2px] font-semibold'>{user?.contact?.name}</div>
                            <div className='text-xs font-normal -translate-y-[2px] text-gray-500'>{user?.contact?.email}</div>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />


                <DropdownMenuGroup>
                    {
                        accountLinks?.map((v, i) => {
                            return (
                                <Link href={v.slug} key={i}>
                                    <DropdownMenuItem>
                                        {v.name}
                                        <DropdownMenuShortcut> {v.short}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </Link>
                            )
                        })
                    }
                </DropdownMenuGroup>





                {/* <DropdownMenuItem disabled>API</DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Profile
