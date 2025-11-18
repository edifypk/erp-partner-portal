"use client"
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar03Icon, HourglassIcon, MentoringIcon, SmartWatch01Icon, TeachingIcon, Timer02Icon } from 'hugeicons-react'
import { convertTimeTo12HourFormat, formatDate } from '@/utils/functions'
import User from '@/components/User'
import { Badge } from '@radix-ui/themes'
import { courseEnrollmentStatuses } from '@/data'
import { differenceInDays } from 'date-fns'
import { Button } from '@/components/ui/button'


const StudentTasks = ({ enquiry }) => {





    return (
        <div>

            <div className='border p-4 border-dashed bg-gray-50 flex justify-center items-start text-center col-span-2 rounded-2xl'>
                <div>
                    <div className='flex justify-center mb-2'>
                        <img src="https://app-cdn.clickup.com/media/empty-my-list-UU75AGUN.svg" alt="" />
                    </div>
                    <h2 className='font-semibold text-sm tracking-tight text-gray-700'>Message</h2>
                    <p className='max-w-[400px] text-xs text-gray-600 tracking-tight'>
                        No tasks created yet for this student
                    </p>
                </div>
            </div>


        </div>
    )
}

export default StudentTasks




