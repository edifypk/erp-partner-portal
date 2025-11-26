import React, { useState } from 'react'
import EditPencil from './EditPencil'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useData } from '@/context/DataContextProvider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from "@/components/ui/switch"
import { AiUserIcon } from 'hugeicons-react'
import flags from 'react-phone-number-input/flags'

const formSchema = z.object({
    abroad_relatives: z.array(
        z.object({
            id: z.string().optional(),
            country_iso: z.string().min(1, "Country is required"),
            name: z.string().min(1, "Name is required"),
            relation: z.string().min(1, "Relation is required"),
            status_in_country: z.string().optional(),
            remarks: z.string().optional(),
        })
    )
})

const AbroadRelatives = ({ contact, editMode, updateContact, loading }) => {
    const [open, setOpen] = useState(contact?.abroad_relatives?.length == 0 ? false : true)
    const [editModalOpen, setEditModalOpen] = useState(false)

    const { getCountries } = useData()
    const countries = getCountries()

    return (
        <div className='px-6 pt-4 pb-2 border rounded-xl bg-gradient-to-br from-primary/5 to-transparent'>
            <div className='flex justify-between items-center mb-2'>
                <h2 className='tracking-normal font-semibold flex items-center gap-1'>
                    <AiUserIcon className='-translate-x-1' />
                    Relatives Abroad
                </h2>
                {
                    (contact?.abroad_relatives?.length == 0 && editMode) ?
                        <Switch
                            checked={open}
                            onCheckedChange={setOpen}
                        />
                        :
                        editMode ? (
                            <div className='w-10 h-10 flex items-center justify-center'>
                                <UpdateModal loading={loading} open={editModalOpen} setOpen={setEditModalOpen} contact={contact} updateContact={updateContact}>
                                    <EditPencil tooltip='Edit Relatives Abroad' editMode={editMode} onClick={() => setEditModalOpen(true)} />
                                </UpdateModal>
                            </div>
                        ) : (
                            null
                            // <div className='text-xl'>👤</div>
                        )
                }
            </div>

            {open && <div className=''>
                {
                    contact?.abroad_relatives?.length > 0 ? (
                        contact?.abroad_relatives?.map((v, i) => {
                            return (
                                <div key={i} className='flex gap-6 relative'>
                                    <div className='flex flex-col items-center gap-1'>
                                        <div className='text-xsl'>
                                            
                                        </div>
                                        {
                                            (contact?.abroad_relatives?.length != (i + 1)) &&
                                            <div className='w-[2px] rounded-full flex-1 bg-[#e8e8e8]'></div>
                                        }
                                    </div>

                                    <div className='pb-6'>
                                        <div className='text-gray-800 font-medium'>{countries.find(c => c.code === v.country_iso)?.name || v.country_iso || 'N/A'}</div>
                                        <div className='text-sm -translate-y-[2px] text-gray-600'>
                                            {v.name} • {v.relation} • {v.status_in_country}
                                        </div>
                                        {v.remarks && (
                                            <div className='text-xs -translate-y-[2px] text-gray-500'>{v.remarks}</div>
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
                            <div className='text-xs text-gray-400 mb-2'>Relatives Abroad Not Added</div>
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


    const { getCountries } = useData()
    const countries = getCountries()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            abroad_relatives: contact?.abroad_relatives?.length > 0
                ? contact?.abroad_relatives.map(item => ({
                    id: item.id,
                    country_iso: item.country_iso || '',
                    name: item.name || '',
                    relation: item.relation || '',
                    status_in_country: item.status_in_country || '',
                    remarks: item.remarks || '',
                }))
                : [{ country_iso: '', name: '', relation: '', status_in_country: '', remarks: '' }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "abroad_relatives"
    })

    const onSubmit = async (data) => {
        try {
            await updateContact({
                form,
                data: {
                    abroad_relatives: data.abroad_relatives
                },
                setOpen
            })
        } catch (error) {
            console.error('Error updating relatives abroad:', error)
            toast.error('Failed to update relatives abroad')
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
                            <DialogTitle>Update Relatives Abroad</DialogTitle>
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
                                    <div className="grid grid-cols-6 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`abroad_relatives[${index}].country_iso`}

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
                                                                error={form.formState.errors.abroad_relatives?.[index]?.country_iso}
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
                                            name={`abroad_relatives[${index}].name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-white" placeholder="Name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`abroad_relatives[${index}].relation`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Relation</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-white" placeholder="e.g. Brother" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`abroad_relatives[${index}].status_in_country`}
                                            render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormLabel>Status in Country</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-white" placeholder="e.g. Citizen, PR" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`abroad_relatives[${index}].remarks`}
                                            render={({ field }) => (
                                                <FormItem className="col-span-6">
                                                    <FormLabel>Remarks</FormLabel>
                                                    <FormControl>
                                                        <Textarea className="bg-white" placeholder="Additional remarks..." {...field} />
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
                                    onClick={() => append({ country_iso: '', name: '', relation: '', status_in_country: '', remarks: '' })}
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

export default AbroadRelatives

