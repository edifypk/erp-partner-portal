import React from 'react'

const PreLoader = () => {
  return (
    <div className='fixed inset-0 bg-white flex justify-center items-center z-99999'>
      <div className='w-44 h-44 relative'>
        <img src="/images/preloader.svg" alt="" />
        <img src="/images/eLogo.svg" className='absolute w-12 h-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' alt="" />
      </div>
    </div>
  )
}

export default PreLoader
