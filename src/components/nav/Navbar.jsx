"use client"
import { useAuth } from '@/context/AuthContextProvider'
import { ArrowRight02Icon, UserIcon } from 'hugeicons-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const Navbar = () => {
  const { user, isLoading } = useAuth()
  var router = useRouter()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false)
    setIsSignupOpen(true)
  }

  const handleSwitchToLogin = () => {
    setIsSignupOpen(false)
    setIsLoginOpen(true)
  }

  var pathname = usePathname()

  return (
    <header className='absolute top-0 left-0 w-full z-50 p-6'>
      <nav className='max-w-7xl mx-auto flex justify-between items-center rounded-full py-4 backdrop-blur-sm'>
        <Link href="/">
          <img className='w-32 md:w-44 cursor-pointer' src="/images/logo.svg" alt="Edify Group" />
        </Link>

        <div></div>

        <div className='flex items-center gap-3'>
          <motion.button
            onClick={() => !user ? router.push('/register') : router.push('/dashboard')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='p-3 tracking-tight pl-6 cursor-pointer font-medium rounded-full gap-4 flex justify-between bg-white/70 backdrop-blur-sm items-center hover:bg-white transition-colors'
          >
            <div className='text-black text-base'>{
              isLoading ?
                <div className='flex items-center gap-1'>
                  <div className='h-2 w-2 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.3s]'></div>
                  <div className='h-2 w-2 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.15s]'></div>
                  <div className='h-2 w-2 rounded-full bg-gray-500 animate-bounce'></div>
                </div>
                :
                (!user ? "Partner with Us" : "Dashboard")}
            </div>
            <div className='w-8 h-8 rounded-full bg-blue-600 text-white flex justify-center items-center'>
              <ArrowRight02Icon />
            </div>
          </motion.button>


          {(!user && !isLoading) &&
            <button
              onClick={() => router.push('/login')}
              className='w-13 h-13 p-[14px] cursor-pointer overflow-hidden rounded-full bg-white/70 text-[#2463eb] backdrop-blur-sm flex justify-center items-center hover:bg-white transition-colors'
            >
              <UserIcon fill="#2463eb" />
            </button>
          }


        </div>
      </nav>
    </header>
  )
}

export default Navbar