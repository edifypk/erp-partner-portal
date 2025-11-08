"use client";

import { useState, useEffect } from "react";
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


// Zod validation schema
const signupSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  your_role: z.string().min(2, "Role must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  country_iso2:z.string().min(2, "Please select a country"),
  country: z.string().min(1, "Please select a country"),
  state: z.string().min(1, "Please select a state"),
  city: z.string().min(1, "Please select a city"),
});

export default function SignupForm({ onSubmitSuccess }) {

  
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);


  const [loading, setLoading] = useState(false);



  const router = useRouter();

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);



  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      company_name: "",
      your_role: "",
      name: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
    },
  });

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://countriesnow.space/api/v0.1/countries/flag/images"
        );
        if (response.data?.data) {
          const sortedCountries = response.data.data.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setCountries(sortedCountries);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when country changes
  const handleCountryChange = async (countryName, onChange) => {
    onChange(countryName); // Call field.onChange to properly update form state
    form.setValue("state", "");
    form.setValue("city", "");
    setStates([]);
    setCities([]);


    form.setValue("country_iso2", countries?.find(country => country.name === countryName)?.iso2 || "");

    if (!countryName) return;

    setLoadingStates(true);
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country: countryName }
      );
      if (response.data?.data?.states) {
        const sortedStates = response.data.data.states.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setStates(sortedStates);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  // Fetch cities when state changes
  const handleStateChange = async (stateName, onChange) => {
    onChange(stateName); // Call field.onChange to properly update form state
    form.setValue("city", "");
    setCities([]);

    const countryName = form.getValues("country");
    if (!countryName || !stateName) return;

    setLoadingCities(true);
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        { country: countryName, state: stateName }
      );
      if (response.data?.data) {
        const sortedCities = response.data.data.sort((a, b) =>
          a.localeCompare(b)
        );
        setCities(sortedCities);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={(value) => handleCountryChange(value, field.onChange)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent align="start">
                        {countries.map((country) => (
                          <SelectItem key={country.name} value={country.name}>
                            <div className="flex items-center gap-2">
                              <img
                                src={country.flag}
                                alt={country.name}
                                className="w-5 h-4 object-cover rounded-sm"
                              />
                              <span>{country.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={(value) => handleStateChange(value, field.onChange)}
                      value={field.value}
                      disabled={!form.watch("country") || loadingStates}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-white relative">
                          <SelectValue
                            placeholder={
                              loadingStates
                                ? "Loading states..."
                                : "Select a state"
                            }
                          />
                          {loadingStates && <div className="absolute flex justify-center items-center w-5 h-5 right-2 bg-white z-10 top-1/2 -translate-y-1/2">
                            <img className="w-4 h-4" src="/images/loading.gif" alt="" />
                          </div>}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent align="start">
                        {states.length === 0 ? (
                          <div className="py-2 px-2 text-sm text-muted-foreground">
                            No states available
                          </div>
                        ) : (
                          states.map((state) => (
                            <SelectItem key={state.name} value={state.name}>
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!form.watch("state") || loadingCities}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-white relative">
                          <SelectValue
                            placeholder={
                              loadingCities ? "Loading cities..." : "Select a city"
                            }
                          />
                          {loadingCities && <div className="absolute flex justify-center items-center w-5 h-5 right-2 bg-white z-10 top-1/2 -translate-y-1/2">
                            <img className="w-4 h-4" src="/images/loading.gif" alt="" />
                          </div>}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent align="start">
                        {cities.length === 0 ? (
                          <div className="py-2 px-2 text-sm text-muted-foreground">
                            No cities available
                          </div>
                        ) : (
                          cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2 hidden md:flex justify-center items-center">
              <img src="/images/signup.png" className="w-[200px]" alt="" />
            </div>

          </div>

          <div className="flex justify-between items-center">
            <Button type="submit" disabled={loading}>
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
        <div className="max-w-[500px] bg-white mx-auto w-full shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] py-8 px-4 rounded-lg">

          <div className="flex justify-center items-center mb-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }} className="w-40 h-40 bg-blue-600/5 rounded-full p-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.4 }} className='bg-blue-600/10 rounded-full w-full h-full p-4'>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.8 }} className='bg-blue-600/10 rounded-full w-full h-full p-4'>

                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 1.2 }} className='bg-blue-600 text-white rounded-full w-full h-full flex justify-center items-center'>
                    <ion-icon className="text-2xl" name="mail-open-outline"></ion-icon>
                  </motion.div>

                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.5, type: 'spring', stiffness: 100, damping: 10 }} className='text-center tracking-tight text-lg md:text-xl font-semibold mb-1'>Signed up Successfully!</motion.h2>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 2, type: 'spring', stiffness: 100, damping: 10 }} className='text-center sm:max-w-[75%] mx-auto text-xs md:text-sm text-gray-500 mb-4'>Please check your provided email for login credentials.</motion.p>

          <div className='flex justify-center'>
            <motion.button type="button" onClick={() => router.push("/login")} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 2.5, type: 'spring', stiffness: 100, damping: 10 }} className='bg-blue-600 cursor-pointer active:scale-95 transition-all duration-300 font-semibold text-white text-xs inline-block px-4 py-2 rounded-full'>Go to Login</motion.button>
          </div>

        </div>
      }
    </Form >
  );
}

