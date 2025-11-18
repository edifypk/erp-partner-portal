import React, { Suspense } from 'react'
import Applications from './Applications'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Applications />
    </Suspense>
  )
}

export default page
