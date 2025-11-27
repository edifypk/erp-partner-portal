import React, { useMemo, useState, useEffect } from 'react'
import EditPencil from './EditPencil'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PhoneInput } from '@/components/ui/phone-input'
import countryList from 'react-select-country-list'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { Loader2 } from 'lucide-react'
import { useContext } from 'react'
import { DataContext } from '@/context/DataContextProvider'
import { useQueryClient } from '@tanstack/react-query'
import { Call02Icon, Contact02Icon, ContactBookIcon, EarthIcon, Location04Icon, Mail01Icon, WhatsappIcon } from 'hugeicons-react'
import flags from 'react-phone-number-input/flags'
import HeadingWithLogo from './HeadingWithLogo'

const ContactInfo = ({ contact, editMode, updateContact, loading }) => {

  const [open, setOpen] = useState(false)

  // Get country and state names from associations
  const countryName = contact?.country?.name || '';
  const stateName = contact?.state?.name || '';

  var contactsList = [
    {
      label: "Phone Number",
      icon: Call02Icon,
      className: "",
      value: contact?.phone
    },
    {
      label: "Email",
      icon: Mail01Icon,
      className: "",
      value: contact?.email
    },
    {
      label: "Location",
      icon: EarthIcon,
      className: "col-span-2",
      value: [contact?.city, stateName, countryName].filter(Boolean).join(', ') || '--'
    },
    {
      label: "Address",
      icon: Location04Icon,
      className: "col-span-2",
      value: contact?.address
    },
  ]

  return (
    <div className='px-6 py-4 border rounded-xl bg-gradient-to-br from-primary/5 to-transparent'>
      <div className='flex justify-between items-start'>
        <HeadingWithLogo
          title="Contact Info"
          icon="/images/contact-sections/call.webp"
        />
        <div className='w-10 h-10 flex items-center justify-center'>
          {
            editMode ? (
              <UpdateModal loading={loading} open={open} setOpen={setOpen} contact={contact} updateContact={updateContact}>
                <EditPencil tooltip='Edit Contact Info' editMode={editMode} onClick={() => setOpen(true)} />
              </UpdateModal>
            ) : (
              null
            )
          }
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {
          contactsList.map((v, i) => {
            return (
              <div key={i} className={`flex items-center gap-2 ${v.className}`}>
                <div>
                  <v.icon size={25} strokeWidth={1} className='text-neutral-500' />
                </div>
                <div>
                  <div className='text-xs font-medium tracking-tight'>{v.label}</div>
                  <div className='text-xs font-medium  tracking-tight text-neutral-500'>{v.value || "--"}</div>
                </div>
              </div>
            )
          })
        }
      </div>

    </div>
  )
}

export default ContactInfo





const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  alt_phone: z.string().optional().refine(
    (val) => {
      // If value is empty, null, or undefined, it's valid (optional field)
      if (!val || val.trim() === "") return true;
      // Otherwise, validate the phone number
      return isValidPhoneNumber(val);
    },
    { message: "Invalid phone number" }
  ).nullable(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state_id: z.string().uuid("State is required"),
  country_id: z.string().uuid("Country is required"),
})


