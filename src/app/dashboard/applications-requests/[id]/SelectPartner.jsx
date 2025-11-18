"use client"

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { FormControl } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Check, ChevronsUpDown } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const SelectPartner = ({ pathname, filters, field, placeholder, error }) => {

    const [open, setOpen] = useState(false)
    const [selectedItemData, setSelectedItemData] = useState(null)


    const [params, setParams] = useState({
        ...filters,
        keyword: "",
    })

    const { data } = useQuery({
        queryKey: [params],
        queryFn: async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${pathname}`, {
                    params,
                });

                if (pathname === "/agreements/partners") {
                    return response.data?.data?.map(item => ({
                        ...item,
                        name: <div className='flex items-center gap-1'>
                            <div className='w-6 h-6 bg-white p-[2px] border border-gray-200/70 overflow-hidden rounded-full flex justify-center items-center'>
                                <img className="w-full h-auto rounded-full" src={item?.logo_url} alt="" />
                            </div>
                            {item.company_name}
                            <span className='text-[10px] leading-[1.4] bg-blue-100 rounded-full inline-block tracking-tight px-2 text-black'>{item.partner_type?.name}</span>
                        </div>
                    })) || [];
                }
                return response.data?.data || [];
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




    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground",
                                error && "border-red-500"
                            )}
                        >
                            {selectedItemData
                                ? selectedItemData?.name
                                : placeholder}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-full p-0">
                    <Command className="">
                        <CommandInput value={params.keyword} onValueChange={(value) => setParams({ ...params, keyword: value })} placeholder="Search Partner" />
                        <CommandList>
                            <CommandEmpty>No data found.</CommandEmpty>
                            <CommandGroup>
                                {data?.map((item) => (
                                    <CommandItem
                                        value={item.id}
                                        key={item.id}
                                        className="flex"
                                        onSelect={() => {
                                            field.onChange(item.id)
                                            setSelectedItemData(item)
                                            setOpen(false)
                                        }}
                                    >
                                        <div className='overflow-hidden text-ellipsis whitespace-nowrap'>
                                            <div>{item.name}</div>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                item.id === field.value
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

export default SelectPartner
