'use client'
import React from 'react'
import Datatable from './Datatable'


const ApplicationRequests = () => {



  return (
    <div className="p-6 h-full">
      <div className="h-full flex flex-col max-w-7xl mx-auto">


        <div className='mb-4 flex justify-between items-center'>
          <h2 className='text-xl font-semibold tracking-tight'>Applications Requests</h2>
        </div>


        <div className='border bg-white rounded-2xl overflow-hidden flex-1 flex flex-col'>
          <Datatable  />
        </div>

      </div>
    </div>
  )
}

export default ApplicationRequests