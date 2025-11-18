import { Cancel01Icon, Route03Icon, Tick01Icon } from 'hugeicons-react'
import { ArrowDown, Check } from 'lucide-react'
import React from 'react'



const ApplicationJourney = ({ application, process, currentStatus }) => {

    const currentStage = process?.stages?.find(stage => stage?.statuses?.find(status => status?.status?.id === currentStatus))
    const currentStageIndex = process?.stages?.findIndex(stage => stage?.id === currentStage?.id)
    const currentStatusName = currentStage?.statuses?.find(status => status?.status?.id === currentStatus)?.status?.name


    var stages = application?.is_cancelled ? process?.stages?.filter((stage, index) => index <= currentStageIndex) : process?.stages


    return (
        <div className='p-4 border border-dashed rounded-2xl bg-white'>
            <div className='font-semibold tracking-tight mb-3 flex items-center gap-2'><Route03Icon size={16} /> Application Journey</div>
            <div className=''>

                {
                    stages?.map((stage, index) => (
                        <div key={index}>

                            <div className='flex gap-2 items-center'>
                                <div>
                                    <div className={`relative w-[14px] h-[14px] flex items-center justify-center text-sm ${index < currentStageIndex ? 'bg-green-600' : 'bg-transparent border-[1.5px]'} ${index > currentStageIndex && 'border-gray-300'} ${index === currentStageIndex && 'border-green-600'} text-white rounded-full items-center justify-center`}>
                                        {index < currentStageIndex && <Tick01Icon strokeWidth={2.5} size={14} />}
                                    </div>
                                </div>
                                <div className={`text-sm font-semibold tracking-tight ${index <= currentStageIndex ? 'text-green-600' : 'text-gray-400'}`}>{stage?.stage?.name}</div>
                            </div>

                            <div className='pl-[6.5px] flex'>
                                {index !== process?.stages?.length - 1 &&
                                    <div className={`min-h-8 w-[1.5px] ${index < currentStageIndex ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                                }
                                <div className='p-[13px] pt-0'>
                                    {
                                        index === currentStageIndex &&
                                        <div className='flex items-center gap-1'>
                                            <div className={`text-xs font-medium text-gray-500 tracking-tight`}>
                                                {currentStatusName}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>

                        </div>
                    ))
                }


                {application?.is_cancelled && <div>
                    <div className='flex gap-2 items-center'>
                        <div>
                            <div className={`relative w-[14px] h-[14px] border-red-600 border-[1.5px] rounded-full`}></div>
                        </div>
                        <div className={`text-xs font-semibold text-red-600 tracking-tight`}>Application Cancelled</div>
                    </div>

                    <div className='pl-[22px] flex text-[11px] text-gray-700 pt-1'>
                        Cancelled while evaluating application. Consider applying to these programs instead.
                    </div>
                </div>}

            </div>
        </div>
    )
}

export default ApplicationJourney