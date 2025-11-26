import React, { useState, useContext } from 'react'
import EditPencil from './EditPencil'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataContext } from '@/context/DataContextProvider'
import { Loader2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import SelectEnglishTest from '@/components/select/SelectEnglishTest'
import { DatePicker } from '@/components/ui/date-picker'
import { formatDate } from '@/utils/functions'
import { Calendar02Icon, Calendar03Icon, ComputerIcon, HeadphonesIcon, KeyboardIcon, LanguageSkillIcon, Mic01Icon, SummationSquareIcon } from 'hugeicons-react'
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
    english_tests: z.array(
        z.object({
            id: z.string().optional(),
            test_id: z.string().min(1, "Test name is required"),
            exam_date: z.date(),
            overall_marks: z.number().min(1, "Overall marks are required"),
            listening_marks: z.number().min(1, "Listening marks are required"),
            reading_marks: z.number().min(1, "Reading marks are required"),
            writing_marks: z.number().min(1, "Writing marks are required"),
            speaking_marks: z.number().min(1, "Speaking marks are required"),
        })
    )
})

const EnglishTests = ({ contact, editMode, updateContact, loading }) => {
    const [open, setOpen] = useState(contact?.english_tests?.length == 0 ? false : true)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const { getEnglishTests } = useContext(DataContext)
    const englishTests = getEnglishTests()

    return (
        <div className='p-6 py-4 border rounded-xl bg-gradient-to-br from-primary/5 to-transparent'>
            <div className='flex justify-between items-center'>
                <h2 className='tracking-normal font-semibold flex items-center gap-1'>
                    <LanguageSkillIcon className='-translate-x-1' />
                    English Tests
                </h2>
                {
                    (contact?.english_tests?.length == 0 && editMode) ?
                        <Switch
                            checked={open}
                            onCheckedChange={setOpen}
                        />
                        :
                        editMode ? (
                            <div className='w-10 h-10 flex items-center justify-center'>
                                <UpdateModal
                                    loading={loading}
                                    open={editModalOpen}
                                    setOpen={setEditModalOpen}
                                    contact={contact}
                                    updateContact={updateContact}
                                    englishTests={englishTests}
                                >
                                    <EditPencil tooltip='Edit English Tests' editMode={editMode} onClick={() => setEditModalOpen(true)} />
                                </UpdateModal>
                            </div>
                        ) : (
                            null
                        )

                }
            </div>

            {open && <div className='space-y-6 mt-4'>
                {
                    contact?.english_tests?.length > 0 ? (
                        contact?.english_tests?.map((item, index) => (
                            <div key={index} className=''>
                                <div className="flex justify-between items-center mb-4">

                                    <div className='text-sm font-medium flex items-center gap-2'>
                                        <img className="w-6 h-6 rounded-full" src={item?.test?.logo_url || "/images/placeholder/image.png"} alt="" />
                                        {item?.test?.name}
                                    </div>

                                    <div className='flex items-center gap-1'>
                                        <div>
                                            <div className='text-[10px] text-gray-500 leading-[9px]'>Exam Date </div>
                                            <div className='text-xs font-medium'>{formatDate(item?.exam_date)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">

                                    <div className='flex items-center gap-2 border border-gray-300 bg-primary/5 border-dotted rounded-md p-2'>
                                        <div>
                                            <SummationSquareIcon size={20} strokeWidth={1} className='text-neutral-500' />
                                        </div>
                                        <div>
                                            <div className='font-medium text-gray-600 text-sm'>{item?.overall_marks}</div>
                                            <div className='text-[10px] text-gray-500'>Overall</div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 border border-gray-300 bg-primary/5 border-dotted rounded-md p-2'>
                                        <div>
                                            <HeadphonesIcon size={20} strokeWidth={1} className='text-neutral-500' />
                                        </div>
                                        <div>
                                            <div className='font-medium text-gray-600 text-sm'>{item?.listening_marks}</div>
                                            <div className='text-[10px] text-gray-500'>Listening</div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 border border-gray-300 bg-primary/5 border-dotted rounded-md p-2'>
                                        <div>
                                            <ComputerIcon size={20} strokeWidth={1} className='text-neutral-500' />
                                        </div>
                                        <div>
                                            <div className='font-medium text-gray-600 text-sm'>{item?.reading_marks}</div>
                                            <div className='text-[10px] text-gray-500'>Reading</div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 border border-gray-300 bg-primary/5 border-dotted rounded-md p-2'>
                                        <div>
                                            <KeyboardIcon size={20} strokeWidth={1} className='text-neutral-500' />
                                        </div>
                                        <div>
                                            <div className='font-medium text-gray-600 text-sm'>{item?.writing_marks}</div>
                                            <div className='text-[10px] text-gray-500'>Writing</div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 border border-gray-300 bg-primary/5 border-dotted rounded-md p-2'>
                                        <div>
                                            <Mic01Icon size={20} strokeWidth={1} className='text-neutral-500' />
                                        </div>
                                        <div>
                                            <div className='font-medium text-gray-600 text-sm'>{item?.speaking_marks}</div>
                                            <div className='text-[10px] text-gray-500'>Speaking</div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='flex flex-col items-center justify-center pb-10'>
                            <div className='w-20 mb-4'>
                                <img src="/images/no-data.svg" alt="" />
                            </div>
                            <div className='text-xs text-gray-400 mb-2'>English Tests Not Added</div>
                            {editMode && <UpdateModal
                                loading={loading}
                                open={editModalOpen}
                                setOpen={setEditModalOpen}
                                contact={contact}
                                updateContact={updateContact}
                                englishTests={englishTests}
                            >
                                <Button size="sm" variant="outline">Click to Add</Button>
                            </UpdateModal>}
                        </div>
                    )
                }
            </div>}

        </div>
    )
}

const UpdateModal = ({ children, open, setOpen, contact, updateContact, englishTests, loading }) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            english_tests: contact?.english_tests?.length > 0
                ? contact.english_tests.map(test => ({
                    id: test.id,
                    test_id: test.test_id,
                    exam_date: test.exam_date ? new Date(test.exam_date) : null,
                    overall_marks: test.overall_marks,
                    listening_marks: test.listening_marks,
                    reading_marks: test.reading_marks,
                    writing_marks: test.writing_marks,
                    speaking_marks: test.speaking_marks,
                }))
                : [{ test_id: "", exam_date: "", overall_marks: 0, listening_marks: 0, reading_marks: 0, writing_marks: 0, speaking_marks: 0 }]
        }
    })

    const { fields: englishTestFields, append: addMoreEnglishTest, remove: removeEnglishTest } = useFieldArray({
        control: form.control,
        name: "english_tests"
    })

    const onSubmit = async (data) => {
        try {
            await updateContact({
                form,
                data: {
                    english_tests: data.english_tests
                },
                setOpen
            })
        } catch (error) {
            console.error('Error updating English tests:', error)
            toast.error('Failed to update English tests')
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
                            <DialogTitle>Update English Tests</DialogTitle>
                        </DialogHeader>
                        <div className='space-y-4 flex-1 overflow-y-auto px-4'>
                            {englishTestFields.map((item, index) => (
                                <div key={item.id} className="border p-4 rounded-2xl bg-white">
                                    <div className='flex justify-between items-center mb-4'>
                                        <div>
                                            <div className='w-6 h-6 text-sm border rounded-full border-black flex justify-center items-center'>
                                                {index + 1}
                                            </div>
                                        </div>

                                        <Button size="icon" variant="outline" type="button" onClick={() => removeEnglishTest(index)}>
                                            <Trash2 />
                                        </Button>

                                    </div>
                                    <div className="grid sm:grid-cols-12 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`english_tests[${index}].test_id`}
                                            render={({ field }) => (
                                                <FormItem className="sm:col-span-4">
                                                    <FormLabel>Test Name</FormLabel>
                                                    <FormControl>
                                                        <SelectEnglishTest
                                                            field={field}
                                                            error={form.formState.errors?.english_tests?.[index]?.test_id}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`english_tests[${index}].exam_date`}
                                            render={({ field }) => (
                                                <FormItem className="sm:col-span-4">
                                                    <FormLabel>Exam Date</FormLabel>
                                                    <FormControl>
                                                        <DatePicker
                                                            disabled={{
                                                                before: new Date(new Date().getFullYear() - 2, new Date().getMonth(), new Date().getDate() + 1),
                                                                after: new Date()
                                                            }}
                                                            startMonth={new Date(new Date().getFullYear() - 2, new Date().getMonth())}
                                                            endMonth={new Date(new Date().getFullYear(), new Date().getMonth())}
                                                            error={form.formState.errors?.english_tests?.[index]?.exam_date}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`english_tests[${index}].overall_marks`}
                                            render={({ field }) => (
                                                <FormItem className="sm:col-span-4">
                                                    <FormLabel>Overall Marks</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            error={form.formState.errors?.english_tests?.[index]?.overall_marks}
                                                            placeholder="Overall Marks"
                                                            {...field}
                                                            type="number"
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`english_tests[${index}].listening_marks`}
                                            render={({ field }) => (
                                                <FormItem className="sm:col-span-3">
                                                    <FormLabel>Listening Marks</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            error={form.formState.errors?.english_tests?.[index]?.listening_marks}
                                                            placeholder="Listening Marks"
                                                            {...field}
                                                            type="number"
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`english_tests[${index}].reading_marks`}
                                            render={({ field }) => (
                                                <FormItem className="sm:col-span-3">
                                                    <FormLabel>Reading Marks</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            error={form.formState.errors?.english_tests?.[index]?.reading_marks}
                                                            placeholder="Reading Marks"
                                                            {...field}
                                                            type="number"
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`english_tests[${index}].writing_marks`}
                                            render={({ field }) => (
                                                <FormItem className="sm:col-span-3">
                                                    <FormLabel>Writing Marks</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            error={form.formState.errors?.english_tests?.[index]?.writing_marks}
                                                            placeholder="Writing Marks"
                                                            {...field}
                                                            type="number"
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`english_tests[${index}].speaking_marks`}
                                            render={({ field }) => (
                                                <FormItem className="sm:col-span-3">
                                                    <FormLabel>Speaking Marks</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            error={form.formState.errors?.english_tests?.[index]?.speaking_marks}
                                                            placeholder="Speaking Marks"
                                                            {...field}
                                                            type="number"
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                                                        />
                                                    </FormControl>
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
                                    onClick={() => addMoreEnglishTest({ test_id: "", overall_marks: 0, listening_marks: 0, reading_marks: 0, writing_marks: 0, speaking_marks: 0 })}
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

export default EnglishTests