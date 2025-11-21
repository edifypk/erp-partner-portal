"use client"

import AnimatedCounter from '@/components/AnimatedCounter'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Check, ChevronsUpDown } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const SelectInstitute = ({ filters, field, placeholder, error }) => {

    const inputRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [selectedItemData, setSelectedItemData] = useState(null)


    const getDefaultSelectedInstitute = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/course-finder/institutes/search`, {
                params: {
                    id: field?.value,
                },
                withCredentials:true
            });
            setSelectedItemData(response.data?.data?.[0] || null);
        } catch (error) {
            console.log(error);
        }
    }


    const [params, setParams] = useState({
        ...filters,
        keyword: "",
    })

    const { data, isLoading } = useQuery({
        queryKey: [params, open],
        queryFn: async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/course-finder/institutes/search`, {
                    params,
                    withCredentials:true
                });

                // if (field?.value && open) {
                //     setSelectedItemData(response.data?.data?.find(item => item.id === field?.value))
                // }
                return response.data || [];
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

    useEffect(() => {
        if (!field?.value) {
            setSelectedItemData(null)
        }
        if (field?.value) {
            getDefaultSelectedInstitute()
        }
    }, [field?.value])



    return (
        <div>
            <DropdownMenu open={open} onOpenChange={setOpen} className="border border-red-400">
                <DropdownMenuTrigger asChild>

                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "w-full justify-between",
                            error && "border-red-500",
                            !field?.value && "text-muted-foreground"
                        )}
                    >
                        {selectedItemData
                            ?
                            <div className='flex items-center gap-2 -translate-x-2'>
                                <div className='w-7 h-7 rounded-full overflow-hidden border'>
                                    <img src={selectedItemData.logo_url} alt="" className='w-full h-full object-cover' />
                                </div>
                                <div>
                                    <div className='overflow-hidden text-black translate-y-[2px] tracking-tight text-[11px] text-ellipsis whitespace-nowrap'>
                                        {selectedItemData.name?.length > 60 ? selectedItemData.name?.substring(0, 60) + "..." : selectedItemData.name}
                                    </div>
                                    <div className='text-[10px] text-start tracking-tight text-gray-600'>{selectedItemData?.country?.name}</div>
                                </div>
                            </div>
                            : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>

                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-full p-0">
                    <Command>
                        <CommandInput className="bg-gray-50" ref={inputRef} value={params.keyword} onValueChange={(value) => setParams({ ...params, keyword: value })} placeholder="Search..." />
                        <CommandList className="max-h-[250px]">
                            <CommandEmpty>{isLoading ? "Loading..." : "No data found."}</CommandEmpty>
                            <CommandGroup>
                                {Array.isArray(data?.data) && data?.data?.map((item) => (
                                    <CommandItem
                                        value={item.name}
                                        key={item.id}
                                        className="flex items-center gap-2"
                                        onSelect={() => {
                                            field.onChange(item.id)
                                            setSelectedItemData(item)
                                            setOpen(false)
                                        }}
                                    >
                                        <div className='w-8 h-8 p-1 rounded-full overflow-hidden border'>
                                            <img src={item.logo_url} alt="" className='w-full h-full object-cover' />
                                        </div>
                                        <div>
                                            <div className='overflow-hidden translate-y-[2px] tracking-tight text-xs text-ellipsis whitespace-nowrap'>
                                                {item.name}
                                            </div>
                                            <div className='text-[10px] translate-y-[-2px] tracking-tight text-gray-600'>{item?.country?.name}</div>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                item.id === field?.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <div className='flex justify-between border-gray-200/50 bg-gray-50 items-center p-2 text-xs border-t font-medium'>
                            <div>
                                Results
                            </div>
                            <div>
                                <AnimatedCounter number={data?.metadata?.pagination?.totalItems || 0} />
                            </div>
                        </div>
                    </Command>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default SelectInstitute
