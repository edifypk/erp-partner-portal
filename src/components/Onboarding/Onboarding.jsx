"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Navigation } from 'swiper/modules'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Tick02Icon } from 'hugeicons-react'
import SubAgentForm from './SubAgentForm'

const Onboarding = () => {
    const [swiper, setSwiper] = useState()
    const [activeStep, setActiveStep] = useState(1)
    const nextButtonRef = useRef(null)

    const steps = [
        {
            label: "Business Info",
            isChecked: false,
            content: "Welcome to our platform! Let's get you started with the basics."
        },
        {
            label: "Supporting Docs",
            isChecked: false,
            content: "Now let's set up your profile and preferences to personalize your experience."
        },
        {
            label: "Sign Contract",
            isChecked: false,
            content: "Almost done! Review your information and complete the setup process."
        }
    ]

    // Handle form submission success
    const handleFormSuccess = (data) => {
        console.log("Form submitted successfully:", data)
        nextStep()
    }

    const nextStep = () => {
        console.log('nextStep called, activeStep:', activeStep, 'swiper:', swiper)
        if (activeStep < steps.length) {
            console.log('Going to next step...')
            setActiveStep(activeStep + 1)
            if (swiper) {
                swiper.slideNext()
            }
        } else {
            console.log('Cannot go to next step - already at last step')
        }
    }

    const prevStep = () => {
        console.log('prevStep called, activeStep:', activeStep, 'swiper:', swiper)
        if (activeStep > 1) {
            console.log('Going to previous step...')
            setActiveStep(activeStep - 1)
            if (swiper) {
                swiper.slidePrev()
            }
        } else {
            console.log('Cannot go to previous step - already at step 1')
        }
    }

    // Sync Swiper with activeStep changes
    useEffect(() => {
        if (swiper && swiper.activeIndex !== activeStep - 1) {
            console.log('Syncing swiper to activeStep:', activeStep)
            swiper.slideTo(activeStep - 1)
        }
    }, [activeStep, swiper])


    return (
        <div className='h-full flex flex-col bg-white relative'>
            
            
            <div className='flex flex-col h-full w-full overflow-hidden relative z-20'>

                {/* Top Stepper */}
                <div className='pt-8 pb-2 bg-white'>

                    <div className='text-center text-lg font-semibold tracking-tight'>Complete Your Registration</div>

                    <div className="flex justify-center my-6 w-full">
                        {steps.map((step, index, arry) => (
                            <div key={index} className='flex items-center'>
                                {
                                    step.isChecked ?
                                        <div
                                            className='w-8 h-8 font-semibold relative border bg-linear-to-br rounded-full p-[2px] from-primary to-primary'
                                        >
                                            <div className='w-full h-full rounded-full flex justify-center items-center text-white'>
                                                <Tick02Icon strokeWidth={2.5} size={25} />
                                            </div>

                                            <div className='absolute text-gray-500 whitespace-nowrap tracking-tighter text-xs -bottom-6 left-1/2 -translate-x-1/2'>
                                                {step.label}
                                            </div>
                                        </div>
                                        :
                                        <div
                                            className={`w-8 h-8 font-semibold text-sm flex justify-center items-center relative rounded-full border 
                                        ${activeStep >= (index + 1) ? "bg-linear-to-r text-white from-primary to-primary"
                                                    : "border-gray-300 text-gray-400"
                                                }`}
                                        >
                                            {index + 1}

                                            <div className='absolute text-gray-500 whitespace-nowrap tracking-tighter text-xs -bottom-6 left-1/2 -translate-x-1/2'>
                                                {step.label}
                                            </div>
                                        </div>
                                }




                                {(arry.length - 1 > index) && <div className='h-[2px] bg-gray-300 w-24'></div>}
                            </div>
                        ))}
                    </div>

                </div>

                {/* Swiper Slider */}
                <div className='flex-1 overflow-auto w-full relative px-4'>

                    <div className='max-w-2xl mx-auto overflow-hidden h-fit pt-6 pb-20'>
                        <Swiper
                            activeindex={activeStep}
                            navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            }}
                            modules={[Navigation]}
                            onSlideChange={(a) => { setActiveStep(a.activeIndex + 1) }}
                            allowTouchMove={false}
                            onSwiper={(swiper) => { setSwiper(swiper) }}
                            className='overflow-visible'
                        >

                            {/* Step 1 */}
                            <SwiperSlide>
                                <div className={`${activeStep == 1 ? "max-h-auto" : "max-h-0"} transition-all duration-300 p-[2px]`}>
                                    <div className="">
                                        <SubAgentForm onSubmitSuccess={handleFormSuccess} />
                                    </div>
                                </div>
                            </SwiperSlide>

                            {/* Step 2 */}
                            <SwiperSlide>
                                <div className={`${activeStep == 2 ? "max-h-auto" : "max-h-0"} transition-all duration-300 p-[2px]`}>
                                    <div className="bg-white rounded-2xl p-8 text-center">
                                        <div className="mb-6">
                                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <span className="text-2xl">⚙️</span>
                                            </div>
                                            <h2 className="text-2xl font-semibold mb-2">Setup</h2>
                                            <p className="text-gray-600">
                                                {steps[1].content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>

                            {/* Step 3 */}
                            <SwiperSlide>
                                <div className={`${activeStep == 3 ? "max-h-auto" : "max-h-0"} transition-all duration-300 p-[2px]`}>
                                    <div className="bg-white rounded-2xl p-8 text-center">
                                        <div className="mb-6">
                                            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <span className="text-2xl">✅</span>
                                            </div>
                                            <h2 className="text-2xl font-semibold mb-2">Complete</h2>
                                            <p className="text-gray-600">
                                                {steps[2].content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>

                        </Swiper>
                    </div>

                </div>

                <div className='flex justify-center items-center py-4 gap-4'>
                    {/* <Button 
                        variant="outline" 
                        onClick={prevStep}
                        disabled={activeStep === 1}
                        className="swiper-button-prev"
                    >
                        Previous
                    </Button>
                    <Button 
                        onClick={nextStep}
                        disabled={activeStep === steps.length}
                        className="swiper-button-next"
                    >
                        Next
                    </Button> */}
                </div>

            </div>

            <img src="/images/worldmap.svg" className='opacity-5 absolute inset-0 pt-20' alt="" />

        </div>
    )
}

export default Onboarding
