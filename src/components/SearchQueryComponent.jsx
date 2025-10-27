"use client"
import React, { useEffect, useState, useRef } from 'react'
import { useSearchQuery } from '@/hooks/useSearchQuery'
import { Input } from './ui/input'
import { Search01Icon } from 'hugeicons-react'
import { cn } from '@/lib/utils'

const SearchQueryComponent = ({ className, applyOnChange = false }) => {

    const [isNotFirstRender, setIsNotFirstRender] = useState(false)
    const { applySearchQueries, CustomSearchParams } = useSearchQuery()
    const [search, setSearch] = useState(CustomSearchParams.get('keyword') || '')
    const debounceTimeoutRef = useRef(null)


    const handleSearch = (e) => {
        if (e) {
            e.preventDefault()
        }
        applySearchQueries([
            { name: 'keyword', value: applyOnChange ? e?.target?.value : search },
            { name: 'page', value: null }
        ])
    }

    const debouncedSearch = (value) => {
        // Clear existing timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }
        
        // Set new timeout
        debounceTimeoutRef.current = setTimeout(() => {
            applySearchQueries([
                { name: 'keyword', value },
                { name: 'page', value: null }
            ])
        }, 200) // 300ms delay - optimal balance between responsiveness and performance
    }


    useEffect(() => {
        if (!search && isNotFirstRender) {
            handleSearch(null)
        }
    }, [search])

    useEffect(() => {
        setIsNotFirstRender(true)
    }, [])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }
        }
    }, [])



    return (
        <form onSubmit={(e)=>!applyOnChange ? handleSearch(e) : e.preventDefault()} className={cn('relative', className)}>


            <Input className='pl-7 w-full' placeholder="Search" type="text" value={search} onChange={(e) => {
                const value = e.target.value
                setSearch(value)
                if (applyOnChange) {
                    debouncedSearch(value)
                }
            }} />

            <div className='absolute top-1/2 -translate-y-1/2 left-2'>
                <Search01Icon size={14} />
            </div>
        </form>
    )
}

export default SearchQueryComponent
