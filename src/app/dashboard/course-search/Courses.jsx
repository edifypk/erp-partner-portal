"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useInView } from 'framer-motion'
import CourseCard from './CourseCard'
import CourseCardSkelton from './CourseCardSkelton'
import FiltersModal from './FiltersModal'
import { useSearchQuery } from '@/hooks/useSearchQuery'
import { cn } from '@/lib/utils'
import SearchQueryComponent from '@/components/SearchQueryComponent'


const Courses = ({ coursesContainerStyle, student_id, className }) => {
    const { applySearchQueries, removeSearchQueries, CustomSearchParams } = useSearchQuery()


    const isClearing = useRef(false)
    const scrollRef = useRef(null)
    const loadMoreRef = useRef();
    const inView = useInView(loadMoreRef);

    const [filters, setFilters] = useState({
        keyword: CustomSearchParams.get('keyword') || "",
        institute_id: CustomSearchParams.get('institute_id') || "",
        country_id: CustomSearchParams.get('country_id') || "",
        level_id: CustomSearchParams.get('level_id') || "",
        tags: CustomSearchParams.get('tags') ? CustomSearchParams.get('tags').split(',') : [],
    })

    const getPrograms = async ({ pageParam = 1 }) => {
        try {
            // Get current URL parameters for the API call
            const currentFilters = {
                keyword: CustomSearchParams.get('keyword') || "",
                institute_id: CustomSearchParams.get('institute_id') || "",
                country_id: CustomSearchParams.get('country_id') || "",
                level_id: CustomSearchParams.get('level_id') || "",
                tags: CustomSearchParams.get('tags') ? CustomSearchParams.get('tags').split(',') : []
            };

            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/course-finder/programs`, {
                params: {
                    ...currentFilters,
                    limit: 12,
                    page: pageParam,
                    tags: currentFilters.tags.join(",")
                },
            });
            if (pageParam === 1) {
                scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
            }
            return response.data;
        } catch (error) {
            return false
        }
    }

    const programs = useInfiniteQuery({
        queryKey: ['programs', CustomSearchParams.toString()],
        queryFn: getPrograms,
        getNextPageParam: (lastPage, allPages) => {
            const maxPages = lastPage?.metadata?.pagination?.totalPages;
            const nextPage = allPages.length + 1;
            return nextPage <= maxPages ? nextPage : undefined;
        },
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
    });

    useEffect(() => {
        if (inView && programs?.hasNextPage && (!programs?.isFetchingNextPage) && (!programs?.isLoading)) {
            programs?.fetchNextPage();
        }
    }, [inView]);

    const applyFilters = () => {
        // Use the new function to apply all filters at once
        const queries = [
            { name: "country_id", value: filters.country_id },
            { name: "institute_id", value: filters.institute_id },
            { name: "level_id", value: filters.level_id },
            { name: "tags", value: filters.tags.join(",") }
        ].filter(query => query.value && query.value !== '' && query.value !== ',');

        setTimeout(() => {
            applySearchQueries(queries);
        }, 500)
    }


    const clearFilters = () => {
        // Set flag to prevent automatic URL updates
        isClearing.current = true

        // Immediately remove URL parameters
        removeSearchQueries(["institute_id", "country_id", "tags", "level_id"])

        // Update local state immediately
        setFilters({
            ...filters,
            institute_id: "",
            country_id: "",
            level_id: "",
            tags: []
        })

        // Reset flag after a short delay
        setTimeout(() => {
            isClearing.current = false
        }, 1000)
    }


    useEffect(()=>{
        setFilters({
            keyword: CustomSearchParams.get('keyword') || "",
            institute_id: CustomSearchParams.get('institute_id') || "",
            country_id: CustomSearchParams.get('country_id') || "",
            level_id: CustomSearchParams.get('level_id') || "",
            tags: CustomSearchParams.get('tags') ? CustomSearchParams.get('tags').split(',') : []
        })
    },[CustomSearchParams])



    return (
        <div className="h-full flex flex-col">


            <div className={cn('px-6 pt-6 shadow-[0px_10px_10px_10px_rgba(255,255,255,100%)] shadow-background dark:shadow-[0px_10px_10px_10px] z-10 ', className)}>

                <div className='flex items-center justify-between mb-2'>
                    <div className='font-semibold flex items-center gap-2'>
                        Course Finder
                    </div>
                </div>


                <div className='flex justify-between mb-2'>
                    <div>
                        <SearchQueryComponent />
                    </div>


                    <div>
                        <FiltersModal filters={filters} setFilters={setFilters} applyFilters={applyFilters} clearFilters={clearFilters} />
                    </div>

                </div>

                <div className='flex justify-end pr-1'>
                    <div className='text-xs tracking-tight'>
                        Results : <span className='font-semibold'>{programs?.isLoading ? "Loading..." : programs?.data?.pages[0]?.metadata?.pagination?.totalItems}</span>
                    </div>
                </div>
            </div>

            <div ref={scrollRef} className='flex-1 overflow-auto px-6 py-6'>

                {
                    (programs?.data?.pages[0]?.data?.length > 0 || programs?.isLoading) ?
                        <div className={cn("grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", coursesContainerStyle)}>
                            {(programs?.isLoading) ? (
                                Array(12).fill(0).map((_, index) => (
                                    <CourseCardSkelton key={index} />
                                ))
                            ) : (
                                <>
                                    {
                                        programs?.data?.pages?.map((page) => (
                                            page?.data?.map((v, index) => (
                                                <CourseCard keyword={filters.keyword} key={index} course={v} student_id={student_id} />
                                            ))
                                        ))
                                    }
                                </>
                            )}
                        </div>
                        :
                        <div style={{ opacity: programs?.isLoading ? 0 : 1 }} className="p-10 flex text-center justify-center items-center">
                            <div>
                                <img className='w-40 mx-auto mb-4' src="/images/notfound.svg" alt="" />
                                <div className='font-medium'>Sorry, we couldn't find any programs</div>
                                <div className='text-xs text-gray-500'>Please try again with different filters</div>
                            </div>
                        </div>
                }

                <div ref={loadMoreRef} className="mt-4">
                    {programs?.hasNextPage &&
                        <div className={cn("grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", coursesContainerStyle)}>
                            {Array(12).fill(0).map((_, index) => (
                                <CourseCardSkelton key={index} />
                            ))}
                        </div>
                    }
                </div>


            </div>

        </div>
    )
}

export default Courses
