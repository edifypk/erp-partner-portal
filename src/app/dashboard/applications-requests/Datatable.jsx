"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { useRef } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from 'next/link'
import { format } from 'timeago.js'
import flags from 'react-phone-number-input/flags'
import { Badge } from '@radix-ui/themes'
import { assignCounsellorHandler } from '@/utils/functions'
import SelectUser from '@/components/SelectUser'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/context/AuthContextProvider'
import icons from '@/utils/icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import { useSearchParams } from 'next/navigation'
import Pagination from '@/components/Pagination'
import HeaderFilters from './HeaderFilters'
import StatusBar from './StatusBar'
import { applicationRequestsStatuses } from '@/data'




const Datatable = () => {


    const searchParams = useSearchParams()


    const [filters, setFilters] = useState({
        limit: searchParams.get("limit") || 10,
        page: searchParams.get("page") || 1,
        keyword: searchParams.get('keyword') || "",
        status: searchParams.get('status') || ""
    })



    const getApplicationsRequests = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/applications/requests`, {
                params: {
                    ...filters
                },
                withCredentials: true
            });
            return response?.data;
        } catch (error) {
            console.log(error?.response?.data)
            return []
        }
    }

    const applicationsRequests = useQuery({
        queryKey: ['applications-requests', filters],
        queryFn: async () => await getApplicationsRequests(),

        retry: false,
        refetchOnWindowFocus: false,
        // refetchOnReconnect: false,
        // refetchInterval: false,
    });





    useEffect(() => {
        setFilters({
            limit: searchParams.get("limit") || 10,
            page: searchParams.get("page") || 1,
            keyword: searchParams.get('keyword') || "",
            status: searchParams.get('status') || ""
        })
    }, [searchParams])







    return (
        <div className='flex-1 flex overflow-hidden flex-col'>
            <StatusBar filters={filters} setFilters={setFilters} />
            <HeaderFilters />
            <div className='w-full flex-1 rounded-b-xl overflow-auto'>

                <Table className="">


                    <TableHeader className="border-b border-dashed sticky top-0 z-20">
                        <TableRow style={{ borderBottomWidth: 0 }} className="bg-gray-100 hover:bg-gray-100 tracking-tight text-sm">
                            <TableHead className="px-4 w-40">Request</TableHead>
                            <TableHead className="min-w-56">Course</TableHead>
                            <TableHead className="w-40">Student</TableHead>
                            <TableHead className="w-36 min-w-36 text-center">Status</TableHead>
                            <TableHead className="w-32">Country</TableHead>
                            <TableHead className="w-40">Requested By</TableHead>
                        </TableRow>
                    </TableHeader>


                    <TableBody className="border-0">

                        {
                            (applicationsRequests?.data?.data?.length > 0 || applicationsRequests?.isLoading) ?
                                <>
                                    {(applicationsRequests?.isLoading) ? (
                                        Array.from({ length: 8 }).map((v, i) => {
                                            return (
                                                <TableRow key={i} className={`${i % 2 == 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-50"} border-b border-dashed`}>
                                                    <TableCell className="py-4 px-4">
                                                        <div className='flex items-center gap-2'>
                                                            <Skeleton className='h-9 w-9 rounded-full' />
                                                            <div>
                                                                <Skeleton className='h-4 w-32 mb-1' />
                                                                <Skeleton className='h-3 w-20' />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    {/* <TableCell className="py-4">
                                                        <div className=''>
                                                            <Skeleton className='h-4 w-32 mb-1' />
                                                            <Skeleton className='h-4 w-20' />
                                                        </div>
                                                    </TableCell> */}
                                                    {/* <TableCell className="py-4">
                                                        <div className='flex items-center justify-center'>
                                                            <Skeleton className='h-6 w-24 rounded-full' />
                                                        </div>
                                                    </TableCell> */}
                                                    <TableCell className="py-4">
                                                        <div className=''>
                                                            <Skeleton className='h-4 w-32 mb-1' />
                                                            <Skeleton className='h-4 w-44' />
                                                        </div>
                                                    </TableCell>
                                                    {/* <TableCell className="py-4">
                                                        <div className=''>
                                                            <Skeleton className='h-4 w-32 mb-1' />
                                                            <Skeleton className='h-4 w-20' />
                                                        </div>
                                                    </TableCell> */}
                                                    {/* <TableCell className="py-4">
                                                        <div className='flex items-center'>
                                                            {
                                                                [1, 1, 1].map((v, ci) => {
                                                                    return (
                                                                        <Skeleton key={ci} style={{ transform: `translateX(${ci * -3}px)` }} className='w-6 h-6 rounded-full'>
                                                                        </Skeleton>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className='flex items-center'>
                                                            <Skeleton className='h-8 w-24 rounded-full' />
                                                        </div>
                                                    </TableCell> */}
                                                    <TableCell className="py-4 px-4">
                                                        <div className='flex items-center gap-2'>
                                                            <Skeleton className='h-7 w-7 rounded-full' />
                                                            <div>
                                                                <Skeleton className='h-3 w-32 mb-1' />
                                                                <Skeleton className='h-[10px] w-20' />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    ) : (
                                        <>
                                            {
                                                applicationsRequests?.data?.data?.map((v, i) => {
                                                    const countryCode = v?.program?.institute?.country?.country?.code;
                                                    const Flag = countryCode ? flags[countryCode] : null;
                                                    return (
                                                        <TableRow key={i} className={`${i % 2 == 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-50"} border-b border-dashed`}>


                                                            <TableCell className="py-2 px-4">
                                                                <Link className='group' href={`/dashboard/applications-requests/${v?.application_id}`}>
                                                                    <div className='text-gray-700 tracking-tight group-hover:text-blue-600 font-semibold translate-y-[1px] text-xs'>{v?.application_id}</div>
                                                                    <div className='text-gray-600 tracking-tighter group-hover:text-blue-600 whitespace-nowrap translate-y-[-1px] text-xs'>{format(v?.createdAt, 'en_US')}</div>
                                                                </Link>
                                                            </TableCell>


                                                            <TableCell className="text-gray-600 text-xs">
                                                                <div className='flex items-center gap-2'>
                                                                    <div>
                                                                        <Avatar className='w-9 h-9 border overflow-hidden bg-white'>
                                                                            <AvatarImage className='rounded-full' src={v?.program?.institute?.logo_url ? v?.program?.institute?.logo_url : `/images/placeholder/image.png`} />
                                                                            <AvatarFallback>{v?.program?.institute?.name?.charAt(0)}</AvatarFallback>
                                                                        </Avatar>
                                                                    </div>
                                                                    <div className='flex-1 tracking-tight'>
                                                                        <TooltipProvider>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <div className='font-medium cursor-default w-fit text-black line-clamp-1'>{v?.program?.name}</div>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent side='top' className="text-[10px] border-[0.5px] rounded-sm border-white/20 px-[6px] py-[2px]">
                                                                                    <p>{v?.program?.name}</p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>



                                                                        <TooltipProvider>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <div className='line-clamp-1 cursor-default w-fit'>{v?.program?.institute?.name}</div>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent side='bottom' className="text-[10px] border-[0.5px] rounded-sm border-white/20 px-[6px] py-[2px]">
                                                                                    <p>{v?.program?.institute?.name}</p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>

                                                                    </div>
                                                                </div>
                                                            </TableCell>



                                                            <TableCell className="py-2">
                                                                <div className='flex tracking-tight items-center gap-2'>
                                                                    <Avatar className='w-9 h-9 border rounded-full'>
                                                                        <AvatarImage className='object-cover' src={v?.student?.contact?.photo_url || `/images/placeholder/male.png`} />
                                                                        <AvatarFallback>{v?.student?.contact?.name?.charAt(0)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className='whitespace-nowrap'>
                                                                        <div className='text-black text-[13px] font-medium whitespace-nowrap translate-y-[2px]'>{v?.student?.contact?.name}</div>
                                                                        <div className='text-[11px] text-gray-500 translate-y-[-2px]'>{v.student?.contact?.contact_id}</div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>





                                                            <TableCell className="py-2">
                                                                <div className='flex items-center justify-center'>

                                                                    {v?.approval_status == 'pending' ?
                                                                        <Badge
                                                                            variant="soft"
                                                                            size="2"
                                                                            color={applicationRequestsStatuses.find(status => status.slug === v?.approval_status)?.color}
                                                                            radius='full'
                                                                            className='capitalize'
                                                                        >
                                                                            {applicationRequestsStatuses.find(status => status.slug === v?.approval_status)?.name}
                                                                        </Badge>
                                                                        :
                                                                        v?.approval_status == 'rejected' ?
                                                                            <TooltipProvider delayDuration={0}>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger className='cursor-pointer' asChild>
                                                                                        <Badge
                                                                                            variant="soft"
                                                                                            size="2"
                                                                                            color={applicationRequestsStatuses.find(status => status.slug === v?.approval_status)?.color}
                                                                                            radius='full'
                                                                                            className='capitalize'
                                                                                        >
                                                                                            {applicationRequestsStatuses.find(status => status.slug === v?.approval_status)?.name}
                                                                                        </Badge>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent className="text-[10px] tracking-tight text-gray-300 border-[0.5px] max-w-[300px] rounded-sm border-white/20 px-[6px] py-[4px]">
                                                                                        <p>
                                                                                            {v?.rejected_reason?.length > 200 ? v?.rejected_reason?.substring(0, 200) + "..." : v?.rejected_reason}
                                                                                        </p>
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            </TooltipProvider>
                                                                            :
                                                                            // cancelled
                                                                            <TooltipProvider delayDuration={0}>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger className='cursor-pointer' asChild>
                                                                                        <Badge
                                                                                            variant="soft"
                                                                                            size="2"
                                                                                            color={applicationRequestsStatuses.find(status => status.slug === v?.approval_status)?.color}
                                                                                            radius='full'
                                                                                            className='capitalize'
                                                                                        >
                                                                                            {applicationRequestsStatuses.find(status => status.slug === v?.approval_status)?.name}
                                                                                        </Badge>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent className="text-[10px] tracking-tight text-gray-300 border-[0.5px] max-w-[300px] rounded-sm border-white/20 px-[6px] py-[4px]">
                                                                                        <p>
                                                                                            {v?.cancelled_reason?.length > 200 ? v?.cancelled_reason?.substring(0, 200) + "..." : v?.cancelled_reason}
                                                                                        </p>
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            </TooltipProvider>

                                                                    }
                                                                </div>
                                                            </TableCell>





                                                            <TableCell>
                                                                <div className="flex">
                                                                    <div className="flex bg-gray-100 items-center gap-1 py-[2px] pl-[6px] pr-2 rounded-full">
                                                                        {Flag && <Flag width={20} className="h-[20px]" height={20} />}
                                                                        <div className='text-xs font-medium'>{v?.program?.institute?.country?.country?.name || 'N/A'}</div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>



                                                            <TableCell className="py-3">
                                                                <div className='flex items-center gap-2 tracking-tight'>
                                                                    <Avatar className='w-7 h-7 border rounded-full'>
                                                                        <AvatarImage className='object-cover' src={v?.requested_by?.contact?.photo_url || `/images/placeholder/male.png`} />
                                                                        <AvatarFallback>{v?.requested_by?.contact?.name?.charAt(0)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className='whitespace-nowrap'>
                                                                        <div className='text-black text-[12px] font-medium whitespace-nowrap translate-y-[3px]'>{v?.requested_by?.contact?.name}</div>
                                                                        <div className='text-[11px] text-gray-500 translate-y-[-3px]'>{v.requested_by?.job_title}</div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>





                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </>
                                    )}
                                </>
                                :
                                <TableRow className="hover:bg-transparent" style={{ opacity: applicationsRequests?.isLoading ? 0 : 1 }}>
                                    <TableCell colSpan="8">
                                        <div className='text-center p-10'>
                                            <img className='w-40 mx-auto mb-4' src="/images/notfound.svg" alt="" />
                                            <div className='font-medium'>Sorry, we couldn't find any applications requests</div>
                                            <div className='text-xs text-gray-500'>Please try again with different filters</div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                        }


                    </TableBody>


                </Table>

            </div>
            <div className='p-3 border-t'>
                <Pagination filters={filters} dataSet={applicationsRequests} />
            </div>
        </div>
    )
}

export default Datatable