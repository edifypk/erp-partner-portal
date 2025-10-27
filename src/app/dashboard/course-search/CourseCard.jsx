"use client"
import { getCurrencyCode, getCurrencySymbol } from '@/utils/currencyUtils'
import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@radix-ui/themes'
import icons from '@/utils/icons'
import CreateApplication from './create-application/CreateApplication'
import flags from 'react-phone-number-input/flags'


const CourseCard = ({ course, keyword, student_id }) => {


    const highlightText = (text, keyword) => {
        if (!keyword || !text) return text;

        const regex = new RegExp(`(${keyword})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ?
                <span key={index} className="bg-yellow-200">{part}</span> :
                part
        );
    };


    var Flag = flags[course?.institute?.country?.iso_code]


    return (
        <div className=' bg-white rounded-2xl shadow-md border border-gray-300 relative flex flex-col'>

            <div className='flex-1'>
                <div className="absolute -top-2 right-4 text-[10px] flex gap-1 z-10">
                    {
                        course?.tags?.filter(t => t?.tag?.is_featured).map((t, index) => {
                            return (
                                <div key={index}>
                                    <Badge variant="solid" style={{ borderRadius: "15px", padding: "2px 8px", fontSize: "10px" }} color={t?.tag?.color}>
                                        {t?.tag?.name}
                                    </Badge>
                                </div>
                            )
                        })
                    }
                </div>


                <div className="h-20 w-full relative rounded-t-[14px] overflow-hidden mb-4 bg-gray-50">
                    <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        onError={(e) => {
                            e.target.src = "/images/placeholder/image.png"
                        }}
                        src={course?.institute?.banner_url || "/images/placeholder/image.png"}
                        alt={course?.institute?.name}
                        className="w-full h-full object-cover"
                    />



                    <div className="absolute top-2 right-2 border border-black/20 bg-white/90 text-black font-semibold  backdrop-blur-md text-xs pr-2 pl-1 rounded-full flex items-center gap-1">
                        <Flag width={20} height={20} style={{ borderRadius: '50%' }} /> {course?.institute?.country?.short_name}
                    </div>

                </div>

                <div className='flex items-start gap-2 mt-2 -translate-y-7 px-2'>
                    <div>
                        <div className='h-10 w-10 rounded-full border border-white shadow-md bg-white'>
                            {
                                course?.institute?.logo_url ?
                                    <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 1 }} src={course?.institute?.logo_url} alt={course?.institute?.name} className="w-full h-full object-cover" />
                                    :
                                    <div className='w-full h-full flex justify-center items-center'>
                                        <div className='text-xs tracking-tight text-black/60 font-medium whitespace-nowrap'>{course?.institute?.name.slice(0, 2).toUpperCase()}</div>
                                    </div>
                            }

                        </div>
                    </div>
                    <h2 className="text-xs tracking-tight font-medium line-clamp-2 pt-4">{highlightText(course?.institute?.name, keyword)}</h2>

                </div>

                <div className='px-4 -translate-y-4'>



                    <div className='text-xs tracking-tight mb-1 text-black/60 font-medium whitespace-nowrap'>{course.program_level?.name}</div>


                    <div className='font-semibold tracking-tight text-sm line-clamp-3'>
                        {highlightText(course.name, keyword)}
                    </div>


                    <div className='flex gap-2 flex-wrap my-4'>
                        {
                            course?.tags?.filter(t => !t?.tag?.is_featured).map((t, index) => {
                                var Icon = icons[t?.tag?.icon]
                                return (
                                    <Badge variant="soft" style={{ borderRadius: "15px", padding: "4px 6px" }} color={t?.tag?.color} key={index}>
                                        <Icon size={12} />
                                        {t?.tag?.name}
                                    </Badge>
                                )
                            })
                        }
                    </div>

                    <div className="space-y-2">

                        {/* <div className="flex justify-between items-center">
                            <div className='text-xs text-black/60 font-medium whitespace-nowrap'>Location</div>
                            <div className='text-xs text-black/60 font-medium whitespace-nowrap'>{course.institute?.province}, {course.institute?.country?.short_name}</div>
                        </div> */}


                        <div className="flex justify-between items-center">
                            <div className='text-xs tracking-tight text-black/60 font-medium whitespace-nowrap'>Campus City</div>
                            <div className='text-xs tracking-tight text-black font-medium whitespace-nowrap'>{course.institute?.city}</div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className='text-xs tracking-tight text-black/60 font-medium whitespace-nowrap'>Tuition (1st year)</div>
                            <div className='text-xs tracking-tight text-black font-medium whitespace-nowrap'>
                                {String(Math.round(course.tuition)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {course.institute?.country?.currency_code}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className='text-xs tracking-tight text-black/60 font-medium whitespace-nowrap'>Application fee</div>
                            <div className='text-xs tracking-tight text-black font-medium whitespace-nowrap'>{String(Math.round(course.application_fee)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {course.institute?.country?.currency_code}</div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className='text-xs tracking-tight text-black/60 font-medium whitespace-nowrap'>Duration</div>
                            <div className='text-xs tracking-tight text-black font-medium whitespace-nowrap'>{course.min_length === course.max_length ? course.min_length : `${course.min_length} - ${course.max_length}`} months</div>
                        </div>

                    </div>

                </div>
            </div>


            <div className="p-4 flex justify-end">
                <div>
                    <CreateApplication course={course} student_id={student_id} />
                </div>
            </div>

        </div>
    )
}

export default CourseCard
