import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const useSearchQuery = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()


    const applySearchQueries = (queries) => {
        const params = new URLSearchParams(searchParams)
        
        queries.forEach(({name, value}) => {
            if (value && value !== '') {
                params.set(name, value)
            } else {
                params.delete(name)
            }
        })
        
        const newQueryString = params.toString()
        const newUrl = newQueryString ? `${pathname}?${newQueryString}` : pathname
        router.replace(newUrl)
    }

    const removeSearchQueries = (queries) => {
        const params = new URLSearchParams(searchParams)
        queries.forEach((name) => {
            params.delete(name)
        })
        const newQueryString = params.toString()
        const newUrl = newQueryString ? `${pathname}?${newQueryString}` : pathname
        router.replace(newUrl)
    }



    return { 
        applySearchQueries,
        removeSearchQueries, 
        CustomSearchParams: searchParams 
    }
}
