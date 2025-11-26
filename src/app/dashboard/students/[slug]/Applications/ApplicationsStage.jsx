"use client"
import React, { useMemo, useState, useRef, useEffect } from 'react'
import ApplicationCard from './ApplicationCard'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import Courses from '../../../course-search/Courses'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import ApplicationRequestCard from './ApplicationRequestCard'
import IconButton from '@mui/material/IconButton'
import { PlusSignIcon } from 'hugeicons-react'

const ApplicationsStage = ({ student }) => {

  const [activeTab, setActiveTab] = useState('applications')
  const parentRef = useRef(null);
  const [refLineStyle, setRefLineStyle] = useState({
    width: 0,
    left: 0
  })

  const applications = useQuery({
    queryKey: [`${student?.id}-applications`],
    queryFn: async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/applications/student/${student?.id}`, {
          withCredentials: true
        });
        return response.data;
      } catch (error) {
        return false
      }
    },
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
  });

  const approvedApplications = useMemo(() => {
    return applications?.data?.data?.filter(v => v.approval_status === "approved") || [];
  }, [applications?.data?.data]);

  const applicationRequests = useMemo(() => {
    return applications?.data?.data?.filter(v => v.approval_status !== "approved") || [];
  }, [applications?.data?.data]);

  const updateLeft = (key) => {
    setRefLineStyle({
      left: `${Math.floor(document.getElementById(key)?.getBoundingClientRect().left - parentRef.current?.getBoundingClientRect().left || 0) + 1}px`,
      width: `${document.getElementById(key)?.getBoundingClientRect().width}px`
    })
  }

  useEffect(() => {
    setRefLineStyle({
      left: `${Math.floor(document.getElementById(activeTab || 'applications')?.getBoundingClientRect().left - parentRef.current?.getBoundingClientRect().left || 0)}px`,
      width: `${document.getElementById(activeTab || 'applications')?.getBoundingClientRect().width}px`
    })
  }, [activeTab])

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center gap-2'>
          <div className='font-medium tracking-tight'>Applications</div>
          <Sheet>
            <SheetTrigger asChild>
              <IconButton size='small' color='primary'>
                <PlusSignIcon size={15} strokeWidth={2} />
              </IconButton>
            </SheetTrigger>
            <SheetContent className="min-w-[1000px] [&>button]:cursor-pointer [&>button]:z-50 p-0 h-full overflow-hidden" overlayStyle="opacity-0">
              <SheetHeader className="hidden">
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
              <Courses coursesContainerStyle="xl:grid-cols-3" className="pt-6" student_id={student?.id} />
            </SheetContent>
          </Sheet>
        </div>

        <div className='overflow-x-auto hideScrollBar mb-4'>
          <div ref={parentRef} className='flex items-center gap-4 pt-1'>
            <button
              id="applications"
              onClick={() => { setActiveTab('applications'); updateLeft('applications') }}
              className={`py-1 px-2 flex cursor-pointer items-center font-medium text-sm gap-1`}
            >
              <div className={`whitespace-nowrap ${activeTab === 'applications' ? "text-primary" : "text-gray-400"}`}>
                Active
              </div>
              <span className='text-xs ml-1 w-4 flex justify-center items-center bg-gray-200 rounded-sm font-semibold'>
                {approvedApplications.length}
              </span>
            </button>
            <button
              id="requests"
              onClick={() => { setActiveTab('requests'); updateLeft('requests') }}
              className={`py-1 px-2 flex cursor-pointer items-center font-medium text-sm gap-1`}
            >
              <div className={`whitespace-nowrap ${activeTab === 'requests' ? "text-primary" : "text-gray-400"}`}>
                Pending
              </div>
              <span className='text-xs ml-1 w-4 flex justify-center items-center bg-gray-200 rounded-sm font-semibold'>
                {applicationRequests.length}
              </span>
            </button>
          </div>
          <div className='h-[2px] bg-gray-100 dark:bg-neutral-900 relative'>
            <div style={refLineStyle} className='absolute transition-all duration-300 bottom-0 bg-primary/40 h-full'></div>
          </div>
        </div>

      </div>



      {activeTab === 'applications' && (
        <div className='grid xl:grid-cols-2 gap-4'>
          {approvedApplications.length > 0 ? (
            approvedApplications.map((v, i) => {
              return (
                <ApplicationCard key={i} application={v} student={student} />
              )
            })
          ) : (
            <div className="col-span-2 p-10 flex text-center justify-center items-center">
              <div>
                <img className='w-40 mx-auto mb-4' src="/images/notfound.svg" alt="" />
                <div className='font-medium'>No approved applications found</div>
                <div className='text-xs text-gray-500'>Create a new application to get started</div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className='grid xl:grid-cols-2 gap-4'>
          {applicationRequests.length > 0 ? (
            applicationRequests.map((v, i) => {
              return (
                <ApplicationRequestCard key={i} application={v} student={student} />
              )
            })
          ) : (
            <div className="col-span-2 p-10 flex text-center justify-center items-center">
              <div>
                <img className='w-40 mx-auto mb-4' src="/images/notfound.svg" alt="" />
                <div className='font-medium'>No application requests found</div>
                <div className='text-xs text-gray-500'>Create a new application request to get started</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ApplicationsStage