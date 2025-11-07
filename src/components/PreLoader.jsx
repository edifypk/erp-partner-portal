"use client"
import { useAuth } from '@/context/AuthContextProvider'
import React, { useEffect, useState } from 'react'

const PreLoader = () => {

  const { agentData } = useAuth()

  var [logoUrl, setLogoUrl] = useState(null)

  // when logo_url received from agent data save in local storage and on load get it from local storage and if not found default eLogo.svg

  useEffect(() => {
    if (agentData?.logo) {
      localStorage.setItem('agentLogo', agentData?.logo_url)
      setLogoUrl(agentData?.logo_url)
    }

    if (localStorage.getItem('agentLogo')) {
      setLogoUrl(localStorage.getItem('agentLogo'))
    } else {
      setLogoUrl("/images/eLogo.svg")
    }
  }, [agentData])


  return (
    <div className='fixed inset-0 bg-background flex justify-center items-center z-99999'>
      <div className='w-44 h-44 relative'>
        
        
        
        <div className='w-full h-full bg-background animate-[spin_2000ms_linear_infinite] border-primary/50 rounded-full border-2 border-t-primary/10'></div>




        <img src={logoUrl} className='absolute w-12 z-10 h-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' alt="" />
      </div>
    </div>
  )
}

export default PreLoader
