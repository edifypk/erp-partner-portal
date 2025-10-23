import { ArrowRight02Icon } from 'hugeicons-react'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
    return (
        <div style={{ height: "100dvh" }} className='w-full h-screen relative'>


            <video
                src="https://erp-assets.edify.pk/videos/10200648-uhd_3840_2160_25fps%20(1)%20(1).mp4"
                autoPlay
                muted
                playsInline
                loop
                className='w-full h-full object-cover'
                poster='/images/hero-poster.jpg'
            ></video>


            <div className='absolute inset-0 p-6 bg-linear-to-r from-black/50 to-transparent'>
                <div className='max-w-7xl mx-auto h-full flex flex-col justify-center'>
                    <div className='max-w-2xl'>
                        <h1 className='text-3xl md:text-4xl lg:text-5xl text-shadow-lg/30 tracking-tighter font-semibold text-white'>Power your success <br /> with Edify Group</h1>
                        <p className='font-medium text-shadow-lg/50 tracking-normal mt-4 mb-8 text-white'>Experience seamless global student recruitment through trusted partnerships, advanced technology, and dedicated support that helps your business grow.</p>
                    </div>
                </div>
            </div>

         

        </div>
    )
}

export default Hero
