"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { DocumentValidationIcon, Files01Icon, Task01Icon, UserListIcon } from 'hugeicons-react'
import { cn } from '@/lib/utils'
import { useSearchQuery } from '@/hooks/useSearchQuery'
import StudentAvatarWithActions from './StudentAvatarWithActions'
import { applicationChecks } from '@/data'
import Documents from '@/components/crm/Documents/Documents'
import ApplicationsStage from './Applications/ApplicationsStage'
import ContactDetails from './contact-details/ContactDetails'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tick02Icon } from 'hugeicons-react'
import Link from 'next/link'

const StudentLayout = ({ student }) => {

    var router = useRouter()
    const { CustomSearchParams, applySearchQueries } = useSearchQuery()

    var [active, setActive] = useState(CustomSearchParams.get('tab') || "studentInfo")


    const [editMode, setEditMode] = useState(true)
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        // setCustomLabels({
        //     ...customLabels,
        //     [enquiry.id]: enquiry.full_name,
        // });
        // setEditMode(false)
    }, [student.id])

    var tabs = [
        {
            icon: UserListIcon,
            label: "Student Info",
            value: "studentInfo",
            showCount: false,
        },
        {
            icon: DocumentValidationIcon,
            label: "Documents",
            value: "documents",
            showCount: false,
        },
        {
            icon: Files01Icon,
            label: "Applications",
            value: "applications",
            showCount: true,
            count: student?.applications?.length || 0
        },
        // {
        //     icon: Task01Icon,
        //     label: "Tasks",
        //     value: "tasks",
        //     showCount: false,
        // },
        // {
        //     icon: Task01Icon,
        //     label: "Tasks",
        //     value: "tasks1",
        //     showCount: false,
        // },
        // {
        //     icon: Task01Icon,
        //     label: "Tasks",
        //     value: "tasks2",
        //     showCount: false,
        // },
    ]

    useEffect(() => {
        applySearchQueries([{ name: 'tab', value: active }])
    }, [active])


    return (
        <div className="p-6 h-full overflow-auto w-full">
            <div className=' max-w-7xl mx-auto'>



                <Tabs
                    defaultValue={active}
                    onValueChange={(value) => {
                        setActive(value)
                        applySearchQueries([{ name: 'tab', value: value }])
                    }}
                    className='flex gap-6'
                >

                    <div className='min-w-[180px] w-[20%]'>
                        <div className='sticky top-0'>
                            <div className='mb-4'>
                                <StudentAvatarWithActions editMode={editMode} setEditMode={setEditMode} student={student} />
                            </div>
                            <TabsList className="flex flex-col gap-1 h-auto items-start p-0 bg-white">

                                {
                                    tabs.map((tab) => {
                                        const isActive = active === tab.value
                                        return (
                                            <TabsTrigger
                                                key={tab.value}
                                                className={cn('text-xs cursor-pointer tracking-tight h-10 hover:scale-105 border flex justify-between w-full', isActive ? 'bg-transparent border' : 'bg-gray-200/70 border-transparent')}
                                                value={tab.value}
                                            >
                                                <div className={cn('flex items-center gap-2 text-[13px]', isActive ? 'font-medium text-primary' : 'font-normal')}>
                                                    <tab.icon size={18} strokeWidth={isActive ? 1.6 : 1.4} />
                                                    {tab.label}
                                                </div>
                                                {tab.showCount && (
                                                    <span className='text-xs ml-1 w-4 flex justify-center items-center bg-gray-200 rounded-sm font-semibold'>
                                                        {tab.count}
                                                    </span>
                                                )}
                                            </TabsTrigger>
                                        )
                                    })
                                }

                            </TabsList>
                        </div>
                    </div>

                    <div className="flex-1">
                        <TabsContent value="studentInfo" className="mt-0">
                            <ContactDetails loading={loading} setEditMode={setEditMode} contact={student?.contact} />
                        </TabsContent>


                        <TabsContent value="documents" className="mt-0">
                            <Documents contact_id={student?.contact_id} foldersContainerStyle="grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-4" />
                        </TabsContent>


                        <TabsContent value="applications" className="mt-0">
                            <ApplicationsStage student={student} />
                        </TabsContent>


                    </div>

                   {active == 'studentInfo' && <div className='min-w-[280px] w-[32%] hidden xl:block'>
                        <div className='sticky top-0'>
                            <ApplicationsOverview student={student} />
                        </div>
                    </div>}

                </Tabs>



            </div>
        </div>
    )
}

