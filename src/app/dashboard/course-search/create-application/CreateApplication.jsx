"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Task01Icon } from 'hugeicons-react'
import flags from 'react-phone-number-input/flags'
import { X } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@radix-ui/themes'
import icons from '@/utils/icons'
import axios from 'axios'
import { toast } from 'sonner'
import SelectStudent from '@/components/select/SelectStudent'
import { useAuth } from '@/context/AuthContextProvider'
import Link from 'next/link'


const applicationSchema = z.object({
    student_id: z.string().min(1, "Student is required"),
    program_id: z.string().min(1, "Course is required"),
    intake_month: z.string().min(1, "Intake month is required"),
    intake_year: z.number().min(new Date().getFullYear(), "Invalid year"),
});


const months = [
    { no: 1, label: "January", value: "jan" },
    { no: 2, label: "February", value: "feb" },
    { no: 3, label: "March", value: "mar" },
    { no: 4, label: "April", value: "apr" },
    { no: 5, label: "May", value: "may" },
    { no: 6, label: "June", value: "jun" },
    { no: 7, label: "July", value: "jul" },
    { no: 8, label: "August", value: "aug" },
    { no: 9, label: "September", value: "sep" },
    { no: 10, label: "October", value: "oct" },
    { no: 11, label: "November", value: "nov" },
    { no: 12, label: "December", value: "dec" },
];

