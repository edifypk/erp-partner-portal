"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { PasswordValidationIcon } from 'hugeicons-react'

// Zod validation schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const ResetPassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)

    const changePasswordPromise = axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users/change-password`,
      {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      },
      { withCredentials: true }
    )

    toast.promise(
      changePasswordPromise,
      {
        loading: 'Updating your password...',
        success: (response) => {
          form.reset()
          setIsSubmitting(false)
          return 'Password changed successfully!'
        },
        error: (error) => {
          setIsSubmitting(false)
          return error?.response?.data?.message || 'Failed to change password'
        },
      }
    )
  }

  return (
    <div className="bg-linear-to-br from-primary/5 to-transparent rounded-3xl border p-6">


      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          <div className='flex items-center gap-2 justify-between'>
            <div>
              <h2 className='text-lg font-semibold'>Change Your Password</h2>
              {/* <p className='text-xs text-gray-500'>Update your password to keep your account secure.</p> */}
            </div>
            <div>
              {/* <PasswordValidationIcon strokeWidth={0.8} size={30} /> */}
            </div>
          </div>



          {/* Current Password */}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-gray-500">
                  Current Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Enter your current password"
                      error={form.formState.errors.currentPassword}
                      className="pr-10 bg-white"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          {/* New Password */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-gray-500">
                  New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      className="pr-10 bg-white"
                      error={form.formState.errors.newPassword}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                {form.formState.errors.newPassword && <FormDescription className="text-xs text-gray-500">
                  Must be at least 8 characters with uppercase, lowercase, and numbers.
                </FormDescription>}
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-gray-500">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      className="pr-10 bg-white"
                      error={form.formState.errors.confirmPassword}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ResetPassword
