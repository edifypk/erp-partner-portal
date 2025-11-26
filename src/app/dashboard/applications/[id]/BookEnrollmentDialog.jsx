"use client"

import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from 'axios'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupInput,
} from "@/components/ui/input-group"

// Zod validation schema
const enrollmentSchema = z.object({
    tuition_fee: z.coerce.number().min(1, "Tuition fee is required"),
    scholarship_amount: z.coerce.number().min(0, "Scholarship amount is required"),
    fee_payable: z.coerce.number().min(0, "Fee payable must be greater than or equal to 0"),
    initial_deposit: z.coerce.number().min(1, "Initial deposit is required"),
    enrollment_fee: z.coerce.number().min(0, "Enrollment fee is required"),
    total_paid: z.coerce.number().min(0, "Total paid must be greater than or equal to 0"),
}).refine((data) => {
    // Calculate fee_payable from tuition_fee - scholarship_amount
    const calculatedFeePayable = data.tuition_fee - data.scholarship_amount
    return calculatedFeePayable >= 0;
}, {
    message: "Scholarship amount cannot exceed tuition fee",
    path: ["scholarship_amount"],
}).refine((data) => {
    const calculatedFeePayable = data.tuition_fee - data.scholarship_amount
    return data.total_paid <= calculatedFeePayable;
}, {
    message: "Total paid cannot exceed fee payable",
    path: ["total_paid"],
}).refine((data) => {
    const calculatedFeePayable = data.tuition_fee - data.scholarship_amount
    return data.initial_deposit <= calculatedFeePayable;
}, {
    message: "Initial deposit cannot exceed fee payable",
    path: ["initial_deposit"],
})

const BookEnrollmentDialog = ({ application }) => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Use controlled state if provided, otherwise use internal state
    const [open, setOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(enrollmentSchema),
        defaultValues: {
            tuition_fee: "",
            scholarship_amount: 0,
            fee_payable: 0,
            initial_deposit: "",
            enrollment_fee: 0,
            total_paid: 0,
        },
    })

    // Watch fields for calculations
    const tuitionFee = form.watch("tuition_fee")
    const scholarshipAmount = form.watch("scholarship_amount")
    const initialDeposit = form.watch("initial_deposit")
    const enrollmentFee = form.watch("enrollment_fee")
    const feePayable = form.watch("fee_payable")
    const totalPaid = form.watch("total_paid")
    
    // Calculate remaining fee
    const remainingFee = feePayable - totalPaid

    // Auto-calculate fee_payable from tuition_fee - scholarship_amount
    React.useEffect(() => {
        const tuition = parseFloat(tuitionFee) || 0
        const scholarship = parseFloat(scholarshipAmount) || 0
        const calculatedFeePayable = Math.max(0, tuition - scholarship)
        form.setValue("fee_payable", calculatedFeePayable || 0, { shouldValidate: true })
    }, [tuitionFee, scholarshipAmount, form])

    // Auto-calculate total_paid from initial_deposit + enrollment_fee
    React.useEffect(() => {
        const deposit = parseFloat(initialDeposit) || 0
        const fee = parseFloat(enrollmentFee) || 0
        const calculatedTotalPaid = deposit + fee
        form.setValue("total_paid", calculatedTotalPaid || 0, { shouldValidate: true })
    }, [initialDeposit, enrollmentFee, form])

    const handleClose = () => {
        setOpen(false)
        form.reset()
        setLoading(false)
    }

    // Get currency information from application
    // Currency info is now in sys_countries, accessed through country.country
    const currencySymbol = application?.program?.institute?.country?.country?.currency_symbol || "$"
    const currencyCode = application?.program?.institute?.country?.country?.currency_code || "USD"

    const onSubmit = async (data) => {
        setLoading(true)
        const submitPromise = new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/enrollments/${application?.id}`,
                    data,
                    {
                        withCredentials: true
                    }
                )

                if (res.status === 201) {
                    resolve(res.data)
                    handleClose()
                    queryClient.invalidateQueries(["application", application?.id])
                    queryClient.invalidateQueries(["applications"])
                    
                    // Redirect to enrollments page if it exists, otherwise stay on current page
                    router.refresh()
                }
            } catch (error) {
                if (error.response?.status === 400) {
                    if (error.response?.data?.error) {
                        form.setError(
                            error.response?.data?.error?.path,
                            { message: error.response?.data?.error?.message },
                            { shouldFocus: true }
                        )
                    }
                }
                reject(error)
            } finally {
                setLoading(false)
            }
        })

        toast.promise(
            submitPromise,
            {
                loading: "Booking enrollment...",
                success: () => "Enrollment booked successfully",
                error: (err) => err?.response?.data?.message || err.message,
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="default">
                    Book Enrollment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Book Enrollment</DialogTitle>
                    <DialogDescription>
                        Enter the enrollment details for application {application?.application_id}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">

                            <FormField
                                control={form.control}
                                name="tuition_fee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tuition Fee</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <InputGroupText>{currencySymbol}</InputGroupText>
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    error={form.formState.errors.tuition_fee}
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>{currencyCode}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="scholarship_amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Scholarship Amount</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <InputGroupText>{currencySymbol}</InputGroupText>
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    error={form.formState.errors.scholarship_amount}
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>{currencyCode}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="initial_deposit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Initial Deposit</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <InputGroupText>{currencySymbol}</InputGroupText>
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    error={form.formState.errors.initial_deposit}
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>{currencyCode}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="enrollment_fee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enrollment Fee</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <InputGroupText>{currencySymbol}</InputGroupText>
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    error={form.formState.errors.enrollment_fee}
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>{currencyCode}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        {/* Display calculated values */}
                        <div className="space-y-3">
                            {/* Fee Payable Display */}
                            <div className="p-3 bg-muted rounded-md">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Fee Payable:</span>
                                    <span className="text-sm font-semibold">
                                        {currencySymbol}{isNaN(feePayable) || feePayable === "" ? "0.00" : parseFloat(feePayable).toFixed(2)} {currencyCode}
                                    </span>
                                </div>
                            </div>

                            {/* Total Paid Display */}
                            <div className="p-3 bg-muted rounded-md">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Total Paid:</span>
                                    <span className="text-sm font-semibold">
                                        {currencySymbol}{isNaN(totalPaid) || totalPaid === "" ? "0.00" : parseFloat(totalPaid).toFixed(2)} {currencyCode}
                                    </span>
                                </div>
                            </div>

                            {/* Remaining Fee Display */}
                            <div className="p-3 bg-muted rounded-md">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Remaining Fee:</span>
                                    <span className="text-sm font-semibold">
                                        {currencySymbol}{isNaN(remainingFee) ? "0.00" : remainingFee.toFixed(2)} {currencyCode}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Booking..." : "Book Enrollment"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default BookEnrollmentDialog

