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

const SelectSearch = ({ pathname, filters, field, placeholder }) => {

    const [open, setOpen] = useState(false)
    const [selectedItemData, setSelectedItemData] = useState(null)


    const [params, setParams] = useState({
        ...filters,
        keyword: "",
    })

    const { data, error } = useQuery({
        queryKey: [params],
        queryFn: async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${pathname}`, {
                    params,
                });

                if (pathname === "/crm/associates") {
                    return response.data?.data?.map(item => ({
                        ...item,
                        name: `${item.contact_person} (${item.company_name})`
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
                                !field.value && "text-muted-foreground"
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
                        <CommandInput value={params.keyword} onValueChange={(value) => setParams({ ...params, keyword: value })} placeholder="Search university..." />
                        <CommandList>
                            <CommandEmpty>No data found.</CommandEmpty>
                            <CommandGroup>
                                {data?.map((item) => (
                                    <CommandItem
                                        value={item.name}
                                        key={item.id}
                                        className="flex"
                                        onSelect={() => {
                                            field.onChange(item.id)
                                            setSelectedItemData(item)
                                            setOpen(false)
                                        }}
                                    >
                                        <div className='overflow-hidden text-ellipsis whitespace-nowrap'>
                                            {item.name}
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

export default SelectSearch
