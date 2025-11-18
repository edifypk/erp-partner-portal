import ApplicationTopbar from './ApplicationTopbar'
import ApplicationTimline from './ApplicationTimline'
import axios from 'axios'
import ApplicationTabs from './ApplicationTabs/ApplicationTabs'
import StudentDetails from './StudentDetails'
import ApplicationJourney from './ApplicationJourney'
import { cookies } from 'next/headers'


const getApplication = async (id) => {
  try {
    const cookieStore = await cookies()
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/applications/${id}`,{
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

const getProcess = async (id) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/app-processes/${id}`)
    return res.data?.data
  } catch (error) {
    return null
  }
}

const Application = async ({ id, env }) => {

  const application = await getApplication(id)
  if (!application) return <div>Application not found</div>

  const process = await getProcess(application?.app_process_id)
  if (!process) return <div>Process not found</div>


  application.is_cancelled = false



  return (
    <div className='flex-1 gap-4 flex flex-col h-full'>
      <div className=''>
        <ApplicationTopbar env={env} process={process} application={application} />
      </div>



      <div className='flex-1 overflow-hidden flex rounded-2xl max-w-7xl mx-auto w-full px-4 lg:px-6'>

        <div className='w-[260px]'>
          <StudentDetails application={application} />
        </div>
        <div className='flex-1 overflow-hidden h-full px-1'>
          <ApplicationTabs application={application} env={env} />
        </div>
        <div className='w-[250px]'>
          <ApplicationJourney application={application} process={process} currentStatus={application?.app_status_id} />
        </div>

      </div>
    </div>
  )
}

export default Application
