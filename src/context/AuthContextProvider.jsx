'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'

const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [agentData, setAgentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const getAgentProfile = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users/profile`, {
        withCredentials: true,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });

      if (res.status >= 400) {
        setUser(null);
        return null;
      }

      const userData = res?.data?.data;
      setUser(userData);

      return userData;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  // Fetch detailed sub-agent data (with account manager, files, etc.)
  const fetchAgentData = async () => {
    try {
      if (!user?.subagent_team_member?.agent?.id) {
        setAgentData(null);
        return null;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${user.subagent_team_member.agent.id}`,
        { withCredentials: true }
      );

      const data = response.data.data;
      setAgentData(data);
      return data;
    } catch (error) {
      console.error("Error fetching agent data:", error);
      setAgentData(null);
      return null;
    }
  };

  const logout = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users/logout`, {
        withCredentials: true
      });
      setUser(null);
      setAgentData(null);
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

  // Fetch agent data when user is loaded
  useEffect(() => {
    if (user?.subagent_team_member?.agent?.id) {
      fetchAgentData();

      // Poll agent data every 5 seconds for real-time updates
      const intervalId = setInterval(fetchAgentData, 5000);

      return () => clearInterval(intervalId);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      agentData, 
      setAgentData,
      fetchAgentData,
      getAgentProfile, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider

export const useAuth = () => {
  return useContext(AuthContext)
}
