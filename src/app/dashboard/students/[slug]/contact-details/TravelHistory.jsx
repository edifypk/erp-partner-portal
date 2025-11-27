import React, { useContext, useState } from 'react'
import EditPencil from './EditPencil'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataContext } from '@/context/DataContextProvider'
import { cn } from '@/lib/utils'
import { Switch } from "@/components/ui/switch"
import { Airplane01Icon } from 'hugeicons-react'
import flags from 'react-phone-number-input/flags'
import HeadingWithLogo from './HeadingWithLogo'

const formSchema = z.object({
    travel_history: z.array(
        z.object({
            id: z.string().optional(),
            country_iso: z.string().min(1, "Country is required"),
            year: z.number().min(1900, "Year is required"),
            month: z.number().min(1).max(12, "Month must be between 1 and 12"),
            duration: z.string().optional(),
            purpose_of_visit: z.string().optional(),
            visa_type: z.string().optional(),
        })
    )
})

const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
]

const TravelHistory = ({ contact, editMode, updateContact, loading }) => {
    const [open, setOpen] = useState((!contact?.travel_history || contact?.travel_history?.length == 0) ? false : true)
    const [editModalOpen, setEditModalOpen] = useState(false)

    const { getCountries } = useContext(DataContext)
    const countries = getCountries()

    return (
        <div className='p-4 pb-2 border rounded-xl bg-linear-to-br from-primary/5 to-transparent'>
            <div className='flex justify-between items-center mb-2'>
                <HeadingWithLogo
                    title="Travel History"
                    icon="/images/contact-sections/flight.webp"
                />
                {
                    ((!contact?.travel_history || contact?.travel_history?.length == 0) && editMode) ?
                        <Switch
                            checked={open}
                            onCheckedChange={setOpen}
                        />
                        :
                        editMode ? (
                            <div className='w-10 h-10 flex items-center justify-center'>
                                <UpdateModal loading={loading} open={editModalOpen} setOpen={setEditModalOpen} contact={contact} updateContact={updateContact}>
                                    <EditPencil tooltip='Edit Travel History' editMode={editMode} onClick={() => setEditModalOpen(true)} />
                                </UpdateModal>
                            </div>
                        ) : (
                            null
                            // <div className='text-xl'>✈️</div>
                        )
                }
            </div>

            {open && <div className='py-4'>
                {
                    contact?.travel_history?.length > 0 ? (
                        contact?.travel_history?.map((v, i, arr) => {
                            return (
                                <div key={i} style={{transform:`translateY(-${8 * i}px)`}} className={cn('flex gap-[10px]')}>
                                    <div className='flex flex-col items-center w-6'>
                                        <div className='w-2 aspect-square translate-y-2 rounded-[1px] rotate-45 bg-[#0088ff]'></div>
                                        {arr.length != (i + 1) && <div className='flex-1 rounded-full w-[2px] bg-[#0088ff]'></div>}
                                    </div>

                                    <div className='flex-1 pb-6'>
                                        <div className='text-gray-800 font-medium'>{countries.find(c => c.code === v.country_iso)?.name || v.country_iso || 'N/A'}</div>
                                        <div className='text-sm -translate-y-[2px] text-gray-600'>
                                            {months.find(m => m.value === v.month)?.label} {v.year} • {v.duration} • {v.visa_type}
                                        </div>
                                        {v.purpose_of_visit && (
                                            <div className='text-xs -translate-y-[2px] text-gray-500'>{v.purpose_of_visit}</div>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className='flex flex-col items-center justify-center pb-10'>
                            <div className='w-20 mb-4'>
                                <img src="/images/no-data.svg" alt="" />
                            </div>
                            <div className='text-xs text-gray-400 mb-2'>Travel History Not Added</div>
                            {editMode && <UpdateModal loading={loading} open={editModalOpen} setOpen={setEditModalOpen} contact={contact} updateContact={updateContact}>
                                <Button size="sm" variant="outline">Click to Add</Button>
                            </UpdateModal>}
                        </div>
                    )
                }
            </div>}
        </div>
    )
}

const UpdateModal = ({ children, open, setOpen, contact, updateContact, loading }) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            travel_history: contact?.travel_history?.length > 0
                ? contact?.travel_history.map(item => ({
                    id: item.id,
                    country_iso: item.country_iso || '',
                    year: item.year || new Date().getFullYear(),
                    month: item.month || 1,
                    duration: item.duration || "",
                    purpose_of_visit: item.purpose_of_visit || '',
                    visa_type: item.visa_type || '',
                }))
                : [{ country_iso: '', year: new Date().getFullYear(), month: 1, duration: "", purpose_of_visit: '', visa_type: '' }]
        }
    })


    const { getCountries } = useContext(DataContext)
    const countries = getCountries()


    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "travel_history"
    })

    const onSubmit = async (data) => {
        try {
            await updateContact({
                form,
                data: {
                    travel_history: data.travel_history
                },
                setOpen
            })
        } catch (error) {
            console.error('Error updating travel history:', error)
            toast.error('Failed to update travel history')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className='p-0 sm:max-w-4xl bg-gray-100'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col max-h-[90vh]">
                        <DialogHeader className="p-4">
                            <DialogTitle>Update Travel History</DialogTitle>
                        </DialogHeader>
                        <div className='space-y-4 flex-1 overflow-y-auto px-4'>
                            {fields.map((item, index) => (
                                <div key={item.id} className="border p-4 rounded-2xl bg-white">
                                    <div className='flex justify-between items-center mb-4'>
                                        <div>
                                            <div className='w-6 h-6 text-sm border rounded-full border-black flex justify-center items-center'>
                                                {index + 1}
                                            </div>
                                        </div>
                                        <Button size="icon" variant="outline" type="button" onClick={() => remove(index)}>
                                            <Trash2 />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-5 gap-4">


                                        <FormField
                                            control={form.control}
                                            name={`travel_history[${index}].country_iso`}

                                            render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormLabel>Country</FormLabel>
                                                    <Select
                                                        onValueChange={(country) => {
                                                            field.onChange(country)
                                                        }}
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger
                                                                error={form.formState.errors.travel_history?.[index]?.country_iso}
                                                                className="bg-white"
                                                            >
                                                                <SelectValue placeholder="Select Your Country" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                countries?.map((country) => {
                                                                    const Flag = country.code ? flags[country.code] : null;
                                                                    return (
                                                                        <SelectItem key={country.id || country.code} value={country.code}>
                                                                            <div className="flex items-center gap-2 cursor-pointer w-full flex-1">
                                                                                {Flag && <Flag width={20} height={20} />}
                                                                                {country.name}
                                                                            </div>
                                                                        </SelectItem>
                                                                    )
                                                                })
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`travel_history[${index}].month`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Month</FormLabel>
                                                    <Select onValueChange={(val) => field.onChange(parseInt(val))} value={field.value?.toString()}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-white">
                                                                <SelectValue placeholder="Select month" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {months.map((month) => (
                                                                <SelectItem key={month.value} value={month.value.toString()}>
                                                                    {month.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`travel_history[${index}].year`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Year</FormLabel>
                                                    <FormControl>

                                                        <Select onValueChange={(val) => field.onChange(parseInt(val))} value={field.value?.toString()}>
                                                            <SelectTrigger className="bg-white">
                                                                <SelectValue placeholder="Select year" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => 1990 + i).map(year => (
                                                                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>

                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />





                                        <FormField
                                            control={form.control}
                                            name={`travel_history[${index}].duration`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Duration</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="bg-white"
                                                            type="text"
                                                            placeholder="e.g., 2 months, 2 years"
                                                            {...field}
                                                            onChange={(e) => field.onChange(e.target.value || '')}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`travel_history[${index}].visa_type`}
                                            render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormLabel>Visa Type</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-white" placeholder="e.g., Tourist Visa, Student Visa" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`travel_history[${index}].purpose_of_visit`}
                                            render={({ field }) => (
                                                <FormItem className="col-span-3">
                                                    <FormLabel>Purpose of Visit</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-white" placeholder="Tourism, Business, Study" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                </div>
                            ))}

                            <div>
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="outline"
                                    onClick={() => append({ country_iso: '', year: new Date().getFullYear(), month: 1, duration: "", purpose_of_visit: '', visa_type: '' })}
                                >
                                    Add More
                                </Button>
                            </div>
                        </div>

                        <div className='flex justify-end gap-3 p-4'>
                            <Button disabled={loading} size="sm" type='button' variant='outline' onClick={() => setOpen(false)}>Discard</Button>
                            <Button size="sm" type='submit' disabled={loading}>
                                {loading && <Loader2 className='w-4 h-4 animate-spin' />}
                                {loading ? "Updating..." : "Update"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default TravelHistory

