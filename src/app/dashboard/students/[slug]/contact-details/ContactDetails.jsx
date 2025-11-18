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


const ContactDetails = ({ contact , editMode = true }) => {

  const [loading, setLoading] = useState(false)
  var router = useRouter()

  const updateContact = async ({ form, data, setOpen }) => {
    setLoading(true)
    const submitPromise = new Promise(async (resolve, reject) => {
      try {

        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/enquiries/${student?.id}`,
          data,
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
        if (error.response.status === 400) {
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