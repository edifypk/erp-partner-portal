"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, UploadCloud, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} bytes`;
  else if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  else if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
};


const UploadFile = ({ docsCategory, student, application, children }) => {

  const queryClient = useQueryClient()


  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [filesStatus, setFilesStatus] = useState([]);

  const filesChangeHandler = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      name: file.name,
      size: file.size,
      key: Date.now() + Math.random(), // Unique key for each file
      status: 0, // 0: Selected, 1: Uploading, 2: Success, 3:Error
      progress: 0,
      message: "",
    }));
    setFilesStatus((prev) => [...prev, ...newFiles]);
  };

  const saveFileReference = async (fileData) => {
    try {


      const data = {
        ...fileData,
        application_id: application?.application_id,
        student_id: student?.student_id,
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/application-docs`, data);
      console.log(response.data);


    } catch (error) {
      toast.error("Error saving file reference:", error);
    }
  }

  const uploadFileToS3 = async (fileData) => {
    const { file, key } = fileData;
    try {



      // Get pre-signed URL from backend
      const presignedUrl = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/s3/generate-presigned-url-to-upload`,
        {
          params: {
            path: `students/${student?.student_id}/${docsCategory?.slug}`,
            fileType: file.type,
          },
        }
      );

      const uploadUrl = presignedUrl?.data?.data?.signedUrl;

      // Upload file to S3
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setFilesStatus((prev) =>
            prev.map((f) =>
              f.key === key ? { ...f, progress, message: `${progress}%`, status: 1 } : f
            )
          );
        },
      });

      var fileDataToSave = {
        id: presignedUrl?.data?.data?.uuid,
        file_name: file.name,
        file_byte_size: file.size,
      }

      await saveFileReference(fileDataToSave)


      setFilesStatus((prev) =>
        prev.map((f) =>
          f.key === key ? { ...f, status: 2, message: "Uploaded" } : f
        )
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      setFilesStatus((prev) =>
        prev.map((f) =>
          f.key === key
            ? { ...f, status: 0, message: "Failed to upload file" }
            : f
        )
      );
    }
  };

  const handleUploadAll = () => {
    filesStatus.forEach((fileData) => {
      if (fileData.status === 0) {
        uploadFileToS3(fileData);
      }
    });
  };

  const resetStates = () => {
    setLoading(false);
    setFilesStatus([]);
  };

  useEffect(() => {
    if (!open) {
      resetStates();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetStates();
    }}>


      <DialogTrigger asChild>
        {
          children ? children : (
            <Button size="sm">
              <UploadCloud /> Upload Files
            </Button>
          )
        }

      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] [&>button]:hidden" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Upload {docsCategory?.name} Documents</DialogTitle>
          <DialogDescription>
            Upload your documents in PDF format. Multiple files supported.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">

          <div className="">
            <label
              htmlFor={filesStatus.some((f) => f.status === 1) ? "" : "files"}
              className={`${filesStatus.some((f) => f.status === 1) ? "cursor-not-allowed" : "cursor-pointer"} border hover:opacity-70 border-gray-300 border-dashed bg-[#f7f7f8] relative text-center select-none transition-all duration-300 px-4 py-16 rounded-2xl flex flex-col justify-center items-center`}
              onDragOver={(e) => e.preventDefault()} // Prevent default to allow drop
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length) {
                  filesChangeHandler({ target: { files } });
                }
              }}
            >
              <img className="w-40" src="/images/files.png" alt="" />
              <div className=" text-gray-700 font-medium">Drop or Select Files</div>
              <div className="text-xs text-gray-500">
                Click to browse through your machine
              </div>
              <div className="text-xs text-gray-400 absolute left-0 bottom-0 w-full py-2">Supported Format: PDF</div>
            </label>
            <input
              id="files"
              onChange={filesChangeHandler}
              hidden
              type="file"
              accept=".pdf"
              multiple
            />
          </div>

          {filesStatus.length > 0 ?
            <div className="overflow-auto max-h-[400px]">
              <Table className="relative">
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="">
                    <TableHead>File Name</TableHead>
                    <TableHead className="w-32">Status</TableHead>
                    <TableHead className="w-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filesStatus.map((file) => (
                    <TableRow key={file.key}>
                      <TableCell className="">
                        <div className='text-xs flex items-center gap-2'>
                          <div className='w-6 h-6 bg-red-100 -translate-y-1 rounded-full flex justify-center items-center'>
                            <img className='w-3' src="/images/pdfIcon.svg" alt="" />
                          </div>
                          <div>
                            <div className='text-gray-600 line-clamp-1'>{file.name}</div>
                            <div className='text-gray-500 text-[10px] -translate-y-1'>{formatBytes(file.size)}</div>
                          </div>
                        </div>
                      </TableCell>


                      <TableCell>
                        {
                          [1].map((f, fi) => {
                            switch (file.status) {

                              case 0: case 1:
                                return (
                                  <span key={fi} className="flex items-center gap-2">
                                    <div className="h-2 flex-1 bg-gray-200 rounded-full">
                                      <div
                                        style={{ width: `${file.progress}%` }}
                                        className="h-full rounded-full bg-green-500"
                                      ></div>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {file.progress}%
                                    </div>
                                  </span>
                                )
                              case 2:
                                return (
                                  <span key={fi} className="text-green-500">{file.message}</span>
                                )
                              case 3:
                                return (
                                  <span key={fi} className="text-red-500">{file.message}</span>
                                )
                            }
                          })
                        }
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            :
            null
          }

        </div>

        <div className="flex justify-end gap-3 mt-3">
          <Button disabled={filesStatus.some((f) => f.status === 1)} type="button" onClick={() => setOpen(false)} variant="outline" size="sm">
            Close
          </Button>
          {filesStatus.length > 0 && (
            <Button
              disabled={filesStatus.some((f) => f.status === 1) || !filesStatus.some((f) => f.status === 0)}
              onClick={handleUploadAll}
              className={`${(filesStatus.some((f) => f.status === 1) || !filesStatus.some((f) => f.status === 0)) ? "" : "animate-pulse"}`}
              size="sm"
            >
              {filesStatus.some((f) => f.status === 1) ? <Loader2 className="animate-spin" /> : null}
              Upload
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFile;
