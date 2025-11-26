"use client"
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EnrollmentCardSkeleton = () => {
    const ref = useRef(null)
    const isInView = useInView(ref)
    return (
        <motion.div
            ref={ref}
            animate={isInView ? { y: 0 } : { y: 50 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.1, damping: 10 }}
        >
            <div className="rounded-2xl bg-white border-gray-300 border animate-pulse">
                <div className='p-4'>
                    <div className='flex items-center justify-between mb-4'>
                        <div className='h-4 w-24 bg-gray-200 rounded'></div>
                        <div className='h-3 w-16 bg-gray-200 rounded'></div>
                    </div>
                    
                    <div className='flex items-center gap-3 mb-4 pb-4 border-b border-dashed'>
                        <div className='h-12 w-12 rounded-full bg-gray-200'></div>
                        <div className='flex-1'>
                            <div className='h-4 w-32 bg-gray-200 rounded mb-2'></div>
                            <div className='h-3 w-24 bg-gray-200 rounded'></div>
                        </div>
                    </div>

                    <div className='mb-4 pb-4 border-b border-dashed'>
                        <div className='h-3 w-16 bg-gray-200 rounded mb-2'></div>
                        <div className='flex items-center gap-2'>
                            <div className='h-7 w-7 rounded-full bg-gray-200'></div>
                            <div className='flex-1'>
                                <div className='h-3 w-24 bg-gray-200 rounded mb-1'></div>
                                <div className='h-2 w-20 bg-gray-200 rounded'></div>
                            </div>
                        </div>
                    </div>

                    <div className='space-y-2 mb-4'>
                        <div className='h-3 w-full bg-gray-200 rounded'></div>
                        <div className='h-3 w-full bg-gray-200 rounded'></div>
                        <div className='h-3 w-full bg-gray-200 rounded'></div>
                    </div>

                    <div>
                        <div className='h-3 w-20 bg-gray-200 rounded mb-2'></div>
                        <div className='flex items-center gap-2'>
                            <div className='h-7 w-7 rounded-full bg-gray-200'></div>
                            <div className='flex-1'>
                                <div className='h-3 w-24 bg-gray-200 rounded'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default EnrollmentCardSkeleton

