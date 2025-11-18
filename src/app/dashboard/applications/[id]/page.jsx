import React from 'react'
import Application from './Application'

const page = async ({ params }) => {

  var params = await params


  return (
    <div className='h-full'>
      <Application
        env={{
          NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
          NEXT_PUBLIC_S3_BUCKET_URL: process.env.NEXT_PUBLIC_S3_BUCKET_URL
        }}
        id={params.id}
      />
    </div>
  )
}

export default page
