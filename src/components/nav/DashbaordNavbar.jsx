import React from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import Profile from './Profile'
import Notifications from './Notifications'
import Settings from './Settings'
import ThemeModeToggle from '../ThemeModeToggle'
import ThemeColorToggle from '../ThemColorToggle'
import { ThemeSwitcher } from '../ui/shadcn-io/theme-switcher'
import { useTheme } from 'next-themes'
import { useAuth } from '@/context/AuthContextProvider'

const DashbaordNavbar = () => {

    const { theme, setTheme } = useTheme()


    return (
        <div className='h-full px-6 border-b-[0.5px] border-dashed'>


            <div className='h-full flex justify-between items-center'>

                <div>
                    <SidebarTrigger className="-ml-1" />
                </div>

                <div className='flex items-center gap-4'>
                    <div className='flex items-center'>
                        {/* <ThemeSwitcher
                            value={theme}
                            onChange={setTheme}
                            className="scale-100"
                        /> */}
                        <Settings />
                        <Notifications />
                    </div>
                    <Profile />
                </div>

            </div>


        </div>
    )
}

export default DashbaordNavbar
