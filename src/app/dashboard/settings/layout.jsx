"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

const layout = ({ children }) => {

    var pathname = usePathname()

    const [activeTab, setActiveTab] = useState(pathname)


    const parentRef = useRef(null);
    var [refLineStyle, setRefLineStyle] = useState({
        width: 0,
        left: 0
    })


    const updateLeft = (key) => {
        setRefLineStyle({
            left: `${Math.floor(document.getElementById(key)?.getBoundingClientRect().left - parentRef.current?.getBoundingClientRect().left || 0) + 1}px`,
            width: `${document.getElementById(key)?.getBoundingClientRect().width}px`
        })
    }

    useEffect(() => {
        setRefLineStyle({
            left: `${Math.floor(document.getElementById(activeTab || 'general')?.getBoundingClientRect().left - parentRef.current?.getBoundingClientRect().left || 0)}px`,
            width: `${document.getElementById(activeTab || 'general')?.getBoundingClientRect().width}px`
        })
    }, [activeTab])


    var settingsTabs = [
        {
            name: 'General',
            slug: '/dashboard/settings'
        },
        {
            name: 'Account',
            slug: '/dashboard/settings/account'
        },
        {
            name: 'Contract',
            slug: '/dashboard/settings/contract'
        },
        {
            name: 'Team Members',
            slug: '/dashboard/settings/team-members'
        },
        {
            name: 'Bank Details',
            slug: '/dashboard/settings/bank-details'
        },
        {
            name: 'Support',
            slug: '/dashboard/settings/support'
        },
    ]

    useEffect(() => {
        setActiveTab(pathname)
    }, [pathname])


    return (
        <div className='flex flex-col h-full overflow-hidden'>
            <div className='pt-8 px-8'>
                <div>
                    <div className='text-lg font-semibold flex items-center'>
                        {/* <div className='w-6 h-6'><ion-icon name="settings-outline"></ion-icon></div> */}
                        <div>Settings</div>
                    </div>
                </div>
                <div className='overflow-x-auto hideScrollBar'>
                    <div ref={parentRef} className='flex items-center gap-4 pt-1'>
                        {
                            settingsTabs?.map((v, i) => {
                                var isActive = (v.slug == activeTab)
                                return (
                                    <Link href={`${v.slug}`} id={v.slug} onClick={() => { setActiveTab(v.slug); updateLeft(v.slug) }} key={i} className={`py-2 px-2 flex cursor-pointer items-center font-medium text-sm gap-1`}>
                                        <div className={`whitespace-nowrap ${isActive ? "text-primary" : "text-gray-400"}`}>{v.name}</div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                    <div className='h-[2px] bg-gray-100 dark:bg-neutral-900 relative'>
                        <div style={refLineStyle} className='absolute transition-all duration-300 bottom-0 bg-primary/40 h-full'></div>
                    </div>
                </div>
            </div>
            <div className='flex-1 overflow-auto p-8'>
                {children}
            </div>
        </div>
    )
}

export default layout
