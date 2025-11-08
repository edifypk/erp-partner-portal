"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useInView } from 'framer-motion'
import StudentCardSkelton from './StudentCardSkelton'
import { useSearchQuery } from '@/hooks/useSearchQuery'
import SearchQueryComponent from '@/components/SearchQueryComponent'
import StudentCard from './StudentCard'
import AddStudentDialog from './AddStudentDialog'
import { Button } from '@/components/ui/button'


const Students = () => {

    const { applySearchQueries, removeSearchQueries, CustomSearchParams } = useSearchQuery()


    const scrollRef = useRef(null)
    const loadMoreRef = useRef();
    const inView = useInView(loadMoreRef);

    const [filters, setFilters] = useState({
        keyword: CustomSearchParams.get('keyword') || "",
    })




    const getStudents = async ({ pageParam = 1 }) => {
        try {


            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/students`, {
                params: {
                    ...filters,
                    limit: 12,
                    page: pageParam,
                },
                withCredentials: true
            });
            if (pageParam === 1) {
                scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
            }
            return response.data;
        } catch (error) {
            return false
        }
    }

    const students = useInfiniteQuery({
        queryKey: ['students', filters],
        queryFn: getStudents,
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
        if (inView && students?.hasNextPage && (!students?.isFetchingNextPage) && (!students?.isLoading)) {
            students?.fetchNextPage();
        }
    }, [inView]);


    useEffect(() => {
        setFilters({
            keyword: CustomSearchParams.get('keyword') || "",
        })
    }, [CustomSearchParams])




    return (
        <div className="h-full flex flex-col">


            <div className='px-6 pt-6 shadow-background shadow-[0px_10px_10px_10px)] z-10'>

                <div className='flex items-center justify-between mb-2'>
                    <div className='font-semibold'>Students</div>
                </div>


                <div className='flex justify-between mb-2'>
                    <div>
                        <SearchQueryComponent />
                    </div>


                    <div>
                        {/* Filters Modal */}
                        <AddStudentDialog>
                            <Button size="sm">
                                Add Student
                            </Button>
                        </AddStudentDialog>
                        {/* <FiltersModal filters={filters} setFilters={setFilters} applyFilters={applyFilters} clearFilters={clearFilters} /> */}
                    </div>

                </div>

                <div className='flex justify-end pr-1'>
                    <div className='text-xs tracking-tight'>
                        Results : <span className='font-semibold'>{students?.isLoading ? "Loading..." : students?.data?.pages[0]?.metadata?.pagination?.count}</span>
                    </div>
                </div>
            </div>

            <div ref={scrollRef} className='flex-1 overflow-auto px-6 py-6'>

                {
                    (students?.data?.pages[0]?.data?.length > 0 || students?.isLoading) ?
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(students?.isLoading) ? (
                                Array(3).fill(0).map((_, index) => (
                                    <StudentCardSkelton key={index} />
                                ))
                            ) : (
                                <>
                                    {
                                        students?.data?.pages?.map((page) => (
                                            page?.data?.map((v, index) => (
                                                <StudentCard student={v} key={index} keyword={filters.keyword} />
                                            ))
                                        ))
                                    }
                                </>
                            )}
                        </div>
                        :
                        <div style={{ opacity: students?.isLoading ? 0 : 1 }} className="p-10 flex text-center justify-center items-center">
                            <div>
                                <img className='w-40 mx-auto mb-4' src="/images/notfound.svg" alt="" />
                                <div className='font-medium'>Sorry, we couldn't find any students</div>
                                <div className='text-xs text-gray-500'>Please try again with different filters</div>
                            </div>
                        </div>
                }

                <div ref={loadMoreRef} className="mt-4">
                    {
                        students?.hasNextPage &&
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array(3).fill(0).map((_, index) => (
                                <StudentCardSkelton key={index} />
                            ))}
                        </div>
                    }
                </div>


            </div>

        </div>
    )
}

export default Students
