import React, { useMemo, useState } from 'react'
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

const ContactInfo = ({ contact, editMode, updateContact, loading }) => {

  const [open, setOpen] = useState(false)
  var contactsList = [
    {
      label: "Phone Number",
      icon: Call02Icon,
      className:"",
      value: contact?.phone
    },
    {
      label: "Email",
      icon: Mail01Icon,
      className:"",
      value: contact?.email
    },
    {
      label: "Location",
      icon: EarthIcon,
      className:"col-span-2",
      value: `${contact?.city}, ${contact?.state}, ${contact?.country}`
    },
    {
      label: "Address",
      icon: Location04Icon,
      className:"col-span-2",
      value: contact?.address
    },
  ]

  return (
    <div className='px-6 pt-4 pb-2 border rounded-xl bg-gradient-to-br from-primary/5 to-transparent'>
      <div className='flex justify-between items-start'>
        <h2 className='tracking-normal font-semibold flex items-center gap-1'>
          <Contact02Icon className='-translate-x-1' />
          Contact Info
          </h2>
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
  alt_phone: z.string().optional().refine(isValidPhoneNumber, { message: "Invalid phone number" }).nullable(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Nationality is required"),
})


const UpdateModal = ({ children, open, setOpen, contact, updateContact, loading }) => {

  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: contact?.email || "",
      phone: contact?.phone || "",
      alt_phone: contact?.alt_phone || "",
      address: contact?.address || "",
      city: contact?.city || "",
      state: contact?.state || "",
      country: contact?.country || "",
    }
  })


  const { getCountries, getStatesOfCountry } = useContext(DataContext)
  const countries = getCountries()
  const statesOfCountry = getStatesOfCountry({ country: form.getValues("country") })





  const onSubmit = async (data) => {
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
                name="country"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={(country) => {
                        field.onChange(country)
                        form.setValue("state", "")
                        form.setValue("city", "")
                        queryClient.invalidateQueries({ queryKey: ['states-of-country', { country: country }] })
                        queryClient.invalidateQueries({ queryKey: ['cities-of-state', { country: country, state: "" }] })
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          error={form.formState.errors.country}
                          className="bg-white"
                        >
                          <SelectValue placeholder="Select Your Country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          countries?.map((v, i) => {
                            // var Flag = flags[v.value]
                            return (
                              <SelectItem key={i} value={v.name}>
                                <div className="flex items-center gap-2 cursor-pointer w-full flex-1">
                                  <img className='w-5 h-4' src={v.flag} alt="" />
                                  {v.name}
                                </div>
                              </SelectItem>
                            )
                          })
                        }
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={(state) => {
                      field.onChange(state)
                      form.setValue("city", "")
                      queryClient.invalidateQueries({ queryKey: ['cities-of-state', { country: form.getValues("country"), state: state }] })
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger
                          error={form.formState.errors.state}
                          className="bg-white"
                        >
                          <SelectValue placeholder="Select Your State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          statesOfCountry?.map((v, i) => {
                            return (
                              <SelectItem key={i} value={v.name}>
                                <div className="flex items-center gap-2 cursor-pointer w-full flex-1">
                                  {v.name}
                                </div>
                              </SelectItem>
                            )
                          })
                        }
                      </SelectContent>
                    </Select>
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