import { ArrowDown } from 'lucide-react'
import React from 'react'



const ApplicationTimline = ({ process, currentStatus }) => {

    const currentStage = process?.app_process_stages?.find(stage => stage?.app_process_stage_statuses?.find(status => status?.app_status?.id === currentStatus))
    const currentStageIndex = process?.app_process_stages?.findIndex(stage => stage?.id === currentStage?.id)
    const currentStatusName = currentStage?.app_process_stage_statuses?.find(status => status?.app_status?.id === currentStatus)?.app_status?.name



    return (
        <div className='pt-14 pb-20'>
            <div className='flex items-center w-[80%] mx-auto'>

                {
                    process?.app_process_stages?.map((stage, index) => (
                        <React.Fragment key={index}>
                            <div className={`relative w-4 h-4 text-sm ${index < currentStageIndex ? 'bg-blue-600' : 'bg-transparent border-[1.5px]'} ${index > currentStageIndex && 'border-gray-300'} ${index === currentStageIndex && 'border-blue-600'} text-white rounded-full flex items-center justify-center`}>
                                <div className='absolute -bottom-6 font-semibold tracking-tighter whitespace-nowrap left-1/2 -translate-x-1/2 text-center text-xs text-gray-600'>
                                    <div className={`${index === currentStageIndex ? 'text-blue-600 block' : 'hidden'} lg:block`}>{stage?.app_stage?.name}</div>
                                    {
                                        index === currentStageIndex &&
                                        <div className='absolute -bottom-8 font-medium tracking-tighter whitespace-nowrap left-1/2 -translate-x-1/2 text-center text-[10px] text-blue-600'>
                                            <div className='flex justify-center text-blue-600'><ArrowDown strokeWidth={2.5} size={14} /></div>
                                            {currentStatusName}
                                        </div>
                                    }
                                </div>

                            </div>

                            {index !== process?.app_process_stages?.length - 1 && <div className={`h-[2px] ${index < currentStageIndex ? 'bg-blue-600' : 'bg-gray-300'} flex-1`}></div>}

                        </React.Fragment>
                    ))
                }

            </div>
        </div>
    )
}

export default ApplicationTimline
