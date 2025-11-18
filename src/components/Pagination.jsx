'use client'
import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import IconButton from '@mui/material/IconButton'
import { useSearchQuery } from '@/hooks/useSearchQuery'



const Pagination = ({ filters, dataSet }) => {

    const { applySearchQueries } = useSearchQuery()





    return (
        <div className='flex justify-end items-center gap-6 text-xs font-medium text-gray-600 tracking-tighter'>



            <div className='flex items-center gap-2'>
                <div>Rows per page:</div>
                <Select value={Number(filters.limit)} onValueChange={(value) => applySearchQueries([{name:'limit',value:value},{name:'page',value:1}])} >
                    <SelectTrigger className="text-xs text-gray-600 shadow-none w-9 h-6 p-0 border-none focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder={`${filters.limit} per page`} />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            [10, 20, 50].map((v, index) => (
                                <SelectItem className="text-xs text-gray-600" key={index} value={v}>{v}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">


                <div className="flex items-center gap-1">
                    <>{dataSet?.data?.metadata?.pagination?.from}-{dataSet?.data?.metadata?.pagination?.to} of {dataSet?.data?.metadata?.pagination?.count}</>
                </div>


                <div className="flex items-center">

                    <IconButton
                        disabled={filters.page == 1 || dataSet?.isLoading}
                        className='disabled:opacity-50 hover:bg-gray-100 disabled:hover:bg-transparent p-[6px] rounded-full'
                        size='small'
                        onClick={() => applySearchQueries([{name:'page',value:Number(filters.page) - 1}])}
                    >
                        <ChevronLeft size={16} strokeWidth={2.5} />
                    </IconButton>


                    <IconButton
                        disabled={dataSet?.data?.metadata?.pagination?.pageCount == dataSet?.data?.metadata?.pagination?.page || dataSet?.isLoading}
                        className='disabled:opacity-50 hover:bg-gray-100 disabled:hover:bg-transparent p-[6px] rounded-full'
                        size='small'
                        onClick={() => applySearchQueries([{name:'page',value:Number(filters.page) + 1}])}
                    >
                        <ChevronRight size={16} strokeWidth={2.5} />
                    </IconButton>

                </div>


            </div>
        </div>
    )
}

export default Pagination
