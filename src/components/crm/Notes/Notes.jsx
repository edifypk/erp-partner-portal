"use client"
import { PlusSignIcon } from 'hugeicons-react'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import RichTextEditor from '@/components/RichTextEditor'
import CreateNote from './CreateNote'
import NotePreview from './NotePreview'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { format } from 'timeago.js'




const Notes = ({ application }) => {

    const [activeItem, setActiveItem] = useState(null)
    const [activeNote, setActiveNote] = useState(null)


    const getApplicationNotes = async (applicationId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/application-notes?application_id=${applicationId}`, {
                params: {
                    include: 'creater,files'
                },
                withCredentials: true
            })
            return response.data?.data
        } catch (error) {
            console.log(error)
            return []
        }
    }

    const notes = useQuery({
        queryKey: ['notes', application.id],
        queryFn: () => getApplicationNotes(application.id)
    })


    useEffect(() => {

        if (!notes?.isLoading) {

        }

    }, [notes?.isLoading])



    return (
        <div>


            <div className='flex gap-2 items-center mb-4 justify-between'>
                <div className='text-lg font-semibold tracking-tight'>Notes</div>
                <button onClick={() => { setActiveItem('create'); setActiveNote(null) }} className='cursor-pointer bg-blue-50 font-medium tracking-tight border px-2 py-1 rounded-md flex items-center gap-1 text-blue-500'>
                    <PlusSignIcon strokeWidth={2} size={15} />
                    <span className='text-xs'>Create Note</span>
                </button>
            </div>

            <div className='space-y-10'>

                {activeItem === 'create' && <CreateNote setActiveItem={setActiveItem} refetch={notes.refetch} application={application} />}


                {/* Notes List */}
                <div className="space-y-10">
                    {
                        notes.isLoading ?
                            <div className='text-center text-gray-500'>Loading...</div>
                            :
                            notes.data?.length === 0 ?
                                <div className='flex flex-col items-center justify-center py-10 tracking-tight bg-gray-50 rounded-2xl'>
                                    <div className='w-20 mb-4'>
                                        <img src="/images/thinking-girl.png" alt="" />
                                    </div>
                                    <div className='text-sm font-semibold text-gray-700'>No Notes Created Yet</div>
                                    <div className='text-xs text-gray-500'>If a note is created, it will appear here</div>
                                </div>
                                :
                                notes.data?.map((v) => {
                                    return (
                                        <NotePreview key={v.id} note={v} />
                                    )
                                })
                    }
                </div>


            </div>
        </div>
    )
}

export default Notes

