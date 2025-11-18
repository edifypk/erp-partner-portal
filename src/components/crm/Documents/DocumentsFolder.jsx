import React, { useContext, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, ExternalLink, Eye, Pencil, Trash2, UserIcon, X } from 'lucide-react'
import { format } from 'timeago.js'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import UpdateModal from './UpdateModal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getPresignedUrlToRead } from '@/utils/functions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import { DataContext } from '@/context/DataContextProvider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '@/context/AuthContextProvider'
import FilesUploadWidget from '@/components/FilesUploadWidget'
import { getFileExtensionImage } from '@/data'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckmarkCircle01Icon, CloudDownloadIcon, LocationUser03Icon, UserAccountIcon } from 'hugeicons-react'
import { cn } from '@/lib/utils'

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const openFileInNewTab = async (fileKey) => {
    try {
        const signedUrl = await getPresignedUrlToRead(fileKey)
        window.open(signedUrl, '_blank');
    } catch (error) {
        console.log(error)
    }
}

const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    else if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
    else if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
};


const DocumentsFolder = ({ docsFolder, contact_id, actions, hideStatusAndUser = true }) => {

    const { checkPermission } = useAuth()

    var queryClient = useQueryClient()

    const uploadDocHandler = async (file) => {
        try {
            var res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/contacts/${contact_id}/docs`, {
                contact_id: contact_id,
                file_id: file.id,
                folder_id: docsFolder?.id,
            }, {
                withCredentials: true
            })
            queryClient.invalidateQueries(`contact-docs-${contact_id}`)
        } catch (error) {
            toast.error("Failed to upload file")
        }
    }


    var filesSize = formatBytes(docsFolder?.files?.reduce((acc, file) => acc + file?.file?.size, 0))
    var filesCount = docsFolder?.files?.length


    var isEmpty = filesCount === 0


    return (
        <>

            <Sheet>
                <SheetTrigger asChild>
                    <div className={cn("border rounded-xl transition-all duration-300 cursor-pointer group p-3 xl:p-4 hover:shadow-md shadow-black/5", isEmpty ? "bg-gray-100" : "bg-gray-50")}>

                        <div className="flex justify-center items-center w-7 h-7 rounded-md border-gray-200/40 mb-4">
                            <img src="/images/file-types/folder.svg" alt="" />
                        </div>


                        <div>
                            <div className="text-xs line-clamp-1 font-semibold text-gray-600 tracking-tighter mb-[2px]">
                                {docsFolder?.name}
                            </div>
                            <div className='text-[10px] font-medium text-gray-500 tracking-tight'> {isEmpty ? "Empty" : `${filesSize} • ${filesCount} files`}</div>
                        </div>

                    </div>
                </SheetTrigger>
                <SheetContent overlayStyle="opacity-0" className="bg-gradient-to-tr min-w-[800px] from-orange-600/20 via-background backdrop-blur-md to-background p-0 h-screen overflow-hidden [&>button]:z-50">


                    <SheetHeader className="hidden">
                        <SheetTitle className="opacity-0">Are you absolutely sure?</SheetTitle>
                    </SheetHeader>





                    <div className='relative h-full overflow-auto'>

                        <div className='flex items-center gap-4 sticky top-0 bg-white z-[1] px-6 py-4 border-b border-dashed'>
                            <div className="flex justify-center items-center w-10 h-10 rounded-md border-gray-200/40">
                                <img src="/images/file-types/folder.svg" alt="" />
                            </div>

                            <div>
                                <div className="font-semibold text-sm tracking-tight text-gray-600"> {docsFolder?.name} </div>
                                <div className='text-xs text-gray-500'>{filesSize} • {filesCount} files</div>
                            </div>
                        </div>


                        <div className='p-6 pb-10'>
                            {
                                docsFolder?.files?.length > 0 &&
                                <div className='rounded-xl mt-3 mb-20'>
                                    <FilesTable actions={actions} files={docsFolder?.files} hideStatusAndUser={hideStatusAndUser} contact_id={contact_id} />
                                </div>
                            }


                            {/* {(actions && checkPermission("crm.enquiries.upload_docs")) && */}
                            <div>
                                <FilesUploadWidget
                                    onUploadSuccess={uploadDocHandler}
                                    isModal={false}
                                    path={`contacts/${contact_id}/docs/${docsFolder?.slug}`}
                                >
                                    <button className='border text-xs flex items-center gap-1 font-medium px-2 shadow-xs py-1 rounded-md bg-white hover:bg-blue-600 text-blue-600 hover:text-white border-blue-600/30'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={16} height={16} color="currentColor" fill={"none"}>
                                            <path d="M17.4776 9.01106C17.485 9.01102 17.4925 9.01101 17.5 9.01101C19.9853 9.01101 22 11.0294 22 13.5193C22 15.8398 20.25 17.7508 18 18M17.4776 9.01106C17.4924 8.84606 17.5 8.67896 17.5 8.51009C17.5 5.46695 15.0376 3 12 3C9.12324 3 6.76233 5.21267 6.52042 8.03192M17.4776 9.01106C17.3753 10.1476 16.9286 11.1846 16.2428 12.0165M6.52042 8.03192C3.98398 8.27373 2 10.4139 2 13.0183C2 15.4417 3.71776 17.4632 6 17.9273M6.52042 8.03192C6.67826 8.01687 6.83823 8.00917 7 8.00917C8.12582 8.00917 9.16474 8.38194 10.0005 9.01101" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 13L12 21M12 13C11.2998 13 9.99153 14.9943 9.5 15.5M12 13C12.7002 13 14.0085 14.9943 14.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div>Upload</div>
                                    </button>
                                </FilesUploadWidget>
                            </div>
                            {/* } */}
                        </div>


                    </div>




                </SheetContent>
            </Sheet>




        </>
    )
}

export default DocumentsFolder







const FilesTable = ({ files, actions, hideStatusAndUser, contact_id }) => {

    const [selectedEntry, setSelectedEntry] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [downloadingFile, setDownloadingFile] = useState(null)


    const openDeleteDialog = (entry) => {
        setSelectedEntry(entry)
        setIsDialogOpen(true)
    }

    const closeDeleteDialog = () => {
        setSelectedEntry(null)
        setIsDialogOpen(false)
    }

    const { checkPermission } = useAuth()


    const handleDownloadFile = async (file) => {
        setDownloadingFile(file)
        try {
            const presignedUrl = await getPresignedUrlToRead(file.path)

            // Fetch the file as a blob
            const response = await fetch(presignedUrl)
            const blob = await response.blob()

            // Create a blob URL
            const blobUrl = window.URL.createObjectURL(blob)

            // Create a temporary anchor element to force download
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = file.name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Clean up the blob URL
            window.URL.revokeObjectURL(blobUrl)
        } catch (error) {
            console.error('Error downloading file:', error)
        } finally {
            setDownloadingFile(null)
        }
    }



    return (
        <>

            <Table>
                <TableHeader>
                    <TableRow className='border-b text-xs border-gray-200/60'>
                        <TableHead className="pr-4 pl-0">File</TableHead>
                        <TableHead className={`w-40 pl-0 ${hideStatusAndUser ? 'hidden md:table-cell' : ''}`}>Status</TableHead>
                        <TableHead className={`w-40 ${hideStatusAndUser ? 'hidden md:table-cell' : ''}`}>Uploaded By</TableHead>
                        {actions && <TableHead className="w-28 text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        files?.map((v, i) => {
                            return (
                                <TableRow key={i} className={cn('border-b border-gray-100')}>


                                    <TableCell className="pl-0 pr-4 py-3">
                                        <div className='flex items-center gap-2'>


                                            <div onClick={() => openFileInNewTab(v?.file?.path)} className='w-8 h-8 cursor-pointer flex justify-center items-center'>
                                                <img src={getFileExtensionImage(v?.file?.extension)} alt="" className="w-7 h-7" />
                                            </div>


                                            <div>
                                                <div className='text-gray-600 text-xs font-medium line-clamp-1 text-ellipsis truncate translate-y-[1px]'>{v?.file?.name}</div>
                                                <div className='text-gray-500 h-4 text-[10px] -translate-y-[1px] whitespace-nowrap'>{formatBytes(v?.file?.size)} · {format(v?.createdAt, 'en_US')}</div>
                                            </div>

                                        </div>
                                    </TableCell>


                                    <TableCell className={`text-gray-400 text-xs p-0 ${hideStatusAndUser ? 'hidden md:table-cell' : ''}`}>
                                        <ChangeStudentDocsFilesStatusBadge actions={actions} file={v} status={v?.status} contact_id={contact_id} />
                                    </TableCell>



                                    <TableCell className={`${hideStatusAndUser ? 'hidden md:table-cell' : ''}`}>
                                        <div className='flex items-center gap-2'>
                                            <Avatar className='w-7 h-7 border rounded-full'>
                                                <AvatarImage className='object-cover' src={v?.file?.uploaded_by?.contact?.photo_url || `/images/placeholder/male.png`} />
                                                <AvatarFallback>{v?.file?.uploaded_by?.contact?.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className='text-[12px] font-medium whitespace-nowrap translate-y-[3px]'>{v?.file?.uploaded_by?.contact?.name}</div>
                                                <div className='text-[11px] text-gray-500 translate-y-[-3px]'>{v?.file?.uploaded_by?.job_title}</div>
                                            </div>
                                        </div>
                                    </TableCell>


                                    {actions && <TableCell className="">
                                        <div className='flex items-center gap-1 justify-end overflow-visible'>

                                            <TooltipProvider>
                                                <Tooltip delayDuration={0}>
                                                    <TooltipTrigger asChild>
                                                        <button disabled={downloadingFile?.id === v?.file?.id} onClick={() => handleDownloadFile(v?.file)} className='cursor-pointer p-1 rounded-full hover:shadow-sm bg-white hover:bg-white hover:scale-125 text-gray-600 transition-all duration-200'>
                                                            {downloadingFile?.id === v?.file?.id ? <img className="w-4 h-4" src="/images/loading.gif" alt="" /> : <CloudDownloadIcon size={17} />}
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px] border-[0.5px] rounded-sm border-white/20 px-[6px] py-[2px]">
                                                        <p>{downloadingFile?.id === v?.file?.id ? "Downloading" : "Download"}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>



                                            {/* {checkPermission("crm.enquiries.update_docs") &&  */}
                                            <TooltipProvider>
                                                <Tooltip delayDuration={0}>
                                                    <TooltipTrigger>
                                                        <UpdateModal file={v} contact_id={contact_id}>
                                                            <div className='cursor-pointer p-1 rounded-full hover:shadow-sm bg-white hover:bg-white hover:scale-125 text-blue-600 transition-all duration-200'><Pencil size={15} /></div>
                                                        </UpdateModal>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px] border-[0.5px] rounded-sm border-white/20 px-[6px] py-[2px]">
                                                        <p>Edit File Name</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            {/* } */}





                                            {/* {checkPermission("crm.enquiries.delete_docs") &&  */}
                                            <TooltipProvider>
                                                <Tooltip delayDuration={0}>
                                                    <TooltipTrigger>
                                                        <div onClick={() => openDeleteDialog(v)} className='cursor-pointer p-1 rounded-full hover:shadow-sm bg-white hover:bg-white hover:scale-125 transition-all duration-200 text-red-600'><Trash2 size={15} /></div>

                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px] border-[0.5px] rounded-sm border-white/20 px-[6px] py-[2px]">
                                                        <p>Delete</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            {/* } */}
                                        </div>
                                    </TableCell>}


                                </TableRow>
                            )
                        })
                    }

                </TableBody>
            </Table>


            {selectedEntry && (
                <DeleteAlertDialog
                    entry={selectedEntry}
                    open={isDialogOpen}
                    onClose={closeDeleteDialog}
                    contact_id={contact_id}
                />
            )}

        </>
    )
}



function DeleteAlertDialog({ entry, open, onClose, contact_id }) {



    var queryClient = useQueryClient()


    const deleteEntry = async (entry) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/contacts/${contact_id}/docs/${entry.id}`, {
                withCredentials: true
            })
            toast.success("Document deleted successfully")
            queryClient.invalidateQueries(`contact-docs-${contact_id}`)
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Failed to delete document")
            }
        }
    }

    return (
        <AlertDialog open={open} onClose={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the data from the server.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={async () => {
                            await deleteEntry(entry)
                            onClose()
                        }}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


const ChangeStudentDocsFilesStatusBadge = ({ file, actions, contact_id }) => {

    const [showRejectDialog, setShowRejectDialog] = useState(false)

    const statuses = [
        {
            id: "pending",
            name: "Pending",
            color: "gray"
        },
        {
            id: "rejected",
            name: "Rejected",
            color: "red"
        },
        {
            id: "approved",
            name: "Approved",
            color: "green"
        }
    ]

    var status = statuses?.find(s => s?.id === file?.status)

    var router = useRouter()
    var queryClient = useQueryClient()

    const { checkPermission } = useAuth()


    const updateStatus = (newStatus) => {
        // If status is being changed to rejected, show the reject reason dialog
        if (newStatus === "rejected") {
            setShowRejectDialog(true)
            return
        }

        // For other statuses, proceed with normal update
        const submitPromise = new Promise(async (resolve, reject) => {
            try {
                await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/contacts/${contact_id}/docs/${file?.id}`, {
                    status: newStatus
                }, {
                    withCredentials: true
                });
                resolve();
                queryClient.invalidateQueries(`contact-docs-${contact_id}`)
                router.refresh()
            } catch (error) {
                console.log(error)
                reject(error);
            }
        });

        toast.promise(
            submitPromise,
            {
                loading: "Updating status...",
                success: () => "Status updated successfully",
                error: (err) => err?.response?.data?.message || "Failed to update status",
            }
        );
    }

    return (
        <div className='flex gap-1 items-center'>





            <Badge color={status?.color} radius='full'>
                {status?.name}
            </Badge>



            {file?.status === "rejected" &&
                <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                            <div className='cursor-pointer'>
                                <img className='w-4' src="/images/gif/warn.gif" alt="" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="min-w-[200px] py-3 max-w-[300px] bg-gray-800">
                            <div>
                                <div className='flex items-center gap-2'>
                                    <Avatar className='w-7 h-7 border-[0.5px] rounded-full'>
                                        <AvatarImage className='object-cover' src={file?.rejected_by?.contact?.photo_url || `/images/placeholder/male.png`} />
                                        <AvatarFallback>Q</AvatarFallback>
                                    </Avatar>
                                    <div className='whitespace-nowrap'>
                                        <div className='text-gray-300 text-[11] whitespace-nowrap translate-y-[2px]'>{file?.rejected_by?.contact?.name}</div>
                                        <div className='text-[11px] text-gray-400 translate-y-[-2px]'>{file?.rejected_by?.job_title}</div>
                                    </div>
                                </div>

                                <div className='text-gray-400 text-[11px] my-2'>{file?.rejection_reason}</div>
                                <div className='text-gray-500 text-[11px]'>{format(file?.rejected_at, 'en_US')}</div>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            }


            {file?.status === "approved" &&
                <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                            <div className='cursor-pointer'>
                                <CheckmarkCircle01Icon color="#fff" fill="#16a34a" size={20} />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="min-w-[200px] py-2 max-w-[300px] bg-gray-800">
                            <div>
                                <div className='flex items-center gap-2'>
                                    <Avatar className='w-7 h-7 border-[0.5px] rounded-full'>
                                        <AvatarImage className='object-cover' src={file?.approved_by?.contact?.photo_url || `/images/placeholder/male.png`} />
                                        <AvatarFallback>Q</AvatarFallback>
                                    </Avatar>
                                    <div className='whitespace-nowrap'>
                                        <div className='text-gray-300 text-[11] whitespace-nowrap translate-y-[2px]'>{file?.approved_by?.contact?.name}</div>
                                        <div className='text-[11px] text-gray-400 translate-y-[-2px]'>{file?.approved_by?.job_title}</div>
                                    </div>
                                </div>
                                <div className='text-gray-500 text-right text-[11px] mt-2'>{format(file?.approved_at, 'en_US')}</div>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            }



            {/* Reject Reason Dialog */}
            <RejectReasonDialog
                file={file}
                contact_id={contact_id}
                open={showRejectDialog}
                onOpenChange={setShowRejectDialog}
                onStatusUpdate={() => {
                    setShowRejectDialog(false)
                    queryClient.invalidateQueries(`contact-docs-${contact_id}`)
                    router.refresh()
                }}
            />
        </div>
    )
}



const rejectReasonSchema = z.object({
    reject_reason: z.string().min(1, "Reject reason is required"),
})
const RejectReasonDialog = ({ file, contact_id, open, onOpenChange, onStatusUpdate }) => {
    const [loading, setLoading] = useState(false)

    // React Hook Form integration with Zod schema validation
    const form = useForm({
        resolver: zodResolver(rejectReasonSchema),
        defaultValues: {
            reject_reason: "",
        },
    });

    const onSubmit = async (data) => {
        setLoading(true)
        const submitPromise = new Promise(async (resolve, reject) => {
            try {
                // First update the status to rejected
                await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/contacts/${contact_id}/docs/${file?.id}`, {
                    status: "rejected",
                    rejection_reason: data.reject_reason
                }, {
                    withCredentials: true
                });

                resolve("Document rejected successfully");
                onStatusUpdate();
                form.reset();
            } catch (error) {
                if (error.response?.status === 400) {
                    if (error.response?.data?.error) {
                        form.setError(error.response?.data?.error?.path, {
                            message: error.response?.data?.error?.message
                        });
                    }
                }
                reject(error);
            } finally {
                setLoading(false)
            }
        });

        toast.promise(
            submitPromise,
            {
                loading: "Rejecting document...",
                success: (message) => message,
                error: (err) => err?.response?.data?.message || "Failed to reject document",
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reject Document</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="reject_reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rejection Reason</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Start Typing..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    {form.formState.errors.reject_reason && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.reject_reason.message}
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || !form.watch("reject_reason")}
                                size="sm"
                            >
                                {loading ? "Rejecting..." : "Reject Document"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}