const UpdateModal = ({ children, open, setOpen, contact, updateContact, loading }) => {

  const queryClient = useQueryClient()

  // Get country and state IDs from associations for form defaults
  const defaultCountryId = contact?.country_id || contact?.country?.id || "";
  const defaultStateId = contact?.state_id || contact?.state?.id || "";
  const defaultCountryCode = contact?.country?.code || "";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: contact?.email || "",
      phone: contact?.phone || "",
      alt_phone: contact?.alt_phone || "",
      address: contact?.address || "",
      city: contact?.city || "",
      state_id: defaultStateId,
      country_id: defaultCountryId,
    }
  })

  // Update form values when dialog opens or contact changes
  useEffect(() => {
    if (open && contact) {
      const countryId = contact?.country_id || contact?.country?.id || "";
      const stateId = contact?.state_id || contact?.state?.id || "";
      form.reset({
        email: contact?.email || "",
        phone: contact?.phone || "",
        alt_phone: contact?.alt_phone || "",
        address: contact?.address || "",
        city: contact?.city || "",
        state_id: stateId,
        country_id: countryId,
      });
    }
  }, [open, contact, form]);

  const { getCountries, getStatesOfCountry } = useContext(DataContext)
  const countries = getCountries()

  // Get the current country_id from form to determine which states to fetch
  const currentCountryId = form.watch("country_id");
  const currentCountry = countries?.find(c => c.id === currentCountryId);
  const countryIdForStates = currentCountryId || defaultCountryId;
  const countryCodeForStates = currentCountry?.code || defaultCountryCode;

  const statesOfCountry = getStatesOfCountry({
    country_id: countryIdForStates,
    country_code: countryCodeForStates
  })





  const onSubmit = async (data) => {
    // Data already contains country_id and state_id, so we can submit directly
    await updateContact({
      form,
      data,
      setOpen
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>


      <DialogTrigger asChild>
        {children}
      </DialogTrigger>


      <DialogContent className='sm:max-w-3xl bg-gray-100'>



        <DialogHeader>
          <DialogTitle>Update Contact Info</DialogTitle>
        </DialogHeader>




        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">


            <div className='col-span-12 md:col-span-8 grid grid-cols-6 gap-4'>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input className="bg-white" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        defaultCountry="PK"
                        placeholder="Enter a phone number"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alt_phone"
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Alternate Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        defaultCountry="PK"
                        placeholder="Enter an alternate phone number"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country_id"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={(countryId) => {
                        field.onChange(countryId)
                        form.setValue("state_id", "")
                        form.setValue("city", "")
                        // Find the country object to get its code
                        const selectedCountry = countries?.find(c => c.id === countryId);
                        const countryCode = selectedCountry?.code;
                        queryClient.invalidateQueries({ queryKey: ['states-of-country', { country_id: countryId, country_code: countryCode }] })
                        queryClient.invalidateQueries({ queryKey: ['cities-of-state', { country_id: countryId, state_id: "" }] })
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          error={form.formState.errors.country_id}
                          className="bg-white"
                        >
                          <SelectValue placeholder="Select Your Country">
                            {field.value ? (() => {
                              const selectedCountry = countries?.find(c => c.id === field.value);
                              return selectedCountry?.name || "";
                            })() : ""}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          countries?.map((v, i) => {
                            const Flag = v.code ? flags[v.code] : null;
                            return (
                              <SelectItem key={i} value={v.id}>
                                <div className="flex items-center gap-2 cursor-pointer w-full flex-1">
                                  {Flag && <Flag width={20} height={20} />}
                                  {v.name}
                                </div>
                              </SelectItem>
                            )
                          })
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state_id"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={(stateId) => {
                      field.onChange(stateId)
                      form.setValue("city", "")
                      queryClient.invalidateQueries({ queryKey: ['cities-of-state', { country_id: form.getValues("country_id"), state_id: stateId }] })
                    }} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          error={form.formState.errors.state_id}
                          className="bg-white"
                        >
                          <SelectValue placeholder="Select Your State">
                            {field.value ? (() => {
                              const selectedState = statesOfCountry?.find(s => s.id === field.value);
                              return selectedState?.name || "";
                            })() : ""}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          statesOfCountry?.map((v, i) => {
                            return (
                              <SelectItem key={i} value={v.id}>
                                <div className="flex items-center gap-2 cursor-pointer w-full flex-1">
                                  {v.name}
                                </div>
                              </SelectItem>
                            )
                          })
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input className="bg-white" placeholder="City" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className='md:col-span-6'>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input className="bg-white" placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex justify-end mt-4 gap-3'>
              <Button disabled={loading} size="sm" type='button' variant='outline' onClick={() => setOpen(false)}>Discard</Button>
              <Button size="sm" type='submit' disabled={loading}>
                {loading && <Loader2 className='w-4 h-4 animate-spin' />}
                {loading ? "Updating..." : "Update"}
              </Button>
            </div>



          </form>
        </Form>




      </DialogContent>


    </Dialog>
  )
}