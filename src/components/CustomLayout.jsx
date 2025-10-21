import GlobalContextProvider from '@/context/GlobalContextProvider'
import React from 'react'
import Navbar from './nav/Navbar'

const CustomLayout = ({ children }) => {
    return (
        <GlobalContextProvider>
            <Navbar />
            {children}
        </GlobalContextProvider>
    )
}

export default CustomLayout
