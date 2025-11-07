"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import axios from 'axios'
import { useAuth } from '@/context/AuthContextProvider'
import { Loader2, UserPlus, Mail, Phone, Briefcase, Shield, Eye, EyeOff, Trash2 } from 'lucide-react'
import { RippleButton } from '@/components/ui/shadcn-io/ripple-button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@radix-ui/themes'
import { Call02Icon, Mail01Icon, SecurityCheckIcon, UserAdd02Icon } from 'hugeicons-react'

// Zod validation schema
const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  your_role: z.enum(['admin', 'staff', 'finance'], {
    required_error: 'Please select a role',
  }),
  job_title: z.string().optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

const TeamMembersPage = () => {
  const { user } = useAuth()
  const [teamMembers, setTeamMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      your_role: 'staff',
      job_title: '',
      password: '',
    }
  })

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/team-members`,
        { withCredentials: true }
      )
      setTeamMembers(response.data.data)
    } catch (error) {
      console.error('Error fetching team members:', error)
      toast.error('Failed to load team members')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const onSubmit = async (data) => {
    setIsSubmitting(true)

    const addMemberPromise = axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/team-members`,
      data,
      { withCredentials: true }
    )

    toast.promise(
      addMemberPromise,
      {
        loading: 'Adding team member...',
        success: () => {
          form.reset()
          setIsAddDialogOpen(false)
          setIsSubmitting(false)
          fetchTeamMembers()
          return 'Team member added successfully!'
        },
        error: (error) => {
          setIsSubmitting(false)
          return error?.response?.data?.message || 'Failed to add team member'
        },
      }
    )
  }

  const handleDeleteMember = async (memberId, memberName) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from your team?`)) {
      return
    }

    const deleteMemberPromise = axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/team-members/${memberId}`,
      { withCredentials: true }
    )

    toast.promise(
      deleteMemberPromise,
      {
        loading: 'Removing team member...',
        success: () => {
          fetchTeamMembers()
          return 'Team member removed successfully!'
        },
        error: (error) => {
          return error?.response?.data?.message || 'Failed to remove team member'
        },
      }
    )
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'finance':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'staff':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const isUserAdmin = user?.subagent_team_member?.your_role === 'admin'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <h2 className="text-lg font-semibold">Team Members</h2>
        {isUserAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>


            <DialogTrigger asChild>
              <Button size="sm">
                <UserAdd02Icon />
                Add Member
              </Button>
            </DialogTrigger>


            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Role */}
                  <FormField
                    control={form.control}
                    name="your_role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          Admin: Full access. Staff: Limited access. Finance: Financial access.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Job Title */}
                  <FormField
                    control={form.control}
                    name="job_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Regional Manager" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a strong password"
                              className="pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Must be at least 8 characters with uppercase, lowercase, and numbers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Member'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Team Members List */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
        {teamMembers.length === 0 ? (
          <div className="text-center col-span-2 py-12 bg-white rounded-lg border border-gray-200">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Add team members to collaborate and manage your sub-agent account
            </p>
          </div>
        ) : (
          teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-linear-to-br group relative from-primary/5 to-transparent rounded-3xl border p-6"
            >
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border">
                    <AvatarImage src={member.contact?.photo_url || '/images/placeholder/male.png'} />
                    <AvatarFallback>{member.contact?.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="text-sm font-semibold ">
                      {member.contact?.name || 'Unknown'}
                    </h3>
                    <div className='text-xs font-medium text-neutral-500'>{member.job_title}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge size="2" variant="soft" radius="full" color={getRoleBadgeColor(member.your_role)}>
                    {member.your_role?.charAt(0).toUpperCase() + member.your_role?.slice(1)}
                  </Badge>
                  {member.user?.is_active && (
                    <Badge size="2" variant="soft" radius="full" color="green">Active</Badge>
                  )}
                </div>

              </div>

              <div className='my-4'>

                <div className="flex flex-col gap-1">
                  {member.contact?.email && (
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Mail01Icon size={18} />
                      {member.contact.email}
                    </div>
                  )}
                  {member.contact?.phone && (
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <Call02Icon size={18} />
                      {member.contact.phone}
                    </div>
                  )}
                </div>

              </div>


              {member.user?.createdAt && (
                <div className="text-xs text-neutral-600 mt-2">
                  Joined {new Date(member.user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}


              {/* Actions */}
              <div className='group-hover:opacity-100 opacity-0 transition-opacity duration-200 absolute bottom-3 right-3'>
                {isUserAdmin && member.your_role !== 'admin' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMember(member.id, member.contact?.name)}
                    className="text-red-600 w-8 h-8 p-0 hover:text-red-700 hover:bg-red-50"
                  >
                    <img src="/images/actions/trash.svg" alt="" />
                  </Button>
                )}
              </div>


            </div>
          ))
        )}
      </div>


      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Info Card */}
        {teamMembers.length > 0 && (
          <div className="bg-linear-to-br tracking-tight from-primary/5 to-transparent rounded-3xl border p-6">
            <div className="flex items-start gap-3">
              <div className='flex-1'>
                <h4 className="text-sm font-semibold mb-2">Team Member Roles</h4>
                <ul className="text-xs space-y-1 dark:text-neutral-400">
                  <li><strong className='font-semibold dark:text-white'>Admin:</strong> Full access to all features and settings</li>
                  <li><strong className='font-semibold dark:text-white'>Staff:</strong> Can manage applications and students</li>
                  <li><strong className='font-semibold dark:text-white'>Finance:</strong> Access to financial reports and invoices</li>
                </ul>
              </div>
              <SecurityCheckIcon className='text-primary/50' size={24} />
            </div>
          </div>
        )}
      </div>


    </div>
  )
}

export default TeamMembersPage
