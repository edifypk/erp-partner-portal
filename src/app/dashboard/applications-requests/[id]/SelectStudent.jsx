"use client"

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Check, ChevronsUpDown } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/context/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'


const SelectStudent = ({ filters, value, onChange, placeholder, excludeItems, editable = true, className, nameClassName, jobTitleClassName, error }) => {

    const { onlineUsers, user } = useAuth()

    const [open, setOpen] = useState(false)
    const [selectedItemData, setSelectedItemData] = useState(null)


    const [params, setParams] = useState({
        ...filters,
        keyword: "",
    })


    const { data,isLoading } = useQuery({
        queryKey: [params,open],
        queryFn: async () => {
            try {
                if (open) {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/students/search`, {
                        params,
                        withCredentials: true,
                    });
                    return response.data?.data?.map(item => ({
                        ...item,
                        name: `${item?.lead?.full_name}`
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
            keyword: "",
        })
    }, [filters])


    // useEffect(() => {
    //     if (value) {
    //         getDefaultItem(value, pathname).then(res => {
    //             setSelectedItemData(res)
    //         })
    //     }
    // }, [])


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
                                                    <AvatarImage className='object-cover' src={selectedItemData?.lead?.photo ? `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${selectedItemData?.lead?.photo}` : `/images/placeholder/male.png`} />
                                                    <AvatarFallback>{selectedItemData?.lead?.full_name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className='text-left'>
                                                <div className={cn('text-gray-700 text-xs font-medium  whitespace-nowrap', nameClassName)}>{selectedItemData?.lead?.full_name}</div>
                                                <div className={cn('text-[10px] leading-[1] text-gray-500  whitespace-nowrap', jobTitleClassName)}>{selectedItemData?.student_id}</div>
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
                                                <AvatarImage className='object-cover' src={selectedItemData?.lead?.photo ? `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${selectedItemData?.lead?.photo}` : `/images/placeholder/male.png`} />
                                                <AvatarFallback>{selectedItemData?.lead?.full_name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className='text-left'>
                                            <div className={cn('text-gray-700 text-xs font-medium  whitespace-nowrap', nameClassName)}>{selectedItemData?.lead?.full_name}</div>
                                            <div className={cn('text-[10px] leading-[1] text-gray-500  whitespace-nowrap', jobTitleClassName)}>{selectedItemData?.student_id}</div>
                                        </div>
                                    </div>
                                )
                                : value ? <Skeleton className='w-full h-7' /> : placeholder}
                        </Button>
                }




                <PopoverContent align="start" className="w-full p-0">
                    <Command className="">
                        <CommandInput value={params.keyword} onValueChange={(value) => setParams({ ...params, keyword: value })} placeholder="Search..." />
                        <CommandList>
                            <CommandEmpty>{params.keyword ? `No data found.` : `Search`}</CommandEmpty>
                            <CommandGroup>
                                {Array.isArray(data) && data?.map((item) => (
                                    <CommandItem
                                        value={item.name}
                                        key={item.id}
                                        className="flex"
                                        onSelect={async () => {
                                            await onChange(item.student_id)
                                            setSelectedItemData(item)
                                            setOpen(false)
                                        }}
                                    >
                                        <div className='flex items-center gap-2'>
                                            <div>
                                                <Avatar online={onlineUsers?.includes(item?.id)} className='w-7 h-7 border'>
                                                    <AvatarImage className='object-cover' src={item?.lead?.photo ? `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${item?.lead?.photo}` : `/images/placeholder/male.png`} />
                                                    <AvatarFallback>{item?.lead?.full_name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div>
                                                <div className={cn('text-gray-700 text-xs font-medium  whitespace-nowrap')}>{item?.lead?.full_name}</div>
                                                <div className={cn('text-[10px] leading-[1] text-gray-500  whitespace-nowrap')}>{item?.student_id}</div>
                                            </div>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                item.id === value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default SelectStudent
