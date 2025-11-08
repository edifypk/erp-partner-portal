import React, { useState } from 'react'
import { Badge } from '@radix-ui/themes'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import { AlertCircleIcon, Tick02Icon } from 'hugeicons-react'
import SelectUser from '@/components/SelectUser'
import { assignCounsellorHandler, highlightText } from '@/utils/functions'
import { CheckIcon, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { applicationChecks } from '@/data'

const StudentCard = ({ student, keyword }) => {

    var router = useRouter()
    const [hoveredApplicationIndex, setHoveredApplicationIndex] = useState(null)



    return (
        <Link href={`/dashboard/crm/students/${student?.contact?.contact_id}`} className='border bg-background rounded-2xl flex flex-col shadow-sm'>
            <div className='p-6 relative flex-1'>

                <div className='flex mb-4'>
                    <div className='flex items-center gap-2 group'>
                        <div>
                            <Avatar className='w-16 h-16 border'>
                                <AvatarImage className='object-cover' src={student?.contact?.photo_url || `/images/placeholder/${student?.contact?.gender}.png`} />
                                <AvatarFallback>{student?.contact?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            <div className='text-sm tracking-tight  font-semibold  whitespace-nowrap'>{highlightText(student?.contact?.name, keyword)}</div>
                            <div className='text-xs tracking-tight text-gray-500  whitespace-nowrap'>{highlightText(student?.contact?.contact_id, keyword)}</div>
                        </div>
                    </div>
                </div>


                <div>
                    <div className='flex gap-2 items-center tracking-tight mb-1'>
                        <div className='text-sm font-medium'>Applications</div>
                        <div className='w-4 h-4 bg-gray-200 dark:text-black flex justify-center items-center rounded-sm text-[11px] font-medium'>{student?.applications?.length}</div>
                    </div>


                    <div className='flex gap-6 mb-3'>

                        <div className='space-y-1 py-3'>
                            {
                                applicationChecks.map((v, i) => {
                                    // Check if this label should be dimmed based on hovered application
                                    const shouldDimLabel = hoveredApplicationIndex !== null &&
                                        !student?.applications?.[hoveredApplicationIndex]?.[v.key]

                                    return (
                                        <div
                                            key={i}
                                            className={cn(
                                                'text-xs tracking-tighter lg:tracking-tight whitespace-nowrap h-[18px] text-neutral-600 dark:text-neutral-400 transition-opacity duration-200',
                                                shouldDimLabel ? 'opacity-30' : 'opacity-100'
                                            )}
                                        >
                                            {v.label}
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className='flex-1 flex gap-3 lg:gap-4 p-2 overflow-auto'>
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
                                                            href={`/dashboard/crm/applications/${app?.application_id}`}
                                                            key={ai}
                                                            className={cn(
                                                                'h-full bg-gray-100 block cursor-pointer rounded-full py-1 px-[2px] space-y-1 ring-4 ring-gray-100 transition-opacity duration-200',
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
                                    <div className='w-full h-full bg-background border text-center border-dashed rounded-lg flex justify-center items-center'>
                                        <div>
                                            <img src="/images/no-data.svg" alt="no data" className='w-10 h-10 mx-auto' />
                                            <div className='text-xs font-medium tracking-tighter'>No applications Found</div>
                                            <p className='text-[10px] tracking-tighter'>Student not applied to any course yet</p>
                                        </div>
                                    </div>
                            }
                        </div>

                    </div>


                    <div className='flex justify-between items-center'>
                        <div>
                            <div className=''>
                                user
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            status
                        </div>
                    </div>


                </div>


            </div>
        </Link>
    )
}

export default StudentCard
