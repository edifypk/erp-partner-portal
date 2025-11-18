import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Edit01Icon, PencilEdit02Icon } from 'hugeicons-react'

const EditPencil = ({
    tooltip = 'Edit',
    onClick
}) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger
                    asChild
                    onClick={onClick}
                >
                    <div className='relative z-[1] bg-gray-50 transition-all  duration-300 cursor-pointer w-full h-full rounded-full flex items-center justify-center group'>
                        <div className='z-20'>
                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" id="«r65»" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m11.4 18.161l7.396-7.396a10.3 10.3 0 0 1-3.326-2.234a10.3 10.3 0 0 1-2.235-3.327L5.839 12.6c-.577.577-.866.866-1.114 1.184a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.775-.258 1.162-.387 1.526-.56q.647-.308 1.211-.749c.318-.248.607-.537 1.184-1.114m9.448-9.448a3.932 3.932 0 0 0-5.561-5.561l-.887.887l.038.111a8.75 8.75 0 0 0 2.092 3.32a8.75 8.75 0 0 0 3.431 2.13z"></path></svg>
                        </div>
                        <div className='absolute opacity-0 group-hover:opacity-100 rounded-full scale-75 group-hover:scale-100 transition-all duration-300 w-full h-full bg-gray-200'></div>
                    </div>

                </TooltipTrigger>
                <TooltipContent className="text-[10px] border-[0.5px] rounded-sm border-white/20 px-[6px] py-[2px]">
                    {tooltip}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default EditPencil
