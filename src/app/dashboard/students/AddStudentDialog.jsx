"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm, useFieldArray } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { RippleButton } from '@/components/ui/shadcn-io/ripple-button'
import { Input } from '@/components/ui/input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { DatePicker } from '@/components/ui/date-picker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserIcon, Delete02Icon } from 'hugeicons-react'
import axios from 'axios'
import { PhoneInput } from '@/components/ui/phone-input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import {toast} from 'sonner'

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    dob: z.date(),
    gender: z.string().min(1, "Gender is required"),

    email: z.string().email("Invalid email address"),
    phone: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),


    // Step 3: Work Experience
    education_gaps: z.array(
        z.object({
            from_date: z.date(),
            to_date: z.date().optional(),
            reason: z.string().min(1, "Reason is required"),
        })
    ),


    // Step 4: Previous Education
    qualifications: z.array(
        z.object({
            edu_level_id: z.string().min(1, "Qualification is required"),
            subject: z.string().min(1, "Subject is required"),
            year_of_completion: z.number().min(1, "Year of completion is required"),
            institute: z.string().min(1, "Institute is required"),
            marks: z.string().min(1, "Marks are required"),
        })
    ),


    // Step 5: English Tests
    english_tests: z.array(
        z.object({
            test_id: z.string().min(1, "Test name is required"),
            exam_date: z.date(),
            overall_marks: z.number().min(1, "Overall marks are required"),
            listening_marks: z.number().min(1, "Listening marks are required"),
            reading_marks: z.number().min(1, "Reading marks are required"),
            writing_marks: z.number().min(1, "Writing marks are required"),
            speaking_marks: z.number().min(1, "Speaking marks are required"),
        })
    ),

})

