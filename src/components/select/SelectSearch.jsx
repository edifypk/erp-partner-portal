"use client"

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { FormControl } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Check, ChevronsUpDown } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const SelectSearch = ({ pathname, filters, field, placeholder, error,onKeyDown,labelKey = "name", renderItem }) => {

    const [open, setOpen] = useState(false)

    const [selectedItemData, setSelectedItemData] = useState(null)


    const [params, setParams] = useState({
        ...filters,
        keyword: "",
    })


    const { data } = useQuery({
        queryKey: [pathname, params],
        queryFn: async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${pathname}`, {
                    params,
                    withCredentials: true
                });

                if (field?.value) {
                    setSelectedItemData(response.data?.data?.find(item => item.id === field.value))
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
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger onKeyDown={onKeyDown} asChild>
                    {/* <FormControl> */}
                        <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                                "w-full justify-between",
                                error && "border-red-500",
                                !field.value && "text-muted-foreground"
                            )}
                        >
                            {selectedItemData
                                ? (() => {
                                    const displayText = renderItem ? renderItem(selectedItemData) : selectedItemData?.[labelKey]
                                    return displayText?.length > 60 ? displayText?.substring(0, 60) + "..." : displayText
                                  })()
                                : placeholder}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    {/* </FormControl> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-full p-0">
                    <Command className="">
                        <CommandInput value={params.keyword} onValueChange={(value) => setParams({ ...params, keyword: value })} placeholder="Search..." />
                        <CommandList>
                            <CommandEmpty>No data found.</CommandEmpty>
                            <CommandGroup>
                                {data?.map((item) => (
                                    <CommandItem
                                        value={item?.[labelKey]}
                                        key={item.id}
                                        className="flex"
                                        onSelect={() => {
                                            field.onChange(item.id)
                                            setSelectedItemData(item)
                                            setOpen(false)
                                        }}
                                    >
                                        <div className='overflow-hidden text-ellipsis whitespace-nowrap'>
                                            {renderItem ? renderItem(item) : item?.[labelKey]}
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
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default SelectSearch
