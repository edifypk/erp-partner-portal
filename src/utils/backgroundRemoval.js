import toast from 'react-hot-toast'

// Professional background removal using Rembg API
export const removeBackgroundFromImage = async (imageFile, setLoadingState) => {
    try {
        if (setLoadingState) setLoadingState(true)
        
        // Check if we have a valid Rembg API key
        const apiKey = process.env.NEXT_PUBLIC_REMBG_API_KEY
        if (!apiKey) {
            // No valid API key, use client-side removal directly
            console.log('No Rembg API key found, using client-side background removal')
            return await simpleBackgroundRemoval(imageFile)
        }
        
        // Convert file to base64
        const base64 = await fileToBase64(imageFile)
        
        // Use Rembg API for professional background removal
        const response = await fetch('https://api.rembg.com/rmbg', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
            },
            body: (() => {
                const formData = new FormData()
                formData.append('image', imageFile)
                return formData
            })(),
        })
        
        if (!response.ok) {
            const errorText = await response.text()
            console.log(`Rembg API failed: ${response.status} - ${errorText}`)
            throw new Error(`Rembg API failed: ${response.status}`)
        }
        
        // Get the processed image as blob
        const blob = await response.blob()
        const file = new File([blob], 'camera-photo-no-bg.png', { type: 'image/png' })
        
        console.log('✅ Rembg background removal successful')
        return file
    } catch (error) {
        console.error('Error removing background:', error)
        
        // Fallback to client-side simple background removal
        try {
            console.log('Using client-side background removal as fallback')
            return await simpleBackgroundRemoval(imageFile)
        } catch (fallbackError) {
            console.error('Fallback background removal failed:', fallbackError)
            toast.error('Failed to remove background. Using original image.')
            return imageFile
        }
    } finally {
        if (setLoadingState) setLoadingState(false)
    }
}

// Enhanced client-side background removal using canvas
const simpleBackgroundRemoval = async (imageFile) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            
            // Draw the image
            ctx.drawImage(img, 0, 0)
            
            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            
            // Enhanced background removal with multiple techniques
            const edgeColors = getEdgeColors(data, canvas.width, canvas.height)
            const threshold = 80 // Increased threshold for better detection
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i]
                const g = data[i + 1]
                const b = data[i + 2]
                
                // Check against multiple edge colors for better accuracy
                let isBackground = false
                for (const edgeColor of edgeColors) {
                    const distance = Math.sqrt(
                        Math.pow(r - edgeColor.r, 2) +
                        Math.pow(g - edgeColor.g, 2) +
                        Math.pow(b - edgeColor.b, 2)
                    )
                    
                    if (distance < threshold) {
                        isBackground = true
                        break
                    }
                }
                
                // Additional check for very light or very dark pixels (common backgrounds)
                const brightness = (r + g + b) / 3
                if (brightness > 240 || brightness < 20) {
                    isBackground = true
                }
                
                // If color is similar to edge color or extreme brightness, make it transparent
                if (isBackground) {
                    data[i + 3] = 0 // Set alpha to 0 (transparent)
                }
            }
            
            // Put the modified image data back
            ctx.putImageData(imageData, 0, 0)
            
            // Convert to blob
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], 'camera-photo-no-bg.png', { type: 'image/png' })
                    resolve(file)
                } else {
                    reject(new Error('Failed to create blob'))
                }
            }, 'image/png')
        }
        
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = URL.createObjectURL(imageFile)
    })
}

// Get multiple dominant colors from the edges of the image
const getEdgeColors = (data, width, height) => {
    const edgePixels = []
    
    // Sample pixels from the edges
    for (let i = 0; i < width; i++) {
        // Top edge
        const topIndex = (i + 0 * width) * 4
        edgePixels.push({
            r: data[topIndex],
            g: data[topIndex + 1],
            b: data[topIndex + 2]
        })
        
        // Bottom edge
        const bottomIndex = (i + (height - 1) * width) * 4
        edgePixels.push({
            r: data[bottomIndex],
            g: data[bottomIndex + 1],
            b: data[bottomIndex + 2]
        })
    }
    
    for (let j = 0; j < height; j++) {
        // Left edge
        const leftIndex = (0 + j * width) * 4
        edgePixels.push({
            r: data[leftIndex],
            g: data[leftIndex + 1],
            b: data[leftIndex + 2]
        })
        
        // Right edge
        const rightIndex = ((width - 1) + j * width) * 4
        edgePixels.push({
            r: data[rightIndex],
            g: data[rightIndex + 1],
            b: data[rightIndex + 2]
        })
    }
    
    // Calculate average color
    const avgColor = edgePixels.reduce((acc, pixel) => {
        acc.r += pixel.r
        acc.g += pixel.g
        acc.b += pixel.b
        return acc
    }, { r: 0, g: 0, b: 0 })
    
    const averageColor = {
        r: Math.round(avgColor.r / edgePixels.length),
        g: Math.round(avgColor.g / edgePixels.length),
        b: Math.round(avgColor.b / edgePixels.length)
    }
    
    // Return multiple color variations for better detection
    return [
        averageColor,
        // Slightly lighter version
        {
            r: Math.min(255, averageColor.r + 20),
            g: Math.min(255, averageColor.g + 20),
            b: Math.min(255, averageColor.b + 20)
        },
        // Slightly darker version
        {
            r: Math.max(0, averageColor.r - 20),
            g: Math.max(0, averageColor.g - 20),
            b: Math.max(0, averageColor.b - 20)
        },
        // Common background colors
        { r: 255, g: 255, b: 255 }, // White
        { r: 0, g: 0, b: 0 }, // Black
        { r: 240, g: 240, b: 240 }, // Light gray
        { r: 128, g: 128, b: 128 } // Gray
    ]
}

export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}

