'use client'
import React, { createContext } from 'react'
import AuthContextProvider from './AuthContextProvider'

const GlobalContext = createContext()


const GlobalContextProvider = ({ children }) => {
    return (
        <GlobalContext.Provider value={{}}>
            <AuthContextProvider>
                {children}
            </AuthContextProvider>
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider