
"use client"
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import Milestones from './Milestones'
import { cn } from '@/lib/utils'




const UpdateStatusModal = ({ open, setOpen, status, env, application, updateApplicationStatus }) => {


    const requiedMilstones = status?.jsonActions?.milestones?.filter(milestone => milestone?.required)
    const milestonesCompleted = application?.json_data?.milestones?.filter(milestone => milestone?.completed)

    const remainingMilestones = requiedMilstones?.filter(milestone => !milestonesCompleted?.find(completed => completed?.key === milestone?.key))


    const handleClose = () => {
        setOpen(false)
    }




    return (
        <div>
            <Dialog open={open} onOpenChange={(isOpen) => {
                if (!isOpen) handleClose();
                setOpen(isOpen);
            }}>



                <DialogTrigger asChild>
                </DialogTrigger>


                <DialogContent showBackgroundSVG={false} className="sm:max-w-xl max-h-[90vh]  p-0 [&>button]:hidden" onInteractOutside={(e) => {
                    e.preventDefault();
                }}>

                    <DialogHeader className='sticky top-0 bg-white p-4 border-b hidden'>
                        <DialogTitle>Milestones</DialogTitle>
                    </DialogHeader>


                    <div className="flex flex-col h-full overflow-hidden">



                        <div className="px-4 border-b py-3">
                            <div className='font-semibold'>{status?.status?.name}</div>
                            <div className='text-xs text-gray-500'>Are you sure you want to update the status?</div>
                        </div>





                        <div className="space-y-1 p-6 flex-1 overflow-auto bg-gray-50">
                            {
                                status?.jsonActions?.milestones?.length > 0 ?
                                    <>
                                        <div className='text-sm text-gray-700 tracking-tight'>Milestones</div>
                                        <Milestones setOpen={setOpen} status={status} application={application} env={env} />
                                    </>
                                    :
                                    <div className='flex flex-col items-center justify-center gap-2 text-center py-10'>
                                        <img className='w-10' src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f913/512.webp" alt="" />
                                        <div>
                                            <div className='tracking-tight text-sm font-semibold'>No Milestones you need to Complete</div>
                                            <p className='text-gray-500 text-xs tracking-tight'>You can update the status directly!</p>
                                        </div>
                                    </div>
                            }

                        </div>


                        <div className="flex gap-3 justify-end px-4 py-3 border-t">
                            <DialogClose asChild>
                                <Button size="sm" type="button" variant="outline">
                                    Close
                                </Button>
                            </DialogClose>

                            <Button
                                className={cn(remainingMilestones?.length > 0 ? "" : "animate-pulse")}
                                onClick={() => updateApplicationStatus(status)}
                                disabled={remainingMilestones?.length > 0}
                                size="sm"
                                type="button"
                            >
                                Confirm Update
                            </Button>
                        </div>

                    </div>


                </DialogContent>
            </Dialog >
        </div>
    )
}

export default UpdateStatusModal
