import React, { Suspense } from 'react'
import StudentLayout from './StudentLayout'
import axios from 'axios'
import { cookies } from 'next/headers'


const getStudent = async (id) => {

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/students/${id}`, {
      headers: {
        cookie: `token=${token}`
      },
      withCredentials: true
    })
    return res.data?.data
  } catch (error) {
    return null
  }
}

const Page = async ({ params }) => {


  var sParams = await params

  const student = await getStudent(sParams.slug)
  if (!student) return <div>Student not found</div>

  if(student?.lead){
    student.lead.contact = student?.contact
  }


  return (
    <Suspense fallback={null}>
      <StudentLayout student={student} />
    </Suspense>
  )
}

export default Page