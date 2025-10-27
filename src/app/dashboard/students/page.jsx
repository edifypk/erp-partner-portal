import React, { Suspense } from 'react'
import Students from './Students';




const Page = async () => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Students />
    </Suspense>
  )
}

export default Page