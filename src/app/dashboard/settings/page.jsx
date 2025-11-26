"use client"
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContextProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import AvatarPicker from '@/components/AvatarPicker'
import { getPresignedUrlToRead } from '@/utils/functions'
import axios from 'axios'
import { toast } from 'sonner'
import { Building2, Mail, Phone, MapPin, Globe, User, Loader2, ImageIcon, Camera, CheckCircle2, Edit2, ExternalLink } from 'lucide-react'
import { Call02Icon, CheckmarkBadge02Icon, Globe02Icon, Location01Icon, Mail02Icon, PencilEdit02Icon } from 'hugeicons-react'

import { ThemeSwitcher } from '@/components/ui/shadcn-io/theme-switcher';
import { useTheme } from 'next-themes'
import ThemeColorToggle from '@/components/ThemColorToggle'


const GeneralSettings = () => {
  const { agentData, fetchAgentData } = useAuth()
  const [logoUrl, setLogoUrl] = useState('')
  const [isLoadingLogo, setIsLoadingLogo] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { theme, setTheme } = useTheme()




  // Form states for editable fields (empty by default)
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    contact_person_name: '',
  })

  // Load logo only
  useEffect(() => {
    if (agentData) {
      // Load logo
      if (agentData.logo?.path) {
        loadLogo(agentData.logo.path)
      } else {
        setIsLoadingLogo(false)
      }
    }
  }, [agentData])

  const loadLogo = async (path) => {
    try {
      setIsLoadingLogo(true)
      const url = await getPresignedUrlToRead(path)
      setLogoUrl(url)
    } catch (error) {
      console.error('Error loading logo:', error)
    } finally {
      setIsLoadingLogo(false)
    }
  }

  const handleLogoUpload = async (uploadedFile, setIsSaved) => {
    try {
      setIsSaving(true)

      // Update the sub-agent with the new logo
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${agentData.id}`,
        {
          logo_id: uploadedFile.id
        },
        { withCredentials: true }
      )

      if (response.status === 200) {
        toast.success('Logo updated successfully')
        setIsSaved()

        // Refresh agent data to get the new logo
        await fetchAgentData()
      }
    } catch (error) {
      console.error('Error updating logo:', error)
      toast.error(error?.response?.data?.message || 'Failed to update logo')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateInfo = async () => {
    try {
      setIsSaving(true)

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${agentData.id}`,
        formData,
        { withCredentials: true }
      )

      if (response.status === 200) {
        toast.success('Information updated successfully')
        setIsEditDialogOpen(false)

        // Refresh agent data
        await fetchAgentData()
      }
    } catch (error) {
      console.error('Error updating information:', error)
      toast.error(error?.response?.data?.message || 'Failed to update information')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleOpenDialog = () => {
    // Load current agent data into form
    if (agentData) {
      setFormData({
        company_name: agentData.company_name || '',
        email: agentData.email || '',
        phone: agentData.phone || '',
        address: agentData.address || '',
        website: agentData.website || '',
        contact_person_name: agentData.contact_person_name || '',
      })
    }
    setIsEditDialogOpen(true)
  }

  if (!agentData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="">
      {/* Header Section with Logo and Company Name */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="flex items-center justify-between">


          <div className="flex items-center gap-6">
            {/* Large Circular Logo */}
            <div className="relative group">
              {isLoadingLogo ? (
                <div className="w-20 h-20 rounded-full border-2 border-primary/20 flex items-center justify-center bg-gray-50">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : logoUrl ? (
                <div className="relative">
                  <img
                    src={agentData.logo_url}
                    alt="Company Logo"
                    className="w-20 h-20 object-cover rounded-full p-[1px] border-2 border-primary/20 bg-white"
                  />
                  {agentData.onboarding_status === 'approved' && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7">
                      <CheckmarkBadge02Icon className='dark:text-black text-white fill-primary' />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-primary/20 flex items-center justify-center bg-gray-50">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                </div>
              )}

              {/* Hover Upload Button */}
              <AvatarPicker
                path="uploads/sub-agents/logos"
                type="logo"
                saveMessage="Upload Logo"
                onSave={handleLogoUpload}
                showBackgroundRemoval={false}
              >
                <button className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-center justify-center group-hover:opacity-100 opacity-0">
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </AvatarPicker>
            </div>

            {/* Company Name and Status */}
            <div>
              <h1 className="text-xl font-bold">
                {agentData.company_name || 'Company Name'}
              </h1>

              {agentData.website ? (
                <a href={agentData.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  {agentData.website}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                'Not provided'
              )}



            </div>
          </div>


          <div className='space-y-2'>
            <div className='flex justify-end'>
              {/* <ThemeSwitcher
                value={theme}
                onChange={setTheme}
                className="scale-100"
              /> */}
            </div>
            <ThemeColorToggle />
          </div>


        </div>
      </div>

      {/* Information Display Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


        {/* Contact Information Card */}
        <div className="bg-linear-to-br from-primary/5 to-transparent rounded-3xl border p-6">


          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            {/* Edit Button */}
            <Button onClick={handleOpenDialog} size="sm" variant="outline" className="w-8 h-8 p-0">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" id="«r65»" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m11.4 18.161l7.396-7.396a10.3 10.3 0 0 1-3.326-2.234a10.3 10.3 0 0 1-2.235-3.327L5.839 12.6c-.577.577-.866.866-1.114 1.184a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.775-.258 1.162-.387 1.526-.56q.647-.308 1.211-.749c.318-.248.607-.537 1.184-1.114m9.448-9.448a3.932 3.932 0 0 0-5.561-5.561l-.887.887l.038.111a8.75 8.75 0 0 0 2.092 3.32a8.75 8.75 0 0 0 3.431 2.13z"></path></svg>
            </Button>
          </div>



          <div className="space-y-2">

            <div className="text-sm flex items-center gap-2">
              <Mail02Icon className="text-primary" size={16} />
              {agentData.email || 'Not provided'}
            </div>

            <div className="text-sm flex items-center gap-2">
              <Call02Icon className="text-primary" size={16} />
              {agentData.phone || 'Not provided'}
            </div>

            <div className="text-sm flex items-center gap-2">
              <Globe02Icon className="text-primary" size={16} />
              {(agentData.city || agentData.state || agentData.country) && (
                <div>
                  {[agentData.city, agentData.state?.name, agentData.country?.name].filter(Boolean).join(', ')}
                </div>
              )}
            </div>

            <div className="text-sm flex items-start gap-2">
              <Location01Icon className="text-primary" size={16} />
              <div>
                {agentData.address || 'Not provided'}
              </div>
            </div>

          </div>
        </div>



      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Company Information</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit_company_name">Company Name</Label>
              <Input
                id="edit_company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Enter company name"
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_email">Email Address</Label>
                <Input
                  id="edit_email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="edit_phone">Phone Number</Label>
                <Input
                  id="edit_phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit_website">Website</Label>
              <Input
                id="edit_website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://www.example.com"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="edit_address">Full Address</Label>
              <Input
                id="edit_address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main St, City, State, Country"
                className="mt-1.5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateInfo} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GeneralSettings
