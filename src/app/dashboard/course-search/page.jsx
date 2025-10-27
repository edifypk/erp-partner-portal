import React, { Suspense } from 'react'
import Courses from './Courses'

const Page = () => {
  return (
    <div className="h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Courses />
      </Suspense>
    </div>
  )
}

export default Page
