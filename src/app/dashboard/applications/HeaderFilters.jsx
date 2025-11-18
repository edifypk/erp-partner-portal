"use client"
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useSearchQuery } from '@/hooks/useSearchQuery'
import { Search01Icon } from 'hugeicons-react'
import SearchQueryComponent from '@/components/SearchQueryComponent'

const HeaderFilters = () => {
    const { applySearchQueries, CustomSearchParams } = useSearchQuery()
    const [keyword, setKeyword] = useState(CustomSearchParams.get('keyword') || '')

    const handleSearch = (e) => {
        const value = e.target.value
        setKeyword(value)
        applySearchQueries([
            { name: 'keyword', value: value },
            { name: 'page', value: null }
        ])
    }

    return (
        <div className='px-6 py-3 border-b flex items-center gap-3'>
            <SearchQueryComponent />
        </div>
    )
}

export default HeaderFilters

