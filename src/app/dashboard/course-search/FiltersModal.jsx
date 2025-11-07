"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import SelectInstitute from './SelectInstitute'
import { useQuery } from '@tanstack/react-query'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SlidersHorizontal } from 'lucide-react'
import PreferredCountrySelect from '@/components/PreferredCountrySelect'
import SelectEducationLevel from '@/components/crm/Enquiry/SelectEducationLevel'


const FiltersModal = ({ filters, setFilters, applyFilters, clearFilters }) => {



    const { data: tags } = useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            var res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/course-finder/program-tags`)
            return res?.data?.data
        }
    })

    const countAppliedFilters = () => {
        var tempFiilters = filters
        delete tempFiilters.keyword

        const count = Object.values(tempFiilters).filter(value => value && value !== '' && value?.length > 0).length
        return count > 0 ? count : 0
    }




    return (
        <Dialog>


            <DialogTrigger asChild>
                <div variant="outline" size="sm" className="font-normal bg-background relative dark:text-neutral-300 border flex gap-2 text-sm px-2 py-[6px] shadow-sm cursor-pointer rounded-md items-center">
                    <SlidersHorizontal size={15} className='text-gray-400' />
                    Filters

                    {countAppliedFilters() > 0 && <div className="absolute animate-bounce -top-2 -right-2 w-5 h-5 flex justify-center items-center border rounded-full bg-blue-600 text-white text-xs">
                        {countAppliedFilters()}
                    </div>}
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl">


                <DialogHeader>
                    <DialogTitle>Filters</DialogTitle>
                </DialogHeader>

                <PreferredCountrySelect
                    field={{
                        onChange: (value) => {
                            setFilters(prevFilter => ({ ...prevFilter, country_id: value, institute_id: "" }))
                        },
                        value: filters.country_id
                    }}
                />


                <SelectInstitute
                    field={
                        {
                            value: filters.institute_id,
                            onChange: (value) => {
                                setFilters(prevFilter => ({ ...prevFilter, institute_id: value }))
                            }
                        }
                    }
                    filters={{ country_id: filters.country_id }}
                    placeholder="Select Institute"
                />


                <SelectEducationLevel
                    field={
                        {
                            value: filters.level_id,
                            onChange: (value) => {
                                setFilters(prevFilter => ({ ...prevFilter, level_id: value }))
                            }
                        }
                    }
                    placeholder="Select Education Level"
                />



                <div className='flex justify-between'>
                    <Button size="sm" variant="outline" onClick={clearFilters}>Clear All</Button>
                    <DialogClose asChild>
                        <Button size="sm" onClick={applyFilters}>Apply Filters</Button>
                    </DialogClose>
                </div>

            </DialogContent>

        </Dialog>
    )
}

export default FiltersModal
