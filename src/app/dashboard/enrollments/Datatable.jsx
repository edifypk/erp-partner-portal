"use client"
import React, { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useInView } from 'framer-motion'
import { useSearchQuery } from '@/hooks/useSearchQuery'
import EnrollmentCard from './EnrollmentCard'
import EnrollmentCardSkeleton from './EnrollmentCardSkeleton'

const Datatable = () => {
    const { CustomSearchParams } = useSearchQuery()
    
    const scrollRef = useRef(null)
    const loadMoreRef = useRef()
    const inView = useInView(loadMoreRef)
    const keyword = CustomSearchParams.get('keyword') || ''

    const getEnrollments = async ({ pageParam = 1 }) => {
        try {
            const currentFilters = {
                keyword: CustomSearchParams.get('keyword') || "",
                limit: 12,
                page: pageParam,
            };

            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/enrollments`, {
                params: currentFilters,
                withCredentials: true
            });
            
            if (pageParam === 1) {
                scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
            }
            
            return response?.data;
        } catch (error) {
            console.log(error?.response?.data)
            return { data: [], metadata: { pagination: { pageCount: 0 } } }
        }
    }

    const enrollments = useInfiniteQuery({
        queryKey: ['enrollments', CustomSearchParams.toString()],
        queryFn: getEnrollments,
        getNextPageParam: (lastPage, allPages) => {
            const maxPages = lastPage?.metadata?.pagination?.pageCount;
            const nextPage = allPages.length + 1;
            return nextPage <= maxPages ? nextPage : undefined;
        },
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
    });

    useEffect(() => {
        if (inView && enrollments?.hasNextPage && (!enrollments?.isFetchingNextPage) && (!enrollments?.isLoading)) {
            enrollments?.fetchNextPage();
        }
    }, [inView, enrollments?.hasNextPage, enrollments?.isFetchingNextPage, enrollments?.isLoading]);

    return (
        <div ref={scrollRef} className='flex-1 overflow-auto px-6 py-6'>
            {
                (enrollments?.data?.pages[0]?.data?.length > 0 || enrollments?.isLoading) ?
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {(enrollments?.isLoading) ? (
                            Array(12).fill(0).map((_, index) => (
                                <EnrollmentCardSkeleton key={index} />
                            ))
                        ) : (
                            <>
                                {
                                    enrollments?.data?.pages?.map((page) => (
                                        page?.data?.map((enrollment, index) => (
                                            <EnrollmentCard 
                                                keyword={keyword} 
                                                key={`${enrollment.id}-${index}`} 
                                                enrollment={enrollment} 
                                            />
                                        ))
                                    ))
                                }
                            </>
                        )}
                    </div>
                    :
                    <div style={{ opacity: enrollments?.isLoading ? 0 : 1 }} className="p-10 flex text-center justify-center items-center">
                        <div>
                            <img className='w-40 mx-auto mb-4' src="/images/notfound.svg" alt="" />
                            <div className='font-medium'>Sorry, we couldn't find any enrollments</div>
                            <div className='text-xs text-gray-500'>Please try again with different filters</div>
                        </div>
                    </div>
            }

            <div ref={loadMoreRef} className="mt-4">
                {enrollments?.hasNextPage && enrollments?.isFetchingNextPage &&
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array(12).fill(0).map((_, index) => (
                            <EnrollmentCardSkeleton key={index} />
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}

export default Datatable

