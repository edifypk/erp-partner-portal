"use client"

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/context/AuthContextProvider'
import { Skeleton } from '@/components/ui/skeleton'
import { CrownIcon } from 'hugeicons-react'
import { Input } from '@/components/ui/input'
import { highlightText } from '@/utils/functions'


const SelectStudent = ({ pathname, showStudentTag = false, filters, value, onChange, placeholder, editable = true, className, nameClassName, jobTitleClassName, error }) => {

    const { onlineUsers, user } = useAuth()

    const [open, setOpen] = useState(false)
    const [selectedItemData, setSelectedItemData] = useState(null)


    const [params, setParams] = useState({
        ...filters,
        keyword: "",
    })


    const { data, isLoading } = useQuery({
        queryKey: [params, open],
        queryFn: async () => {
            try {
                if (open) {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${pathname}`, {
                        params,
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
    });


    useEffect(() => {
        if (!open) {
            setParams({
                ...filters,
                keyword: "",
            })
        }
    }, [open])

    useEffect(() => {
        setParams({
            ...filters,
            keyword: ""
        })
    }, [filters])

    var getDefaultItem = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${pathname}/${value}`, {
                params,
                withCredentials: true,
            });
            setSelectedItemData({
                ...response.data?.data,
                name: `${response.data?.data?.contact?.name}`
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (value) {
            getDefaultItem()
        } else {
            setSelectedItemData(null)
        }
    }, [value])




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
                                    (value) && "shadow-none",
                                    className,
                                    error && "border-red-500"
                                )}
                            >
                                {selectedItemData ?
                                    (
                                        <div className='flex items-center gap-2'>
                                            <div>
                                                <Avatar online={onlineUsers?.includes(selectedItemData?.id)} className='w-7 h-7 border-0 rounded-full'>
                                                    <AvatarImage className='object-cover' src={selectedItemData?.contact?.photo_url} />
                                                    <AvatarFallback>{selectedItemData?.contact?.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className='text-left'>
                                                <div className={cn('text-gray-700 text-xs font-medium  whitespace-nowrap', nameClassName)}>{selectedItemData?.contact?.name}</div>
                                                <div className={cn('text-[10px] leading-[1] text-gray-500  whitespace-nowrap', jobTitleClassName)}>{selectedItemData?.contact?.contact_id}</div>
                                            </div>
                                        </div>
                                    )
                                    :  placeholder}
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
                                            <div className={cn('text-gray-700 text-xs font-medium  whitespace-nowrap', nameClassName)}>{selectedItemData?.contact?.name}</div>
                                            <div className={cn('text-[10px] leading-[1] text-gray-500  whitespace-nowrap', jobTitleClassName)}>{selectedItemData?.contact?.contact_id}</div>
                                        </div>
                                    </div>
                                )
                                : value ? <Skeleton className='w-full h-7' /> : placeholder}
                        </Button>
                }



                <PopoverContent align="start" className="w-full min-w-60 p-0">
                    <div className="border-b relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 opacity-50" />
                        <Input className="border-0 focus-visible:ring-0 pl-8 shadow-none" value={params.keyword} onChange={(e) => setParams({ ...params, keyword: e?.target?.value })} placeholder="Search..." />
                    </div>

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
                                    await onChange(item.id)
                                    setSelectedItemData(item)
                                    setOpen(false)
                                }}
                            >
                                <div className='flex items-center gap-2'>
                                    <div>
                                        <Avatar online={onlineUsers?.includes(item?.id)} className='w-7 h-7 border'>
                                            <AvatarImage className='object-cover' src={item?.contact?.photo_url} />
                                            <AvatarFallback>{item?.contact?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div>
                                        <div className={cn('text-gray-700 text-xs font-medium  whitespace-nowrap tracking-tight')}>{highlightText(item?.contact?.name, params.keyword)}</div>
                                        <div className={cn('text-[10px] leading-[1] text-gray-500  whitespace-nowrap')}>{highlightText(item?.contact?.contact_id.toString(), params.keyword)}</div>
                                    </div>
                                </div>
                                {item?.is_converted_to_student && <div className='ml-auto text-gray-200'>
                                    <CrownIcon fill="#f59e0b" size={18} />
                                </div>}
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default SelectStudent
