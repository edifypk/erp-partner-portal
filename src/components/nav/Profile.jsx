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
import { ThemeSwitcher } from '../ui/shadcn-io/theme-switcher'
import { useTheme } from 'next-themes'

const Profile = () => {

    const { user, isLoading, logout } = useAuth()

    const { theme, setTheme } = useTheme()



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
                <Avatar className="border">
                    <AvatarImage src={user?.contact?.photo_url || "/images/placeholder/male.png"} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>


            <DropdownMenuContent className="w-72" align="end">
                <DropdownMenuLabel>
                    <div className='flex justify-between items-center'>

                        <div className='flex items-center gap-2'>
                            <div>
                                <Avatar>
                                    <AvatarImage src={user?.contact?.photo_url || "/images/placeholder/male.png"} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </div>
                            <div>
                                <div className='text-sm translate-y-[2px] font-semibold'>{user?.contact?.name}</div>
                                <div className='text-[11px] font-normal -translate-y-[2px] text-neutral-500'>{user?.contact?.email}</div>
                            </div>
                        </div>

                        <div>
                            <ThemeSwitcher
                                value={theme}
                                onChange={setTheme}
                                className="scale-90"
                            />
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



                {/* <div className='flex justify-end'>
               
                </div> */}


                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Profile
