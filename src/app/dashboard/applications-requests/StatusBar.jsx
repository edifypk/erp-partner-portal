"use client"
import { useSearchQuery } from '@/hooks/useSearchQuery';
import { Badge } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react'

function pad(num, size) {
    if (num == 0) return "0"
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}


const StatusBar = ({ filters, setFilters }) => {

    const { applySearchQueries,CustomSearchParams } = useSearchQuery()
    var [active, setActive] = useState(CustomSearchParams.get('status') || false)

    var parentRef = useRef(null)
    var [refLineStyle, setRefLineStyle] = useState({
        width: 0,
        left: 0
    })


    const getApplicationsCountByStatus = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/applications/requests/count-by-status`, {
                // params: {
                //     ...filters
                // },
                withCredentials: true
            });
            return response?.data?.data
        } catch (error) {
            console.log(error)
            return []
        }
    }

    // var effectedFilters = filters
    // delete effectedFilters.page

    const applicationsCountByStatus = useQuery({
        queryKey: ['applications-count-by-status'],
        queryFn: getApplicationsCountByStatus
    })


    const updateLeft = (key) => {
        setRefLineStyle({
            left: `${Math.floor(document.getElementById(key)?.getBoundingClientRect().left - parentRef.current?.getBoundingClientRect().left || 0)}px`,
            width: `${document.getElementById(key)?.getBoundingClientRect().width}px`
        })
    }

    useEffect(() => {
        setRefLineStyle({
            left: `${Math.floor(document.getElementById(active || 'all')?.getBoundingClientRect().left - parentRef.current?.getBoundingClientRect().left || 0)}px`,
            width: `${document.getElementById(active || 'all')?.getBoundingClientRect().width}px`
        })
    }, [])




    return (
        <div className='border-b px-6  overflow-x-auto hideScrollBar'>
            <div ref={parentRef} className='flex items-center gap-8 pt-1 relative'>


                <div id='all' onClick={() => { applySearchQueries([{name:'status',value:null},{name:'page',value:null}]); setActive(null); updateLeft('all') }} className={`py-2 flex cursor-pointer items-center font-medium text-xs gap-1`}>
                    <div className={`${active ? "text-gray-500" : "text-black"}`}>All</div>
                    <div
                        style={(!active) ? { backgroundColor: '#000' } : { backgroundColor: 'gray' }}
                        className={`px-1 rounded-[4px] text-[10px] font-semibold min-w-[20px] text-center text-white`}
                    >
                        { applicationsCountByStatus?.data?.length > 0 ? pad(applicationsCountByStatus?.data?.reduce((acc, curr) => acc + Number(curr.applicationCount || 0), 0), 2) : 0}
                    </div>
                </div>

                {
                    applicationsCountByStatus?.data?.map((v, i) => {
                        const slug = v.approval_status;
                        const name = (slug || '').replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                        const count = Number(v.applicationCount || 0);
                        var isActive = (slug == active)
                        return (
                            <div id={slug} onClick={() => { applySearchQueries([{name:'status',value:slug},{name:'page',value:null}]); setActive(slug); updateLeft(slug) }} key={i} className={`py-2 flex cursor-pointer items-center font-medium text-xs gap-1`}>
                                <div className={`whitespace-nowrap ${isActive ? "text-black" : "text-gray-500"}`}>{name}</div>
                                <Badge variant={isActive ? "solid" : "soft"} color={isActive ? "green" : "gray"} >{ applicationsCountByStatus?.data?.length > 0 ? pad(count, 2) : 0}</Badge>
                            </div>
                        )
                    })
                }

                <div style={refLineStyle} className='absolute transition-all duration-300 bottom-0 bg-black h-[2px]'></div>
            </div>

        </div>
    )
}

export default StatusBar