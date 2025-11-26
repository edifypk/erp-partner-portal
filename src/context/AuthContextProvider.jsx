'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [agentData, setAgentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [logoUrl, setLogoUrl] = useState(() => {
    // Initialize from localStorage on mount, or use default
    if (typeof window !== 'undefined') {
      return localStorage.getItem('agentLogo') || "/images/eLogo.svg";
    }
    return "/images/eLogo.svg";
  })
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

      if(userData?.user_type == 'sub_agent'){
        setUser(userData);
      }else{
        router.push('/login');
        return null;
      }

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

  // Fetch detailed sub-agent data (with account manager, files, etc.) using React Query
  const {
    data: agentDataResponse,
    refetch: refetchAgentData,
    isLoading: isLoadingAgentData
  } = useQuery({
    queryKey: ['agentData', user?.subagent_team_member?.agent?.id],
    queryFn: async () => {
      if (!user?.subagent_team_member?.agent?.id) {
        return null;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${user.subagent_team_member.agent.id}`,
        { withCredentials: true }
      );

      return response.data.data;
    },
    enabled: !!user?.subagent_team_member?.agent?.id,
    refetchOnWindowFocus: true,
    // Poll every 3 seconds if onboarding_status is not 'approved'
    refetchInterval: (query) => {
      const data = query.state.data;
      // If data exists and onboarding_status is not 'approved', poll every 3 seconds
      if (data && data.onboarding_status !== 'approved') {
        return 3000; // 3 seconds
      }
      // Otherwise, stop polling
      return false;
    },
    onError: (error) => {
      console.error("Error fetching agent data:", error);
      setAgentData(null);
    }
  });

  // Legacy fetchAgentData function for backward compatibility
  const fetchAgentData = async () => {
    const result = await refetchAgentData();
    return result.data || null;
  };

  const logout = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users/logout`, {
        withCredentials: true
      });
      setUser(null);
      setAgentData(null);
      setLogoUrl("/images/eLogo.svg");
      if (typeof window !== 'undefined') {
        localStorage.removeItem('agentLogo');
      }
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

  // Sync agentData from React Query response and update logoUrl
  useEffect(() => {
    if (agentDataResponse) {
      setAgentData(agentDataResponse);
      
      // Update logoUrl when agentData has a logo
      if (agentDataResponse?.logo && agentDataResponse?.logo_url) {
        const newLogoUrl = agentDataResponse.logo_url;
        setLogoUrl(newLogoUrl);
        if (typeof window !== 'undefined') {
          localStorage.setItem('agentLogo', newLogoUrl);
        }
      }
    } else if (!user?.subagent_team_member?.agent?.id) {
      setAgentData(null);
    }
  }, [agentDataResponse, user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      agentData, 
      setAgentData,
      fetchAgentData,
      getAgentProfile, 
      logout, 
      isLoading,
      logoUrl
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider

export const useAuth = () => {
  return useContext(AuthContext)
}
