import Link from 'next/link'
import React from 'react'

const Settings = () => {
    return (
        <Link href="/dashboard/settings" className='w-9 h-9 animate-spin [animation-delay:4s] [animation-duration:8s] flex rounded-full items-center justify-center text-lg text-gray-400 relative group cursor-pointer'>
            <ion-icon className="z-10 relative" name="settings"></ion-icon>
            <div className='w-3/4 h-3/4 absolute bg-gray-100 opacity-0 group-hover:opacity-100 rounded-full group-hover:w-full group-hover:h-full transition-all duration-300'></div>
        </Link>
    )
}

export default Settings
