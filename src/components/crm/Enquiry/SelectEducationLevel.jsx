"use client"
import React, { useContext } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataContext } from '@/context/DataContextProvider'

const SelectEducationLevel = ({ field, error }) => {

    const { getProgramLevels } = useContext(DataContext)
    const applyLevels = getProgramLevels({ limit: 50 })




    return (
        <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className={`bg-white w-full ${error ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select Education Level" />
            </SelectTrigger>
            <SelectContent className="bg-white py-2 max-h-[300px] overflow-y-auto">
                <div className='space-y-1 mb-3'>
                    <div className='text-xs font-medium px-2'>Postgraduate</div>
                    <div className='pl-2 ml-1'>
                        {
                            applyLevels.filter(v => v.family == 'postgraduate').map((v, i) => {
                                return (
                                    <SelectItem className="text-xs text-gray-600 py-1" key={i} value={v.id}>{v.name}</SelectItem>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='space-y-1 mb-3'>
                    <div className='text-xs font-medium px-2'>Undergraduate</div>
                    <div className='pl-2 ml-1'>
                        {
                            applyLevels.filter(v => v.family == 'undergraduate').map((v, i) => {
                                return (
                                    <SelectItem className="text-xs text-gray-600 py-1" key={i} value={v.id}>{v.name}</SelectItem>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='space-y-1 mb-3'>
                    <div className='text-xs font-medium px-2'>Secondary</div>
                    <div className='pl-2 ml-1'>
                        {
                            applyLevels.filter(v => v.family == 'secondary').map((v, i) => {
                                return (
                                    <SelectItem className="text-xs text-gray-600 py-1" key={i} value={v.id}>{v.name}</SelectItem>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='space-y-1'>
                    <div className='text-xs font-medium px-2'>Primary</div>
                    <div className='pl-2 ml-1'>
                        {
                            applyLevels.filter(v => v.family == 'primary').map((v, i) => {
                                return (
                                    <SelectItem className="text-xs text-gray-600 py-1" key={i} value={v.id}>{v.name}</SelectItem>
                                )
                            })
                        }
                    </div>
                </div>
            </SelectContent>
        </Select>
    )
}

export default SelectEducationLevel
