"use client"
import React, { useContext } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataContext } from '@/context/DataContextProvider'

const SelectLanguageCourse = ({ field, error }) => {
    const { getLanguageCourses } = useContext(DataContext)
    const languageCourses = getLanguageCourses()

    
    return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger error={error} className="bg-white">
                <SelectValue placeholder="Select Course Name" />
            </SelectTrigger>
            <SelectContent className="bg-white">
                {
                    languageCourses.map((v, i) => {
                        return (
                            <SelectItem key={i} value={v.id}>
                                <div className='flex items-center gap-2 tracking-tight'>
                                    <img className='w-4 h-4 rounded-full' src={v?.logo_url || "/images/placeholder/image.png"} alt="" />
                                    {v.name} <span className='w-1 h-1 rounded-full bg-black'></span> <span className='text-[10px]'>{v.weeks} weeks</span>
                                </div>
                            </SelectItem>
                        )
                    })
                }
            </SelectContent>
        </Select>
    )
}

export default SelectLanguageCourse
