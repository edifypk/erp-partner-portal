"use client"

import { useQuery } from '@tanstack/react-query';
import React, { createContext,useContext } from 'react';
import axios from 'axios';

export const DataContext = createContext();

const DataContextProvider = ({ children }) => {


    const invalidateTime = 1000 * 60 * 5 // 5 minutes

    const getAccountServices = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['account-services', filters],
            queryFn: async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/services`, {
                    params: filters,
                });
                return response.data;
            },
            onError: (error) => {
                console.error("Error fetching account services:", error);
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data || [];
    };

    const getEnquiryStatuses = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['enquiry-statuses', filters],
            queryFn: async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/enquiries-statuses`, {
                    params: filters,
                });
                return response.data;
            },
            onError: (error) => {
                console.error("Error fetching enquiry statuses:", error);
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data || [];
    };

    const getStudentStatuses = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['student-statuses', filters],
            queryFn: async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/students-statuses`, {
                    params: filters,
                });
                return response.data;
            },
            onError: (error) => {
                console.error("Error fetching student statuses:", error);
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data || [];
    };

    const getApplyLevels = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['program-levels', filters],
            queryFn: async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/edu-levels`, {
                    params: filters,
                });
                return response.data;
            },
            onError: (error) => {
                console.error("Error fetching program levels:", error);
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data || [];
    };


    const getContactDocsFolders = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['contact-docs-folders', filters],
            queryFn: async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/contact-docs-folders`, {
                    params: filters,
                });
                return response.data;
            },
            onError: (error) => {
                console.error("Error fetching contact docs folders:", error);
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data || [];
    };


    const getProgramLevels = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['program-levels', filters],
            queryFn: async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/course-finder/program-levels`, {
                    params: filters,
                });
                return response.data;
            },
            onError: (error) => {
                console.error("Error fetching program levels:", error);
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data || [];
    };

    const getLeadSources = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['lead-sources', filters],
            queryFn: async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/lead-sources`, {
                    params: filters,
                });
                return response.data;
            },
            onError: (error) => {
                console.error("Error fetching lead sources:", error);
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data || [];
    };

    const getBranches = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['branches', filters],
            queryFn: async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hr/work-locations`, {
                    params: filters,
                });
                return response.data;
            },
            onError: (error) => {
                console.error("Error fetching branches:", error);
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data || [];
    }

    const getDepartments = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['departments', filters],
            queryFn: async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hr/departments`, {
                    params: filters,
                });
                return response.data;
            },
            onError: (error) => {
                console.error("Error fetching academics:", error);
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data || [];
    };

    const getEnglishTests = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['english-tests', filters],
            queryFn: async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/english-tests`, {
                    params: filters,
                });
                return response.data;
            },
            onError: (error) => {
                console.error("Error fetching english tests:", error);
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data || [];
    };

    const getOfferedCountries = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['offered-countries', filters],
            queryFn: async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/offered-countries`, {
                    params: filters,
                });
                return response.data;
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data || [];
    };

    const getInstitutes = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['institutes', filters],
            queryFn: async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/institutes`, {
                    params: filters,
                });
                return response.data;
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data || [];
    };

    const getReferralSources = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['referral-sources', filters],
            queryFn: async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/referral-sources`, {
                    params: filters,
                });
                return response.data;
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data || [];
    };

    const getMaritalStatuses = () => {
        return [
            { id: 'single', name: 'Single' },
            { id: 'married', name: 'Married' },
            { id: 'divorced', name: 'Divorced' },
            { id: 'widowed', name: 'Widowed' },
        ];
    };


    const getCountries = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['countries', filters],
            queryFn: async () => {
                const response = await axios.get(`https://countriesnow.space/api/v0.1/countries/flag/images`, {
                    params: filters,
                });
                return response.data;
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data?.sort((a, b) => a.name.localeCompare(b.name)) || [];
    };


    const getStatesOfCountry = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['states-of-country', filters],
            queryFn: async () => {
                const response = await axios.post(`https://countriesnow.space/api/v0.1/countries/states`, filters);
                return response.data;
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data?.states?.sort((a, b) => a.name.localeCompare(b.name)) || [];
    };




    const getLanguageCourses = (filters = {}) => {
        const { data, error } = useQuery({
            queryKey: ['language-courses', filters],
            queryFn: async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/lang-coaching/courses`, {
                    params: filters,
                });
                return response.data;
            },
            staleTime: invalidateTime,
        });

        if (error) {
            return [];
        }

        return data?.data || [];
    };

    return (
        <DataContext.Provider value={{
            getAccountServices,
            getEnquiryStatuses,
            getStudentStatuses,
            getLeadSources,
            getEnglishTests,
            getOfferedCountries,
            getReferralSources,
            getMaritalStatuses,
            getInstitutes,
            getDepartments,
            getBranches,
            getApplyLevels,
            getProgramLevels,
            getContactDocsFolders,
            getCountries,
            getStatesOfCountry,
            getLanguageCourses
        }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContextProvider;

export const useData = () => useContext(DataContext);
