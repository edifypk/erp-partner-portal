"use client"
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'

const StudentCardSkelton = () => {
    const ref = useRef(null)
    const isInView = useInView(ref)
    return (
        <motion.div
            ref={ref}
            animate={isInView ? { y: 0 } : { y: 50 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.1, damping: 10 }}
        >
            <div className='border bg-white rounded-2xl flex flex-col shadow-sm'>
                <div className='p-4 relative flex-1'>

                    <div className='flex mb-4'>
                        <div className='flex items-center gap-2 group'>
                            <div>
                                <Skeleton className='w-16 h-16 border rounded-full'>
                                </Skeleton>
                            </div>
                            <div>
                                <Skeleton className='w-32 h-4 rounded-full mb-1'></Skeleton>
                                <Skeleton className='w-20 h-3 rounded-full'></Skeleton>
                            </div>
                        </div>
                    </div>


                    <div>
                        <div className='flex gap-2 items-center mb-1'>
                            <Skeleton className='w-20 h-4 rounded-full'></Skeleton>
                            <Skeleton className='w-4 h-4 rounded-sm'></Skeleton>
                        </div>


                        <div className='flex gap-6 mb-4'>

                            <div className='space-y-1 py-1'>
                                {
                                    Array.from({ length: 6 }).map((v, i) => {
                                        return (
                                            <Skeleton className='w-40 h-[18px] rounded-full' key={i}></Skeleton>
                                        )
                                    })
                                }
                            </div>

                            <div className='flex-1 flex gap-3 lg:gap-4'>
                                {
                                    Array.from({ length: 3 }).map((v, i) => {
                                        return (
                                            <div key={i} className='space-y-1 py-1 bg-gray-100 p-1 rounded-full'>
                                                {
                                                    Array.from({ length: 6 }).map((v, i) => {
                                                        return (
                                                            <Skeleton className='w-[18px] h-[18px] rounded-full' key={i}></Skeleton>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>

                        </div>


                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-2 group'>
                                <div>
                                    <Skeleton className='w-7 h-7 border rounded-full'></Skeleton>
                                </div>
                                <div>
                                    <Skeleton className='w-20 h-3 rounded-full mb-1'></Skeleton>
                                    <Skeleton className='w-16 h-2 rounded-full'></Skeleton>
                                </div>
                            </div>
                            <Skeleton className='w-16 h-6 rounded-full'></Skeleton>
                        </div>


                    </div>


                </div>
            </div>
        </motion.div>
    )
}

export default StudentCardSkelton