export default StudentLayout



const ApplicationsOverview = ({ student }) => {

    var [hoveredApplicationIndex, setHoveredApplicationIndex] = useState(null)


    return (
        <div className='rounded-2xl border bg-linear-to-br from-primary/5 to-transparent p-3'>
            <div className='flex gap-2 items-center tracking-tight mb-1'>
                <div className='text-sm font-medium'>Applications Overview</div>
                <div className='w-4 h-4 bg-gray-200 dark:text-black flex justify-center items-center rounded-sm text-[11px] font-medium'>{student?.applications?.length}</div>
            </div>
            <div className='flex items-center gap-6'>
                <div className='space-y-1 py-3'>
                    {
                        applicationChecks.map((v, i) => {
                            return (
                                <div
                                    key={i}
                                    className={cn(
                                        'text-xs tracking-tighter lg:tracking-tight whitespace-nowrap h-[18px] text-neutral-600 dark:text-neutral-400 transition-opacity duration-200',
                                    )}
                                >
                                    {v.label}
                                </div>
                            )
                        })
                    }
                </div>
                <div className='flex-1 flex gap-3 lg:gap-4 pl-2 overflow-auto py-1'>
                    {
                        student?.applications?.length > 0 ?
                            student?.applications?.map((app, ai) => {

                                const isHovered = hoveredApplicationIndex === ai
                                const shouldDimApplication = hoveredApplicationIndex !== null && hoveredApplicationIndex !== ai

                                return (
                                    <TooltipProvider key={ai}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Link
                                                    href={`/dashboard/applications/${app?.application_id}`}
                                                    key={ai}
                                                    className={cn(
                                                        'h-full bg-gray-100 cursor-pointer block rounded-full px-[2px] py-1 space-y-1 ring-4 ring-gray-100 transition-opacity duration-200',
                                                        shouldDimApplication ? 'opacity-30' : 'opacity-100'
                                                    )}
                                                    onMouseEnter={() => setHoveredApplicationIndex(ai)}
                                                    onMouseLeave={() => setHoveredApplicationIndex(null)}
                                                >
                                                    {
                                                        applicationChecks?.map((check, i) => {
                                                            var isChecked = app[check.key]
                                                            return (

                                                                <div key={i} className='w-[18px] h-[18px] bg-white rounded-full'>
                                                                    <div
                                                                        className={
                                                                            cn(
                                                                                'w-full h-full bg-gradient-to-br rounded-full p-[2px] ring-2',
                                                                                isChecked ? 'from-green-400 to-green-600 ring-green-200/80' : 'from-gray-200 to-gray-300 ring-gray-50'
                                                                            )}
                                                                    >
                                                                        <div className='w-full h-full rounded-full flex justify-center items-center text-white'>
                                                                            {isChecked && <Tick02Icon strokeWidth={2.5} size={25} />}
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                            )
                                                        })
                                                    }
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent className="min-w-40 py-3 shadow-md max-w-72 bg-white border">
                                                <div className='flex items-center gap-2'>
                                                    <div>
                                                        <Avatar className='w-10 h-10 border rounded-full'>
                                                            <AvatarImage className='object-cover' src={app?.program?.institute?.logo_url || `/images/placeholder/male.png`} />
                                                            <AvatarFallback>{app?.program?.institute?.name?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                    <div className='text-left'>
                                                        <div className='text-gray-600 text-[12px] leading-[1] mb-1 font-medium line-clamp-2 tracking-tight'>{app?.program?.name}</div>
                                                        <div className='text-xs tracking-tight leading-[1] text-gray-500'>{app?.program?.institute?.name} • {app?.program?.institute?.country?.short_name}</div>
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )
                            })
                            :
                            <div className='w-full h-full bg-background dark:bg-neutral-900/50 p-2 border text-center border-dashed rounded-lg flex justify-center items-center'>
                                <div>
                                    <img src="/images/no-data.svg" alt="no data" className='w-10 h-10 mx-auto' />
                                    <div className='text-[11px] font-medium tracking-tighter'>No applications Found</div>
                                    {/* <p className='text-[10px] tracking-tighter'>Student not applied to any course yet</p> */}
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}