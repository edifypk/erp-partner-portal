'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'

const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const getAgentProfile = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/account/profile`, {
        withCredentials: true,
        validateStatus: function (status) {
          // Don't throw error for 401, 403, 404 status codes
          return status >= 200 && status < 500;
        }
      });

      // Check if the response indicates an error
      if (res.status >= 400) {
        setUser(null);
        return null;
      }

      const agentData = res?.data?.data;
      setUser(agentData);

      return agentData;
    } catch (error) {
      // Silently handle the error without logging to console
      setUser(null);
      return null;
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const logout = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/account/logout`, {
        withCredentials: true
      });
      setUser(null);
      router.push('/login');
      toast.success(res?.data?.message || 'Logged out successfully');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    // Skip profile fetch on login page
    if (pathname === '/login') {
      setIsLoading(false);
      return;
    }
    getAgentProfile();
  }, []);


  return (
    <AuthContext.Provider value={{ user, setUser, getAgentProfile, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider


export const useAuth = () => {
  return useContext(AuthContext)
}