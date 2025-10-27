"use client"

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Check, ChevronDown, ChevronsUpDown, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/context/AuthContextProvider'
import { Skeleton } from './ui/skeleton'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'


const highlightText = (text, keyword) => {
    if (!keyword || !text) return text;

    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
        regex.test(part) ?
            <span key={index} className="bg-yellow-100">{part}</span> :
            part
    );
};


const getDefaultItem = async (id, pathname) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${pathname}/${id}`, {
            withCredentials: true,
            params: {
                attributes: "id,name,job_title,photo",
            }
        })
        return response.data?.data
    } catch (error) {
        console.log(error)
        return null
    }
}

const SelectUser = ({ error, pathname, filters, value, onChange, placeholder, excludeItems, editable = true, className, nameClassName, jobTitleClassName, defaultData, id, align = "end" }) => {

    const { onlineUsers, user } = useAuth()

    const [open, setOpen] = useState(false)
    const [selectedItemData, setSelectedItemData] = useState(null)


    const [params, setParams] = useState({
        ...filters,
        keyword: "",
        limit: 30,
        leads_period: 'today'
    })


    const { data, isLoading } = useQuery({
        queryKey: [params, open],
        queryFn: async () => {
            try {
                if (open) {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users`, {
                        params: {
                            leads_period: 'today',
                            ...params,
                        },
                        withCredentials: true,
                    });
                    return response.data?.data?.map(item => ({
                        ...item,
                        name: `${item?.contact?.name}`
                    })) || [];
                } else {
                    return []
                }
            } catch (error) {
                console.log(error);
                return []
            }
        },
        gcTime: 0
    });

    useEffect(() => {
        if (!open) {
            setParams({
                ...filters,
                keyword: "",
                leads_period: 'today'
            })
        }
    }, [open])


    useEffect(() => {
        setParams({
            ...filters,
            keyword: ""
        })
    }, [filters])


    useEffect(() => {
        if (value) {
            if (defaultData) {
                setSelectedItemData(defaultData)
            } else {
                getDefaultItem(value, pathname).then(res => {
                    setSelectedItemData(res)
                })
            }
        } else {
            setSelectedItemData(null)
        }
    }, [value, defaultData])




    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                {
                    editable ?
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "w-full border justify-between p-0 pl-2 pr-2",
                                    !value && "text-muted-foreground",
                                    error && "border-red-500",
                                    // (value) && "border-0 shadow-none",
                                    className
                                )}
                            >
                                {selectedItemData ?
                                    (
                                        <div className='flex items-center gap-2'>
                                            <div>
                                                <Avatar online={onlineUsers?.includes(selectedItemData?.id)} className='w-6 h-6 border-0 rounded-full'>
                                                    <AvatarImage className='object-cover' src={selectedItemData?.contact?.photo_url || `/images/placeholder/male.png`} />
                                                    <AvatarFallback>{selectedItemData?.contact?.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className='text-left'>
                                                <div className={cn('text-gray-700 text-[11px] font-medium whitespace-nowrap tracking-tight', nameClassName)}>{selectedItemData?.contact?.name}</div>
                                                <div className={cn('text-[9px] leading-[1] translate-y-[-4px] text-gray-500  whitespace-nowrap', jobTitleClassName)}>{selectedItemData?.job_title}</div>
                                            </div>
                                        </div>
                                    )
                                    : value ? <Skeleton className='w-full h-7' /> : placeholder}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        :
                        <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                                "w-full justify-between p-0 pl-2 pr-2 border-gray-200/40 border shadow-none",
                                !value && "text-muted-foreground",
                                className,
                                (selectedItemData) && "border-0 shadow-none"
                            )}
                        >
                            {selectedItemData ?
                                (
                                    <div className='flex items-center gap-2'>
                                        <div>
                                            <Avatar className='w-7 h-7 border-0 rounded-full'>
                                                <AvatarImage className='object-cover' src={selectedItemData?.contact?.photo_url || `/images/placeholder/male.png`} />
                                                <AvatarFallback>{selectedItemData?.contact?.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className='text-left'>
                                            <div className={cn('text-gray-700 text-xs font-medium  whitespace-nowrap tracking-tight', nameClassName)}>{highlightText(selectedItemData?.contact?.name, params.keyword)}</div>
                                            <div className={cn('text-[10px] leading-[1] text-gray-500  whitespace-nowrap', jobTitleClassName)}>{selectedItemData?.job_title}</div>
                                        </div>
                                    </div>
                                )
                                : value ? <Skeleton className='w-full h-7' /> : placeholder}
                        </Button>
                }




                <PopoverContent align={align} className="w-full min-w-60 p-0">

                    <div className="border-b relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 opacity-50" />
                        <Input className="border-0 focus-visible:ring-0 pl-8 shadow-none" value={params.keyword} onChange={(e) => setParams({ ...params, keyword: e?.target?.value })} placeholder="Search..." />
                    </div>


                    {(params.is_counsellor || params.is_lang_depart_counsellor) && <div className='flex items-center justify-between p-2'>
                        <div className='text-xs font-medium tracking-tighter'>Enquiries Assigned</div>
                        <div>
                            <Select
                                defaultValue='today'
                                value={params.leads_period}
                                onValueChange={(value) => {
                                    setParams(prev => ({
                                        ...prev,
                                        leads_period: value
                                    }))
                                }}
                            >
                                <SelectTrigger className='h-6 w-24 text-xs px-2 tracking-tight'>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    <SelectItem className="text-xs tracking-tight" value="today">Today</SelectItem>
                                    <SelectItem className="text-xs tracking-tight" value="this_week">This Week</SelectItem>
                                    <SelectItem className="text-xs tracking-tight" value="this_month">This Month</SelectItem>
                                    <SelectItem className="text-xs tracking-tight" value="this_year">This Year</SelectItem>
                                    {/* <SelectItem className="text-xs tracking-tight" value="last_year">Last Year</SelectItem> */}
                                </SelectContent>
                            </Select>

                        </div>
                    </div>}



                    <div className="max-h-[250px] overflow-y-auto p-2">
                        {
                            (isLoading) &&
                            Array.from({ length: 6 }).map((v, i) => (
                                <div key={i} className='flex justify-between items-center p-1 pr-2 rounded-md hover:bg-gray-100 cursor-pointer'>
                                    <div className='flex items-center gap-2'>
                                        <Skeleton className='h-7 w-7 rounded-full' />
                                        <div>
                                            <Skeleton className='h-3 w-20 mb-1 rounded-sm' />
                                            <Skeleton className='h-2 w-16 rounded-sm' />
                                        </div>
                                    </div>
                                    <div>
                                        <Skeleton className='h-4 w-4 rounded-sm' />
                                    </div>
                                </div>
                            ))
                        }
                        {data?.map((item) => (
                            <div
                                value={item.name}
                                key={item.id}
                                className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                                onClick={async () => {
                                    setSelectedItemData(item)
                                    await onChange(item.id)
                                    setOpen(false)
                                }}
                            >
                                <div className='flex items-center gap-2'>
                                    <div>
                                        <Avatar online={onlineUsers?.includes(item?.id)} className='w-7 h-7 border'>
                                            <AvatarImage className='object-cover' src={item?.contact?.photo_url || `/images/placeholder/male.png`} />
                                            <AvatarFallback>{item?.contact?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div>
                                        <div className={cn('text-gray-700 text-xs font-medium  whitespace-nowrap tracking-tight')}>{highlightText(item?.contact?.name, params.keyword)}</div>
                                        <div className={cn('text-[10px] leading-[1] font-medium tracking-tight text-gray-500  whitespace-nowrap')}>{item?.job_title}</div>
                                    </div>
                                </div>
                                {(params.is_counsellor || params.is_lang_depart_counsellor) && <div className='pr-2 text-xs font-medium tracking-tighter'>
                                    <div>{item?.leads_count || 0}</div>
                                </div>}
                            </div>
                        ))}
                    </div>


                </PopoverContent>
            </Popover>
        </div>
    )
}

export default SelectUser
