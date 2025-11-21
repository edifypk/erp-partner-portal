"use client"
import React from 'react'
import { Badge } from '@radix-ui/themes';
import Link from 'next/link';
import { Agreement02Icon, Calendar03Icon, Globe02Icon, GraduationScrollIcon, Tick02Icon } from 'hugeicons-react';
import { applicationChecks } from '@/data';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import flags from 'react-phone-number-input/flags';
import User from '@/components/User';

function formatDate(date) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options).replace(',', '');
}


const ApplicationCard = ({ application, student }) => {

    var router = useRouter()
    var Flag = flags[application?.program?.institute?.country?.iso_code]

    return (
        <>

            <Link href={`/dashboard/applications/${application?.application_id}`} className={`hover:ring-2 border ring-blue-200 block hover:shadow-sm cursor-pointer bg-white rounded-2xl transition-all duration-300 pb-4`}>





                <div className="h-20 w-full border rounded-t-2xl overflow-hidden mb-4 bg-gray-50 relative">
                    <img onError={(e) => {
                        e.target.src = "/images/placeholder/image.png"
                    }} src={application?.program?.institute?.banner_url || "/images/placeholder/image.png"} alt={application?.program?.institute?.name} className="w-full h-full object-cover" />

                    <div className="absolute top-2 left-2 border border-black/10 bg-white/90 text-black font-semibold  backdrop-blur-md text-xs px-2 py-1 rounded-full flex items-center gap-2">
                        <Flag width={20} height={20} /> {application?.program?.institute?.country?.short_name}
                    </div>

                </div>



                <div className='px-4 flex items-center gap-2'>
                    <div>
                        <div className='p-1 border-gray-200 rounded-full h-10 w-10 border'>
                            {
                                application?.program?.institute?.logo ?
                                    <img className="rounded-full" src={application?.program?.institute?.logo_url} alt="" />
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={32} height={32} color={"#555"} fill={"none"}>
                                        <path d="M7 22V12.3981C7 11.3299 7 10.7958 7.24458 10.3478C7.48915 9.89983 7.93842 9.61101 8.83697 9.03338L10.9185 7.69526C11.4437 7.35763 11.7063 7.18881 12 7.18881C12.2937 7.18881 12.5563 7.35763 13.0815 7.69526L15.163 9.03338C16.0616 9.61101 16.5108 9.89983 16.7554 10.3478C17 10.7958 17 11.3299 17 12.3981V22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 13H12.009" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M21 22V16.1623C21 13.8707 19.7408 13.6852 17 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3 22V16.1623C3 13.8707 4.25916 13.6852 7 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 22H22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 22V18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                        <path d="M12 7V4.98221M12 4.98221V2.97035C12 2.49615 12 2.25905 12.1464 2.11173C12.6061 1.64939 14.5 2.74303 15.2203 3.18653C15.8285 3.56105 16 4.30914 16 4.98221H12Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                            }

                        </div>
                    </div>
                    <div>
                        <div className='font-medium text-sm line-clamp-1'>{application?.program?.name}</div>
                        <div className='text-xs tracking-tight line-clamp-1 text-gray-600'>{application?.program?.institute?.name}</div>
                    </div>
                </div>




                <div className='flex justify-between items-center px-4 py-2'>

                    <div className="space-y-3">
                        {/* <div className='gap-2 flex items-center'>
                            <div>
                                <Globe02Icon className='text-blue-600' />
                            </div>
                            <div>
                                <div className='text-xs text-gray-500'>Country</div>
                                <div className='text-xs font-medium text-gray-600'>{application?.program?.institute?.country?.short_name}</div>
                            </div>
                        </div> */}
                        <div className='gap-2 flex items-center'>
                            <div>
                                <GraduationScrollIcon className='text-blue-600' />
                            </div>
                            <div>
                                <div className='text-xs text-gray-500'>Apply Level</div>
                                <div className='text-xs font-medium text-gray-600'>{application?.program?.program_level?.name}</div>
                            </div>
                        </div>
                        <div className='gap-2 flex items-center'>
                            <div>
                                <Calendar03Icon className='text-blue-600' />
                            </div>
                            <div>
                                <div className='text-xs text-gray-500'>Intake</div>
                                <div className='text-xs font-medium text-gray-600 capitalize'>{application?.intake_month} - {application?.intake_year}</div>
                            </div>
                        </div>
                        <div className='gap-2 flex items-center'>
                            <div>
                                <Agreement02Icon className='text-blue-600' />
                            </div>
                            <div>
                                <div className='text-xs text-gray-500'>Partner</div>
                                <div className='text-xs font-medium text-gray-600'>{application?.partner?.company_name}</div>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-6'>
                        <div className='space-y-1 py-2'>
                            {
                                applicationChecks.map((v, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className={cn(
                                                'text-xs tracking-tighter lg:tracking-tight whitespace-nowrap h-[18px] text-gray-600 transition-opacity duration-200',
                                            )}
                                        >
                                            {v.label}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='flex-1 flex gap-3 lg:gap-4 p-2'>


                            <div
                                onClick={() => router.push(`/dashboard/crm/applications/${application?.application_id}`)}
                                className={cn(
                                    'h-full bg-gray-100 cursor-pointer rounded-full py-1 px-[2px] space-y-1 ring-4 ring-gray-100 transition-opacity duration-200',
                                )}
                            >
                                {
                                    applicationChecks?.map((check, i) => {
                                        var isChecked = application[check.key]
                                        return (
                                            <div key={i} className='w-[18px] h-[18px] bg-white rounded-full'>
                                                <div
                                                    className={
                                                        cn(
                                                            'w-full h-full bg-gradient-to-br rounded-full p-[2px] ring-2',
                                                            isChecked ? 'from-green-400 to-green-600 ring-green-200/80' : 'from-gray-200 to-gray-300 ring-gray-50'
                                                        )}
                                                >
                                                    <div className='w-full h-full rounded-full flex justify-center items-center text-white'>
                                                        {isChecked && <Tick02Icon strokeWidth={2.5} size={25} />}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                        </div>
                    </div>

                </div>

                <div className='flex justify-between items-center px-4 border-t pt-4 border-dashed'>
                    <div>
                        <User user={application?.processing_by} />
                    </div>
                    <div>
                        {/* <div className='text-xs text-red-500 bg-white border px-3 py-1 rounded-md border-red-600/40 backdrop-blur-sm inline-block'>Requested</div> */}
                        <Badge variant='soft' radius='full' size="2" color={application?.status?.color}>{application?.status?.name}</Badge>
                    </div>
                </div>

            </Link>

        </>
    )
}

export default ApplicationCard







