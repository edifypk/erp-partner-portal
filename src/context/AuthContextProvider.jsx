'use client'
import React, {createContext, useContext, useState} from 'react'

const AuthContext = createContext()

const AuthContextProvider = ({children}) => {

  const [user, setUser] = useState({
    name:"Ali"
  })


  return (
    <AuthContext.Provider value={{user, setUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider


export const useAuth = () => {
  return useContext(AuthContext)
}