const AddStudentDialog = ({ children }) => {

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    const [hasEducationGaps, setHasEducationGaps] = useState(false);
    const [hasQualifications, setHasQualifications] = useState(false);
    const [hasEnglishTest, setHasEnglishTest] = useState(false);


    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            dob: null,
            gender: '',
            email: '',
            phone: '',
            country: '',
            city: '',
            state: '',
            education_gaps: [],
            qualifications: [],
            english_tests: [],
        },
    })

    const { fields: gapFields, append: addMoreGap, remove: removeGap } = useFieldArray({
        control: form.control,
        name: "education_gaps"
    });

    const { fields: eduFields, append: addMoreEdu, remove: removeEdu } = useFieldArray({
        control: form.control,
        name: "qualifications"
    });

    const { fields: englishTestFields, append: addMoreEnglishTest, remove: removeEnglishTest } = useFieldArray({
        control: form.control,
        name: "english_tests"
    });




    // Fetch countries on component mount
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get(
                    "https://countriesnow.space/api/v0.1/countries/flag/images"
                );
                if (response.data?.data) {
                    const sortedCountries = response.data.data.sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    setCountries(sortedCountries);
                }
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        fetchCountries();
    }, []);

    // Fetch states when country changes
    const handleCountryChange = async (countryName, onChange) => {
        onChange(countryName); // Call field.onChange to properly update form state
        form.setValue("state", "");
        form.setValue("city", "");
        setStates([]);
        setCities([]);


        form.setValue("country_iso2", countries?.find(country => country.name === countryName)?.iso2 || "");

        if (!countryName) return;

        setLoadingStates(true);
        try {
            const response = await axios.post(
                "https://countriesnow.space/api/v0.1/countries/states",
                { country: countryName }
            );
            if (response.data?.data?.states) {
                const sortedStates = response.data.data.states.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setStates(sortedStates);
            }
        } catch (error) {
            console.error("Error fetching states:", error);
        } finally {
            setLoadingStates(false);
        }
    };

    // Fetch cities when state changes
    const handleStateChange = async (stateName, onChange) => {
        onChange(stateName); // Call field.onChange to properly update form state
        form.setValue("city", "");
        setCities([]);

        const countryName = form.getValues("country");
        if (!countryName || !stateName) return;

        setLoadingCities(true);
        try {
            const response = await axios.post(
                "https://countriesnow.space/api/v0.1/countries/state/cities",
                { country: countryName, state: stateName }
            );
            if (response.data?.data) {
                const sortedCities = response.data.data.sort((a, b) =>
                    a.localeCompare(b)
                );
                setCities(sortedCities);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            setLoadingCities(false);
        }
    };

    // Education Gaps Validation
    useEffect(() => {
        if (!hasEducationGaps) {
            gapFields.forEach((f, i) => {
                removeGap(i);
            });
            form.clearErrors("education_gaps");
        } else {
            if (gapFields.length === 0) {
                addMoreGap({ from_date: undefined, to_date: undefined, reason: "" });
            }
            form.clearErrors("education_gaps");
        }
    }, [form.watch("education_gaps"), hasEducationGaps]);

    // Qualifications Validation
    useEffect(() => {
        if (!hasQualifications) {
            eduFields.forEach((f, i) => {
                removeEdu(i);
            });
            form.clearErrors("qualifications");
        } else {
            if (eduFields.length === 0) {
                addMoreEdu({ edu_level_id: "", subject: "", year_of_completion: "", institute: "", marks: "" });
            }
            form.clearErrors("qualifications");
        }
    }, [form.watch("qualifications"), hasQualifications]);

    // English Tests Validation
    useEffect(() => {
        if (!hasEnglishTest) {
            englishTestFields.forEach((f, i) => {
                removeEnglishTest(i);
            });
            form.clearErrors("english_tests");
        } else {
            if (englishTestFields.length === 0) {
                addMoreEnglishTest({ test_id: "", exam_date: "", overall_marks: "", listening_marks: "", reading_marks: "", writing_marks: "", speaking_marks: "" });
            }
            form.clearErrors("english_tests");
        }
    }, [form.watch("english_tests"), hasEnglishTest]);


    const onSubmit = (data) => {
        var promise = new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/students`,
                    data,
                    {
                        withCredentials: true
                    }
                );
                resolve(response.data);
            }
            catch (error) {
                console.error("Error submitting student:", error);
                reject(error);
            }
        });

        toast.promise(promise, {
            loading: "Submitting...",
            success: () => "Student submitted successfully",
            error: (error) => error.response?.data?.message || error.message,
        });
    }



    return (
        <Dialog onInteractOutside={e => {
            const { originalEvent } = e.detail;
            if ( originalEvent.target instanceof Element && originalEvent.target.closest('.group.toast') ) {
                 e.preventDefault();
            }
         }}>


            <DialogTrigger asChild>
                {children}
            </DialogTrigger>



            <DialogContent className="max-h-[85vh] [&>button]:cursor-pointer [&>button]:text-2xl [&>button]:text-white bg-background overflow-hidden h-full min-h-[500px] sm:max-w-3xl p-0 rounded-3xl">


                <DialogHeader className="hidden">
                    <DialogTitle>Add Student</DialogTitle>
                </DialogHeader>


                <Form {...form}>
                    <form autoComplete='off' onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col h-full overflow-hidden p-1'>


                        <div className='h-44 bg-background relative pb-10'>
                            <div className='bg-linear-to-br overflow-hidden from-primary to-transparent h-full rounded-[20px]'>
                                <img src="/images/stuBanner.png" className='h-full w-full object-cover' alt="" />
                            </div>


                            <div className='absolute bottom-2 left-0 w-full px-8'>
                                <div className='w-20 flex justify-center text-neutral-500 items-center bg-neutral-900 h-20 border-3 border-background rounded-full'>
                                    <UserIcon strokeWidth={0.8} size={35} />
                                </div>
                            </div>
                        </div>

                        <div className='flex-1 overflow-y-auto p-4'>

                            <div className='gap-4 grid grid-cols-3 mb-6'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input error={form.formState.errors.name} placeholder="Enter full name" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dob"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Date of Birth</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    error={form.formState.errors.dob}
                                                    startMonth={new Date(new Date().getFullYear() - 100, 0)}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Gender</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-full" error={form.formState.errors.gender}>
                                                        <SelectValue placeholder="Select Gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />




                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input error={form.formState.errors.email} type="email" placeholder="email@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <PhoneInput
                                                    error={form.formState.errors?.phone?.message}
                                                    defaultCountry="PK"
                                                    placeholder="Enter a phone number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div></div>


                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Country</FormLabel>
                                            <Select
                                                onValueChange={(value) => handleCountryChange(value, field.onChange)}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full" error={form.formState.errors.country}>
                                                        <SelectValue placeholder="Select a country" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent align="start">
                                                    {countries.map((country) => (
                                                        <SelectItem key={country.name} value={country.name}>
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={country.flag}
                                                                    alt={country.name}
                                                                    className="w-5 h-4 object-cover rounded-sm"
                                                                />
                                                                <span>{country.name}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>State</FormLabel>
                                            <Select
                                                onValueChange={(value) => handleStateChange(value, field.onChange)}
                                                value={field.value}
                                                disabled={!form.watch("country") || loadingStates}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full relative">
                                                        <SelectValue
                                                            placeholder={
                                                                loadingStates
                                                                    ? "Loading states..."
                                                                    : "Select a state"
                                                            }
                                                        />
                                                        {loadingStates && <div className="absolute flex justify-center items-center w-5 h-5 right-2 bg-background z-10 top-1/2 -translate-y-1/2">
                                                            <Spinner />
                                                        </div>}
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent align="start">
                                                    {states.length === 0 ? (
                                                        <div className="py-2 px-2 text-sm text-muted-foreground">
                                                            No states available
                                                        </div>
                                                    ) : (
                                                        states.map((state) => (
                                                            <SelectItem key={state.name} value={state.name}>
                                                                {state.name}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>City</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={!form.watch("state") || loadingCities}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full relative">
                                                        <SelectValue
                                                            placeholder={
                                                                loadingCities ? "Loading cities..." : "Select a city"
                                                            }
                                                        />
                                                        {loadingCities && <div className="absolute flex justify-center items-center w-5 h-5 right-2 bg-background z-10 top-1/2 -translate-y-1/2">
                                                            <Spinner />
                                                        </div>}
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent align="start">
                                                    {cities.length === 0 ? (
                                                        <div className="py-2 px-2 text-sm text-muted-foreground">
                                                            No cities available
                                                        </div>
                                                    ) : (
                                                        cities.map((city) => (
                                                            <SelectItem key={city} value={city}>
                                                                {city}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>




                            <div className='space-y-4'>
                                {/* Education Gaps */}
                                <div className='border p-4 rounded-xl bg-neutral-900'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-sm">Education Gaps</h3>
                                        </div>

                                        <Switch
                                            checked={hasEducationGaps}
                                            onCheckedChange={setHasEducationGaps}
                                        />

                                    </div>
                                    {hasEducationGaps && (
                                        <div className='space-y-3 pt-4'>
                                            {gapFields.map((item, index) => (
                                                <div key={item.id} className="border p-4 rounded-xl bg-background">
                                                    <div className='flex justify-between items-center mb-3'>
                                                        <div className='w-6 h-6 text-xs border rounded-full border-black flex justify-center items-center'>
                                                            {index + 1}
                                                        </div>
                                                        {gapFields.length > 1 && (
                                                            <Button size="icon" variant="outline" type="button" onClick={() => removeGap(index)}>
                                                                <Delete02Icon size={14} />
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-12 gap-3">
                                                        <FormField
                                                            control={form.control}
                                                            name={`education_gaps[${index}].from_date`}
                                                            render={({ field }) => (
                                                                <FormItem className="col-span-6">
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
                                                                <FormItem className="col-span-6">
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
                                                                <FormItem className="col-span-12">
                                                                    <FormLabel>Reason</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea
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
                                            <Button
                                                size="sm"
                                                type="button"
                                                variant="ghost"
                                                onClick={() => addMoreGap({ from_date: undefined, to_date: undefined, reason: "" })}
                                            >
                                                Add More
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Qualifications */}
                                <div className='border p-4 rounded-xl bg-neutral-900'>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-sm">Previous Qualifications</h3>
                                        </div>
                                        <div>
                                            <Switch
                                                checked={hasQualifications}
                                                onCheckedChange={setHasQualifications}
                                            />
                                        </div>
                                    </div>
                                    {hasQualifications && (
                                        <div className='space-y-3 pt-4'>
                                            {eduFields.map((item, index) => (
                                                <div key={item.id} className="border p-4 rounded-xl bg-background">
                                                    <div className='flex justify-between items-center mb-3'>
                                                        <div className='w-6 h-6 text-xs border rounded-full border-black flex justify-center items-center'>
                                                            {index + 1}
                                                        </div>
                                                        {eduFields.length > 1 && (
                                                            <Button size="icon" variant="outline" type="button" onClick={() => removeEdu(index)}>
                                                                <Delete02Icon size={14} />
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-12 gap-3">
                                                        <FormField
                                                            control={form.control}
                                                            name={`qualifications[${index}].edu_level_id`}
                                                            render={({ field }) => (
                                                                <FormItem className="col-span-6">
                                                                    <FormLabel>Qualification Level</FormLabel>
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select Level" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            <SelectItem value="1">Matric</SelectItem>
                                                                            <SelectItem value="2">Intermediate</SelectItem>
                                                                            <SelectItem value="3">Bachelor</SelectItem>
                                                                            <SelectItem value="4">Master</SelectItem>
                                                                            <SelectItem value="5">PhD</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`qualifications[${index}].subject`}
                                                            render={({ field }) => (
                                                                <FormItem className="col-span-6">
                                                                    <FormLabel>Subject</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="e.g. Computer Science" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`qualifications[${index}].year_of_completion`}
                                                            render={({ field }) => (
                                                                <FormItem className="col-span-4">
                                                                    <FormLabel>Year</FormLabel>
                                                                    <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select Year" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => 1990 + i).reverse().map(year => (
                                                                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`qualifications[${index}].institute`}
                                                            render={({ field }) => (
                                                                <FormItem className="col-span-8">
                                                                    <FormLabel>Institute</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Institute name" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`qualifications[${index}].marks`}
                                                            render={({ field }) => (
                                                                <FormItem className="col-span-12">
                                                                    <FormLabel>Marks/Grade</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="e.g. 85% or A Grade" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <Button
                                                size="sm"
                                                type="button"
                                                onClick={() => addMoreEdu({ edu_level_id: "", subject: "", year_of_completion: "", institute: "", marks: "" })}
                                            >
                                                Add More
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* English Tests */}
                                <div className='border p-4 rounded-xl bg-neutral-900'>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-sm">English Tests</h3>
                                    </div>
                                    <div>
                                        <Switch
                                            checked={hasEnglishTest}
                                            onCheckedChange={setHasEnglishTest}
                                        />
                                    </div>
                                </div>
                                {hasEnglishTest && (
                                    <div className='space-y-3 pt-4'>
                                        {englishTestFields.map((item, index) => (
                                            <div key={item.id} className="border p-4 rounded-xl bg-background">
                                                <div className='flex justify-between items-center mb-3'>
                                                    <div className='w-6 h-6 text-xs border rounded-full border-black flex justify-center items-center'>
                                                        {index + 1}
                                                    </div>
                                                    {englishTestFields.length > 1 && (
                                                        <Button size="icon" variant="outline" type="button" onClick={() => removeEnglishTest(index)}>
                                                            <Delete02Icon size={14} />
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-12 gap-3">
                                                    <FormField
                                                        control={form.control}
                                                        name={`english_tests[${index}].test_id`}
                                                        render={({ field }) => (
                                                            <FormItem className="col-span-6">
                                                                <FormLabel>Test Name</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select Test" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="1">IELTS</SelectItem>
                                                                        <SelectItem value="2">TOEFL</SelectItem>
                                                                        <SelectItem value="3">PTE</SelectItem>
                                                                        <SelectItem value="4">Duolingo</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`english_tests[${index}].exam_date`}
                                                        render={({ field }) => (
                                                            <FormItem className="col-span-6">
                                                                <FormLabel>Exam Date</FormLabel>
                                                                <FormControl>
                                                                    <DatePicker
                                                                        error={form.formState.errors?.english_tests?.[index]?.exam_date}
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`english_tests[${index}].overall_marks`}
                                                        render={({ field }) => (
                                                            <FormItem className="col-span-6">
                                                                <FormLabel>Overall Marks</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Overall"
                                                                        type="number"
                                                                        step="0.5"
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`english_tests[${index}].listening_marks`}
                                                        render={({ field }) => (
                                                            <FormItem className="col-span-6">
                                                                <FormLabel>Listening</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Listening"
                                                                        type="number"
                                                                        step="0.5"
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`english_tests[${index}].reading_marks`}
                                                        render={({ field }) => (
                                                            <FormItem className="col-span-4">
                                                                <FormLabel>Reading</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Reading"
                                                                        type="number"
                                                                        step="0.5"
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`english_tests[${index}].writing_marks`}
                                                        render={({ field }) => (
                                                            <FormItem className="col-span-4">
                                                                <FormLabel>Writing</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Writing"
                                                                        type="number"
                                                                        step="0.5"
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`english_tests[${index}].speaking_marks`}
                                                        render={({ field }) => (
                                                            <FormItem className="col-span-4">
                                                                <FormLabel>Speaking</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Speaking"
                                                                        type="number"
                                                                        step="0.5"
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            size="sm"
                                            type="button"
                                            onClick={() => addMoreEnglishTest({ test_id: "", exam_date: "", overall_marks: "", listening_marks: "", reading_marks: "", reading_marks: "", writing_marks: "", speaking_marks: "" })}
                                        >
                                            Add More
                                        </Button>
                                    </div>
                                )}
                            </div>
                            </div>

                        </div>

                        <div className='p-4 border-t flex justify-between items-center'>
                            <div></div>
                            <div>
                                <RippleButton size="sm" type='submit'>Submit</RippleButton>
                            </div>
                        </div>

                    </form>
                </Form>

            </DialogContent>




        </Dialog>
    )
}

export default AddStudentDialog
