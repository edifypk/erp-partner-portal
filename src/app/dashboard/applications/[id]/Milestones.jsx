"use client"
import React, { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import FilesMilestone from './ApplicationTabs/Milestones/FilesMilestone'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { CheckmarkCircle01Icon } from 'hugeicons-react'
import { useQuery } from '@tanstack/react-query'
import DynamicForm from '@/components/DynamicForm'
import { cn } from '@/lib/utils'







const Milestones = ({ status, application, env }) => {
    return (
        <Accordion type="single" collapsible className="w-full border border-gray-300 overflow-hidden rounded-lg">
            {
                (status && status?.jsonActions?.milestones?.length > 0) && (
                    status?.jsonActions?.milestones?.map((milestone, index) => {
                        return (
                            <SingleMilestone status={status} env={env} milestone={milestone} key={milestone?.key} index={index} application={application} />
                        )
                    })
                )
            }
        </Accordion>
    )
}














const getForm = async (id) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/forms/${id}`, {
        withCredentials: true
    })
    return res.data?.data
}

const SingleMilestone = ({ milestone, index, application, env, status }) => {


    const router = useRouter()
    const [loading, setLoading] = useState(false)



    var isDone = application?.json_data?.milestones?.find(m => m?.key === milestone?.key)?.completed


    const form = useQuery({
        queryKey: ['form', milestone?.form_id],
        queryFn: () => getForm(milestone?.form_id)
    })


    const updateMilestone = (data) => {


        var milestoneToBeUpdated = {}

        if (milestone?.type == "form") {
            milestoneToBeUpdated = {
                ...milestone,
                data: {
                    ...data,
                    created_at: new Date().toISOString()
                },
                completed: true
            }
        } else if (milestone?.type == "file") {
            // console.log(, "values")
            milestoneToBeUpdated = {
                ...milestone,
                data: data,
                completed: true
            }
        }



        // setLoading(true)
        const submitPromise = new Promise(async (resolve, reject) => {
            try {

                const res = await axios.put(
                    `${env.NEXT_PUBLIC_BACKEND_URL}/crm/applications/update-milestones/${application?.id}?stageStatusId=${status?.id}`,
                    milestoneToBeUpdated,{
                        withCredentials:true
                    }
                );

                if (res.status === 200) {
                    resolve(res.data); // Resolve promise to show success toast
                    router.refresh()

                    // update the application status
                    if (res.data?.data?.remainingMilestones?.length == 0) {
                        setOpen(false)
                    }

                }
            } catch (error) {
                reject(error); // Reject promise to show error toast
            } finally {
                setLoading(false)
            }
        });

        toast.promise(
            submitPromise,
            {
                loading: "Updating...",
                success: (data) => data?.message, // Customize success message
                error: (err) => {
                    return err?.response?.data?.message ?
                        `
                        ${JSON.stringify(err?.response?.data?.data, null, 2)}
                        ${err?.response?.data?.message}
                        `
                        :
                        err.message
                }
            }
        );

    }

    return (
        <AccordionItem value={milestone?.key} className={`${index && "border-t"} border-gray-300 border-b-0 bg-white`}>
            <AccordionTrigger className={`py-2 px-2 no-underline hover:no-underline ${isDone ? "bg-green-50" : (milestone?.required ? "bg-red-50" : "bg-yellow-50")}`}>
                <div className='flex items-center gap-2 w-full pr-4'>
                    <div>
                        {isDone ? (
                            <div className='text-white'>
                                {/* <TickDouble01Icon /> */}
                                <CheckmarkCircle01Icon fill="#16a34a" size={20} />
                            </div>
                        ) : (
                            <div className='text-white'>
                                {/* <CheckUnread02Icon /> */}
                                <CheckmarkCircle01Icon fill={milestone?.required ? "#dc2626" : "#f59e0b"} size={20} />

                            </div>
                        )}
                    </div>
                    <div className={`flex justify-between w-full ${isDone ? "text-green-600" : (milestone?.required ? "text-red-600" : "text-yellow-600")}`}>
                        {milestone?.title}
                        {!isDone && <div className={cn('text-[10px] ml-4 inline-block px-2 text-black rounded-full', milestone?.required ? "bg-red-200" : "bg-yellow-300")}>{milestone?.required ? "Required" : "Optional"}</div>}
                    </div>
                </div>
            </AccordionTrigger>


            <AccordionContent className='p-4 flex flex-col gap-4 max-h-[400px] overflow-auto'>
                {/* <div dangerouslySetInnerHTML={{ __html: milestone?.description }} className='text-xs ProseMirror text-gray-500'></div> */}

                <div>
                    {
                        milestone?.type == "file" && (
                            <div className='flex gap-2'>
                                <FilesMilestone
                                    data={application?.json_data?.milestones?.find(m => m?.key === milestone?.key)?.data}
                                    milestone={milestone}
                                    updateMilestone={(data) => updateMilestone(data)}
                                />
                            </div>
                        )
                    }
                    {
                        milestone?.type == "form" && (
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: milestone?.description }} className='text-xs ProseMirror text-gray-500 mb-4'></div>
                                <DynamicForm
                                    data={application?.json_data?.milestones?.find(m => m?.key === milestone?.key)?.data}
                                    onSubmit={(data) => updateMilestone(data)}
                                    formConfig={{ ...form?.data?.form_config, disabled: isDone }}
                                />
                            </div>
                        )
                    }
                </div>
            </AccordionContent>


        </AccordionItem>
    )
}



export default Milestones




