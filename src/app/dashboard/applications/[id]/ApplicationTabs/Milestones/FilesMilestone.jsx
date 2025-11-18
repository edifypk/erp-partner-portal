"use client"
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { CloudUploadIcon } from 'hugeicons-react'
import FilesUploadWidget from '@/components/FilesUploadWidget'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CloudDownloadIcon } from 'hugeicons-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getPresignedUrlToRead, openFileInNewTab } from '@/utils/functions'
import { formatBytes } from '@/utils/functions'
import { getFileExtensionImage } from '@/data'
import { cn } from '@/lib/utils'
import { format } from 'timeago.js'

const FilesMilestone = ({ milestone, updateMilestone, data }) => {

    const [tempFiles, setTempFiles] = useState([])


    const uploadDocHandler = async () => {
        try {
            await updateMilestone({ files: [...(data?.files?.map(file => file.id) || []), ...(tempFiles?.map(file => file.id) || [])] })
            setTempFiles([])
        } catch (error) {
            console.log(error)
            toast.error("Failed to upload file")
        }
    }



    return (
        <div className='w-full space-y-4'>

            {tempFiles?.length > 0 &&
                <div>
                    <div className='mb-4'>
                        <div className='text-sm font-medium mb-2'>
                            Files to Save
                        </div>
                        <div className='border rounded-lg'>
                            <FilesTable files={tempFiles} />
                        </div>
                    </div>

                    <Button size="sm" disabled={tempFiles.length === 0} onClick={uploadDocHandler}>Save</Button>
                </div>
            }

            {data?.files?.length > 0 ?
                <div>
                    <div className='flex justify-between items-center mb-4'>
                        <div>
                            <div>Files</div>
                            <div dangerouslySetInnerHTML={{ __html: milestone?.description }} className='text-xs ProseMirror text-gray-500'></div>
                        </div>
                        <div>
                            <FilesUploadWidget
                                onUploadSuccess={(file) => {
                                    setTempFiles(prevFiles => [...prevFiles, file])
                                }}
                            >
                                <button className='border text-xs flex items-center gap-1 font-medium px-2 shadow-xs py-1 rounded-md bg-white hover:bg-blue-600 text-blue-600 hover:text-white border-blue-600/30'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={16} height={16} color="currentColor" fill={"none"}>
                                        <path d="M17.4776 9.01106C17.485 9.01102 17.4925 9.01101 17.5 9.01101C19.9853 9.01101 22 11.0294 22 13.5193C22 15.8398 20.25 17.7508 18 18M17.4776 9.01106C17.4924 8.84606 17.5 8.67896 17.5 8.51009C17.5 5.46695 15.0376 3 12 3C9.12324 3 6.76233 5.21267 6.52042 8.03192M17.4776 9.01106C17.3753 10.1476 16.9286 11.1846 16.2428 12.0165M6.52042 8.03192C3.98398 8.27373 2 10.4139 2 13.0183C2 15.4417 3.71776 17.4632 6 17.9273M6.52042 8.03192C6.67826 8.01687 6.83823 8.00917 7 8.00917C8.12582 8.00917 9.16474 8.38194 10.0005 9.01101" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 13L12 21M12 13C11.2998 13 9.99153 14.9943 9.5 15.5M12 13C12.7002 13 14.0085 14.9943 14.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div>Upload More Files</div>
                                </button>
                            </FilesUploadWidget>
                        </div>
                    </div>
                    <div className='border rounded-lg'>
                        <FilesTable files={data?.files} />
                    </div>
                </div>
                :
                <div>
                    <FilesUploadWidget
                        onUploadSuccess={(file) => setTempFiles([...tempFiles, file])}
                    >
                        <div className='flex justify-center items-center border p-4 text-center border-dashed bg-gray-50 border-blue-200 cursor-pointer rounded-lg hover:bg-gray-100'>
                            <div>
                                <div className='flex justify-center text-blue-600'><CloudUploadIcon size={20} /></div>
                                <div className='text-sm font-medium'>Click to Upload</div>
                            </div>
                        </div>
                    </FilesUploadWidget>
                </div>
            }

        </div>
    )
}

export default FilesMilestone








