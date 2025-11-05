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
import { useQuery } from '@tanstack/react-query';

// Zod validation schema for sub agent form
const subAgentSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_type: z.enum(['sole_proprietorship', 'partnership', 'corporation', 'llc', 'inc', 'other']),
  website: z.string().url("Please enter a valid website URL"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().refine((val) => !val || isValidPhoneNumber(val), {
    message: "Invalid phone number"
  }).optional(),
  country: z.string().min(1, "Please select a country"),
  state: z.string().min(1, "Please select a state"),
  city: z.string().min(1, "Please select a city"),
  zip_code: z.number(),
  address: z.string().min(1, "Please enter your address"),
});

export default function SubAgentForm({ onSubmitSuccess, defaultValues = {} }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isLoadingAgent, setIsLoadingAgent] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const { user } = useAuth();

  // React Query for fetching sub-agent data
  const { data: agentData } = useQuery({
    queryKey: ['subAgent', user?.subagent_team_member?.agent?.agent_id],
    queryFn: async () => {
      if (!user?.subagent_team_member?.agent?.id) return null;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${user.subagent_team_member.agent.id}`,
        { withCredentials: true }
      );
      return response.data.data;
    },
    enabled: !!user?.subagent_team_member?.agent?.id,
  });

  // API functions
  const fetchSubAgentData = async (agentId) => {
    try {
      setIsLoadingAgent(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${agentId}`,
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

  const updateSubAgentData = async (id, data) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating sub agent data:", error);
      throw error;
    }
  };

  // Function to check if form data has changed
  const hasFormDataChanged = (currentData) => {
    if (!originalData) return true;
    
    // Compare each field
    const fieldsToCompare = [
      'company_name', 'company_type', 'website', 'email', 'phone',
      'country', 'state', 'city', 'zip_code', 'address'
    ];
    
    for (const field of fieldsToCompare) {
      const originalValue = originalData[field] || '';
      const currentValue = currentData[field] || '';
      
      if (originalValue !== currentValue) {
        return true;
      }
    }
    
    return false;
  };

  const form = useForm({
    resolver: zodResolver(subAgentSchema),
    defaultValues: {
      agent_id: defaultValues.agent_id || "",
      company_name: defaultValues.company_name || "",
      company_type: defaultValues.company_type || "other",
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
      // Fetch countries with ISO codes
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
      if (user?.subagent_team_member?.agent?.id) {
        // console.log("Fetching data for agent_id:", user.subagent_team_member.agent.agent_id);
        const agentData = await fetchSubAgentData(user.subagent_team_member.agent.id);
        // console.log("Fetched agent data:", agentData);
        if (agentData) {
          // Update form with fetched data
          const formData = {
            company_name: agentData.company_name || "",
            company_type: agentData.company_type || "other",
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
          
          // Store original data for comparison
          setOriginalData(formData);

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
      if (!user?.subagent_team_member?.agent?.id) {
        toast.error("User not authenticated");
        return;
      }

      // Check if form data has changed
      const hasChanged = hasFormDataChanged(data);
      
      if (hasChanged) {
        // Find the country ISO2 code from the selected country
        const selectedCountry = countries.find(c => c.name === data.country);
        const country_iso2 = selectedCountry?.iso2;

        // Prepare data with country_iso2 for Odoo update
        const updatePayload = {
          ...data,
          country_iso2: country_iso2
        };

        // Update sub agent data
        const result = await updateSubAgentData(agentData?.id, updatePayload);
        
        // Update original data with the new data
        setOriginalData(data);
        
        toast.success("Business information saved successfully!");
        
        if (onSubmitSuccess) {
          onSubmitSuccess(result.data);
        }
      } else {
        // No changes detected, just proceed to next step
        if (onSubmitSuccess) {
          onSubmitSuccess(data);
        }
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





  // Check if form should be disabled - allow editing for 'in_progress' and 'approved' statuses
  const isFormDisabled = agentData?.onboarding_status && 
    !['in_progress', 'approved'].includes(agentData.onboarding_status);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
        <div className="grid grid-cols-12 gap-4">


          {/* Company Name */}
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem className="col-span-8">
                <FormLabel>
                  Company Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-white disabled:opacity-100"
                    placeholder="Enter your company name"
                    disabled={isFormDisabled}
                    {...field}
                  />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />



          {/* Company Type */}
          <FormField
            control={form.control}
            name="company_type"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel>Company Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isFormDisabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full bg-white disabled:opacity-100">
                      <SelectValue placeholder="Select a company type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent align="start">
                    <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="inc">Inc</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
                    className="bg-white disabled:opacity-100"
                    type="email"
                    placeholder="contact@yourcompany.com"
                    disabled={true}
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
                    className="bg-white disabled:opacity-100"
                    error={form.formState.errors.phone}
                    defaultCountry="PK"
                    placeholder="Enter a phone number"
                    disabled={isFormDisabled}
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
                    className="bg-white disabled:opacity-100"
                    placeholder="https://yourcompany.com"
                    disabled={isFormDisabled}
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
                      disabled={isFormDisabled}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-white disabled:opacity-100">
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
                      disabled={!form.watch("country") || loadingStates || isFormDisabled}
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
                      disabled={!form.watch("state") || loadingCities || isFormDisabled}
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
                        className="bg-white disabled:opacity-100"
                        placeholder="123 Main Street, Suite 100"
                        disabled={isFormDisabled}
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
                        className="bg-white disabled:opacity-100"
                        type="number"
                        placeholder="94105"
                        disabled={isFormDisabled}
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
             disabled={loading}
           >
             {loading && (
               <div className='flex items-center gap-[2px] mr-2'>
                 <div className='h-1 w-1 rounded-full bg-gray-200 animate-bounce [animation-delay:-0.3s]'></div>
                 <div className='h-1 w-1 rounded-full bg-gray-200 animate-bounce [animation-delay:-0.15s]'></div>
                 <div className='h-1 w-1 rounded-full bg-gray-200 animate-bounce'></div>
               </div>
             )}
             {loading ? "Saving..." : "Next"}
           </RippleButton>
         </div>
      </form>
    </Form>
  );
}
