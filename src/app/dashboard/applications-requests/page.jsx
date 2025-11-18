import React, { Suspense } from 'react'
import ApplicationRequests from './ApplicationRequests';





const Page = async () => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplicationRequests />
    </Suspense>
  )
}

export default Page