const FilesTable = ({ files }) => {


    const [downloadingFile, setDownloadingFile] = useState(null)





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
                        <TableHead className="px-4">File</TableHead>
                        {/* <TableHead className={`w-40 pl-0 ${hideStatusAndUser ? 'hidden md:table-cell' : ''}`}>Status</TableHead> */}
                        {/* <TableHead className={`w-40 ${hideStatusAndUser ? 'hidden md:table-cell' : ''}`}>Uploaded By</TableHead> */}
                        <TableHead className="w-28 px-4 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        files?.map((v, i) => {
                            return (
                                <TableRow key={i} className={cn('border-b border-gray-100')}>


                                    <TableCell className="px-4 py-3">
                                        <div className='flex items-center gap-2'>


                                            <div onClick={() => openFileInNewTab(v?.path)} className='w-8 h-8 cursor-pointer flex justify-center items-center'>
                                                <img src={getFileExtensionImage(v?.extension)} alt="" className="w-7 h-7" />
                                            </div>


                                            <div>
                                                <div className='text-gray-600 text-xs font-medium line-clamp-1 text-ellipsis truncate translate-y-[1px]'>{v?.name}</div>
                                                <div className='text-gray-500 h-4 text-[10px] -translate-y-[1px] whitespace-nowrap'>{formatBytes(v?.size)} · {format(v?.createdAt, 'en_US')}
                                                </div>
                                            </div>

                                        </div>
                                    </TableCell>


                                    {/* <TableCell className={`text-gray-400 text-xs p-0 ${hideStatusAndUser ? 'hidden md:table-cell' : ''}`}>
                                        <ChangeStudentDocsFilesStatusBadge actions={actions} file={v} status={v?.status} enquiry={enquiry} />
                                    </TableCell> */}



                                    {/* <TableCell className={`${hideStatusAndUser ? 'hidden md:table-cell' : ''}`}>
                                        <div className='flex items-center gap-2'>
                                            <Avatar className='w-7 h-7 border rounded-full'>
                                                <AvatarImage className='object-cover' src={v?.uploaded_by?.contact?.photo_url || `/images/placeholder/male.png`} />
                                                <AvatarFallback>{v?.uploaded_by?.contact?.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className='text-[12px] font-medium whitespace-nowrap translate-y-[3px]'>{v?.uploaded_by?.contact?.name}</div>
                                                <div className='text-[11px] text-gray-500 translate-y-[-3px]'>{v?.uploaded_by?.job_title}</div>
                                            </div>
                                        </div>
                                    </TableCell> */}


                                    <TableCell className="px-4">
                                        <div className='flex items-center gap-1 justify-end overflow-visible'>

                                            <TooltipProvider>
                                                <Tooltip delayDuration={0}>
                                                    <TooltipTrigger asChild>
                                                        <button disabled={downloadingFile?.id === v?.id} onClick={() => handleDownloadFile(v)} className='cursor-pointer p-1 rounded-full hover:shadow-sm bg-white hover:bg-white hover:scale-125 text-gray-600 transition-all duration-200'>
                                                            {downloadingFile?.id === v?.id ? <img className="w-4 h-4" src="/images/loading.gif" alt="" /> : <CloudDownloadIcon size={17} />}
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px] border-[0.5px] rounded-sm border-white/20 px-[6px] py-[2px]">
                                                        <p>{downloadingFile?.id === v?.id ? "Downloading" : "Download"}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>



                                            {/* {checkPermission("crm.enquiries.update_docs") && <TooltipProvider>
                                                <Tooltip delayDuration={0}>
                                                    <TooltipTrigger>
                                                        <UpdateModal file={v} enquiry={enquiry}>
                                                            <div className='cursor-pointer p-1 rounded-full hover:shadow-sm bg-white hover:bg-white hover:scale-125 text-blue-600 transition-all duration-200'><Pencil size={15} /></div>
                                                        </UpdateModal>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px] border-[0.5px] rounded-sm border-white/20 px-[6px] py-[2px]">
                                                        <p>Edit File Name</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>} */}





                                            {/* {checkPermission("crm.enquiries.delete_docs") && <TooltipProvider>
                                                <Tooltip delayDuration={0}>
                                                    <TooltipTrigger>
                                                        <div onClick={() => openDeleteDialog(v)} className='cursor-pointer p-1 rounded-full hover:shadow-sm bg-white hover:bg-white hover:scale-125 transition-all duration-200 text-red-600'><Trash2 size={15} /></div>

                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px] border-[0.5px] rounded-sm border-white/20 px-[6px] py-[2px]">
                                                        <p>Delete</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>} */}
                                        </div>
                                    </TableCell>


                                </TableRow>
                            )
                        })
                    }

                </TableBody>
            </Table>


            {/* {selectedEntry && (
                <DeleteAlertDialog
                    entry={selectedEntry}
                    open={isDialogOpen}
                    onClose={closeDeleteDialog}
                    enquiry={enquiry}
                />
            )} */}

        </>
    )
}
