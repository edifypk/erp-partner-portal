import SignupForm from './SignupForm'
import React from 'react'

const page = () => {
    return (
        <div className="h-screen overflow-hidden">

            <div className='h-full px-4 bg-black/40 absolute inset-0 z-10 flex justify-center items-center'>
                <div className='bg-white/90 backdrop-blur-md p-6 rounded-2xl sm:max-w-5xl'>
                    <SignupForm />
                </div>
            </div>

            <video
                src="https://erp-assets.edify.pk/videos/10200648-uhd_3840_2160_25fps%20(1)%20(1).mp4"
                autoPlay
                muted
                playsInline
                loop
                className='absolute inset-0 h-full w-full object-cover'
                poster='/images/hero-poster.jpg'
            ></video>
        </div>
    )
}

export default page
