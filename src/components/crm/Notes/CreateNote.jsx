import RichTextEditor from '@/components/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { z } from 'zod'
import axios from 'axios'

const formSchema = z.object({
  title: z.string().min(1),
  content: z.any().refine((data) => {
    if (typeof data === 'string') {
      return false
    }
    return true
  })
})

const CreateNote = ({ application, refetch, setActiveItem }) => {

  var form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    }
  })

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/application-notes`,
        {
          ...data,
          application_id: application.id
        },
        {
          withCredentials: true
        }
      )

      refetch()
      form.reset()
      setActiveItem(null)

    } catch (error) {
      console.log(error)
    }
  }



  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 rounded-2xl bg-blue-100/70 mx-10'>


      <Form {...form}>


        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className='space-y-0'>
              <FormLabel className='text-xs'>Title <span className='text-red-500'>*</span></FormLabel>
              <FormControl>
                <Input error={form.formState.errors.title} placeholder='' {...field} />
              </FormControl>
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className='space-y-0'>
              <FormLabel className='text-xs'>Note <span className='text-red-500'>*</span></FormLabel>
              <FormControl>
                <RichTextEditor
                  defaultValue={field.value || ''}
                  onChangeContent={field.onChange}
                  className={form.formState.errors.content && 'border-red-500'}
                  placeholder=' '
                  attachmentsPath='students/1/application/1/notes-attachments'
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-3 mt-5'>
          <Button size='sm' type='button' variant='ghost' onClick={() => setActiveItem(null)}>Cancel</Button>
          <Button size='sm'>Create</Button>
        </div>
      </Form>


    </form>
  )
}

export default CreateNote
