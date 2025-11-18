'use client'

import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { useSearchQuery } from '@/hooks/useSearchQuery'

const HeaderFilters = () => {

    const [isNotFirstRender, setIsNotFirstRender] = useState(false)
    const { applySearchQueries, CustomSearchParams } = useSearchQuery()
    const [search, setSearch] = useState(CustomSearchParams.get('keyword') || '')


    const handleSearch = (e) => {
        if (e) {
            e.preventDefault()
        }
        applySearchQueries([
            { name: 'keyword', value: search },
            { name: 'page', value: null }
        ])
    }


    useEffect(() => {
        if (!search && isNotFirstRender) {
            handleSearch(null)
        }
    }, [search])


    useEffect(() => {
        setIsNotFirstRender(true)
    }, [])


    return (
        <div className='flex items-center justify-between p-4'>

            <form onSubmit={handleSearch}>
                <Input placeholder="Search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
            </form>

            <div>
                {/* <EnquiriesFiltersModal /> */}
            </div>


        </div>
    )
}

export default HeaderFilters