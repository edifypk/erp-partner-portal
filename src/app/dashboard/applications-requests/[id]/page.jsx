import { cookies } from 'next/headers';
import Request from './Request'
import axios from 'axios'


const getApplication = async (id) => {
  try {
    var cookieStore = await cookies();
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/applications/requests/${id}`,{
      headers: {
        cookie: `token=${cookieStore.get("token")?.value}`
      },
    })
    return res.data?.data
  } catch (error) {
    console.log(error)
    return null
  }
}

const page = async ({ params }) => {

  var params = await params

  const application = await getApplication(params.id)

  if (!application) {
    return <div>Application not found</div>
  }

  return (
    <Request application={application} />
  )
}

export default page
