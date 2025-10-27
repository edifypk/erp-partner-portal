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
import { Location05Icon } from "hugeicons-react";
import { RippleButton } from "../ui/shadcn-io/ripple-button";
import { useAuth } from "@/context/AuthContextProvider";

// Zod validation schema for sub agent form
const subAgentSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().refine((val) => !val || isValidPhoneNumber(val), {
    message: "Invalid phone number"
  }).optional(),
  country: z.string().min(1, "Please select a country"),
  state: z.string().min(1, "Please select a state"),
  city: z.string().min(1, "Please select a city"),
  zip_code: z.number().optional().or(z.literal("")),
  address: z.string().optional(),
});

export default function SubAgentForm({ onSubmitSuccess, defaultValues = {} }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isLoadingAgent, setIsLoadingAgent] = useState(false);

  const { user } = useAuth();

  // API functions
  const fetchSubAgentData = async (agentId) => {
    try {
      setIsLoadingAgent(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/agent-id/${agentId}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching sub agent data:", error);
      return null;
    } finally {
      setIsLoadingAgent(false);
    }
  };

  const updateSubAgentData = async (agentId, data) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/agent-id/${agentId}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating sub agent data:", error);
      throw error;
    }
  };

  const form = useForm({
    resolver: zodResolver(subAgentSchema),
    defaultValues: {
      agent_id: defaultValues.agent_id || "",
      company_name: defaultValues.company_name || "",
      website: defaultValues.website || "",
      email: defaultValues.email || "",
      phone: defaultValues.phone || "",
      country: defaultValues.country || "",
      state: defaultValues.state || "",
      city: defaultValues.city || "",
      zip_code: defaultValues.zip_code || "",
      address: defaultValues.address || "",
    },
    mode: "onChange"
  });

  // Load sub agent data and countries on component mount
  useEffect(() => {
    const loadData = async () => {
      // Fetch countries
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

      // Fetch sub agent data if user is logged in
      if (user?.agent?.agent_id) {
        console.log("Fetching data for agent_id:", user.agent.agent_id);
        const agentData = await fetchSubAgentData(user.agent.agent_id);
        console.log("Fetched agent data:", agentData);
        if (agentData) {
          // Update form with fetched data
          const formData = {
            company_name: agentData.company_name || "",
            website: agentData.website || "",
            email: agentData.email || "",
            phone: agentData.phone || "",
            country: agentData.country || "",
            state: agentData.state || "",
            city: agentData.city || "",
            zip_code: agentData.zip_code || "",
            address: agentData.address || "",
          };
          // console.log("Setting form data:", formData);
          form.reset(formData);

          // Load states and cities if country/state are already set
          if (agentData.country) {
            // Load states for the country
            try {
              const statesResponse = await axios.post(
                "https://countriesnow.space/api/v0.1/countries/states",
                { country: agentData.country }
              );
              if (statesResponse.data?.data?.states) {
                const sortedStates = statesResponse.data.data.states.sort((a, b) =>
                  a.name.localeCompare(b.name)
                );
                setStates(sortedStates);
              }
            } catch (error) {
              console.error("Error fetching states:", error);
            }

            // Load cities if state is also set
            if (agentData.state) {
              try {
                const citiesResponse = await axios.post(
                  "https://countriesnow.space/api/v0.1/countries/state/cities",
                  { country: agentData.country, state: agentData.state }
                );
                if (citiesResponse.data?.data) {
                  const sortedCities = citiesResponse.data.data.sort((a, b) =>
                    a.localeCompare(b)
                  );
                  setCities(sortedCities);
                }
              } catch (error) {
                console.error("Error fetching cities:", error);
              }
            }
          }
        }
      }
    };

    loadData();
  }, [user]);

  // Fetch states when country changes
  const handleCountryChange = async (countryName, onChange) => {
    onChange(countryName);
    form.setValue("state", "");
    form.setValue("city", "");
    setStates([]);
    setCities([]);

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
    onChange(stateName);
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

    try {
      if (!user?.agent?.agent_id) {
        toast.error("User not authenticated");
        return;
      }

      // Update sub agent data
      const result = await updateSubAgentData(user.agent.agent_id, data);
      
      toast.success("Business information saved successfully!");

      if (onSubmitSuccess) {
        onSubmitSuccess(result.data);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to save business information. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching agent data
  if (isLoadingAgent) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex items-center gap-2">
          <div className='h-1 w-1 rounded-full bg-gray-200 animate-bounce [animation-delay:-0.3s]'></div>
          <div className='h-1 w-1 rounded-full bg-gray-200 animate-bounce [animation-delay:-0.15s]'></div>
          <div className='h-1 w-1 rounded-full bg-gray-200 animate-bounce'></div>
          <span className="ml-2 text-gray-600">Loading your information...</span>
        </div>
      </div>
    );
  }





  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-12 gap-4">


          {/* Company Name */}
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem className="col-span-12">
                <FormLabel>
                  Company Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="Enter your company name"
                    {...field}
                  />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />



          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    type="email"
                    placeholder="contact@yourcompany.com"
                    {...field}
                  />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="col-span-4">
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
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />


          {/* Website */}
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="https://yourcompany.com"
                    {...field}
                  />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />


          <div className="col-span-12 mt-4">
            
            {/* <div className="col-span-12 mb-2 font-semibold flex items-center gap-1"> <Location05Icon className="text-blue-600" size={15} /> Location</div> */}

            <div className="grid grid-cols-12 gap-4">
              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="col-span-4">
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
                                className="w-5 h-4 object-cover rounded-[3px]"
                              />
                              <span>{country.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={(value) => handleStateChange(value, field.onChange)}
                      value={field.value}
                      disabled={!form.watch("country") || loadingStates}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-white disabled:opacity-100 relative">
                          <SelectValue
                            placeholder={
                              loadingStates
                                ? "Loading states..."
                                : "Select a state"
                            }
                          />
                          {loadingStates && (
                            <div className="absolute flex justify-center items-center w-5 h-5 right-2 bg-white z-10 top-1/2 -translate-y-1/2">
                              <img className="w-4 h-4" src="/images/loading.gif" alt="" />
                            </div>
                          )}
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
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!form.watch("state") || loadingCities}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-white disabled:opacity-100 relative">
                          <SelectValue
                            placeholder={
                              loadingCities ? "Loading cities..." : "Select a city"
                            }
                          />
                          {loadingCities && (
                            <div className="absolute flex justify-center items-center w-5 h-5 right-2 bg-white z-10 top-1/2 -translate-y-1/2">
                              <img className="w-4 h-4" src="/images/loading.gif" alt="" />
                            </div>
                          )}
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
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-8">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="123 Main Street, Suite 100"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              {/* ZIP Code */}
              <FormField
                control={form.control}
                name="zip_code"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        type="number"
                        placeholder="94105"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
            </div>
          </div>






        </div>



         {/* Submit Button */}
         <div className="flex justify-center pt-4">
           <RippleButton
             type="submit"
            //  disabled={loading || !form.formState.isValid}
           >
             {loading && (
               <div className='flex items-center gap-[2px] mr-2'>
                 <div className='h-1 w-1 rounded-full bg-gray-200 animate-bounce [animation-delay:-0.3s]'></div>
                 <div className='h-1 w-1 rounded-full bg-gray-200 animate-bounce [animation-delay:-0.15s]'></div>
                 <div className='h-1 w-1 rounded-full bg-gray-200 animate-bounce'></div>
               </div>
             )}
             {loading ? "Saving..." : "Continue to Next Step"}
           </RippleButton>
         </div>
      </form>
    </Form>
  );
}
