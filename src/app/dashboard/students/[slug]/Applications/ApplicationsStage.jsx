"use client"
import React from 'react'
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

const ApplicationsStage = ({ student }) => {

  const applications = useQuery({
    queryKey: [`${student?.id}-applications`],
    queryFn: async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/applications/student/${student?.id}`);
        return response.data;
      } catch (error) {
        return false
      }
    }
  });


  return (
    <div>

      <div className='flex justify-between items-center mb-4'>
        <div>
          <div className='font-medium tracking-tight'>Applications</div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              New Application
            </Button>
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

      <div className='grid xl:grid-cols-2 gap-4 mb-8'>
        {
          applications?.data?.data?.filter(v => v.approval_status === "approved").map((v, i) => {
            return (
              <ApplicationCard key={i} application={v} student={student} />
            )
          })
        }
      </div>

      {applications?.data?.data?.filter(v => v.approval_status !== "approved")?.length > 0 && <div className=''>
        <div className='text-sm font-medium tracking-tight mb-2'>Application Requests</div>
        <div className='grid xl:grid-cols-2 gap-4'>
          {
            applications?.data?.data?.filter(v => v.approval_status !== "approved").map((v, i) => {
              return (
                <ApplicationRequestCard key={i} application={v} student={student} />
              )
            })
          }
        </div>
      </div>}


    </div>
  )
}

export default ApplicationsStage