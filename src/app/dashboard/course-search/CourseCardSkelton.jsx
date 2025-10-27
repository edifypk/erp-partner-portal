"use client"
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const CourseCardSkelton = () => {
    const ref = useRef(null)
    const isInView = useInView(ref)
    return (
        <motion.div
            ref={ref}
            animate={isInView ? { y: 0 } : { y: 50 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.1, damping: 10 }}
        >
            <div className="rounded-2xl bg-white border-gray-300 border animate-pulse">
                <div className="h-20 w-full border rounded-t-2xl bg-gray-200 mb-4"></div>
                <div className='flex items-start gap-2 mt-2 -translate-y-7 pl-2'>
                    <div className='h-10 w-10 rounded-full border border-gray-300 bg-gray-200'></div>
                </div>

                <div className='p-4'>
                    <div className='h-4 w-20 bg-gray-200 rounded-full mb-2'></div>
                    <div className='h-4 w-32 bg-gray-200 rounded-full mb-2'></div>
                    <div className='h-4 w-24 bg-gray-200 rounded-full mb-2'></div>
                </div>
            </div>
        </motion.div>
    )
}

export default CourseCardSkelton
