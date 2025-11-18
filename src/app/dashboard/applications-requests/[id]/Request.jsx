'use client'
import { Badge } from '@radix-ui/themes'
import { ArrowLeft01Icon, ArrowTurnBackwardIcon, Building06Icon, Calendar03Icon, Globe02Icon, GraduationScrollIcon, HourglassIcon, Money03Icon, MoneyBag02Icon, PencilEdit01Icon, PencilEdit02Icon, StarIcon } from 'hugeicons-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { applicationRequestsStatuses } from '@/data'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { format } from 'timeago.js'
import axios from 'axios'
import ApplicationRequestTabs from './ApplicationRequestTabs/ApplicationRequestTabs'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '@/context/AuthContextProvider'

import { toast as sonnerToast } from 'sonner'
import User from '@/components/User'



const Request = ({ application }) => {



    return (
        <div className='h-full p-6 overflow-auto'>


            <div className="max-w-7xl mx-auto">


                {/* topbar */}
                <div className='flex items-center justify-between mb-5'>
                    <div>
                        <div className='flex items-center gap-4'>
                            <div className='font-bold text-lg'>
                                {application?.application_id}
                            </div>
                            <div>
                                <ChangeApplicationRequestStatusBadge application={application} status={application?.approval_status} />
                            </div>

                            {application?.approval_status == "rejected" &&
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger>
                                            <div className='cursor-pointer'>
                                                <img className='w-4' src="/images/gif/warn.gif" alt="" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="min-w-[200px] py-3 max-w-[300px] bg-gray-800">
                                            <div>
                                                <div className='flex items-center gap-2'>
                                                    <Avatar className='w-7 h-7 border-[0.5px] rounded-full'>
                                                        <AvatarImage className='object-cover' src={application?.rejected_by?.contact?.photo_url} />
                                                        <AvatarFallback>Q</AvatarFallback>
                                                    </Avatar>
                                                    <div className='whitespace-nowrap'>
                                                        <div className='text-gray-300 text-[11] whitespace-nowrap translate-y-[2px]'>{application?.rejected_by?.contact?.name}</div>
                                                        <div className='text-[11px] text-gray-400 translate-y-[-2px]'>{application?.rejected_by?.job_title}</div>
                                                    </div>
                                                </div>

                                                <div className='text-gray-400 text-[11px] my-2'>{application?.rejected_reason}</div>
                                                <div className='text-gray-500 text-[11px]'>{format(application?.rejected_at, 'en_US')}</div>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            }
                            {application?.approval_status == "cancelled" &&
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger>
                                            <div className='cursor-pointer'>
                                                <img className='w-4' src="/images/gif/warn.gif" alt="" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="min-w-[200px] py-3 max-w-[300px] bg-gray-800">
                                            <div>
                                                <div className='flex items-center gap-2'>
                                                    <Avatar className='w-7 h-7 border-[0.5px] rounded-full'>
                                                        <AvatarImage className='object-cover' src={application?.cancelled_by?.contact?.photo_url} />
                                                        <AvatarFallback>Q</AvatarFallback>
                                                    </Avatar>
                                                    <div className='whitespace-nowrap'>
                                                        <div className='text-gray-300 text-[11] whitespace-nowrap translate-y-[2px]'>{application?.cancelled_by?.contact?.name}</div>
                                                        <div className='text-[11px] text-gray-400 translate-y-[-2px]'>{application?.cancelled_by?.job_title}</div>
                                                    </div>
                                                </div>

                                                <div className='text-gray-400 text-[11px] my-2'>{application?.cancelled_reason}</div>
                                                <div className='text-gray-500 text-[11px]'>{format(application?.cancelled_at, 'en_US')}</div>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            }

                        </div>
                    </div>


                    <div className='flex items-center gap-2'>
                    </div>
                </div>


                <div className='grid grid-cols-12 gap-4'>

                    <div className='col-span-8'>
                        <ApplicationRequestTabs application={application} />
                    </div>


                    <div className='col-span-4 pt-10'>

                        <div className='bg-white rounded-2xl shadow-sm sticky top-0'>

                            <div className='border-b border-dashed py-3 px-4'>
                                <div className='text-start w-full mb-3'>
                                    <div className='font-semibold tracking-tight'>Student info</div>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <div>
                                            <Avatar className='w-12 h-12 border'>
                                                <AvatarImage className='object-cover border border-white rounded-full' src={application?.student?.contact?.photo_url} />
                                                <AvatarFallback>{application?.student?.lead?.full_name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div>
                                            <div className='text-black text-sm font-medium tracking-tight whitespace-nowrap'>{application?.student?.contact?.name}</div>
                                            <div className='text-xs font-medium tracking-tighter -translate-y-[2px] text-gray-500  whitespace-nowrap'>{application?.student?.contact?.contact_id}</div>
                                        </div>
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger>
                                                <Link target="_blank" className='hover:scale-110 transition-all duration-300' href={`/dashboard/students/${application?.student?.contact_id}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" color="currentColor" className="w-full h-full text-[#585858]"><path d="M8.34056 3.75L9.42476 3.75C9.98408 3.75 10.4375 4.18528 10.4375 4.72222C10.4375 5.25917 9.98408 5.69445 9.42476 5.69445H8.41203C6.95119 5.69445 5.95743 5.69651 5.21326 5.79256C4.49822 5.88485 4.16703 6.04757 3.94163 6.26396C3.71622 6.48035 3.54672 6.79829 3.45059 7.48473C3.35053 8.19914 3.34838 9.15314 3.34838 10.5556V14.4444C3.34838 15.8469 3.35053 16.8009 3.45059 17.5153C3.54672 18.2017 3.71622 18.5197 3.94163 18.736C4.16703 18.9524 4.49822 19.1152 5.21326 19.2074C5.95743 19.3035 6.95119 19.3056 8.41203 19.3056H12.5018C13.9626 19.3056 14.9564 19.3035 15.7006 19.2074C16.4156 19.1152 16.7468 18.9524 16.9722 18.736C17.2662 18.4538 17.4589 18.0058 17.5282 16.8205C17.5595 16.2844 18.0376 15.8742 18.5961 15.9043C19.1545 15.9344 19.5818 16.3934 19.5505 16.9295C19.4768 18.1902 19.2635 19.2862 18.4044 20.111C17.74 20.7489 16.9101 21.0133 15.9705 21.1345C15.0754 21.2501 13.9446 21.25 12.5732 21.25H8.34059C6.96922 21.25 5.83838 21.2501 4.94337 21.1345C4.00373 21.0133 3.17387 20.7489 2.50941 20.111C1.84495 19.4731 1.56952 18.6764 1.44319 17.7744C1.32286 16.9152 1.32289 15.8296 1.32292 14.5131V10.4869C1.32289 9.17044 1.32286 8.08484 1.44319 7.22563C1.56952 6.32358 1.84495 5.52691 2.50941 4.88903C3.17387 4.25115 4.00373 3.98673 4.94337 3.86546C5.83838 3.74994 6.9692 3.74997 8.34056 3.75Z" fill="currentColor" fillRule="evenodd"></path><path d="M16.5349 2.75C15.9001 2.75 15.3854 3.24408 15.3854 3.85355V6.25H12.5208C9.21286 6.25 6.53123 8.82436 6.53123 12V14.5C6.53123 14.8561 6.79205 15.1631 7.1554 15.2347C7.51781 15.3061 7.88256 15.1237 8.02943 14.798C8.07158 14.7189 8.19251 14.4939 8.28615 14.3494C8.47413 14.0595 8.76536 13.6708 9.17345 13.283C9.98239 12.5142 11.2451 11.75 13.1157 11.75H15.3854V14.1464C15.3854 14.7559 15.9001 15.25 16.5349 15.25C16.8398 15.25 17.1322 15.1337 17.3478 14.9268L22.08 10.3839C22.4623 10.0169 22.6771 9.51906 22.6771 9C22.6771 8.48094 22.4623 7.98315 22.08 7.61612L17.3478 3.07322C17.1322 2.86627 16.8398 2.75 16.5349 2.75Z" fill="currentColor"></path></svg>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>View Student Profile</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            <div className='border-b border-dashed py-3 px-4 text-xs space-y-[6px]'>
                                {
                                    [
                                        {
                                            label: "Gender",
                                            value: application?.student?.contact?.gender,
                                            valueClass: "capitalize"
                                        },
                                        {
                                            label: "Date of Birth",
                                            value: application?.student?.contact?.dob
                                        },
                                        {
                                            label: "Marital Status",
                                            value: application?.student?.contact?.marital_status,
                                            valueClass: "capitalize"
                                        },
                                        {
                                            label: "Email",
                                            value: application?.student?.contact?.email
                                        },
                                        {
                                            label: "Phone",
                                            value: application?.student?.contact?.phone
                                        },
                                        {
                                            label: "CNIC",
                                            value: application?.student?.contact?.cnic
                                        },
                                        {
                                            label: "Passport",
                                            value: application?.student?.contact?.passport
                                        },
                                        // {
                                        //     label: "City",
                                        //     value: application?.student?.contact?.city
                                        // },
                                        // {
                                        //     label: "State",
                                        //     value: application?.student?.contact?.state
                                        // },
                                        // {
                                        //     label: "Nationality",
                                        //     value: application?.student?.contact?.country
                                        // },
                                        {
                                            label: "Address",
                                            value: `${application?.student?.contact?.city}, ${application?.student?.contact?.state}, ${application?.student?.contact?.country}`
                                        }
                                    ].map((item, index) => (
                                        <div key={index} className='flex gap-2 items-center justify-between'>
                                            <div className='font-medium'>{item.label}</div>
                                            <div className={item.valueClass || ""}>{item.value || '--'}</div>
                                        </div>
                                    ))
                                }
                            </div>


                            {/* Application Requested By */}
                            <div className='border-0 border-dashed pt-3 pb-4 px-4'>
                                <div className='text-start w-full mb-2'>
                                    <div className='font-semibold text-gray-600 text-xs tracking-tight'>Application Requested By</div>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <User user={application?.requested_by} />
                                    {/* <div className='flex items-center gap-[2px]'>
                                        <StarIcon fill='currentColor' size={18} className='text-yellow-400' />
                                        <StarIcon fill='currentColor' size={18} className='text-yellow-400' />
                                        <StarIcon fill='currentColor' size={18} className='text-yellow-400' />
                                        <StarIcon fill='currentColor' size={18} className='text-yellow-400' />
                                        <StarIcon size={18} className='text-yellow-400' />
                                    </div> */}
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Request






const ChangeApplicationRequestStatusBadge = ({ status, application }) => {


    const [openCancelDialog, setOpenCancelDialog] = useState(false)
    const router = useRouter()


    const cancelApplicationRequestForm = useForm({
        resolver: zodResolver(z.object({
            cancelled_reason: z.string().min(1, "Cancelled reason is required"),
        })),
        defaultValues: {
            cancelled_reason: "",
        },
    })


    const cancelApplicationRequest = (data) => {
        const submitPromise = new Promise(async (resolve, reject) => {
            try {
                await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/applications/requests/cancel/${application?.id}`, data, {
                    withCredentials: true
                });
                resolve();
                router.refresh()
                setOpenCancelDialog(false)
                cancelApplicationRequestForm.reset()
            } catch (error) {
                console.log(error)
                if (error.response?.status === 400) {
                    if (error.response?.data?.error) {
                        cancelApplicationRequestForm.setError(error.response?.data?.error?.path, { message: error.response?.data?.error?.message }, { shouldFocus: true });
                    }
                }
                reject(error);
            }
        });

        sonnerToast.promise(
            submitPromise,
            {
                loading: "Cancelling...",
                success: () => "Cancelled successfully",
                error: (err) => err?.response?.data?.message || "Failed to cancel",
            }
        );
    }



    return (
        <>

            {
                application?.approval_status == "pending" ?
                    <DropdownMenu>
                        
                        
                        <DropdownMenuTrigger asChild>
                            <Badge size="2" radius='full' color={applicationRequestsStatuses?.find(s => s?.slug === status)?.color} style={{ cursor: "pointer", gap: "2px" }}>
                                <span className='capitalize'>{status}</span>
                                <ChevronDown size={16} />
                            </Badge>
                        </DropdownMenuTrigger>


                        <DropdownMenuContent align="start">
                                {status == "pending" && <DropdownMenuItem className="cursor-pointer text-xs" key={status?.slug} onClick={()=>setOpenCancelDialog(true)}>
                                    <Badge style={{ width: "8px", height: "8px", padding: 0, borderRadius: "100%" }} color="gray" variant="solid"></Badge>
                                    Cancel
                                </DropdownMenuItem>}
                        </DropdownMenuContent>

                        
                    </DropdownMenu>
                    :
                    <Badge size="2" radius='full' color={applicationRequestsStatuses?.find(s => s?.slug === status)?.color}>
                        <span className='capitalize'>{status}</span>
                    </Badge>
            }

            <Dialog open={openCancelDialog} onOpenChange={setOpenCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Application Request</DialogTitle>
                    </DialogHeader>


                    <Form {...cancelApplicationRequestForm}>
                        <form onSubmit={cancelApplicationRequestForm.handleSubmit(cancelApplicationRequest)} className="space-y-4">
                            <FormField
                                control={cancelApplicationRequestForm.control}
                                name="cancelled_reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cancellation Reason</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                error={cancelApplicationRequestForm.formState.errors.cancelled_reason}
                                                placeholder="Enter cancellation reason"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div className='flex justify-between'>
                                <DialogClose asChild>
                                    <Button variant="outline" size="sm">Discard</Button>
                                </DialogClose>
                                <Button size="sm" type="submit">Submit</Button>
                            </div>
                        </form>
                    </Form>


                </DialogContent>
            </Dialog>
        </>
    )
}
