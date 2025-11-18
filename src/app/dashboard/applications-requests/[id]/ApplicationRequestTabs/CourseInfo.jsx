import React from 'react'
import { Building06Icon, Calendar03Icon, GraduationScrollIcon, HourglassIcon, MoneyBag02Icon } from 'hugeicons-react'
import flags from 'react-phone-number-input/flags'
import { getCurrencyCode, getCurrencySymbol } from '@/utils/currencyUtils'


const CourseInfo = ({ application }) => {

    var Flag = flags[application?.program?.institute?.country?.iso_code]



    return (
        <div>

            <div className="h-40 w-full rounded-xl bg-gray-100 relative mb-4">


                <img initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.5 }} onError={(e) => {
                    e.target.src = "/images/placeholder/image.png"
                }} src={application?.program?.institute?.banner_url || "/images/placeholder/image.png"} alt={application?.program?.institute?.name} className="w-full h-full opacity-80 object-cover rounded-xl" />


                <div className="absolute top-4 left-4 border border-black/10 bg-white/90 text-black font-semibold  backdrop-blur-md text-xs px-2 py-1 rounded-full flex items-center gap-2">
                    <Flag width={20} height={20} /> {application?.program?.institute?.country?.short_name}
                </div>


            </div>



            <div className='flex items-center gap-2 mb-4 -translate-y-1'>
                <div>
                    <div className='w-10 h-auto'>
                        {
                            application?.program?.institute?.logo ?
                                <img className="rounded-full" src={application?.program?.institute?.logo_url} alt="" />
                                :
                                <div className='flex items-center justify-center w-full h-full'>
                                    <Building06Icon size={32} />
                                </div>
                        }
                    </div>
                </div>
                <div className=''>
                    <div className='font-semibold translate-y-[2px] text-lg text-gray-700 tracking-tight'>{application?.program?.name}</div>
                    <div className='font-medium -translate-y-[2px] text-[14px] text-gray-500 leading-[20px] tracking-tight line-clamp-2'>{application?.program?.institute?.name}</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-5">

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
                        <MoneyBag02Icon className='text-blue-600' />
                    </div>
                    <div>
                        <div className='text-xs text-gray-500'>Tuition Fee (1st year)</div>
                        <div className='text-xs font-medium text-gray-600'>{getCurrencySymbol(application?.program?.institute?.country_code)}{String(Math.round(application?.program?.tuition)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {getCurrencyCode(application?.program?.institute?.country?.iso_code)}</div>
                    </div>
                </div>

                <div className='gap-2 flex items-center'>
                    <div>
                        <MoneyBag02Icon className='text-blue-600' />
                    </div>
                    <div>
                        <div className='text-xs text-gray-500'>Application Fee</div>
                        <div className='text-xs font-medium text-gray-600'>{getCurrencySymbol(application?.program?.institute?.country_code)}{String(Math.round(application?.program?.application_fee)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {getCurrencyCode(application?.program?.institute?.country?.iso_code)}</div>
                    </div>
                </div>

                <div className='gap-2 flex items-center'>
                    <div>
                        <HourglassIcon className='text-blue-600' />
                    </div>
                    <div>
                        <div className='text-xs text-gray-500'>Duration</div>
                        <div className='text-xs font-medium text-gray-600'>{application?.program?.min_length === application?.program?.max_length ? application?.program?.min_length : `${application?.program?.min_length} - ${application?.program?.max_length}`} months</div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default CourseInfo
