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

const SelectProcess = ({ pathname, filters, field, placeholder, error }) => {

    const inputRef = useRef(null)
    const [open, setOpen] = useState(false)
    const [selectedItemData, setSelectedItemData] = useState(null)


    const [params, setParams] = useState({
        ...filters,
        keyword: "",
    })


    const { data } = useQuery({
        queryKey: [params, open],
        queryFn: async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${pathname}`, {
                    params,
                });


                if (field?.value && open) {
                    setSelectedItemData(response.data?.data?.find(item => item.id === field?.value))
                }
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
    }, [field?.value])



    return (
        <div>
            <DropdownMenu open={open} onOpenChange={setOpen}>
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
                            ? (selectedItemData?.name.length > 20 ? selectedItemData?.name.substring(0, 20) + "..." : selectedItemData?.name)
                            : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>

                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-96 p-0">
                    <Command>
                        <CommandInput ref={inputRef} value={params.keyword} onValueChange={(value) => setParams({ ...params, keyword: value })} placeholder="Search..." />
                        <CommandList>
                            <CommandEmpty>No data found.</CommandEmpty>
                            <CommandGroup>
                                {data?.data?.map((item) => (
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
                                                item.id === field?.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default SelectProcess
