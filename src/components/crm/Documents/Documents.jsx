"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContextProvider'
import { CloudDownloadIcon, Download01Icon, Zip02Icon, Loading03Icon } from 'hugeicons-react'
import DocumentsFolder from './DocumentsFolder'
import { Skeleton } from '@/components/ui/skeleton'
import { useData } from '@/context/DataContextProvider'
import { cn } from '@/lib/utils'
import JSZip from 'jszip'

const Documents = ({ contact_id, actions = true, downloadAll = false, filterEmptyFolders = false, foldersContainerStyle }) => {

  const { checkPermission, isLoading } = useAuth()
  const { getContactDocsFolders } = useData()
  const docsFolders = getContactDocsFolders({})

  // State for download progress
  const [downloadProgress, setDownloadProgress] = useState({
    isDownloading: false,
    currentFile: null,
    downloadedFiles: 0,
    totalFiles: 0,
    currentProgress: 0
  })

  const docsFolderWithFiles = useQuery({
    queryKey: [`contact-docs-${contact_id}`],
    queryFn: async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/contacts/${contact_id}/docs`, {
          withCredentials: true
        });
        return response.data;
      } catch (error) {
        return false
      }
    }
  });

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Download a single file and return blob
  const downloadFileBlob = async (file) => {
    try {
      const response = await fetch(file.downloadUrl)
      if (!response.ok) throw new Error('Download failed')

      return {
        name: file.name,
        blob: await response.blob(),
        folder: file.folder
      }
    } catch (error) {
      console.error(`Error downloading ${file.name}:`, error)
      return null
    }
  }

  // Download all documents as a single zip file
  const downloadAllDocs = async () => {
    try {
      setDownloadProgress({
        isDownloading: true,
        currentFile: null,
        downloadedFiles: 0,
        totalFiles: 0,
        currentProgress: 0
      })

      // Fetch download URLs
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/contacts/${contact_id}/docs/download-urls`,
        { withCredentials: true }
      )

      const { data } = response.data
      const { files, totalFiles, totalSize, contact } = data

      setDownloadProgress(prev => ({
        ...prev,
        totalFiles: totalFiles
      }))

      console.log(`Starting download of ${totalFiles} files (${formatFileSize(totalSize)}) for ${contact.name}`)

      // Show initial progress
      setDownloadProgress(prev => ({
        ...prev,
        currentFile: 'Preparing download...',
        currentProgress: 0
      }))

      // Create JSZip instance
      const zip = new JSZip()
      let downloadedCount = 0

      // Download files in batches and add to zip
      const batchSize = 3
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize)

        const batchPromises = batch.map(async (file) => {
          setDownloadProgress(prev => ({
            ...prev,
            currentFile: file.name,
            currentProgress: (downloadedCount / totalFiles) * 100
          }))

          const fileData = await downloadFileBlob(file)
          if (fileData) {
            // Add file to zip with folder structure
            const zipPath = `${fileData.folder}/${fileData.name}`
            zip.file(zipPath, fileData.blob)
          }

          downloadedCount++
          setDownloadProgress(prev => ({
            ...prev,
            downloadedFiles: downloadedCount,
            currentProgress: (downloadedCount / totalFiles) * 100
          }))
        })

        await Promise.all(batchPromises)

        // Small delay between batches
        if (i + batchSize < files.length) {
          await new Promise(resolve => setTimeout(resolve, 300))
        }
      }

      // Generate and download the zip file
      setDownloadProgress(prev => ({
        ...prev,
        currentFile: 'Creating zip file...',
        currentProgress: 95
      }))

      console.log(`Creating zip file for ${downloadedCount} files...`)

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6 // Balanced compression level
        }
      })

      // Download the zip file
      const url = window.URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${contact.name}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      console.log(`Download completed: ${downloadedCount}/${totalFiles} files in zip`)

      setDownloadProgress({
        isDownloading: false,
        currentFile: null,
        downloadedFiles: 0,
        totalFiles: 0,
        currentProgress: 0
      })

    } catch (error) {
      console.error('Download error:', error)
      setDownloadProgress({
        isDownloading: false,
        currentFile: null,
        downloadedFiles: 0,
        totalFiles: 0,
        currentProgress: 0
      })
    }
  }


  var folders = filterEmptyFolders ? docsFolderWithFiles?.data?.data?.filter(v => v?.files?.length > 0) : docsFolderWithFiles?.data?.data



  return (
    <>

      <div className="">

        <div className='flex gap-2 items-center mb-4 justify-between'>
          <div className='text-lg font-semibold tracking-tight'>Documents</div>
          {
                downloadAll && folders?.length > 0 &&
                <div>
                  {
                    downloadProgress.isDownloading ?
                      <div className='flex items-center gap-2 text-[10px] text-gray-600 bg-gray-50 px-3 py-2 rounded-md min-w-[200px]'>
                        <Loading03Icon className='animate-spin' size={12} />
                        <div className='flex-1'>
                          <div className='w-full bg-gray-200 rounded-full h-1.5'>
                            <div
                              className='bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out'
                              style={{ width: `${downloadProgress.currentProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      :
                      <div
                        onClick={downloadProgress.isDownloading ? undefined : downloadAllDocs}
                        className={cn(
                          'font-medium tracking-tight border px-2 py-1 rounded-md flex items-center gap-1 transition-all duration-200',
                          downloadProgress.isDownloading
                            ? 'cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200'
                            : 'cursor-pointer bg-blue-50 text-blue-500 border-blue-200 hover:bg-blue-100'
                        )}
                      >
                        {downloadProgress.isDownloading ? (
                          <Loading03Icon className='animate-spin' size={15} />
                        ) : (
                          <CloudDownloadIcon strokeWidth={2} size={15} />
                        )}
                        <span className='text-xs'>
                          {downloadProgress.isDownloading ? 'Downloading...' : 'Download All'}
                        </span>
                      </div>
                  }
                </div>
              }
        </div>

        <div>
          {
            (docsFolderWithFiles?.isLoading) ?
              <div className={cn("grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", foldersContainerStyle)}>
                {
                  docsFolders.map((folder, i) => {
                    return (
                      <div key={i} className="border rounded-xl transition-all duration-300 cursor-pointer group p-3 xl:p-4 hover:shadow-md shadow-black/5">

                        <div className="flex justify-center items-center w-7 h-7 rounded-md border-gray-200/40 mb-4">
                          <img src="/images/file-types/folder.svg" alt="" />
                        </div>


                        <div>
                          <div className="text-xs line-clamp-1 font-semibold text-gray-600 tracking-tighter mb-[2px]">
                            {folder?.name}
                          </div>

                          <Skeleton className="h-3 w-20 rounded-sm" />
                        </div>

                      </div>
                    )
                  })
                }
              </div>
              :
              <div className={cn("grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", foldersContainerStyle)}>
                {
                  folders?.map((v, i) => (
                    <div key={i}>
                      <DocumentsFolder actions={actions} key={i} docsFolder={v} contact_id={contact_id} />
                    </div>
                  ))
                }
              </div>
          }
        </div>





      </div>




    </>
  )
}

export default Documents