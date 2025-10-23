import React from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import Profile from './Profile'
import Notifications from './Notifications'
import Settings from './Settings'

const DashbaordNavbar = () => {
    return (
        <div className='h-full px-6 border-b-[0.5px] border-dashed'>


            <div className='h-full flex justify-between items-center'>

                <div>
                    <SidebarTrigger className="-ml-1" />
                </div>

                <div className='flex items-center gap-4'>
                    <div className='flex items-center'>
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
