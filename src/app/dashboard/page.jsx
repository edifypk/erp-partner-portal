"use client"
import AccountManagerCard from '@/components/AccountManagerCard';
import NewsSlider from '@/components/NewsSlider';
import Onboarding from '@/components/Onboarding/Onboarding';
import { useAuth } from '@/context/AuthContextProvider'

export default function Page() {

  const { user } = useAuth()

  return (
    <Onboarding />
    // <div className='h-full p-6 overflow-y-auto'>
    //   <div className='max-w-7xl mx-auto'>
    //     <div className='grid grid-cols-12 gap-4'>

    //       <div className='col-span-6 h-80 rounded-2xl border dashWelcomeBox p-8'>
    //         <div className='flex justify-between items-center h-full'>
    //           <div className='text-white'>
    //             <h2 className="text-xl font-semibold mb-2 whitespace-nowrap">
    //               Welcome back 👋 <br />
    //               {user?.contact?.name}
    //             </h2>
    //             <p className="text-gray-400 font-medium text-sm max-w-[300px]">If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything.</p>
    //           </div>
    //           <div>
    //             <img className='w-72' src="/images/welcome.svg" alt="" />
    //           </div>
    //         </div>
    //       </div>

       

    //       <div className='col-span-3 h-80 rounded-2xl border overflow-hidden'>
    //         <NewsSlider />
    //       </div>

    //       <div className='col-span-3'>
    //         <AccountManagerCard />
    //       </div>


    //     </div>
    //   </div>
    // </div>
  );
}



