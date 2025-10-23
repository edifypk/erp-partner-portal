import React from 'react'
import ResetPassword from './ResetPassword'
import axios from 'axios'

const checkResetPasswordTokenValidity = async (token) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/account/check-reset-password-token-validity`, {
      token: token
    })
    return res?.data?.data
  } catch (error) {
    return false
  }
}


const page = async ({ searchParams }) => {
  searchParams = await searchParams;

  const token = searchParams?.token;

  // if (!token) {
  //   return <div>Invalid token</div>
  // }

  const agent = await checkResetPasswordTokenValidity(token)



  return (
    <>
      <ResetPassword token={token} agent={agent} />
    </>
  )
}

export default page

