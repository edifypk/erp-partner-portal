"use client"
import React, { useState } from 'react'
import EditPencil from './EditPencil'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Trash2 } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Alert02Icon } from 'hugeicons-react'
import { DatePicker } from '@/components/ui/date-picker'
import HeadingWithLogo from './HeadingWithLogo'

const formSchema = z.object({
    education_gaps: z.array(
        z.object({
            id: z.string().optional(),
            from_date: z.date({
                required_error: "From date is required",
            }),
            to_date: z.date().optional(),
            reason: z.string().min(1, "Reason is required"),
        })
    ),
})

function formatDate(date) {
    if (!date) return 'Present';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options).replace(',', '');
}

const EducationGap = ({ contact, editMode, updateContact, loading }) => {
    const [open, setOpen] = useState((!contact?.education_gaps || contact?.education_gaps?.length == 0) ? false : true)
    const [editModalOpen, setEditModalOpen] = useState(false)

    return (
        <div className='p-4 border rounded-xl bg-linear-to-br from-primary/5 to-transparent'>

            <div className='flex justify-between items-center'>

                <HeadingWithLogo
                    title="Education Gap"
                    icon="/images/contact-sections/info.webp"
                />

                {
                    ((!contact?.education_gaps || contact?.education_gaps?.length == 0) && editMode) ?
                        <Switch
                            checked={open}
                            onCheckedChange={setOpen}
                        />
                        :
                        editMode ? (
                            <div className='w-10 h-10 flex items-center justify-center'>
                                <UpdateModal loading={loading} open={editModalOpen} setOpen={setEditModalOpen} contact={contact} updateContact={updateContact} >
                                    <EditPencil tooltip='Edit Education Gap' editMode={editMode} onClick={() => setEditModalOpen(true)} />
                                </UpdateModal>
                            </div>
                        ) : (
                            null
                        )
                }

            </div>



            {open && <div className='py-4'>
                {
                    contact?.education_gaps && contact?.education_gaps?.length > 0 ? (
                        contact?.education_gaps?.map((v, i, arr) => {
                            return (
                                <div key={i} style={{transform:`translateY(-${8 * i}px)`}} className={'flex gap-[10px]'}>
                                    <div className='flex flex-col items-center w-6'>
                                        <div className='w-2 aspect-square translate-y-2 rounded-[1px] rotate-45 bg-[#0088ff]'></div>
                                        {arr.length != (i + 1) && <div className='flex-1 rounded-full w-[2px] bg-[#0088ff]'></div>}
                                    </div>

                                    <div className='flex-1 pb-6 tracking-tight'>
                                        <div className='text-gray-800 font-medium flex gap-[6px] items-center mb-1'>
                                            {formatDate(v.from_date)} - {v.to_date ? formatDate(v.to_date) : 'Present'}
                                        </div>
                                        <div className='text-sm text-gray-500'>{v.reason}</div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className='flex flex-col items-center justify-center py-4'>
                            <div className='w-20 mb-4'>
                                <img src="/images/no-data.svg" alt="" />
                            </div>
                            <div className='text-xs text-gray-400 mb-2'>Education Gap Not Added</div>
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
            education_gaps: contact?.education_gaps?.length > 0
                ? contact?.education_gaps.map(gap => ({
                    ...gap,
                    from_date: gap.from_date ? new Date(gap.from_date) : undefined,
                    to_date: gap.to_date ? new Date(gap.to_date) : undefined,
                }))
                : [{ from_date: undefined, to_date: undefined, reason: "" }]
        }
    })

    const { fields: gapFields, append: addMoreGap, remove: removeGap } = useFieldArray({
        control: form.control,
        name: "education_gaps"
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
                            <DialogTitle>Update Education Gap</DialogTitle>
                        </DialogHeader>
                        <div className='space-y-4 flex-1 overflow-y-auto px-4'>
                            {gapFields.map((item, index) => (
                                <div key={item.id} className="border p-4 rounded-2xl bg-white">
                                    <div className='flex justify-between items-center mb-4'>
                                        <div>
                                            <div className='w-6 h-6 text-sm border rounded-full border-black flex justify-center items-center'>
                                                {index + 1}
                                            </div>
                                        </div>
                                        {
                                            gapFields.length > 1 && (
                                                <Button size="icon" variant="outline" type="button" onClick={() => removeGap(index)}>
                                                    <Trash2 />
                                                </Button>
                                            )
                                        }
                                    </div>
                                    <div className="grid grid-cols-12 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`education_gaps[${index}].from_date`}
                                            render={({ field }) => (
                                                <FormItem className='col-span-6'>
                                                    <FormLabel>From Date</FormLabel>
                                                    <FormControl>
                                                        <DatePicker
                                                            error={form.formState.errors?.education_gaps?.[index]?.from_date}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`education_gaps[${index}].to_date`}
                                            render={({ field }) => (
                                                <FormItem className='col-span-6'>
                                                    <FormLabel>To Date (Optional)</FormLabel>
                                                    <FormControl>
                                                        <DatePicker
                                                            error={form.formState.errors?.education_gaps?.[index]?.to_date}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`education_gaps[${index}].reason`}
                                            render={({ field }) => (
                                                <FormItem className='col-span-12'>
                                                    <FormLabel>Reason</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            className="bg-white"
                                                            placeholder="Reason for gap"
                                                            {...field}
                                                        />
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
                                    onClick={() => addMoreGap({ from_date: undefined, to_date: undefined, reason: "" })}
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

export default EducationGap

