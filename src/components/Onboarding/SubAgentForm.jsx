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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useData } from "@/context/DataContextProvider";
import flags from 'react-phone-number-input/flags';

// Zod validation schema for sub agent form
const subAgentSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_type: z.enum(['sole_proprietorship', 'partnership', 'corporation', 'llc', 'inc', 'other']),
  website: z.string().url("Please enter a valid website URL"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().refine((val) => !val || isValidPhoneNumber(val), {
    message: "Invalid phone number"
  }).optional(),
  country_id: z.string().min(1, "Please select a country"),
  state_id: z.string().min(1, "Please select a state"),
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
  const queryClient = useQueryClient();
  const { getCountries, getStatesOfCountry } = useData();
  const countriesData = getCountries();

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
      'country_id', 'state_id', 'city', 'zip_code', 'address'
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
      country_id: defaultValues.country_id || "",
      state_id: defaultValues.state_id || "",
      city: defaultValues.city || "",
      zip_code: defaultValues.zip_code || "",
      address: defaultValues.address || "",
    },
    mode: "onChange"
  });

  // Load sub agent data and countries on component mount
  useEffect(() => {
    const loadData = async () => {
      // Update countries from DataContext
      if (countriesData && countriesData.length > 0) {
        setCountries(countriesData);
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
            country_id: agentData.country?.id || agentData.country_id || "",
            state_id: agentData.state?.id || agentData.state_id || "",
            city: agentData.city || "",
            zip_code: agentData.zip_code || "",
            address: agentData.address || "",
          };
          // console.log("Setting form data:", formData);
          form.reset(formData);
          
          // Store original data for comparison
          setOriginalData(formData);

          // Note: States will be loaded reactively via the form.watch("country_id") pattern below
          // No need to manually call getStatesOfCountry here - it's already set up reactively
        }
      }
    };

    loadData();
  }, [user, countriesData]);

  // Watch selected country and fetch states reactively
  const selectedCountryId = form.watch("country_id");
  const selectedCountry = countries?.find(country => country.id === selectedCountryId);
  const statesData = getStatesOfCountry(
    selectedCountry 
      ? { country_code: selectedCountry.code, country_id: selectedCountry.id }
      : {}
  );

  // Update states when country changes or when states data arrives
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
  }, [selectedCountryId, statesData?.length]); // Include statesData.length to detect when query completes

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
        const selectedCountry = countries.find(c => c.id === data.country_id);
        const country_iso2 = selectedCountry?.code;

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
                name="country_id"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={(countryId) => {
                        field.onChange(countryId);
                        form.setValue("state_id", "");
                        form.setValue("city", "");
                        queryClient.invalidateQueries({ queryKey: ['states-of-country', { country_id: countryId }] });
                      }}
                      value={field.value}
                      disabled={isFormDisabled}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-white disabled:opacity-100">
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
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                control={form.control}
                name="state_id"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={(stateId) => {
                        field.onChange(stateId);
                        form.setValue("city", "");
                      }}
                      value={field.value}
                      disabled={!form.watch("country_id") || isFormDisabled}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-white disabled:opacity-100">
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
                    <FormControl>
                      <Input
                        className="bg-white disabled:opacity-100"
                        placeholder="Enter city name"
                        disabled={isFormDisabled}
                        {...field}
                      />
                    </FormControl>
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
