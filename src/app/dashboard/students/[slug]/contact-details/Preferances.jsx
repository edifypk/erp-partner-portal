"use client"
import React, { useContext } from 'react'
import EditPencil from './EditPencil'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import SelectSearch from './form/SelectSearch'
import { DataContext } from '@/context/DataContextProvider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import flags from 'react-phone-number-input/flags'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const StudentPreferances = ({ enquiry, editMode, updateEnquiry,loading }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className='p-4 border rounded-xl bg-white'>
            <div className='flex justify-between items-start'>
                <h2 className='tracking-normal font-semibold'>Preferences</h2>
                <div className='w-10 h-10 flex items-center justify-center'>
                    {
                        editMode ? (
                            <UpdateModal loading={loading} open={open} setOpen={setOpen} enquiry={enquiry} updateEnquiry={updateEnquiry}>
                                <EditPencil tooltip='Edit Preferences' editMode={editMode} onClick={() => setOpen(true)} />
                            </UpdateModal>
                        ) : (
                            <img src="/images/icons/idea.png" className='w-12' alt="" />
                        )
                    }
                </div>
            </div>

            <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            className="injected-svg"
                            data-src="https://cdn.hugeicons.com/icons/global-search-twotone-rounded.svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            role="img"
                            color="#2463eb"
                        >
                            <path
                                d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22"
                                stroke="#2463eb"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <path
                                d="M20 5.69899C19.0653 5.76636 17.8681 6.12824 17.0379 7.20277C15.5385 9.14361 14.039 9.30556 13.0394 8.65861C11.5399 7.6882 12.8 6.11636 11.0401 5.26215C9.89313 4.70542 9.73321 3.19045 10.3716 2"
                                stroke="#2463eb"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M2 11C2.7625 11.6621 3.83046 12.2682 5.08874 12.2682C7.68843 12.2682 8.20837 12.7649 8.20837 14.7518C8.20837 16.7387 8.20837 16.7387 8.72831 18.2288C9.06651 19.1981 9.18472 20.1674 8.5106 21"
                                stroke="#2463eb"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                            />
                            <path
                                opacity="0.4"
                                d="M19.8988 19.9288L22 22M21.1083 17.0459C21.1083 19.2805 19.2932 21.0919 17.0541 21.0919C14.8151 21.0919 13 19.2805 13 17.0459C13 14.8114 14.8151 13 17.0541 13C19.2932 13 21.1083 14.8114 21.1083 17.0459Z"
                                stroke="#2463eb"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <div className=''>
                        <div className='text-xs text-gray-500'>
                            Preferred Countries
                        </div>
                        <div className='text-sm text-gray-600 flex items-center'>
                            {enquiry?.preferred_countries?.map(c => c?.country?.name).join(' · ')}
                            {/* {
                                enquiry?.lead_preferred_countries?.map((c, ci) => {
                                    var Flag = flags[c?.offered_country?.iso_code]
                                    return (
                                        <div key={ci} style={{ transform: `translateX(${ci * -3}px)` }} title={c?.offered_country?.name} className='select-none group w-6 h-6  gap-4 border rounded-full overflow-hidden border-gray-300 relative'>

                                            <div className='absolute w-8 h-9 left-1/2 -translate-x-1/2'> <Flag /></div>

                                            <div className="absolute inset-0 bg-white text-[8px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex justify-center items-center">
                                                {c?.offered_country?.short_name}
                                            </div>
                                        </div>
                                    )
                                })
                            } */}
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            className="injected-svg"
                            data-src="https://cdn.hugeicons.com/icons/city-01-twotone-rounded.svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            role="img"
                            color="#2463eb"
                        >
                            <path
                                d="M14 8H10C7.518 8 7 8.518 7 11V22H17V11C17 8.518 16.482 8 14 8Z"
                                stroke="#2463eb"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M11 12L13 12M11 15H13M11 18H13"
                                stroke="#2463eb"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                opacity="0.4"
                                d="M21 22V8.18564C21 6.95735 21 6.3432 20.7013 5.84966C20.4026 5.35612 19.8647 5.08147 18.7889 4.53216L14.4472 2.31536C13.2868 1.72284 13 1.93166 13 3.22873V7.7035"
                                stroke="#2463eb"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                opacity="0.4"
                                d="M3 22V13C3 12.1727 3.17267 12 4 12H7"
                                stroke="#2463eb"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M22 22H2"
                                stroke="#2463eb"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div className=''>
                        <div className='text-xs text-gray-500'>
                            Preferred City
                        </div>
                        <div className='text-sm text-gray-600'>
                            {enquiry?.preferred_city}
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            className="injected-svg"
                            data-src="https://cdn.hugeicons.com/icons/book-open-02-twotone-rounded.svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            role="img"
                            color="#2463eb"
                        >
                            <path
                                d="M16.6127 16.0846C13.9796 17.5677 12.4773 20.6409 12 21.5V8C12.4145 7.25396 13.602 5.11646 15.6317 3.66368C16.4868 3.05167 16.9143 2.74566 17.4572 3.02468C18 3.30371 18 3.91963 18 5.15146V13.9914C18 14.6568 18 14.9895 17.8634 15.2233C17.7267 15.4571 17.3554 15.6663 16.6127 16.0846L16.6127 16.0846Z"
                                stroke="#2463eb"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                opacity="0.4"
                                d="M12 7.80556C11.3131 7.08403 9.32175 5.3704 5.98056 4.76958C4.2879 4.4652 3.44157 4.31301 2.72078 4.89633C2 5.47965 2 6.42688 2 8.32133V15.1297C2 16.8619 2 17.728 2.4626 18.2687C2.9252 18.8095 3.94365 18.9926 5.98056 19.3589C7.79633 19.6854 9.21344 20.2057 10.2392 20.7285C11.2484 21.2428 11.753 21.5 12 21.5C12.247 21.5 12.7516 21.2428 13.7608 20.7285C14.7866 20.2057 16.2037 19.6854 18.0194 19.3589C20.0564 18.9926 21.0748 18.8095 21.5374 18.2687C22 17.728 22 16.8619 22 15.1297V8.32133C22 6.42688 22 5.47965 21.2792 4.89633C20.7721 4.4859 19.8502 4.59028 19 4.94264C18.6418 5.09107 18.2964 5.28351 18 5.5"
                                stroke="#2463eb"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div className=''>
                        <div className='text-xs text-gray-500'>
                            Preferred Course
                        </div>
                        <div className='text-sm text-gray-600'>
                            {enquiry?.preferred_course}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default StudentPreferances






