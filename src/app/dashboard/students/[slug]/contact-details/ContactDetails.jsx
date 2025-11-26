"use client"
import React, { useState } from 'react'
import PersonalInfo from './PersonalInfo'
import ContactInfo from './ContactInfo'
import EducationHistory from './EducationHistory'
import EnglishTests from './EnglishTests'
import WorkExperience from './WorkExperience'
import TravelHistory from './TravelHistory'
import RefusalHistory from './RefusalHistory'
import AbroadRelatives from './AbroadRelatives'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'


const ContactDetails = ({ contact , editMode = true }) => {

  const [loading, setLoading] = useState(false)
  var router = useRouter()

  const updateContact = async ({ form, data, setOpen }) => {
    setLoading(true)
    const submitPromise = new Promise(async (resolve, reject) => {
      try {
        // Use contact_id from contact object (the API expects contact_id as the route parameter)
        const contactId = contact?.contact_id || contact?.id;
        
        if (!contactId) {
          throw new Error("Contact ID is required to update student");
        }

        // Wrap data in contact object as expected by the API
        const requestData = {
          contact: data
        };

        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/students/${contactId}`,
          requestData,
          {
            withCredentials: true
          }
        );

        if (res.status === 200) {
          resolve(res.data);
          router.refresh()
          setLoading(false)
          setOpen(false)
        }


      } catch (error) {
        // Check if error.response exists before accessing its properties
        if (error?.response?.status === 400) {
          if (error.response?.data?.error) {
            form.setError(error.response?.data?.error?.path, { message: error.response?.data?.error?.message }, { shouldFocus: true });
          }
        }
        reject(error)
      } finally {
        setLoading(false)
      }
    });

    toast.promise(
      submitPromise,
      {
        loading: "Updating...",
        success: () => `Updated successfully`, // Customize success message
        error: (err) => err?.response?.data?.message || err.message, // Display error from the backend or default message
      }
    );
  };





  return (
    <div className=''>
      <div className='space-y-4'>
        <PersonalInfo loading={loading} contact={contact} editMode={editMode} updateContact={updateContact} />
        <ContactInfo loading={loading} contact={contact} editMode={editMode} updateContact={updateContact} />
        <EducationHistory loading={loading} contact={contact} editMode={editMode} updateContact={updateContact} />
        <EnglishTests loading={loading} contact={contact} editMode={editMode} updateContact={updateContact} />
        <WorkExperience loading={loading} contact={contact} editMode={editMode} updateContact={updateContact} />
        <TravelHistory loading={loading} contact={contact} editMode={editMode} updateContact={updateContact} />
        <RefusalHistory loading={loading} contact={contact} editMode={editMode} updateContact={updateContact} />
        <AbroadRelatives loading={loading} contact={contact} editMode={editMode} updateContact={updateContact} />
      </div>
    </div>
  )
}

export default ContactDetails