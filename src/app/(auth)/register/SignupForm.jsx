"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Tick04Icon } from "hugeicons-react";
import { useData } from "@/context/DataContextProvider";
import flags from 'react-phone-number-input/flags';
import { useQueryClient } from '@tanstack/react-query';


// Zod validation schema
const signupSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  your_role: z.string().min(2, "Role must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  country_id: z.string().min(1, "Please select a country"),
  state_id: z.string().min(1, "Please select a state"),
  city: z.string().min(1, "Please select a city"),
});

export default function SignupForm({ onSubmitSuccess }) {

  
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();
  const { getCountries, getStatesOfCountry } = useData();
  const countriesData = getCountries();

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);



  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      company_name: "",
      your_role: "",
      name: "",
      email: "",
      phone: "",
      country_id: "",
      state_id: "",
      city: "",
    },
  });

  // Update countries state when data is available
  useEffect(() => {
    if (countriesData && countriesData.length > 0) {
      setCountries(countriesData);
    }
  }, [countriesData]);

  // Watch selected country and fetch states
  const selectedCountryId = form.watch("country_id");
  const selectedCountry = countries?.find(country => country.id === selectedCountryId);
  const statesData = getStatesOfCountry(
    selectedCountry 
      ? { country_code: selectedCountry.code, country_id: selectedCountry.id }
      : {}
  );

  // Update states when country changes - only depend on selectedCountryId to avoid infinite loops
  useEffect(() => {
    if (Array.isArray(statesData)) {
      if (statesData.length > 0) {
        setStates(statesData);
      } else if (!selectedCountryId) {
        setStates([]);
      }
    } else if (!selectedCountryId) {
      setStates([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountryId]); // Only depend on selectedCountryId to prevent infinite loops


  const onSubmit = async (data) => {
    setLoading(true);


    var promise = new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/signup`,
          data
        );
        resolve(response.data);
      } catch (error) {
        if (error.response?.status === 400) {
          if (error.response?.data?.error) {
            form.setError(
              error.response.data.error.path,
              { message: error.response.data.error.message },
              { shouldFocus: true }
            );
          }
        }
        reject(error);
      } finally {
        setLoading(false);
      }
    });


    toast.promise(promise, {
      loading: "Submitting...",
      success: () => {
        setIsFormSubmitted(true);
        return "Signed up successfully";
      },
      error: (error) => error.response?.data?.message || error.message,
      position: "top-center",
      duration: 5000,
      style: {
        background: "white",
        color: "black",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "16px",
      },
    });
  };








  return (
    <Form {...form}>
      {!isFormSubmitted ?
        <form onSubmit={form.handleSubmit(onSubmit)}>

          <h1 className="text-lg font-semibold">Become a Partner</h1>

          <div className="grid md:grid-cols-8">

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 my-6 md:col-span-6">
              {/* Company Name */}
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input className="bg-white" placeholder="Enter company name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Your Role */}
              <FormField
                control={form.control}
                name="your_role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Role</FormLabel>
                    <FormControl>
                      <Input className="bg-white" placeholder="e.g. CEO, Manager" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input className="bg-white" placeholder="Enter your full name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input className="bg-white" type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <PhoneInput
                        className="bg-white"
                        error={form.formState.errors.phone}
                        defaultCountry="PK"
                        placeholder="Enter a phone number"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Country */}
              <FormField
                control={form.control}
                name="country_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={(countryId) => {
                        field.onChange(countryId);
                        form.setValue("state_id", "");
                        queryClient.invalidateQueries({ queryKey: ['states-of-country', { country_id: countryId }] });
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent align="start">
                        {countries.map((country, i) => {
                          const Flag = flags[country?.code];
                          return (
                            <SelectItem key={i} value={country.id}>
                              <div className="flex items-center gap-2">
                                {Flag ? <Flag width={20} height={20} /> : <div className='w-5 bg-white h-4 border'></div>}
                                <span>{country.name}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                control={form.control}
                name="state_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={(stateId) => {
                        field.onChange(stateId);
                      }}
                      value={field.value}
                      disabled={!form.watch("country_id")}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent align="start">
                        {states.length === 0 ? (
                          <div className="py-2 px-2 text-sm text-muted-foreground">
                            No states available
                          </div>
                        ) : (
                          states.map((state, i) => (
                            <SelectItem key={i} value={state.id}>
                              {state.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input className="bg-white" placeholder="Enter city name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2 hidden md:flex justify-center items-center">
              <img src="/images/signup.png" className="w-[200px]" alt="" />
            </div>

          </div>

          <div className="flex justify-between items-center">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading && <div className='flex items-center gap-[2px]'>
                <div className='h-1 w-1 rounded-full bg-gray-200 animate-bounce [animation-delay:-0.3s]'></div>
                <div className='h-1 w-1 rounded-full bg-gray-200 animate-bounce [animation-delay:-0.15s]'></div>
                <div className='h-1 w-1 rounded-full bg-gray-200 animate-bounce'></div>
              </div>}
              {loading ? "Submitting" : "Sign Up"}
            </Button>
          </div>

        </form>
        :
        <div className="max-w-[500px]  mx-auto w-full py-8 px-4 rounded-lg">

          <div className="flex justify-center items-center mb-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }} className="w-40 h-40 bg-blue-600/5 rounded-full p-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.4 }} className='bg-blue-600/10 rounded-full w-full h-full p-4'>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.8 }} className='bg-blue-600/10 rounded-full w-full h-full p-4'>

                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 1.2 }} className='bg-blue-600 text-white rounded-full w-full h-full flex justify-center items-center'>
                    <Tick04Icon size={28} />
                  </motion.div>

                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.5, type: 'spring', stiffness: 100, damping: 10 }} className='text-center tracking-tight text-lg md:text-xl font-semibold mb-1'>Form Submitted Successfully!</motion.h2>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 2, type: 'spring', stiffness: 100, damping: 10 }} className='text-center sm:max-w-[85%] mx-auto text-xs md:text-sm text-gray-500 mb-4'>We will review your application and get back to you soon. Please stay updated on your provided email.</motion.p>

          {/* <div className='flex justify-center'>
            <motion.button type="button" onClick={() => router.push("/login")} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 2.5, type: 'spring', stiffness: 100, damping: 10 }} className='bg-blue-600 cursor-pointer active:scale-95 transition-all duration-300 font-semibold text-white text-xs inline-block px-4 py-2 rounded-full'>Go to Login</motion.button>
          </div> */}

        </div>
      }
    </Form >
  );
}

