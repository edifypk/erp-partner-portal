"use client"
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { motion } from 'framer-motion'
import { getPresignedUrlToUpload } from '@/utils/functions'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { Camera01Icon, CloudUploadIcon, LinkBackwardIcon } from 'hugeicons-react'
import { removeBackgroundFromImage } from '@/utils/backgroundRemoval'
import BackgroundRemovalToggle from './BackgroundRemovalToggle'



const ImagePicker = ({ children, className, removeBg = false, saveMessage, onSave, path = 'uploads/temp-images', onUploadSuccess, type = "avatar", aspectRatio = null, showBackgroundRemoval = true }) => {
    const videoRef = useRef(null)

    // Utility function to convert HEIC files to web-compatible format
    const convertHeicToWebFormat = async (file) => {
        try {
            // Check if the file is HEIC/HEIF
            const isHeic = file.type === 'image/heic' || 
                          file.type === 'image/heif' || 
                          file.name.toLowerCase().endsWith('.heic') || 
                          file.name.toLowerCase().endsWith('.heif')
            
            if (!isHeic) {
                return file // Return original file if not HEIC
            }

            // Check if we're on the client side
            if (typeof window === 'undefined') {
                console.warn('HEIC conversion not available on server side')
                return file
            }

            // Dynamically import heic2any only on client side
            const heic2any = (await import('heic2any')).default

            // Convert HEIC to JPEG
            const convertedBlob = await heic2any({
                blob: file,
                toType: 'image/jpeg',
                quality: 0.9
            })

            // heic2any returns an array, so we take the first element
            const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
            
            // Create a new File object with the converted blob
            const convertedFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now()
            })

            return convertedFile
        } catch (error) {
            console.error('Error converting HEIC file:', error)
            toast.error('Failed to process HEIC image. Please try a different format.')
            return null
        }
    }


    const [showConfirmBox, setShowConfirmBox] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [originalSelectedImage, setOriginalSelectedImage] = useState(null)
    const [processedImage, setProcessedImage] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)

    // Camera states
    const [cameraStream, setCameraStream] = useState(null)
    const [isCameraActive, setIsCameraActive] = useState(false)
    const [cameraError, setCameraError] = useState(null)
    const [isCameraLoading, setIsCameraLoading] = useState(false)

    // Background removal states
    const [isRemovingBackground, setIsRemovingBackground] = useState(false)
    const [shownImage, setShownImage] = useState("cropped")


    // while uploading
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState('idle') // idle, uploading, success, error

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
                if (onUploadSuccess) {
                    onUploadSuccess(response?.data?.data)
                }
                return response?.data?.data
            } else {
                toast.error("Failed to save file reference")
                return null
            }
        } catch (error) {
            toast.error("Failed to save file reference")
            return null
        }
    }

    const uploadFileToS3 = async (file) => {
        try {
            setIsUploading(true)
            setUploadStatus('uploading')
            setUploadProgress(0)

            const getPresignedUrlResponse = await getPresignedUrlToUpload({
                path: path,
                fileType: file.type,
                isPublic: true
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
                    setUploadProgress(progress)
                },
            });

            setUploadStatus('success')
            setUploadProgress(100)

            // Save file reference in database
            const fileReference = await saveFileReference({
                file,
                uploadedPath: key
            })

            return fileReference

        } catch (error) {
            console.error("Error uploading file:", error);
            setUploadStatus('error')
            toast.error("Failed to upload avatar")
            return null
        } finally {
            setIsUploading(false)
        }
    };

    const handleSave = async () => {
        if (croppedImage) {
            // Upload file to S3 and save reference
            const uploadedFile = await uploadFileToS3(shownImage == "cropped" ? croppedImage : processedImage)

            if (uploadedFile) {

                const setIsSaved = () => {
                    setCroppedImage(null)
                    setOriginalSelectedImage(null)
                    setIsOpen(false)

                    setUploadProgress(0)
                    setUploadStatus('idle')
                }

                await onSave(uploadedFile, setIsSaved)

            }
        }
    }

    useEffect(() => {
        if (!isOpen) {
            setCroppedImage(null)
            setOriginalSelectedImage(null)
            setShowConfirmBox(false)
            setUploadProgress(0)
            setUploadStatus('idle')
            setIsUploading(false)
        }
    }, [isOpen])

    // Cleanup camera when component unmounts
    useEffect(() => {
        return () => {
            stopCamera()
        }
    }, [])

    // Set video source when camera stream is available
    useEffect(() => {
        if (videoRef.current && cameraStream) {
            videoRef.current.srcObject = cameraStream
        }
    }, [cameraStream])

    const takePhotoHandler = async () => {
        try {
            setCameraError(null)
            setIsCameraLoading(true)
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 480 },
                    height: { ideal: 480 },
                    facingMode: 'user' // Use front camera
                }
            })

            setCameraStream(stream)
            setIsCameraActive(true)
        } catch (error) {
            console.error('Error accessing camera:', error)
            setCameraError('Unable to access camera. Please check permissions.')
        } finally {
            setIsCameraLoading(false)
        }
    }

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop())
            setCameraStream(null)
            setIsCameraActive(false)
        }
    }

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')

            // Set canvas size to match video dimensions
            canvas.width = videoRef.current.videoWidth
            canvas.height = videoRef.current.videoHeight

            // Apply horizontal flip transformation
            context.scale(-1, 1)
            context.translate(-canvas.width, 0)

            // Draw video frame to canvas
            context.drawImage(videoRef.current, 0, 0)

            // Convert canvas to blob
            canvas.toBlob(async (blob) => {
                if (blob) {
                    const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
                    setOriginalSelectedImage(file)
                    stopCamera()
                }
            }, 'image/jpeg', 0.9)
        }
    }



    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                stopCamera() // Stop camera when dialog closes
            }
            setIsOpen(open)
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>


            <DialogContent
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
                style={{ borderRadius: "20px" }}
                className={cn("max-w-2xl max-h-[90vh] overflow-hidden border-0",
                    (isUploading || uploadStatus == 'uploading' || uploadStatus == 'success') && '[&>button]:hidden'
                )}
            >
                <DialogHeader>
                    <DialogTitle className="hidden">
                        {/* <Crop className="h-5 w-5" /> */}
                        {type == "logo" ? "Edit Logo" : "Edit Avatar Image"}
                    </DialogTitle>
                </DialogHeader>

                <div className='min-h-[400px] flex flex-col justify-center items-center'>


                    {
                        originalSelectedImage ?
                            <ImageCropper
                                isOpen={isOpen}
                                onClose={() => setIsOpen(false)}
                                croppedImage={originalSelectedImage}
                                onCropComplete={(croppedImage) => {
                                    setCroppedImage(croppedImage)
                                    setProcessedImage(null)
                                    setShownImage("cropped")
                                }}
                                minWidth={200}
                                minHeight={200}
                                aspectRatio={aspectRatio}
                            />
                            :

                            <div className='w-full'>
                                {isCameraActive ? (
                                    // Camera view
                                    <div className='text-center'>
                                        <div className='relative mb-4'>
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className='w-full h-auto object-cover border-2 border-gray-200 transform scale-x-[-1]'
                                            />
                                            {/* <div className='absolute inset-0 rounded-full border-4 border-[#2463eb] border-dashed animate-pulse'></div> */}
                                            <div className='absolute top-2 right-2 bg-[#2463eb] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1'>
                                                Take Photo
                                            </div>
                                        </div>
                                        <div className='flex justify-center items-center gap-2 mb-4'>
                                            <Button
                                                size="sm"
                                                onClick={stopCamera}
                                                variant="outline"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={capturePhoto}
                                            >
                                                Capture Photo
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    // Default view with placeholder
                                    <>
                                        <img className='w-full rounded-lg h-80 object-cover mx-auto mb-10' src={"/images/placeholder/image.svg"} alt="" />


                                        <div className='flex justify-center items-center gap-2 mb-4'>




                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    document.getElementById('avatar-picker').click()
                                                }}
                                            >
                                                <CloudUploadIcon />
                                                Upload From Device
                                            </Button>



                                            <Button
                                                size="sm"
                                                onClick={isCameraLoading ? undefined : takePhotoHandler}
                                                variant="outline"
                                            >
                                                {isCameraLoading ? (
                                                    <Loader2 className="animate-spin" />
                                                ) : (
                                                    <Camera01Icon />
                                                )}
                                                {isCameraLoading ? 'Initializing Camera...' : 'Take Photo'}
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {cameraError && (
                                    <div className='text-center mt-4'>
                                        <div className='text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200'>
                                            {cameraError}
                                        </div>
                                    </div>
                                )}
                            </div>

                    }
                </div>



                {/* Confirm Box */}
                <motion.div
                    className='absolute z-10 bottom-0 w-[calc(100%+4px)] bg-white/80 border-t backdrop-blur-md'
                    initial={{ y: "100%" }}
                    animate={showConfirmBox ? { y: 0 } : { y: "100%" }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.1, type: "spring", stiffness: 150, damping: 15 }}
                >
                    <div>

                        <div className='p-8'>

                            <div className='rounded-2xl relative overflow-hidden mb-4 h-[300px]'>

                                {
                                    processedImage ?
                                        <>
                                            <img src={processedImage ? URL.createObjectURL(processedImage) : "/images/placeholder/image.svg"} className='absolute inset-0 w-auto h-full object-cover object-center' alt="" />
                                            <motion.img
                                                src={croppedImage ? URL.createObjectURL(croppedImage) : "/images/placeholder/image.svg"}
                                                className='w-auto absolute inset-0 h-full object-cover object-center' alt=""
                                                animate={shownImage == "cropped" ? { clipPath: "inset(0 0 0 0)" } : { clipPath: "inset(0 0 0 100%)" }}
                                                transition={{ duration: 0.8 }}
                                            />
                                        </>
                                        :
                                        <>
                                            <img src={croppedImage ? URL.createObjectURL(croppedImage) : "/images/placeholder/image.svg"} className=' w-auto mx-auto h-full' alt="" />
                                        </>
                                }

                                {isRemovingBackground &&
                                    <div className='absolute inset-0 bg-black/50 flex items-center justify-center z-20'>
                                        <img className='w-6 h-6' src="/images/loading.gif" alt="" />
                                    </div>
                                }
                            </div>



                            <div className='flex justify-center gap-2 w-full'>
                                {/* <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setShowConfirmBox(false)
                                    }}
                                    disabled={isUploading || uploadStatus == 'uploading' || uploadStatus == 'success'}
                                >
                                    Cancel
                                </Button> */}

                                {(removeBg && showBackgroundRemoval) && <Button
                                    size="sm"
                                    onClick={async () => {
                                        if (shownImage == "processed" && processedImage) {
                                            setShownImage("cropped")
                                        } else {

                                            if (processedImage) {
                                                setShownImage("processed")
                                            } else {
                                                setIsRemovingBackground(true)
                                                try {
                                                    const img = await removeBackgroundFromImage(croppedImage, setIsRemovingBackground)
                                                    setProcessedImage(img)
                                                    setShownImage('processed')
                                                } catch (error) {
                                                    console.error('Background removal failed:', error)
                                                    toast.error('Failed to remove background')
                                                } finally {
                                                    setIsRemovingBackground(false)
                                                }
                                            }
                                        }
                                    }}
                                    disabled={isRemovingBackground}
                                    variant="outline"
                                    className="rounded-full"
                                >
                                    {
                                        shownImage == "cropped" ?
                                            <img src="/images/svgs/remove-bg.svg" alt="" />
                                            :
                                            <LinkBackwardIcon />
                                    }
                                    {isRemovingBackground ? "Removing Background..." : shownImage == "processed" ? "Back to Original" : "Remove Background"}
                                </Button>}


                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    className="rounded-full"
                                    disabled={isUploading || uploadStatus == 'uploading' || uploadStatus == 'success'}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        saveMessage || "Upload"
                                    )}
                                </Button>
                            </div>

                        </div>

                        {
                            uploadStatus == 'error' &&
                            <div className='mb-6 text-center'>
                                <div className='text-red-500 text-sm font-medium'>✗ Upload failed. Please try again.</div>
                            </div>
                        }

                        <div style={{ width: `${uploadProgress}%` }} className='h-1 bg-green-500'></div>

                    </div>
                </motion.div>





                {showConfirmBox &&
                    <div
                        onClick={() => (!isUploading && uploadStatus != 'uploading' && uploadStatus != 'success' && !isRemovingBackground) && setShowConfirmBox(false)}
                        className='absolute inset-0'
                    >
                    </div>
                }


                <input id="avatar-picker" type="file" accept="image/*,.heic,.heif" hidden onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                        if (file.size > (5 * 1024 * 1024)) {
                            toast.error("File size must be less than 5MB")
                            return
                        }
                        
                        // Convert HEIC files to web-compatible format
                        const convertedFile = await convertHeicToWebFormat(file)
                        if (convertedFile) {
                            setOriginalSelectedImage(convertedFile)
                            setCroppedImage(convertedFile)
                            setProcessedImage(convertedFile)
                            setShowConfirmBox(false)
                        }
                    }

                }} />


                {originalSelectedImage && <DialogFooter>
                    <div className="flex justify-between w-full">

                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => {
                                // Open File Picker
                                document.getElementById('avatar-picker').click()
                            }}
                        >
                            Change
                        </Button>

                        <Button
                            size="sm"
                            className="rounded-full"
                            onClick={() => {
                                setShowConfirmBox(true)
                            }}
                            disabled={!croppedImage}
                        >
                            Next
                        </Button>

                    </div>
                </DialogFooter>}


            </DialogContent>
        </Dialog>
    )
}

