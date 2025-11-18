"use client"
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from '@radix-ui/react-dialog'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useQueryClient } from '@tanstack/react-query';


// Zod schema for form validation
const schema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
});


const UpdateModal = ({file,children,contact_id}) => {

    var queryClient = useQueryClient()
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // React Hook Form integration with Zod schema validation
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: file?.file?.name || "",
        },
    });

    const handleClose = () => {
        setOpen(false);
        form.reset(); // Reset form fields
        setLoading(false); // Reset loading state
    };

    const onSubmit = async (data) => {
        setLoading(true)
        const submitPromise = new Promise(async (resolve, reject) => {
            try {
                const res = await axios.put(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/contacts/${contact_id}/docs/${file?.id}`,
                    {file:{name:data?.name}},
                    {withCredentials: true}
                );

                if (res?.status === 200) {
                    resolve(res.data); // Resolve promise to show success toast
                    setOpen(false)
                    form.reset()
                    queryClient.invalidateQueries(`contact-docs-${contact_id}`)
                }
            } catch (error) {
                if(error?.response?.status === 400){
                    if(error?.response?.data?.error){
                        form.setError(error?.response?.data?.error?.path, { message: error?.response?.data?.error?.message },{shouldFocus: true});
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
                loading: "Updating...",
                success: () => `Updated successfully`, // Customize success message
                error: (err) => err?.response?.data?.message || err.message, // Display error from the backend or default message
            }
        );
    };

    useEffect(() => {
        const fetchUpdatedValues = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/contacts/${contact_id}/docs/${file?.id}`,
                    {withCredentials: true}
                );
                if (res.status === 200) {
                    form.reset({
                        name: res.data.data.file?.name || "",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch updated values:", error);
            }
        };

        if (file?.id && open) {
            fetchUpdatedValues();
        }
    }, [file, form, open]);




    return (
        <>



            <Dialog open={open} onOpenChange={(isOpen) => {
                if (!isOpen) handleClose();
                setOpen(isOpen);
            }}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-md" onInteractOutside={(e) => {
                    e.preventDefault();
                }}>

                    <DialogHeader>
                        <DialogTitle>Update Document</DialogTitle>
                        <DialogDescription>
                            Update the document name
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel> Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Document Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                            <div className="flex gap-3 justify-end">
                                <DialogClose asChild>
                                    <Button disabled={loading} type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button disabled={loading} type="submit" className="">
                                    Save
                                </Button>
                            </div>

                        </form>
                    </Form>

                </DialogContent>
            </Dialog>


        </>
    )
}

export default UpdateModal