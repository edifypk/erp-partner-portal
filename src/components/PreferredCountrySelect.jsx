"use client"
import React, { useContext } from 'react'
import { FormControl, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataContext } from '@/context/DataContextProvider'
import flags from "react-phone-number-input/flags";
import { cn } from '@/lib/utils'

const PreferredCountrySelect = ({ field,align, loading, error, disabled }) => {

    const { getOfferedCountries } = useContext(DataContext)
    const offeredCountries = getOfferedCountries({ limit: 100 })


    return (
        <div className=''>
            <Select
                disabled={loading || disabled}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
            >

                <SelectTrigger className={cn("bg-white w-full", error && "border-red-500")}>
                    <SelectValue placeholder="Select Country" />
                </SelectTrigger>

                <SelectContent align={align || 'end'} className="overflow-y-auto max-h-[250px]">
                    {/* <SelectItem key="clear-country-filter" className="text-gray-500 cursor-pointer">
                        <div className="flex items-center gap-2 cursor-pointer w-full flex-1">
                            <span className="text-gray-500 text-xs">Clear</span>
                        </div>
                    </SelectItem> */}
                    {
                        offeredCountries.map((v, i) => {
                            var Flag = flags[v.iso_code]
                            return (
                                <SelectItem key={i} value={v.id}>
                                    <div className="flex items-center gap-2 cursor-pointer w-full flex-1">
                                        <Flag width={20} height={20} /> {v.name}
                                    </div>
                                </SelectItem>
                            )
                        })
                    }
                </SelectContent>
            </Select>
        </div>
    )
}

export default PreferredCountrySelect
