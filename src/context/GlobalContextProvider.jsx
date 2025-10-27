'use client'
import React, { createContext } from 'react'
import AuthContextProvider from './AuthContextProvider'
import DataContextProvider from './DataContextProvider'

const GlobalContext = createContext()


const GlobalContextProvider = ({ children }) => {
    return (
        <GlobalContext.Provider value={{}}>
            <AuthContextProvider>
                <DataContextProvider>
                    {children}
                </DataContextProvider>
            </AuthContextProvider>
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider