"use client"
import { useAuth } from '@/context/AuthContextProvider'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {

  const { user } = useAuth()


  return (
    <header className='absolute top-0 left-0 w-full z-50 p-6'>

      <nav className='max-w-7xl mx-auto flex justify-between items-center rounded-full py-4 pl-6 pr-4 bg-linear-to-r from-white/50 to-white/80 backdrop-blur-sm'>
        <div>
          <img className='w-32 md:w-36' src="https://edify.pk/images/logo.svg" alt="" />
        </div>
        <div>

        </div>

        <div className='flex gap-2'>
          <Link className='px-3 md:px-6 py-2 md:py-3 border border-blue-600 text-sm font-semibold bg-blue-600 text-white rounded-full' href="/">Register</Link>
          <Link className='px-3 hidden sm:block md:px-6 py-2 md:py-3 border border-blue-600 text-sm font-semibold bg-white text-blue-600 rounded-full' href="/">Login</Link>
        </div>
      </nav>


    </header>
  )
}

export default Navbar