const formSchema = z.object({
    preferred_countries: z.array(z.string()).min(1, "At least one preferred country is required"),
    preferred_course: z.string().optional(),
    preferred_city: z.string().optional(),
})


const UpdateModal = ({ children, open, setOpen, enquiry, updateEnquiry,loading }) => {


    const { getOfferedCountries } = useContext(DataContext)
    const offeredCountries = getOfferedCountries({ limit: 50 })


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            preferred_countries: enquiry?.preferred_countries?.map(c => c?.country_id),
            preferred_course: enquiry?.preferred_course || "",
            preferred_city: enquiry?.preferred_city || "",
        }
    })

    const onSubmit = async (data) => {
        await updateEnquiry({
            form,
            data,
            setOpen
        })
    }

    // console.log(offeredCountries?.map(c => console.log(c?.iso_code)))


    return (
        <Dialog open={open} onOpenChange={setOpen}>


            <DialogTrigger asChild>
                {children}
            </DialogTrigger>


            <DialogContent className='sm:max-w-3xl bg-gray-100'>



                <DialogHeader>
                    <DialogTitle>Update Sources</DialogTitle>
                </DialogHeader>




                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">


                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name="preferred_countries"
                                render={() => (
                                    <FormItem className="col-span-2">
                                        <div className="mb-4">
                                            <FormLabel>Preferred Countries</FormLabel>
                                            <FormDescription>
                                                Select the countries where you want to study abroad.
                                            </FormDescription>
                                        </div>
                                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
                                            {offeredCountries.map((item, i) => (
                                                <FormField
                                                    key={item.id}
                                                    className="border"
                                                    control={form.control}
                                                    name="preferred_countries"
                                                    render={({ field }) => {
                                                        var Flag = flags[item?.iso_code]
                                                        return (
                                                            <FormItem
                                                                key={item.id}
                                                                className={cn("flex border p-2 rounded-md border-gray-300 border-dotted bg-gray-50 flex-row items-center space-x-2 space-y-0", field.value?.includes(item.id) && 'bg-blue-50 border-blue-600')}
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, item.id])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== item.id
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel>
                                                                    <div className={cn('flex items-center gap-1')}>
                                                                       <div className='w-6 border rounded-sm overflow-hidden h-4'><Flag /></div>
                                                                        <div className='text-xs tracking-tight'>{item.name}</div>
                                                                    </div>
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="preferred_course"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preferred Course</FormLabel>
                                        <FormControl>
                                            <Input className="bg-white" placeholder="Preferred Course" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="preferred_city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preferred City</FormLabel>
                                        <FormControl>
                                            <Input className="bg-white" placeholder="Preferred City" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex justify-end mt-4 gap-3'>
                            <Button disabled={loading} size="sm" type='button' variant='outline' onClick={() => setOpen(false)}>Discard</Button>
                            <Button size="sm" type='submit' disabled={loading}>
                                { loading && <Loader2 className='w-4 h-4 animate-spin' /> }
                                { loading ? "Updating..." : "Update"}
                            </Button>
                        </div>



                    </form>
                </Form>




            </DialogContent>


        </Dialog>
    )
}