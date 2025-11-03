"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { Upload, UploadCloud, Loader2, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getPresignedUrlToUpload } from "@/utils/functions";
import { getFileExtensionImage } from "@/data";
import { CloudUploadIcon } from "hugeicons-react";


const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} bytes`;
  else if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  else if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
};


const FilesUploadWidget = ({ children, path = "/uploads/temp", onUploadSuccess, isModal = true, multipleFiles = true, disabled = false }) => {



  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const filesChangeHandler = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      tempKey: Date.now() + Math.random(), // Unique key for each file
      status: 0, // 0: Selected, 1: Uploading, 2: Success, 3:Error
      progress: 0,
      message: "",
    }));
    
    if (multipleFiles) {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    } else {
      // For single file upload, replace the existing file
      setSelectedFiles(newFiles);
    }
  };


  const saveFileReference = async (fileData) => {
    var data = {
      name: fileData.file.name,
      original_name: fileData.file.name,
      extension: fileData.file.name.split(".").pop(),
      type: fileData.file.type,
      size: fileData.file.size,
      path: fileData.uploadedPath,
    }
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/files`, data, {
        withCredentials: true
      })
      if (response?.status === 201) {
        onUploadSuccess(response?.data?.data)
        if(!isModal){
          // is not modal then also remove the file from the selected files on upload success
          setSelectedFiles((prev) => prev.filter((f) => f.tempKey !== fileData.tempKey));
        }
      } else {
        toast.error("Failed to save file reference")
      }
    } catch (error) {
      toast.error("Failed to save file reference")
    }
  }

  const uploadFileToS3 = async (fileData) => {
    const { file, tempKey } = fileData;
    try {

      const getPresignedUrlResponse = await getPresignedUrlToUpload({
        path: path,
        fileType: file.type,
      })


      const { signedUrl, key } = getPresignedUrlResponse



      // Upload file to S3
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setSelectedFiles((prev) =>
            prev.map((f) =>
              f.tempKey === tempKey ? { ...f, progress, message: `${progress}%`, status: 1 } : f
            )
          );
        },
      });



      // update status to be uploaded
      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.tempKey === tempKey ? { ...f, status: 2, message: "Uploaded" } : f
        )
      );
      await saveFileReference({
        ...fileData,
        uploadedPath: key
      })



    } catch (error) {
      console.error("Error uploading file:", error);
      setSelectedFiles((prev) =>
        prev.map((f) =>
          f.tempKey === tempKey
            ? { ...f, status: 0, message: "Failed to upload file" }
            : f
        )
      );
    }
  };

  const handleUploadAll = () => {
    selectedFiles.forEach((fileData) => {
      if (fileData.status === 0) {
        uploadFileToS3(fileData);
      }
    });
  };

  const resetStates = () => {
    setLoading(false);
    setSelectedFiles([]);
  };

  useEffect(() => {
    if (!open) {
      resetStates();
    }
  }, [open]);




  return (
    <>

      {
        isModal ?

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
              <DialogHeader className="space-y-0">
                <DialogTitle className="">Upload Files</DialogTitle>
                <DialogDescription className="text-xs">
                  Upload files in any format. Multiple files supported.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">

                <div className="">
                  <label
                    htmlFor={selectedFiles.some((f) => f.status === 1) ? "" : "files"}
                    className={`${selectedFiles.some((f) => f.status === 1) || disabled ? "cursor-not-allowed" : "cursor-pointer"} border hover:opacity-70 border-gray-300 border-dashed bg-[#f7f7f8] relative text-center select-none transition-all duration-300 px-4 py-16 rounded-2xl flex flex-col justify-center items-center`}
                    onDragOver={(e) => e.preventDefault()} // Prevent default to allow drop
                    onDrop={(e) => {
                      if (disabled) return;
                      e.preventDefault();
                      const files = e.dataTransfer.files;
                      if (files.length) {
                        if (multipleFiles) {
                          filesChangeHandler({ target: { files } });
                        } else {
                          // For single file upload, only take the first file
                          filesChangeHandler({ target: { files: [files[0]] } });
                        }
                      }
                    }}
                  >
                    <img className="w-40" src="/images/files.png" alt="" />
                    <div className=" text-gray-700 font-medium">Drop or Select Files</div>
                    <div className="text-xs text-gray-500">
                      Click to browse through your file manager
                    </div>
                    <div className="text-xs text-gray-400 absolute left-0 bottom-0 w-full py-2">Supported Format: PDF</div>
                  </label>
                  <input
                    id="files"
                    onChange={filesChangeHandler}
                    hidden
                    type="file"
                    // accept=".pdf"
                    multiple={multipleFiles}
                    disabled={disabled}
                  />
                </div>

                {selectedFiles.length > 0 ?
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
                        {selectedFiles.map((file) => (
                          <TableRow key={file.tempKey}>
                            <TableCell className="">
                              <div className='text-xs flex items-center gap-2'>
                                <div className='w-8 h-8 flex justify-center items-center'>
                                  <img src={getFileExtensionImage(file?.file?.name?.split('.').pop())} alt="" className="w-7 h-7" />
                                </div>
                                <div>
                                  <div className='text-gray-600 line-clamp-1 translate-y-[1px]'>{file?.file?.name}</div>
                                  <div className='text-gray-500 text-[10px] -translate-y-[1px]'>{formatBytes(file?.file?.size)}</div>
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
                            <TableCell>
                              <Button className="p-0 w-8 h-8" size="sm" variant="outline" onClick={() => {
                                setSelectedFiles((prev) => prev.filter((f) => f.tempKey !== file.tempKey));
                              }}>
                                <img className="w-5 h-5" src="/images/actions/trash.svg" alt="" />
                              </Button>
                            </TableCell>
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
                <Button disabled={selectedFiles.some((f) => f.status === 1)} type="button" onClick={() => setOpen(false)} variant="outline" size="sm">
                  Close
                </Button>
                {selectedFiles.length > 0 && (
                  <Button
                    disabled={selectedFiles.some((f) => f.status === 1) || !selectedFiles.some((f) => f.status === 0) || disabled}
                    onClick={handleUploadAll}
                    className={`${(selectedFiles.some((f) => f.status === 1) || !selectedFiles.some((f) => f.status === 0) || disabled) ? "" : "animate-pulse"}`}
                    size="sm"
                  >
                    {selectedFiles.some((f) => f.status === 1) ? <Loader2 className="animate-spin" /> : null}
                    Upload
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
          :






          <div className="">

            {selectedFiles.length > 0 &&<div>
              <div>
                <div className="text-sm font-medium text-gray-600">Selected Files Not Uploaded Yet</div>
                <div className="overflow-auto max-h-[400px]">
                  <Table className="relative">
                    <TableHeader className="sticky top-0 z-10 tracking-tight text-xs">
                      <TableRow className="">
                        <TableHead>File Name</TableHead>
                        <TableHead className="w-40">Upload Progress</TableHead>
                        <TableHead className="w-4"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedFiles.map((file) => (
                        <TableRow key={file.tempKey}>
                          <TableCell className="">
                            <div className='text-xs flex items-center gap-2'>
                              <div className='w-8 h-8 flex justify-center items-center'>
                                <img src={getFileExtensionImage(file?.file?.name?.split('.').pop())} alt="" className="w-7 h-7" />
                              </div>
                              <div>
                                <div className='text-gray-600 line-clamp-1 translate-y-[1px]'>{file?.file?.name}</div>
                                <div className='text-gray-500 text-[10px] -translate-y-[1px]'>{formatBytes(file?.file?.size)}</div>
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
                          <TableCell>
                            <Button className="p-0 w-8 h-8" size="sm" variant="outline" onClick={() => {
                              setSelectedFiles((prev) => prev.filter((f) => f.tempKey !== file.tempKey));
                            }}>
                              <img className="w-5 h-5" src="/images/actions/trash.svg" alt="" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

               <div className="flex justify-end gap-3 mt-3">
                <Button
                  disabled={selectedFiles.some((f) => f.status === 1) || !selectedFiles.some((f) => f.status === 0) || disabled}
                  onClick={handleUploadAll}
                  className={`${(selectedFiles.some((f) => f.status === 1) || !selectedFiles.some((f) => f.status === 0) || disabled) ? "" : "animate-pulse"}`}
                  size="sm"
                >
                  {selectedFiles.some((f) => f.status === 1) ? <Loader2 className="animate-spin" /> : null}
                  Upload
                </Button>
              </div>
            </div>}

           {(selectedFiles?.length === 0) && <div className="mt-8">
              <label
                htmlFor={selectedFiles.some((f) => f.status === 1) ? "" : "files"}
                className={`${selectedFiles.some((f) => f.status === 1) || disabled ? "cursor-not-allowed" : "cursor-pointer"} border border-gray-300 border-dashed relative select-none transition-all duration-300 p-8 gap-4 rounded-2xl flex items-center`}
                onDragOver={(e) => e.preventDefault()} // Prevent default to allow drop
                onDrop={(e) => {
                  if (disabled) return;
                  e.preventDefault();
                  const files = e.dataTransfer.files;
                  if (files.length) {
                    if (multipleFiles) {
                      filesChangeHandler({ target: { files } });
                    } else {
                      // For single file upload, only take the first file
                      filesChangeHandler({ target: { files: [files[0]] } });
                    }
                  }
                }}
              >

                <div>
                  <CloudUploadIcon size={35} />
                </div>

                <div>
                  <div className=" text-gray-700 font-medium">Drop or Select Files</div>
                  <div className="text-xs text-gray-500">
                    Click to browse through your file manager
                  </div>
                </div>
              </label>
              <input
                id="files"
                onChange={filesChangeHandler}
                hidden
                type="file"
                // accept=".pdf"
                multiple={multipleFiles}
                disabled={disabled}
              />
            </div>}

          </div>
      }




    </>
  );
};

export default FilesUploadWidget;
