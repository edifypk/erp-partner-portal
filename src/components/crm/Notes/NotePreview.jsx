"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/context/AuthContextProvider"
import { cn } from "@/lib/utils"
import { formatBytes, getPresignedUrlToRead, openFileInNewTab } from "@/utils/functions"
import { CloudDownloadIcon } from "hugeicons-react"
import { Loader2Icon } from "lucide-react"
import { useState } from "react"
import { getFileExtensionImage } from "@/data"

const formatDateWithTimeAndDay = (date) => {
    // desired format: Sat, May 17, 2:04 PM
    const dateObj = new Date(date)
    const day = dateObj.toLocaleDateString('en-US', { weekday: 'short' })
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' })
    const dayOfMonth = dateObj.getDate()
    const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    return `${day}, ${month} ${dayOfMonth}, ${time}`
}

const NotePreview = ({ note }) => {

    const { user } = useAuth()
    const isOwner = note?.creater?.id === user?.id
    const [downloadingAttachments, setDownloadingAttachments] = useState([])

    note.html_content = note.html_content.replace(/<p><\/p>/g, '<p class="heightNone">&nbsp;</p>')

    const handleDownloadAttachment = async (attachment) => {
        setDownloadingAttachments([...downloadingAttachments, attachment.id])
        try {
            const presignedUrl = await getPresignedUrlToRead(attachment.file.path)

            // Fetch the file as a blob
            const response = await fetch(presignedUrl)
            const blob = await response.blob()

            // Create a blob URL
            const blobUrl = window.URL.createObjectURL(blob)

            // Create a temporary anchor element to force download
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = attachment.file.name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Clean up the blob URL
            window.URL.revokeObjectURL(blobUrl)
        } catch (error) {
            console.error('Error downloading file:', error)
        } finally {
            setDownloadingAttachments(downloadingAttachments.filter(id => id !== attachment.id))
        }
    }

    return (
        <div id={note?.id} className={cn("flex gap-2 pr-10", isOwner && "flex-row-reverse pl-10 pr-0")}>
            
            <div>
                <Avatar className='w-8 h-8 border border-gray-300 rounded-full'>
                    <AvatarImage className='object-cover' src={note?.creater?.contact?.photo_url} />
                    <AvatarFallback>{note?.creater?.contact?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-1">
                <div className={cn("text-xs text-gray-700 font-medium tracking-tight mb-1", isOwner && "text-right")}>{isOwner ? "You" : note?.creater?.contact?.name}</div>


                <div className={cn("border bg-white p-4 rounded-xl", isOwner && "bg-blue-100/70 border-none")}>

                    <div className="flex justify-between items-center mb-2">
                        <div className='font-semibold text-base'>{note?.title}</div>
                        <div className='text-xs tracking-tight text-gray-700'>{formatDateWithTimeAndDay(note?.createdAt)}</div>
                    </div>

                    <div className='notesRichText' dangerouslySetInnerHTML={{ __html: note?.html_content }} />

                    <div>
                        {note?.files?.length > 0 && <div className='grid xl:grid-cols-2 gap-3 mt-4'>
                            {
                                note?.files?.map((attachment, index) => (
                                    <div key={index} className='flex items-center gap-2 p-1 relative z-10 rounded-full bg-white border overflow-hidden'>

                                        <div className="flex items-center gap-2 flex-1">


                                            <div className='relative z-10 pl-1'>
                                                <div onClick={() => openFileInNewTab(attachment.file.path)} className='w-8 h-8 cursor-pointer p-1'>
                                                    <img src={getFileExtensionImage(attachment.file.extension)} alt="" className="w-full h-full my-0" />
                                                </div>
                                            </div>

                                            <div className='relative z-10'>
                                                <div className='line-clamp-1 tracking-tight font-medium text-[10px]'>{attachment.file.name}</div>
                                                <div className='flex items-center gap-1 text-[10px]'>
                                                    <p>{formatBytes(attachment.file.size)}</p>
                                                    <div className='font-bold'>•</div>
                                                    <p className="uppercase">{attachment.file.extension}</p>
                                                </div>
                                            </div>
                                        </div>


                                        <div>
                                            <TooltipProvider>
                                                <Tooltip delayDuration={0}>
                                                    <TooltipTrigger asChild>
                                                        <button disabled={downloadingAttachments.includes(attachment.id)} onClick={() => handleDownloadAttachment(attachment)} className="w-8 h-8 text-blue-600 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors">
                                                            {downloadingAttachments.includes(attachment.id) ?
                                                                <img className="w-4 h-4" src="/images/loading.gif" alt="" />
                                                                :
                                                                <CloudDownloadIcon size={20} />
                                                            }
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px] border-[0.5px] rounded-sm border-white/20 px-[6px] py-[2px]">
                                                        {downloadingAttachments.includes(attachment.id) ? "Downloading" : "Download"}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>

                                    </div>
                                ))
                            }
                        </div>}
                    </div>


                </div>



            </div>
        </div>
    )
}

export default NotePreview