"use client"
import React, { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import FilesMilestone from './FilesMilestone'
// import DynamicForm from './DynamicForm'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { CheckUnread02Icon, TickDouble01Icon } from 'hugeicons-react'
import { useQuery } from '@tanstack/react-query'
import DynamicForm from '@/components/DynamicForm'


const getForm = async (id) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/forms/${id}`, {
        withCredentials: true
    })
    return res.data?.data
}


const MilstonesDone = ({ status, application, env }) => {



    return (
        <Accordion type="multiple" className="w-full border border-gray-200 overflow-hidden rounded-lg mt-4">

            {
                (application?.json_data?.milestones?.length > 0) ? (
                    application?.json_data?.milestones?.map((milestone, index) => {
                        return (
                            <SingleMilestone application={application} milestone={milestone} index={index} key={index} />
                        )
                    })
                ) : (
                    <div className='flex flex-col items-center justify-center py-10 tracking-tight bg-gray-50'>
                        <div className='w-20 mb-4'>
                            <img src="/images/thinking-girl.png" alt="" />
                        </div>
                        <div className='text-sm font-semibold text-gray-700'>No Milestones Completed Yet</div>
                        <div className='text-xs text-gray-500'>If a milestone is completed, it will appear here</div>
                    </div>
                )
            }

        </Accordion>
    )
}

export default MilstonesDone



const SingleMilestone = ({ milestone, index, application }) => {


    const router = useRouter()
    const [loading, setLoading] = useState(false)


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
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/applications/update-milestones/${application?.id}`,
                    milestoneToBeUpdated
                );

                if (res.status === 200) {
                    resolve(res.data); // Resolve promise to show success toast
                    router.refresh()
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
            
            
            <AccordionTrigger className={`py-2 px-2 no-underline hover:no-underline ${milestone?.completed ? "bg-green-50" : "bg-red-50"}`}>
                <div className='flex items-center gap-1'>
                    <div>
                        {milestone?.completed ? (
                            <div className='text-green-600'>
                                <TickDouble01Icon size={17} />
                            </div>
                        ) : (
                            <div className='text-red-600'>
                                <CheckUnread02Icon size={17} />
                            </div>
                        )}
                    </div>
                    <div className={`${milestone?.completed ? "text-green-600" : "text-red-600"}`}>{milestone?.title}</div>
                </div>
            </AccordionTrigger>



            <AccordionContent className='py-4 pr-4 pl-7 flex flex-col gap-2'>

                <div dangerouslySetInnerHTML={{ __html: milestone?.description }} className='text-xs ProseMirror text-gray-500'></div>

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
                            <DynamicForm data={milestone?.data} formConfig={{ ...form?.data?.form_config, disabled: true }} />
                        )
                    }
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}