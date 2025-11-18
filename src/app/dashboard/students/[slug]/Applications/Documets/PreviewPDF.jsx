"use client"
import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import axios from 'axios';
import { X } from 'lucide-react';


const PreviewPDF = ({ children, fileKey }) => {

    var [open, setOpen] = useState(false)
    const [url, setUrl] = useState(null)

    const readFile = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/s3/generate-presigned-url-to-read`, {
                params: {
                    key: fileKey
                }
            })
            setUrl(response?.data?.data?.signedUrl)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (fileKey && open) {
            readFile()
        }
    }, [fileKey, open])




    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-[540px] overflow-hidden h-[95vh] p-1 [&>button]:hidden bg-[#323639] border-white/10">
                <DialogHeader className='hidden'>
                    <DialogTitle>Ghulam Qadir</DialogTitle>
                    <DialogDescription>
                        Intermediate Marks Sheet
                    </DialogDescription>
                </DialogHeader>

                <div className='h-full'>
                    <iframe src={url} className='h-full rounded-md' width="100%" />
                </div>

                <div onClick={() => setOpen(false)} className='absolute top-0 cursor-pointer hover:bg-white/20 right-0 bg-white/10 text-white w-8 h-8 rounded-bl-full flex justify-end items-start p-[6px]'>
                    <X size={15} strokeWidth={2} />
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default PreviewPDF