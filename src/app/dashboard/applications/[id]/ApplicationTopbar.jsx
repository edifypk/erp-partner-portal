'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronDown, MoreVertical } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Badge } from '@radix-ui/themes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Alert01Icon } from 'hugeicons-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContextProvider';
import BookEnrollmentDialog from './BookEnrollmentDialog';
import Link from 'next/link';

const ApplicationTopbar = ({ env, process, application }) => {

    var router = useRouter()
    // var { checkPermission } = useAuth()

    const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const currentStage = process?.stages?.find(stage => stage?.statuses?.find(s => s?.status?.id === application?.app_status_id))

    var isAllMilestonesCompleted = application?.is_submitted_to_institute && application?.is_unconditional_received && application?.is_fee_paid && application?.is_spon_letter_received && application?.is_visa_granted && application?.is_enrolled;
    var isEligibleForEnrollment = isAllMilestonesCompleted && (!application?.is_enrollment_booked) && (application?.student?.student_type == 'sub_agent');


    console.log(application)



    const handleDeleteApplication = async () => {
        try {
            if (!window.confirm('Are you sure you want to delete this application?')) {
                return
            }
            await axios.delete(`${env.NEXT_PUBLIC_BACKEND_URL}/crm/applications/${application.id}`, {
                withCredentials: true
            })
            toast.success("Application deleted successfully")
            // move to that student page
            router.push(`/dashboard/crm/applications`)
            // router.push(`/dashboard/crm/students/${application?.student?.student_id}?tab=applications`)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete application")
        }
    }


    return (
        <>


            <div style={{ backgroundImage: `url('${application?.program?.institute?.banner_url}')` }} className="bg-cover overflow-hidden bg-center">
                <div className="flex-1 px-6 pb-6 flex flex-col justify-end bg-linear-to-b from-white/50 backdrop-blur-sm to-white h-[200px]">

                    <div className='flex items-end justify-between'>

                        <div>

                            {/* University + Course Detail */}
                            <div className='flex items-center gap-3 flex-1 overflow-hidden mb-4'>
                                <div>
                                    <Avatar className='w-16 h-16 border overflow-hidden bg-white'>
                                        <AvatarImage className='rounded-full' src={application?.program?.institute?.logo_url ? application?.program?.institute?.logo_url : `/images/placeholder/image.png`} />
                                        <AvatarFallback>{application?.program?.institute?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className='translate-y-1 flex-1 overflow-hidden'>
                                    <div className='text-gray-700 font-semibold text-xs tracking-tight truncate'>{application?.program?.institute?.name}</div>
                                    <div className='text-black font-bold overflow-hidden tracking-tight line-clamp-1' >{application?.program?.name}</div>
                                </div>
                            </div>

                            {/* Application Detail */}
                            <div className="rounded-md flex flex-wrap whitespace-nowrap gap-x-10 gap-y-6 pl-[75px]">

                                {
                                    [
                                        {
                                            label: "Application ID",
                                            value: application?.application_id
                                        },
                                        {
                                            label: "Apply Level",
                                            value: application?.program?.program_level?.name + " " + application?.program?.program_level?.family
                                        },
                                        {
                                            label: "Country",
                                            value: application?.program?.institute?.country?.name
                                        },
                                        {
                                            label: "Intake",
                                            value: (application?.intake_month).toUpperCase() + " - " + application?.intake_year
                                        },
                                        // {
                                        //     label: "Partner",
                                        //     value: application?.partner?.company_name
                                        // },
                                        {
                                            label: "Duration",
                                            value: `${application?.program?.min_length === application?.program?.max_length ? application?.program?.min_length : `${application?.program?.min_length} - ${application?.program?.max_length}`} Months`
                                        }
                                    ].map((item, index) => (
                                        <div key={index} className='gap-2 flex items-center tracking-tight'>
                                            <div>
                                                <div className='text-[10px] font-semibold tracking-tight text-gray-600'>{item?.label}</div>
                                                <div className='text-xs font-semibold text-gray-800'>{item?.value}</div>
                                            </div>
                                        </div>
                                    ))
                                }

                            </div>

                        </div>



                        <div>
                            {isAllMilestonesCompleted ?

                                <div>

                                    {(isEligibleForEnrollment) ? <BookEnrollmentDialog application={application} /> : <Badge variant='solid' radius='full' color="yellow" size="3">Booking Pending</Badge>}

                                    {application?.is_enrollment_booked &&
                                        <Link href={`/dashboard/enrollments/${application?.enrollment?.id}`}>
                                            <Badge variant='solid' radius='full' color="green" size="3">Enrollment Booked</Badge>
                                        </Link>
                                    }
                                </div>

                                :
                                <div className='flex items-center gap-2'>

                                    <a href={`/dashboard/settings/crm/application-processes/${process?.id}`} target='_blank' className="text-xs text-transparent">{process.name}</a>

                                    <div>
                                        <Badge variant='solid' radius='full' color={application?.status?.color} size="3">
                                            {application?.status?.name}
                                        </Badge>
                                    </div>

                                    <DropdownMenu open={isActionsDropdownOpen} onOpenChange={setIsActionsDropdownOpen}>


                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-6 w-6 border border-gray-200 p-0 bg-white text-black hover:text-black">
                                                <span className="sr-only">Open menu</span>
                                                <MoreVertical />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className='w-44' align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                            {/* <div className='px-2 py-1 rounded-md hover:bg-gray-100 cursor-pointer'>
                                        <CancleModal setIsActionsDropdownOpen={setIsActionsDropdownOpen} application={application} />
                                    </div> */}



                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>}



                        </div>

                    </div>

                </div>
            </div>



            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the application and all its associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteApplication}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default ApplicationTopbar





const CancleModal = ({ application, setIsActionsDropdownOpen }) => {

    const [isOpen, setIsOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(z.object({
            cancellation_reason: z.string().min(1, { message: "Cancellation reason is required" }),
        })),
        defaultValues: {
            cancellation_reason: "",
        },
    })

    const onSubmit = (data) => {

    }

    useEffect(() => {
        if (!isOpen) {
            form.reset()
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className='flex items-center gap-2 text-red-600 focus:text-red-600 text-xs'>
                    <div>
                        <Alert01Icon size={14} strokeWidth={2} />
                    </div>
                    <div>
                        Cancel Application
                    </div>
                </div>
            </DialogTrigger>


            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel Application</DialogTitle>
                </DialogHeader>


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="cancellation_reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cancellation Reason</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            error={form.formState.errors.cancellation_reason}
                                            placeholder="Enter cancellation reason"
                                            className="resize-none"
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
    )
}