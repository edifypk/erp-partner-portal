import React, { useState } from 'react'
import EditPencil from './EditPencil'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Loader2 } from 'lucide-react'
import { UserCircleIcon } from 'hugeicons-react'


function formatDate(date) {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options).replace(',', '');
}

const formSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  gender: z.string().min(1, "Gender is required"),
  dob: z.date(),
  marital_status: z.string().optional().nullable(),
  religion: z.enum(['islam', 'christianity', 'hinduism', 'buddhism', 'judaism', 'other']).optional().nullable(),
  cnic: z.string().optional(),
  passport: z.string().optional(),
  passport_expiry_date: z.date().optional().nullable(),
})

const PersonalInfo = ({ contact, editMode, updateContact, loading }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className='p-6 pt-4 border rounded-xl bg-gradient-to-br from-primary/5 to-transparent'>
      <div className='flex justify-between items-center mb-2'>
        <h2 className='tracking-normal font-semibold flex items-center gap-1'>
          <UserCircleIcon className='-translate-x-1' />
          Personal Information
        </h2>
        <div className='w-10 h-10 flex items-center justify-center'>
          {
            editMode ? (
              <UpdateModal loading={loading} open={open} setOpen={setOpen} contact={contact} updateContact={updateContact}>
                <EditPencil tooltip='Edit Personal Information' editMode={editMode} onClick={() => setOpen(true)} />
              </UpdateModal>
            ) : (
              null
              // <img src="/images/icons/student.png" className='w-12' alt="" />
            )
          }
        </div>
      </div>

      <div className='grid lg:grid-cols-2 xl:grid-cols-4 gap-4'>


        <div className=''>
          <div className='text-xs font-medium tracking-tight'>Gender</div>
          <div className='text-xs font-medium  tracking-tight text-neutral-500 capitalize'>{contact?.gender}</div>
        </div>
        <div className=''>
          <div className='text-xs font-medium tracking-tight'>Date of Birth</div>
          <div className='text-xs font-medium  tracking-tight text-neutral-500 uppercase'>{formatDate(contact?.dob)}</div>
        </div>
        <div className=''>
          <div className='text-xs font-medium tracking-tight'>Marital Status</div>
          <div className='text-xs font-medium  tracking-tight text-neutral-500 capitalize'>{contact?.marital_status ? contact?.marital_status : '--'}</div>
        </div>
        <div className=''>
          <div className='text-xs font-medium tracking-tight'>Religion</div>
          <div className='text-xs font-medium  tracking-tight text-neutral-500 capitalize'>{contact?.religion ? contact?.religion : '--'}</div>
        </div>
        <div className=''>
          <div className='text-xs font-medium tracking-tight'>CNIC</div>
          <div className='text-xs font-medium  tracking-tight text-neutral-500'>{contact?.cnic ? contact?.cnic : '--'}</div>
        </div>
        <div className=''>
          <div className='text-xs font-medium tracking-tight'>Passport</div>
          <div className='text-xs font-medium  tracking-tight text-neutral-500'>{contact?.passport ? contact?.passport : '--'}</div>
        </div>
        <div className=''>
          <div className='text-xs font-medium tracking-tight'>Passport Expiry</div>
          <div className='text-xs font-medium  tracking-tight text-neutral-500'>{contact?.passport_expiry_date ? formatDate(contact?.passport_expiry_date) : '--'}</div>
        </div>

      </div>

    </div>
  )
}

const UpdateModal = ({ children, open, setOpen, contact, updateContact, loading }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: contact?.name || '',
      gender: contact?.gender || '',
      dob: contact?.dob ? new Date(contact?.dob) : null,
      marital_status: contact?.marital_status || null,
      religion: contact?.religion || null,
      cnic: contact?.cnic || '',
      passport: contact?.passport || '',
      passport_expiry_date: contact?.passport_expiry_date ? new Date(contact?.passport_expiry_date) : null,
    }
  })

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

      <DialogContent className='sm:max-w-2xl bg-gray-100'>
        <DialogHeader>
          <DialogTitle>Update Personal Information</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className='grid grid-cols-2 gap-4'>


              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input className="bg-white" placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />



              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <DatePicker
                        disabled={{ after: new Date() }}
                        startMonth={new Date(new Date().getFullYear() - 100, 0)}
                        endMonth={new Date(new Date().getFullYear(), new Date().getMonth())}
                        {...field}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marital_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={field.value ? "text-black bg-white" : "text-gray-500 bg-white"}>
                          <SelectValue placeholder="Select Marital Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className="text-gray-500" value={null}>Not Specified</SelectItem>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Religion</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={field.value ? "text-black bg-white" : "text-gray-500 bg-white"}>
                          <SelectValue placeholder="Select Religion" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className="text-gray-500" value={null}>Not Specified</SelectItem>
                        <SelectItem value="islam">Islam</SelectItem>
                        <SelectItem value="christianity">Christianity</SelectItem>
                        <SelectItem value="hinduism">Hinduism</SelectItem>
                        <SelectItem value="buddhism">Buddhism</SelectItem>
                        <SelectItem value="judaism">Judaism</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cnic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNIC</FormLabel>
                    <FormControl>
                      <Input className="bg-white" placeholder="CNIC Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Number</FormLabel>
                    <FormControl>
                      <Input className="bg-white" placeholder="Passport Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passport_expiry_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Expiry Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        disabled={{ before: new Date() }}
                        startMonth={new Date(new Date().getFullYear(), new Date().getMonth())}
                        endMonth={new Date(new Date().getFullYear() + 20, 11)}
                        {...field}
                        className="bg-white"
                      />
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

export default PersonalInfo