import { cn } from '@/lib/utils'
import { formatDate } from '@/utils/functions'
import { CheckListIcon, Tick02Icon, TickDouble03Icon } from 'hugeicons-react'
import React from 'react'
import { format } from 'timeago.js'

const ApplicationOverview = ({ application }) => {

  var data = [
    {
      title: "Application Submitted to Institute",
      value: application?.is_submitted_to_institute,
      date:application?.submitted_to_institute_at
    },
    {
      title: "Unconditional Received",
      value: application?.is_unconditional_received,
      date:application?.unconditional_received_at
    },
    {
      title: "Tuition Fee Paid",
      value: application?.is_fee_paid,
      date:application?.fee_paid_at
    },
    {
      title: "Sponsorship Letter Received",
      value: application?.is_spon_letter_received,
      date:application?.spon_letter_received_at
    },
    {
      title: "Visa Granted",
      value: application?.is_visa_granted,
      date:application?.visa_granted_at
    },
    {
      title: "Enrolled Confirmed",
      value: application?.is_enrolled,
      date:application?.enrolled_at
    }
  ]
  return (
    <div>
      <div className='grid grid-cols-2 gap-4'>


        {
          data?.map((v, i) => {
            return (
              <div key={i} className={cn('flex items-center gap-3 border p-4 rounded-xl', v?.value ? 'border-green-500/40 bg-green-50' : 'border-gray-200 bg-white')}>
                <div>


                  <div
                    className={
                      cn(
                        'w-5 h-5 bg-gradient-to-br rounded-full p-[2px] ring-4',
                        v?.value ? 'from-green-400 to-green-600 ring-green-200/80' : 'from-gray-200 to-gray-300 ring-gray-100'
                      )}
                  >
                    <div className='w-full h-full rounded-full flex justify-center items-center text-white'>
                      {v?.value && <Tick02Icon strokeWidth={2.5} size={25} />}
                    </div>
                  </div>


                </div>

                <div>
                  <div className={cn('text-xs font-semibold tracking-tight', v?.value ? 'text-black/70' : 'text-gray-400')}>{v?.title}</div>
                  {v?.value && <p className='text-xs text-gray-500 tracking-tighter'>{v?.date ? formatDate(v?.date) : 'N/A'} • {v?.date && `${format(v?.date)}`}</p>}
                </div>

              </div>
            )
          })
        }



      </div>
    </div>
  )
}

export default ApplicationOverview
