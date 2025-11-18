"use client"
import React, { useState } from 'react'
import EditPencil from './EditPencil'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Trash2 } from 'lucide-react'
import SelectEducationLevel from '@/components/crm/Enquiry/SelectEducationLevel'
import { Switch } from "@/components/ui/switch"
import { GraduationScrollIcon } from 'hugeicons-react'


const formSchema = z.object({
    qualifications: z.array(
        z.object({
            id: z.string().optional(),
            edu_level_id: z.string().min(1, "Qualification is required"),
            subject: z.string().min(1, "Subject is required"),
            year_of_completion: z.number().min(1, "Year of completion is required"),
            institute: z.string().min(1, "Institute is required"),
            marks: z.string().min(1, "Marks are required"),
        })
    ),
})

const EducationHistory = ({ contact, editMode, updateContact, loading }) => {
    const [open, setOpen] = useState(contact?.qualifications?.length == 0 ? false : true)
    const [editModalOpen, setEditModalOpen] = useState(false)

    return (
        <div className='px-6 py-4 border rounded-xl bg-gradient-to-br from-primary/5 to-transparent'>

            <div className='flex justify-between items-center'>
                <h2 className='tracking-normal font-semibold flex items-center gap-1'>
                    <GraduationScrollIcon className='-translate-x-1' />
                    Educational History
                </h2>


                {
                    (contact?.qualifications?.length == 0 && editMode) ?
                        <Switch
                            checked={open}
                            onCheckedChange={setOpen}
                        />
                        :
                        editMode ? (
                            <div className='w-10 h-10 flex items-center justify-center'>
                                <UpdateModal loading={loading} open={editModalOpen} setOpen={setEditModalOpen} contact={contact} updateContact={updateContact} >
                                    <EditPencil tooltip='Edit Educational History' editMode={editMode} onClick={() => setEditModalOpen(true)} />
                                </UpdateModal>
                            </div>
                        ) : (
                            null
                            // <img src="/images/icons/education.png" className='w-12' alt="" />
                        )
                }

            </div>



            {open && <div className='py-4'>
                {
                    contact?.qualifications?.length > 0 ? (
                        contact?.qualifications?.map((v, i) => {
                            return (
                                <div key={i} className='flex gap-4'>
                                    <div className='text-xl'>
                                        
                                    </div>

                                    <div className=''>
                                        <div className='text-gray-800 font-medium'>{v.edu_level?.name}</div>
                                        <div className='text-sm text-gray-500 flex gap-[6px] items-center'>
                                            {v.subject}
                                            <span className='w-1 h-1 rounded-full bg-gray-600'></span>
                                            {v.year_of_completion}
                                            <span className='w-1 h-1 rounded-full bg-gray-600'></span>
                                            {v.marks}
                                        </div>
                                        <div className='text-sm text-gray-500'>{v.institute}</div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className='flex flex-col items-center justify-center py-4'>
                            <div className='w-20 mb-4'>
                                <img src="/images/no-data.svg" alt="" />
                            </div>
                            <div className='text-xs text-gray-400 mb-2'>Educational History Not Added</div>
                            {editMode && <UpdateModal loading={loading} open={editModalOpen} setOpen={setEditModalOpen} contact={contact} updateContact={updateContact}>
                                <Button size="sm" variant="outline">Click to Add</Button>
                            </UpdateModal>}
                        </div>
                    )
                }
            </div>}
        </div >
    )
}








const UpdateModal = ({ children, open, setOpen, contact, updateContact, loading }) => {


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            qualifications: contact?.qualifications?.length > 0
                ? contact?.qualifications
                : [{ edu_level_id: "", subject: "", year_of_completion: "", institute: "", marks: "" }]
        }
    })

    const { fields: eduFields, append: addMoreEdu, remove: removeEdu } = useFieldArray({
        control: form.control,
        name: "qualifications"
    })

    const onSubmit = async (data) => {
        await updateContact({
            form,
            data,
            setOpen
        })
    }





    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className='p-0 sm:max-w-3xl bg-gray-100'>


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col max-h-[90vh]">
                        <DialogHeader className="p-4">
                            <DialogTitle>Update Educational History</DialogTitle>
                        </DialogHeader>
                        <div className='space-y-4 flex-1 overflow-y-auto px-4'>
                            {eduFields.map((item, index) => (
                                <div key={item.id} className="border p-4 rounded-2xl bg-white">
                                    <div className='flex justify-between items-center mb-4'>
                                        <div>
                                            <div className='w-6 h-6 text-sm border rounded-full border-black flex justify-center items-center'>
                                                {index + 1}
                                            </div>
                                        </div>
                                        {
                                            eduFields.length > 1 && (
                                                <Button size="icon" variant="outline" type="button" onClick={() => removeEdu(index)}>
                                                    <Trash2 />
                                                </Button>
                                            )
                                        }
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`qualifications[${index}].edu_level_id`}
                                            render={({ field }) => (
                                                <FormItem className='col-span-2'>
                                                    <FormLabel>Qualification</FormLabel>
                                                    <FormControl>
                                                        <SelectEducationLevel field={field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`qualifications[${index}].institute`}
                                            render={({ field }) => (
                                                <FormItem className='col-span-2'>
                                                    <FormLabel>Institute</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-white" placeholder="Institute" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`qualifications[${index}].subject`}
                                            render={({ field }) => (
                                                <FormItem className='col-span-2'>
                                                    <FormLabel>Subject</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-white" placeholder="Subject" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`qualifications[${index}].year_of_completion`}
                                            render={({ field }) => (
                                                <FormItem className='col-span-1'>
                                                    <FormLabel>Year of Completion</FormLabel>
                                                    <FormControl>
                                                        <Select value={Number(field.value)} onValueChange={(value) => field.onChange(Number(value))} defaultValue={Number(field.value)}>
                                                            <SelectTrigger style={{ color: 'black' }} className="bg-white text-black">
                                                                <SelectValue placeholder="Select Year" />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-white">
                                                                {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => 1990 + i).map(year => (
                                                                    <SelectItem style={{ color: 'black' }} key={year} value={year}>{year}</SelectItem>
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
                                            name={`qualifications[${index}].marks`}
                                            render={({ field }) => (
                                                <FormItem className='col-span-1'>
                                                    <FormLabel>Marks</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-white" placeholder="Marks" {...field} />
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
                                    onClick={() => addMoreEdu({ edu_level_id: "", subject: "", year_of_completion: "", institute: "", marks: "" })}
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

export default EducationHistory