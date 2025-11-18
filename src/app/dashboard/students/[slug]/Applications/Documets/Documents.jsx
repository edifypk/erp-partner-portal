"use client"
import React, { useState } from 'react'
import axios from 'axios'
import UploadFile from './UploadFile'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { format } from 'timeago.js'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import PreviewPDF from './PreviewPDF'
import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import UpdateModal from './UpdateModal'



const openFileInNewTab = async (fileKey) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/s3/generate-presigned-url-to-read`, {
      params: {
        key: fileKey
      }
    })
    window.open(response?.data?.data?.signedUrl, '_blank');
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




const Documents = ({ application, student }) => {


  // randome documents table data
  const documents = [
    {
      id: 1,
      name: "Document 1",
      status: "Pending",
      uploadedBy: "Asma Alam",
      uploadedAt: "2024-01-01"
    }
  ]


  return (
    <div className="">

      <div className="space-y-4">

        <div className=''>


          {
            documents?.length > 0 &&
            <div className='rounded-xl whitespace-nowrap mt-3'>
              <FilesTable files={documents} />
            </div>
          }

          <div className='justify-end flex items-center'>

            <UploadFile docsCategory={{ name: "Application Documents", slug: "application-documents" }} student={student}>
              <button className='border text-xs flex items-center gap-1 font-medium px-2 shadow-xs py-1 rounded-md bg-white hover:bg-blue-600 text-blue-600 hover:text-white border-blue-600/30'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={16} height={16} color="currentColor" fill={"none"}>
                  <path d="M17.4776 9.01106C17.485 9.01102 17.4925 9.01101 17.5 9.01101C19.9853 9.01101 22 11.0294 22 13.5193C22 15.8398 20.25 17.7508 18 18M17.4776 9.01106C17.4924 8.84606 17.5 8.67896 17.5 8.51009C17.5 5.46695 15.0376 3 12 3C9.12324 3 6.76233 5.21267 6.52042 8.03192M17.4776 9.01106C17.3753 10.1476 16.9286 11.1846 16.2428 12.0165M6.52042 8.03192C3.98398 8.27373 2 10.4139 2 13.0183C2 15.4417 3.71776 17.4632 6 17.9273M6.52042 8.03192C6.67826 8.01687 6.83823 8.00917 7 8.00917C8.12582 8.00917 9.16474 8.38194 10.0005 9.01101" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 13L12 21M12 13C11.2998 13 9.99153 14.9943 9.5 15.5M12 13C12.7002 13 14.0085 14.9943 14.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>Upload</div>
              </button>
            </UploadFile>
          </div>







        </div>


      </div>


    </div>
  )
}

export default Documents







const FilesTable = ({ files }) => {

  const [selectedEntry, setSelectedEntry] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)


  const openDeleteDialog = (entry) => {
    setSelectedEntry(entry)
    setIsDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setSelectedEntry(null)
    setIsDialogOpen(false)
  }


  return (
    <>

      <Table>
        <TableBody>
          {
            files?.map((v, i) => {
              return (
                <TableRow key={i} className='border-b bg-gray-50 border-gray-100'>


                  <TableCell className="px-4 py-3">
                    <div className='flex items-center gap-2'>

                      <PreviewPDF fileKey={`students/${v?.student_id}/${v?.category_slug}/${v?.id}.pdf`}>
                        <div title='Click to Preview' className='cursor-pointer w-8 h-8 p-[9px] bg-red-100 rounded-full'>
                          <img src="/images/pdfIcon.svg" alt="" />
                        </div>
                      </PreviewPDF>


                      <div>
                        <div className='text-gray-600 text-xs'>{v?.file_name}</div>
                        <div className='text-[11px] font-light leading-[1.2] text-gray-400'>{formatBytes(v?.file_byte_size)} · {format(v?.createdAt, 'en_US')}</div>
                      </div>
                    </div>
                  </TableCell>


                  <TableCell className="text-gray-400 text-xs">
                    <div className='flex'>
                      <div className='text-[11px] border-orange-600/30 text-orange-600 font-medium overflow-hidden border px-2 py-[2px] rounded-md relative'>
                        <span className='z-[1] relative'>Pending</span>
                        <div className='absolute opacity-5 inset-0 white'></div>
                      </div>
                    </div>
                  </TableCell>



                  <TableCell className="">
                    <div className='flex items-center gap-2'>
                      <div className='w-7 h-7 border rounded-full'>
                        <img className='rounded-full object-cover w-full h-full' src="/images/profile/counsellor.png" alt="" />
                      </div>
                      <div>
                        <div className='text-gray-500 text-xs font-medium'>Asma Alam</div>
                        <div className='text-[11px] text-gray-400 -mt-1'>Counsellor</div>
                      </div>
                    </div>
                  </TableCell>


                  <TableCell className="">
                    <div className='flex items-center gap-2 justify-center'>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div onClick={() => openFileInNewTab(`students/${v?.student_id}/${v?.category_slug}/${v?.id}.pdf`)} className='cursor-pointer hover:scale-125 text-gray-600 transition-all duration-200'><ExternalLink size={15} /></div>

                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Open in new tab</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>



                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <UpdateModal file={v}>
                              <div className='cursor-pointer hover:scale-125 text-blue-600 transition-all duration-200'><Pencil size={15} /></div>
                            </UpdateModal>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit File Name</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>





                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div onClick={() => openDeleteDialog(v)} className='cursor-pointer hover:scale-125 transition-all duration-200 text-red-600'><Trash2 size={15} /></div>

                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>


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
        />
      )}

    </>
  )
}

function DeleteAlertDialog({ entry, open, onClose }) {

  var queryClient = useQueryClient()

  const deleteEntry = async (entry) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/student-docs-files/${entry.id}`)
      toast.success("Document deleted successfully")
      queryClient.invalidateQueries("student-docs-files")
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Failed to delete english test")
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
