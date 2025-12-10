"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import axios from 'axios'
import { useAuth } from '@/context/AuthContextProvider'
import { Loader2, Plus, Building2, CreditCard, CheckCircle, AlertCircle, Edit, Trash2 } from 'lucide-react'
import { Badge } from '@radix-ui/themes'
import { BankIcon, Building06Icon, Delete02Icon, Edit02Icon, PiggyBankIcon, PlusSignIcon } from 'hugeicons-react'
import { Switch } from '@/components/ui/switch'

// Zod validation schema
const bankAccountSchema = z.object({
  account_holder_name: z.string().min(1, 'Account holder name is required'),
  bank_name: z.string().min(1, 'Bank name is required'),
  account_number: z.string().min(1, 'Account number is required'),
  routing_number: z.string().optional(),
  swift_code: z.string().optional(),
  iban: z.string().optional(),
  bank_address: z.string().optional(),
  account_type: z.enum(['checking', 'savings', 'business'], {
    required_error: 'Please select an account type',
  }),
  is_primary: z.boolean().default(false),
  notes: z.string().optional(),
})

const BankDetailsPage = () => {
  const { user } = useAuth()
  const [bankAccounts, setBankAccounts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)

  const form = useForm({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      account_holder_name: '',
      bank_name: '',
      account_number: '',
      routing_number: '',
      swift_code: '',
      iban: '',
      bank_address: '',
      account_type: 'business',
      is_primary: false,
      notes: '',
    }
  })

  const fetchBankAccounts = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/bank-accounts`,
        { withCredentials: true }
      )
      setBankAccounts(response.data.data)
    } catch (error) {
      console.error('Error fetching bank accounts:', error)
      toast.error('Failed to load bank accounts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBankAccounts()
  }, [])

  const onSubmit = async (data) => {
    setIsSubmitting(true)

    const request = editingAccount
      ? axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/bank-accounts/${editingAccount.id}`,
        data,
        { withCredentials: true }
      )
      : axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/bank-accounts`,
        data,
        { withCredentials: true }
      )

    toast.promise(
      request,
      {
        loading: editingAccount ? 'Updating bank account...' : 'Adding bank account...',
        success: () => {
          form.reset()
          setIsAddDialogOpen(false)
          setIsEditDialogOpen(false)
          setEditingAccount(null)
          setIsSubmitting(false)
          fetchBankAccounts()
          return editingAccount ? 'Bank account updated successfully!' : 'Bank account added successfully!'
        },
        error: (error) => {
          setIsSubmitting(false)
          return error?.response?.data?.message || `Failed to ${editingAccount ? 'update' : 'add'} bank account`
        },
      }
    )
  }

  const handleEditAccount = (account) => {
    setEditingAccount(account)
    form.reset({
      account_holder_name: account.account_holder_name,
      bank_name: account.bank_name,
      account_number: account.account_number,
      routing_number: account.routing_number || '',
      swift_code: account.swift_code || '',
      iban: account.iban || '',
      bank_address: account.bank_address || '',
      account_type: account.account_type,
      is_primary: account.is_primary,
      notes: account.notes || '',
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteAccount = async (accountId, bankName) => {
    if (!confirm(`Are you sure you want to remove ${bankName} bank account?`)) {
      return
    }

    const deleteAccountPromise = axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/bank-accounts/${accountId}`,
      { withCredentials: true }
    )

    toast.promise(
      deleteAccountPromise,
      {
        loading: 'Removing bank account...',
        success: () => {
          fetchBankAccounts()
          return 'Bank account removed successfully!'
        },
        error: (error) => {
          return error?.response?.data?.message || 'Failed to remove bank account'
        },
      }
    )
  }

  const getAccountTypeBadge = (type) => {
    switch (type) {
      case 'business':
        return { label: 'Business', color: 'blue' }
      case 'checking':
        return { label: 'Checking', color: 'green' }
      case 'savings':
        return { label: 'Savings', color: 'orange' }
      default:
        return { label: type, color: 'gray' }
    }
  }

  const canManageBankAccounts = ['admin', 'finance'].includes(user?.subagent_team_member?.your_role)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const BankAccountForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        {/* Account Holder Name */}
        <FormField
          control={form.control}
          name="account_holder_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Holder Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bank Name */}
        <FormField
          control={form.control}
          name="bank_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input placeholder="Bank of America" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account Number */}
        <FormField
          control={form.control}
          name="account_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account Type */}
        <FormField
          control={form.control}
          name="account_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Routing Number */}
        <FormField
          control={form.control}
          name="routing_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Routing Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="021000021" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SWIFT Code */}
        <FormField
          control={form.control}
          name="swift_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SWIFT Code (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="BOFAUS3N" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* IBAN */}
        <FormField
          control={form.control}
          name="iban"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IBAN (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="GB29 NWBK 6016 1331 9268 19" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bank Address */}
        <FormField
          control={form.control}
          name="bank_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Address (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Bank branch address" rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Primary */}
        <FormField
          control={form.control}
          name="is_primary"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-sm font-medium">
                  Primary Account
                </FormLabel>
                <FormDescription className="text-xs">
                  Set this as your primary bank account for payments
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes about this account" rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsAddDialogOpen(false)
              setIsEditDialogOpen(false)
              setEditingAccount(null)
              form.reset()
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {editingAccount ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              editingAccount ? 'Update Account' : 'Add Account'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Bank Accounts</h2>
        {canManageBankAccounts && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => {
                setEditingAccount(null)
                form.reset()
              }}>
                <PiggyBankIcon />
                Add Bank
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Bank Account</DialogTitle>
              </DialogHeader>
              <BankAccountForm />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Bank Account</DialogTitle>
          </DialogHeader>
          <BankAccountForm />
        </DialogContent>
      </Dialog>

      {/* Bank Accounts List */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-8 mb-8">
        {bankAccounts.length === 0 ? (
          <div className="bg-linear-to-br from-primary/5 to-transparent rounded-3xl border p-6 col-span-2 text-center py-10">
            <BankIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" strokeWidth={1} />
            <h3 className="text-lg font-semibold tracking-tight text-gray-900">No Bank Accounts Added Yet!</h3>
            <p className="text-xs text-gray-500">
              Add a bank account to receive payments for your commissions
            </p>
          </div>
        ) : (
          bankAccounts.map((account) => {
            const accountType = getAccountTypeBadge(account.account_type)
            return (
              <div
                key={account.id}
                className="bg-linear-to-br group relative from-primary/5 to-transparent rounded-3xl border p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <BankIcon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">
                        {account.bank_name}
                      </h3>
                      <div className='text-xs font-medium text-neutral-500 dark:text-neutral-400'>{account.account_holder_name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge size="2" variant="soft" radius="full" color={accountType.color}>
                      {accountType.label}
                    </Badge>
                    {account.is_primary && (
                      <Badge size="2" variant="soft" radius="full" color="violet">Primary</Badge>
                    )}
                    {account.is_verified && (
                      <Badge size="2" variant="soft" radius="full" color="green">Verified</Badge>
                    )}
                  </div>
                </div>

                <div className='space-y-2 text-neutral-500 dark:text-neutral-400'>
                  <div className="text-xs">
                    <span className="font-medium">Account:</span> ••••{account.account_number.slice(-4)}
                  </div>
                  {account.routing_number && (
                    <div className="text-xs">
                      <span className="font-medium">Routing:</span> {account.routing_number}
                    </div>
                  )}
                  {account.swift_code && (
                    <div className="text-xs">
                      <span className="font-medium">SWIFT:</span> {account.swift_code}
                    </div>
                  )}
                  {account.iban && (
                    <div className="text-xs">
                      <span className="font-medium">IBAN:</span> {account.iban}
                    </div>
                  )}
                  {account.bank_address && (
                    <div className="text-xs">
                      <span className="font-medium">Address:</span> {account.bank_address}
                    </div>
                  )}
                  {account.notes && (
                    <div className="text-xs mt-2 pt-2 border-t">
                      <span className="font-medium">Notes:</span> {account.notes}
                    </div>
                  )}
                </div>

                {/* {account.createdAt && (
                  <div className="text-xs text-gray-500 mt-2">
                    Added {new Date(account.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )} */}

                {/* Actions */}
                {canManageBankAccounts && (
                  <div className='group-hover:opacity-100 opacity-0 transition-opacity duration-200 absolute bottom-3 right-3 flex gap-2'>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAccount(account)}
                      className="w-8 h-8 p-0 hover:bg-blue-50"
                    >
                      <img src="/images/actions/edit.svg" alt="Edit" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAccount(account.id, account.bank_name)}
                      className="text-red-600 w-8 h-8 p-0 hover:text-red-700 hover:bg-red-50"
                    >
                      <img src="/images/actions/trash.svg" alt="Delete" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Info Card */}
      {bankAccounts.length > 0 && (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <div className="bg-linear-to-br tracking-tight from-primary/5 to-transparent rounded-3xl border p-6">
            <div className="flex items-start gap-3">
              <div className='flex-1'>
                <h4 className="text-sm font-semibold mb-2">Bank Account Information</h4>
                <ul className="text-xs space-y-1">
                  <li><strong className='font-semibold'>Primary:</strong> Used for all commission payments</li>
                  <li><strong className='font-semibold'>Verified:</strong> Account has been verified by admin</li>
                  <li><strong className='font-semibold'>Security:</strong> Account details are encrypted and secure</li>
                </ul>
              </div>
              <AlertCircle className='text-primary/50' strokeWidth={1.5} size={24} />

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BankDetailsPage
