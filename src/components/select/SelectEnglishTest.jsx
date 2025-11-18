"use client"
import React, { useContext } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataContext } from '@/context/DataContextProvider'

const SelectEnglishTest = ({ field, error }) => {
    const { getEnglishTests } = useContext(DataContext)
    const englishTests = getEnglishTests()

    
    return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger error={error} className="bg-white">
                <SelectValue placeholder="Select Test Name" />
            </SelectTrigger>
            <SelectContent className="bg-white">
                {
                    englishTests.map((v, i) => {
                        return (
                            <SelectItem key={i} value={v.id}>
                                <div className='flex items-center gap-2'>
                                    <img className='w-4 h-4 rounded-full' src={v?.logo_url || "/images/placeholder/image.png"} alt="" />
                                    {v.name}
                                </div>
                            </SelectItem>
                        )
                    })
                }
            </SelectContent>
        </Select>
    )
}

export default SelectEnglishTest