export default ImagePicker






const ImageCropper = ({
    croppedImage,
    onCropComplete,
    aspectRatio = null,
}) => {
    const [imgSrc, setImgSrc] = useState('')
    const [crop, setCrop] = useState()
    const [imgRef, setImgRef] = useState(null)

    // Load image when file changes
    React.useEffect(() => {
        if (croppedImage) {
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImgSrc(reader.result)
            })
            reader.readAsDataURL(croppedImage)
        }
    }, [croppedImage])

    // Center crop on image load
    const onImageLoad = useCallback((e) => {
        const { width, height } = e.currentTarget
        setImgRef(e.currentTarget)

        // Calculate aspect ratio
        let cropAspect = undefined
        if (aspectRatio && aspectRatio !== 'free') {
            const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number)
            cropAspect = widthRatio / heightRatio
        } else {
            // Default to 1:1 (square) if no aspect ratio specified
            cropAspect = 1
        }

        // Create initial crop starting from top-left
        const cropSize = Math.min(width, height) * 0.6 // 60% of the smaller dimension

        let cropWidth, cropHeight
        if (cropAspect > 1) {
            // Landscape aspect ratio
            cropWidth = cropSize
            cropHeight = cropSize / cropAspect
        } else {
            // Portrait or square aspect ratio
            cropWidth = cropSize * cropAspect
            cropHeight = cropSize
        }

        // Ensure crop doesn't exceed image boundaries
        cropWidth = Math.min(cropWidth, width)
        cropHeight = Math.min(cropHeight, height)

        // Convert to percentages for ReactCrop
        const crop = {
            unit: '%',
            x: 0, // Start from left
            y: 0, // Start from top
            width: (cropWidth / width) * 100,
            height: (cropHeight / height) * 100
        }

        setCrop(crop)
    }, [aspectRatio])

    // Handle crop completion
    const handleCrop = () => {
        if (!imgRef) return

        // If no crop is set, use the default crop area
        const cropToUse = crop || {
            unit: '%',
            x: 0,
            y: 0,
            width: 60,
            height: 60
        }

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            throw new Error('No 2d context')
        }

        // Create a temporary canvas to apply transformations
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')

        // Set temp canvas size to accommodate the full transformed image
        const maxDimension = Math.max(imgRef.naturalWidth, imgRef.naturalHeight) * 2
        tempCanvas.width = maxDimension
        tempCanvas.height = maxDimension

        // Apply transformations to temp canvas
        tempCtx.save()
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2)
        tempCtx.drawImage(
            imgRef,
            -imgRef.naturalWidth / 2,
            -imgRef.naturalHeight / 2,
            imgRef.naturalWidth,
            imgRef.naturalHeight
        )
        tempCtx.restore()

        // Calculate crop coordinates in the transformed image
        const scaleX = imgRef.naturalWidth / imgRef.width
        const scaleY = imgRef.naturalHeight / imgRef.height

        // Convert crop coordinates from percentage to pixels
        const cropX = (cropToUse.x / 100) * imgRef.width * scaleX
        const cropY = (cropToUse.y / 100) * imgRef.height * scaleY
        const cropWidth = (cropToUse.width / 100) * imgRef.width * scaleX
        const cropHeight = (cropToUse.height / 100) * imgRef.height * scaleY

        // Map the crop coordinates to the transformed image
        const transformedCropX = (tempCanvas.width / 2) - (imgRef.naturalWidth / 2) + cropX
        const transformedCropY = (tempCanvas.height / 2) - (imgRef.naturalHeight / 2) + cropY
        const transformedCropWidth = cropWidth
        const transformedCropHeight = cropHeight

        // Set final canvas size
        canvas.width = transformedCropWidth
        canvas.height = transformedCropHeight

        // Draw the cropped portion
        ctx.drawImage(
            tempCanvas,
            transformedCropX,
            transformedCropY,
            transformedCropWidth,
            transformedCropHeight,
            0,
            0,
            transformedCropWidth,
            transformedCropHeight
        )

        canvas.toBlob((blob) => {
            if (blob) {
                const croppedFile = new File([blob], croppedImage.name, {
                    type: croppedImage.type,
                    lastModified: Date.now()
                })
                onCropComplete(croppedFile)
            }
        }, croppedImage.type, 0.9)
    }


    return (
        <div className="flex-1 overflow-auto p-4">
            <div className="flex flex-col gap-4">

                {/* Image Container */}
                <div className="">
                    <div className="relative flex justify-center items-center" style={{ maxWidth: '100%', maxHeight: '60vh' }}>
                        {imgSrc && (
                            <ReactCrop
                                aspect={aspectRatio && aspectRatio !== 'free' ?
                                    (() => {
                                        const [width, height] = aspectRatio.split(':').map(Number)
                                        return width / height
                                    })() : undefined
                                }
                                crop={crop}
                                keepSelection={true}
                                onChange={(_, percentCrop) => {
                                    setCrop(percentCrop)
                                    handleCrop()
                                }}
                                zIndex={1000}
                            >
                                <img
                                    src={imgSrc}
                                    alt="Crop me"
                                    className='border'
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '50vh',
                                        width: 'auto',
                                        height: 'auto'
                                    }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
}

