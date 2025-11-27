import React, { useState } from 'react'
import EditPencil from './EditPencil'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2, Trash2 } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import toast from 'react-hot-toast'
import { Switch } from "@/components/ui/switch"
import { HandBag02Icon } from 'hugeicons-react'
import HeadingWithLogo from './HeadingWithLogo'
import { cn } from '@/lib/utils'

const formSchema = z.object({
    work_experiences: z.array(
        z.object({
            id: z.string().optional(),
            position: z.string().min(1, "Position is required"),
            company: z.string().min(1, "Company is required"),
            from_date: z.date(),
            to_date: z.date().optional(),
        })
    )
})

function formatDate(date) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options).replace(',', '');
}

const WorkExperience = ({ contact, editMode, updateContact, loading }) => {
    const [open, setOpen] = useState((!contact?.work_experiences || contact?.work_experiences?.length == 0) ? false : true)
    const [editModalOpen, setEditModalOpen] = useState(false)

    return (
        <div className='p-4 border rounded-xl bg-gradient-to-br from-primary/5 to-transparent'>
            <div className='flex justify-between items-center'>

                <HeadingWithLogo
                    title="Work Experience"
                    icon="/images/contact-sections/chair.webp"
                />
                {
                    ((!contact?.work_experiences || contact?.work_experiences?.length == 0) && editMode) ?
                        <Switch
                            checked={open}
                            onCheckedChange={setOpen}
                        />
                        :
                        editMode ? (
                            <div className='w-10 h-10 flex items-center justify-center'>

                                <UpdateModal loading={loading} open={editModalOpen} setOpen={setEditModalOpen} contact={contact} updateContact={updateContact}>
                                    <EditPencil tooltip='Edit Experience' editMode={editMode} onClick={() => setEditModalOpen(true)} />
                                </UpdateModal>
                            </div>
                        ) : (
                            null
                        )
                }
            </div>

            {open && <div className='py-4'>
                {
                    contact?.work_experiences?.length > 0 ? (
                        contact?.work_experiences?.map((v, i, arr) => {
                            return (
                                <div key={i} style={{transform:`translateY(-${8 * i}px)`}} className={cn('flex gap-[10px]')}>
                                    <div className='flex flex-col items-center w-6'>
                                        <div className='w-2 aspect-square translate-y-2 rounded-[1px] rotate-45 bg-[#0088ff]'></div>
                                        {arr.length != (i + 1) && <div className='flex-1 rounded-full w-[2px] bg-[#0088ff]'></div>}
                                    </div>

                                    <div className='flex-1 pb-6'>
                                        <div className='text-gray-800 font-medium capitalize'>{v.position}</div>
                                        <div className='text-sm -translate-y-[2px] text-gray-600 capitalize'>{v.company}</div>
                                        <div className='text-xs -translate-y-[2px] text-gray-500'>{formatDate(v.from_date)} - {v.to_date ? formatDate(v.to_date) : 'Present'}</div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className='flex flex-col items-center justify-center pb-10'>
                            <div className='w-20 mb-4'>
                                <img src="/images/no-data.svg" alt="" />
                            </div>
                            <div className='text-xs text-gray-400 mb-2'>Work Experience Not Added</div>
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
            work_experiences: contact?.work_experiences?.length > 0
                ? contact?.work_experiences.map(exp => ({
                    id: exp.id,
                    position: exp.position,
                    company: exp.company,
                    from_date: exp.from_date ? new Date(exp.from_date) : null,
                    to_date: exp.to_date ? new Date(exp.to_date) : null,
                }))
                : [{ position: "", company: "", from_date: null, to_date: null }]
        }
    })

    const { fields: workFields, append: addMoreWorkExp, remove: removeWorkExp } = useFieldArray({
        control: form.control,
        name: "work_experiences"
    })

    const onSubmit = async (data) => {
        try {
            await updateContact({
                form,
                data: {
                    work_experiences: data.work_experiences
                },
                setOpen
            })
        } catch (error) {
            console.error('Error updating work experience:', error)
            toast.error('Failed to update work experience')
        }
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
                            <DialogTitle>Update Work Experience</DialogTitle>
                        </DialogHeader>
                        <div className='space-y-4 flex-1 overflow-y-auto px-4'>
                            {workFields.map((item, index) => (
                                <div key={item.id} className="border p-4 rounded-2xl bg-white">
                                    <div className='flex justify-between items-center mb-4'>
                                        <div>
                                            <div className='w-6 h-6 text-sm border rounded-full border-black flex justify-center items-center'>
                                                {index + 1}
                                            </div>
                                        </div>

                                        <Button size="icon" variant="outline" type="button" onClick={() => removeWorkExp(index)}>
                                            <Trash2 />
                                        </Button>

                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`work_experiences[${index}].position`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Position</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-white" placeholder="Position" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`work_experiences[${index}].company`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Company</FormLabel>
                                                    <FormControl>
                                                        <Input className="bg-white" placeholder="Company" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`work_experiences[${index}].from_date`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>From Date</FormLabel>
                                                    <FormControl>
                                                        <DatePicker
                                                            disabled={{ after: new Date() }}
                                                            startMonth={new Date(new Date().getFullYear() - 50, 0)}
                                                            endMonth={new Date()}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`work_experiences[${index}].to_date`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>To Date (Optional)</FormLabel>
                                                    <FormControl>
                                                        <DatePicker
                                                            disabled={{ after: new Date() }}
                                                            startMonth={new Date(new Date().getFullYear() - 50, 0)}
                                                            endMonth={new Date()}
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
                                    onClick={() => addMoreWorkExp({ position: "", company: "", from_date: null, to_date: null })}
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

export default WorkExperience