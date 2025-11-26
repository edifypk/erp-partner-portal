'use client'
import React from 'react'
import Datatable from './Datatable'
import SearchQueryComponent from '@/components/SearchQueryComponent'
import { useSearchQuery } from '@/hooks/useSearchQuery'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const Enrollments = () => {
  const { CustomSearchParams } = useSearchQuery()

  // Get total count for display
  const getEnrollmentsCount = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/enrollments`, {
        params: {
          keyword: CustomSearchParams.get('keyword') || "",
          limit: 1,
          page: 1,
        },
        withCredentials: true
      });
      return response?.data?.metadata?.pagination?.count || 0;
    } catch (error) {
      return 0;
    }
  }

  const countQuery = useQuery({
    queryKey: ['enrollments-count', CustomSearchParams.get('keyword')],
    queryFn: getEnrollmentsCount,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="h-full flex flex-col">
      <div className={cn('px-6 pt-6 shadow-[0px_10px_10px_10px] shadow-white z-10 bg-white')}>
        <div className='flex items-center justify-between mb-2'>
          <div className='font-semibold flex items-center gap-2'>
            Enrollments
          </div>
        </div>

        <div className='flex justify-between mb-2'>
          <div>
            <SearchQueryComponent />
          </div>
        </div>

        <div className='flex justify-end pr-1 mb-4'>
          <div className='text-xs tracking-tight'>
            Results : <span className='font-semibold'>
              {countQuery?.isLoading ? "Loading..." : countQuery?.data || 0}
            </span>
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-hidden'>
        <Datatable />
      </div>
    </div>
  )
}

export default Enrollments
