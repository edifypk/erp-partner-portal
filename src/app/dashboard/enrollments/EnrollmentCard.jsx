"use client"
import React from 'react'
import Link from 'next/link'
import { format } from 'timeago.js'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import User from '@/components/User'
import { motion } from 'framer-motion'
import { highlightText } from '@/utils/functions'

const EnrollmentCard = ({ enrollment, keyword }) => {
    const application = enrollment?.application
    // Currency info is now in sys_countries, accessed through country.country
    const currencySymbol = application?.program?.institute?.country?.country?.currency_symbol || "$"
    const currencyCode = application?.program?.institute?.country?.country?.currency_code || "USD"

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='bg-white rounded-2xl shadow-md border border-gray-300 relative flex flex-col hover:shadow-lg transition-shadow'
        >
            <div className='flex-1 p-4'>
                {/* Header with Application ID and Date */}
                <div className='flex items-center justify-between mb-4'>
                    <Link className='group' href={`/dashboard/applications/${application?.application_id}`}>
                        <div className='text-gray-700 tracking-tight group-hover:text-blue-600 font-semibold text-sm'>
                            {application?.application_id}
                        </div>
                    </Link>
                </div>

                {/* Student */}
                <div className='flex items-center gap-3 mb-4 pb-4 border-b border-dashed'>
                    <Avatar className='w-12 h-12 border overflow-hidden bg-white'>
                        <AvatarImage className='rounded-full' src={application?.student?.contact?.photo_url || `/images/placeholder/image.png`} />
                        <AvatarFallback>{application?.student?.contact?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                        <div className='font-medium text-sm text-black line-clamp-1 mb-1'>
                            {highlightText(application?.student?.contact?.name, keyword)}
                        </div>
                        <div className='text-xs text-gray-600 line-clamp-1'>
                            {highlightText(application?.student?.contact?.contact_id, keyword)}
                        </div>
                    </div>
                </div>


                {/* Application */}
                <div className='flex items-center gap-3 mb-4 pb-4 border-b border-dashed'>
                    <Avatar className='w-10 h-10 border overflow-hidden bg-white'>
                        <AvatarImage className='rounded-full' src={application?.program?.institute?.logo_url || `/images/placeholder/image.png`} />
                        <AvatarFallback>{application?.program?.institute?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                        <div className='font-medium text-sm text-black line-clamp-1 mb-1'>
                            {highlightText(application?.program?.name, keyword)}
                        </div>
                        <div className='text-xs text-gray-600 line-clamp-1'>
                            {application?.program?.institute?.name}
                        </div>
                    </div>
                </div>

                {/* Fee Information */}
                <div className='space-y-2 mb-4'>
                    <div className="flex justify-between items-center">
                        <div className='text-xs text-gray-500'>Total</div>
                        <div className='text-xs font-medium text-gray-700'>
                            {currencySymbol}{parseFloat(enrollment?.tuition_fee || 0).toFixed(2)} {currencyCode}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className='text-xs text-gray-500'>Scholarship Amount</div>
                        <div className='text-xs font-medium text-gray-700'>
                            {currencySymbol}{parseFloat(enrollment?.scholarship_amount || 0).toFixed(2)} {currencyCode}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className='text-xs text-gray-500'>Initial Deposit</div>
                        <div className='text-xs font-medium text-gray-700'>
                            {currencySymbol}{parseFloat(enrollment?.initial_deposit || 0).toFixed(2)} {currencyCode}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className='text-xs text-gray-500'>Enrollment Fee</div>
                        <div className='text-xs font-medium text-gray-700'>
                            {currencySymbol}{parseFloat(enrollment?.enrollment_fee || 0).toFixed(2)} {currencyCode}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className='text-xs text-gray-500'>Total Paid</div>
                        <div className='text-xs font-medium text-gray-700'>
                            {currencySymbol}{parseFloat(enrollment?.total_paid || 0).toFixed(2)} {currencyCode}
                        </div>
                    </div>
                </div>

                {/* Booked By */}
                <div>
                    <div className='text-xs text-gray-500 mb-2'>Booked By</div>
                    <User user={enrollment?.booked_by} />
                </div>
            </div>
        </motion.div>
    )
}

export default EnrollmentCard

