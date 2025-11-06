import React from 'react'

const BackgroundRemovalToggle = ({ 
    removeBackground, 
    setRemoveBackground, 
    isRemovingBackground = false 
}) => {
    return (
        <div className='flex justify-center items-center gap-2 mb-3'>
            <label className='flex items-center gap-2 text-sm text-gray-600 cursor-pointer'>
                <input
                    type="checkbox"
                    checked={removeBackground}
                    onChange={(e) => setRemoveBackground(e.target.checked)}
                    className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                    disabled={isRemovingBackground}
                />
                Remove background (Professional)
            </label>
        </div>
    )
}

export default BackgroundRemovalToggle

