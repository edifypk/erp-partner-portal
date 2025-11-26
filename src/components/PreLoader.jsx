"use client"
import { useAuth } from '@/context/AuthContextProvider'
import React from 'react'

const PreLoader = () => {
  const { logoUrl } = useAuth()


  return (
    <div className='fixed inset-0 bg-background flex justify-center items-center z-99999'>
      <div className='w-44 h-44 relative'>
        
        
        
        <div className='w-full h-full bg-background animate-[spin_2000ms_linear_infinite] border-primary/50 rounded-full border-2 border-t-primary/10'></div>




        <img src={logoUrl} className='absolute rounded-full w-12 z-10 h-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' alt="" />
      </div>
    </div>
  )
}

export default PreLoader
