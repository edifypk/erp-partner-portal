"use client"
import GlobalContextProvider from '@/context/GlobalContextProvider'
import React from 'react'
import Navbar from './nav/Navbar'
import FloatingNav from './FloatingNav'
import { usePathname } from 'next/navigation'
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
const CustomLayout = ({ children }) => {


    var pathname = usePathname()



    return (
        <QueryClientProvider client={queryClient}>
            <GlobalContextProvider>
                <Toaster position="bottom-right" richColors="true" />

                {(!pathname.startsWith('/dashboard')) && <Navbar />}

                {children}

                {(!pathname.startsWith('/dashboard')) && <FloatingNav />}
            </GlobalContextProvider>
        </QueryClientProvider>
    )
}

export default CustomLayout
