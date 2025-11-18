"use client"
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CourseInfo from './CourseInfo'
import Documents from '@/components/crm/Documents/Documents'
import { useSearchQuery } from '@/hooks/useSearchQuery'
import Notes from '@/components/crm/Notes/Notes'

const ApplicationRequestTabs = ({ application }) => {

    const {applySearchQueries,CustomSearchParams} = useSearchQuery()
    const [activeTab, setActiveTab] = useState(CustomSearchParams.get('tab') || 'course-info')


    return (
        <div>
            <Tabs defaultValue={activeTab} onValueChange={(value)=>{
                setActiveTab(value)
                applySearchQueries([{name: 'tab', value: value}])
            }} className="">

                <div className='flex'>
                    <TabsList className=" bg-white border">
                        <TabsTrigger className='text-xs tracking-tight' value="course-info">Course Info</TabsTrigger>
                        <TabsTrigger className='text-xs tracking-tight' value="documents">Documents</TabsTrigger>
                        <TabsTrigger className='text-xs tracking-tight' value="notes">Notes</TabsTrigger>
                        {/* <TabsTrigger className='text-xs tracking-tight' value="requirements">Requirements</TabsTrigger>
                        <TabsTrigger className='text-xs tracking-tight' value="activity-log">Activities</TabsTrigger> */}
                        {/* <TabsTrigger className='text-xs tracking-tight' value="activities">Activities</TabsTrigger> */}
                    </TabsList>
                </div>


                <TabsContent value="course-info">
                    <div className='bg-white rounded-2xl shadow-sm shadow-black/20 p-4 min-h-24'>
                        <CourseInfo application={application} />
                    </div>
                </TabsContent>

                <TabsContent value="documents">
                    <div className='rounded-2xl bg-white/5 backdrop-blur-sm border border-black/20 border-dotted p-4 min-h-24'>
                        <Documents downloadAll={true} actions={false} contact_id={application?.student?.contact_id} />
                    </div>
                </TabsContent>

                <TabsContent value="notes">
                    <div className='rounded-2xl bg-white/5 backdrop-blur-sm border border-black/20 border-dotted p-4 min-h-24'>
                        <Notes application={application} />
                    </div>
                </TabsContent>

                <TabsContent value="activities">
                    <div className='bg-white rounded-2xl shadow-sm shadow-black/20 p-4 min-h-24'>
                        <h1>Activities</h1>
                    </div>
                </TabsContent>

                <TabsContent value="requirements">
                    <div className='bg-white rounded-2xl shadow-sm shadow-black/20 p-4 min-h-24'>
                        <h1>Requirements Added Soon!</h1>
                    </div>
                </TabsContent>

                <TabsContent value="activity-log">
                    <div className='bg-white rounded-2xl shadow-sm shadow-black/20 p-4 min-h-24'>
                        <h1>Activity Log Added Soon!</h1>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    )
}

export default ApplicationRequestTabs