const CreateApplication = ({ course, student_id }) => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    var Flag = flags[course?.institute?.country?.iso_code]

    const { agentData } = useAuth()


    const form = useForm({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            student_id: student_id || "",
            program_id: course?.id,
            intake_month: "",
            intake_year: new Date().getFullYear(),
        }
    });

    const onSubmit = async (data) => {
        setLoading(true)
        const submitPromise = new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/applications`,
                    data,
                    {
                        withCredentials: true
                    }
                );

                if (res.status === 201) {
                    resolve(res.data); // Resolve promise to show success toast
                    setOpen(false)
                    form.reset()
                }
            } catch (error) {
                if (error.response.status === 400) {
                    if (error.response?.data?.error) {
                        form.setError(error.response?.data?.error?.path, { message: error.response?.data?.error?.message }, { shouldFocus: true });
                    }
                }
                reject(error); // Reject promise to show error toast
            } finally {
                setLoading(false)
            }
        });

        toast.promise(
            submitPromise,
            {
                loading: "Creating Application Request...",
                success: () => `Application Request Created successfully`, // Customize success message
                error: (err) => err?.response?.data?.message || err.message, // Display error from the backend or default message
            }
        );
    };



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className='flex items-center gap-1 active:scale-90 transition-all duration-300 cursor-pointer hover:bg-primary hover:text-white bg-background text-primary border rounded-full p-2'>
                    <Task01Icon size={15} />
                    <div className='text-xs font-medium'>Create Application</div>
                </div>
            </DialogTrigger>
            <DialogContent
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
                style={{ borderRadius: "17px" }}
                className='sm:max-w-3xl p-0 border border-white/30 bg-white/5 [&>button]:hidden'
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>Create Application Request</DialogTitle>
                </DialogHeader>


                <>

                    {
                        agentData?.onboarding_status == 'approved' ?
                            <div className='bg-white rounded-2xl'>

                                <div className='h-56'>


                                    <div className="h-40 w-full rounded-t-2xl overflow-hidden mb-4 bg-gray-100 relative">
                                        <img initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.5 }} onError={(e) => {
                                            e.target.src = "/images/placeholder/image.png"
                                        }} src={course?.institute?.banner_url || "/images/placeholder/image.png"} alt={course?.institute?.name} className="w-full h-full object-cover" />


                                        <div className="absolute top-4 left-4 border border-black/10 bg-white/70 text-black font-medium  backdrop-blur-md text-xs px-2 py-1 rounded-full flex items-center gap-2">
                                            <Flag width={20} height={20} /> {course?.institute?.country?.short_name}
                                        </div>


                                    </div>



                                    <div className='flex items-start gap-2 mt-2 -translate-y-10 pl-6'>
                                        <div>
                                            <div className='h-16 w-16 rounded-full border overflow-hidden bg-white shadow-md'>
                                                {
                                                    course?.institute?.logo ?
                                                        <img initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 1 }} src={course?.institute?.logo_url} alt={course?.institute?.name} className="w-full h-full object-cover" />
                                                        :
                                                        <div className='w-full h-full flex justify-center items-center'>
                                                            <div className='text-xs text-black/60 font-medium whitespace-nowrap'>{course?.institute?.name.slice(0, 2).toUpperCase()}</div>
                                                        </div>
                                                }

                                            </div>
                                        </div>
                                        <h2 className="text-sm font-medium line-clamp-2 pt-7">{course?.institute?.name}</h2>

                                    </div>

                                </div>


                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid items-center grid-cols-12 gap-4 p-6">

                                        <div className='-translate-y-4 col-span-12'>
                                            <div className='text-xs mb-1 text-black/60 font-medium whitespace-nowrap'>{course.program_level?.name}</div>
                                            <div className='font-semibold line-clamp-3'>
                                                {course?.name}
                                            </div>

                                            {course?.tags?.length > 0 && <div className='flex gap-2 flex-wrap text-xs mt-2'>
                                                {
                                                    course?.tags?.map((t, index) => {
                                                        var Icon = icons[t?.tag?.icon]
                                                        return (
                                                            <Badge variant="soft" style={{ borderRadius: "15px", padding: "4px 6px", gap: "4px" }} color={t?.tag?.color} key={index}>
                                                                <Icon size={12} />
                                                                {t?.tag?.name}
                                                            </Badge>
                                                        )
                                                    })
                                                }
                                            </div>}
                                        </div>


                                        <div className='col-span-6'>
                                            <FormField
                                                control={form.control}
                                                name="student_id"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>Student</FormLabel>
                                                        <FormControl>
                                                            <SelectStudent
                                                                error={form.formState.errors.student_id}
                                                                placeholder="Select Student"
                                                                filters={{}}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                pathname="/sub-agents/students/search"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>


                                        <div className='col-span-6 flex flex-col space-y-[2px]'>
                                            <FormLabel className={cn("col-span-2 text-xs",
                                                form.formState.errors.intake_month && "text-red-500",
                                                form.formState.errors.intake_year && "text-red-500"
                                            )}>Intake</FormLabel>
                                            <div className={cn('grid grid-cols-2 gap-2 border border-gray-200 p-1 rounded-md',
                                                form.formState.errors.intake_month && "border-red-500",
                                                form.formState.errors.intake_year && "border-red-500"
                                            )}
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="intake_month"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormControl>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger className='border-gray-100 rounded-sm border-0 bg-gray-50  py-0 h-6 shadow-none'>
                                                                            <SelectValue placeholder="Intake Month" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {/* if intake_year is current year then show only the months greater or equal to current month */}
                                                                        {(form.watch('intake_year') === new Date().getFullYear()
                                                                            ? months.filter((month) => month.no >= months[new Date().getMonth()].no)
                                                                            : months
                                                                        ).map((month) => (
                                                                            <SelectItem key={month.value} value={month.value}>
                                                                                {month.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>

                                                            {/* <FormMessage /> */}
                                                        </FormItem>
                                                    )}
                                                    onBlur={() => handleStepValidation(1)}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="intake_year"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                                    value={field.value?.toString()}
                                                                >
                                                                    <FormControl>
                                                                        <SelectTrigger className='border-gray-100 rounded-sm border-0 bg-gray-50  py-0 h-6 shadow-none'>
                                                                            <SelectValue placeholder="Intake Year" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {Array.from({ length: 2 }, (_, i) => {
                                                                            const year = new Date().getFullYear() + i;
                                                                            return (
                                                                                <SelectItem
                                                                                    key={year}
                                                                                    value={year.toString()}
                                                                                >
                                                                                    {year}
                                                                                </SelectItem>
                                                                            );
                                                                        })}
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            {/* <FormMessage /> */}
                                                        </FormItem>
                                                    )}
                                                    onBlur={() => handleStepValidation(1)}
                                                />
                                            </div>
                                        </div>



                                        <div className="flex gap-3 justify-between col-span-12 pt-4">
                                            <div>
                                                <Button size='sm' onClick={() => setOpen(false)} type='button' variant="outline" className='text-xs' disabled={loading}>
                                                    Cancel
                                                </Button>
                                            </div>

                                            <Button size='sm' type="submit" className={cn("text-xs", loading && "opacity-50")} disabled={loading} >
                                                Submit Application Request
                                            </Button>
                                        </div>

                                    </form>
                                </Form>


                            </div>

                            :

                            <div className='bg-white rounded-2xl p-6'>
                                <h2 className='text-lg font-semibold tracking-tight mb-2'>Create Application Request</h2>
                                <p className='text-gray-500 text-sm font-medium tracking-tight mb-4'>Please Complete Your Onboarding Process to unlock all the features.</p>
                                <div>
                                    <Link href="/dashboard/" className='text-primary text-xs bg-primary text-white px-4 py-2 rounded-md'>
                                        Complete Onboarding
                                    </Link>
                                </div>
                            </div>
                    }


                </>

            </DialogContent>
        </Dialog>
    )
}

export default CreateApplication
