"use client"
import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Tick02Icon } from 'hugeicons-react'
import SubAgentForm from './SubAgentForm'
import CompanyDocs from './CompanyDocs'
import ContractSign from './ContractSign'
import { useAuth } from "@/context/AuthContextProvider"
import { subAgentStatuses } from '@/data'
import { Badge } from '@radix-ui/themes'

const Onboarding = () => {
    const [swiper, setSwiper] = useState()
    const [activeStep, setActiveStep] = useState(1)
    const { agentData } = useAuth()

    const onboardingStatus = agentData?.onboarding_status || 'in_progress';

    const steps = [
        {
            label: "Business Info",
            isChecked: false,
        },
        {
            label: "Supporting Docs",
            isChecked: false,
        },
        {
            label: "Sign Contract",
            isChecked: false,
        }
    ]

    const handleFormSuccess = () => {
        nextStep()
    }

    const nextStep = () => {
        if (activeStep < steps.length && swiper) {
            setActiveStep(activeStep + 1)
            swiper.slideNext()
        }
    }

    // Sync Swiper with activeStep changes
    useEffect(() => {
        if (swiper && swiper.activeIndex !== activeStep - 1) {
            swiper.slideTo(activeStep - 1)
        }
    }, [activeStep, swiper])

    return (
        <div className='h-full flex flex-col bg-white relative'>

            <div className='flex flex-col h-full w-full overflow-hidden relative z-20'>

                {/* Top Stepper */}
                <div className='pt-8 pb-2 bg-white'>

                    <div className='flex justify-center flex-col gap-1 items-center'>

                        <Badge color={subAgentStatuses.find(v => v.slug === onboardingStatus)?.color} radius='full'>{subAgentStatuses.find(v => v.slug === onboardingStatus)?.name}</Badge>
                        <div className='text-center text-lg font-semibold tracking-tight'>Complete Your Registration</div>

                    </div>

                    <div className="flex justify-center my-6 w-full">
                        {steps.map((step, index, arry) => (
                            <div key={index} className='flex items-center'>
                                <div
                                    className={`w-8 h-8 font-semibold text-sm flex justify-center items-center relative rounded-full border transition-all duration-200
                                    ${(() => {
                                            // Special handling for contract step (index 2)
                                            if (index === 2 && !['pending_contract', 'approved'].includes(onboardingStatus)) {
                                                return "border-gray-300 text-gray-400 opacity-50";
                                            }

                                            // Regular step logic
                                            if (activeStep >= (index + 1)) {
                                                return "bg-linear-to-r text-white from-primary to-primary";
                                            } else if (activeStep + 1 === (index + 1)) {
                                                return "border-primary text-primary";
                                            } else {
                                                return "border-gray-300 text-gray-400 opacity-50";
                                            }
                                        })()}`}
                                >
                                    {step.isChecked ? (
                                        <Tick02Icon strokeWidth={2.5} size={20} />
                                    ) : (
                                        index + 1
                                    )}

                                    <div className='absolute text-gray-500 whitespace-nowrap tracking-tighter text-xs -bottom-6 left-1/2 -translate-x-1/2'>
                                        {step.label}
                                    </div>
                                </div>

                                {(arry.length - 1 > index) && <div className='h-[2px] bg-gray-300 w-24'></div>}
                            </div>
                        ))}
                    </div>

                </div>

                {/* Swiper Slider */}
                <div className='flex-1 overflow-auto w-full relative px-4'>

                    <div className='max-w-2xl mx-auto overflow-hidden h-fit py-6'>
                        <Swiper
                            activeindex={activeStep}
                            onSlideChange={(a) => { setActiveStep(a.activeIndex + 1) }}
                            allowTouchMove={false}
                            onSwiper={(swiper) => { setSwiper(swiper) }}
                            className='overflow-visible'
                        >

                            {/* Step 1 */}
                            <SwiperSlide>
                                <div className={`${activeStep == 1 ? "max-h-auto" : "max-h-0"} transition-all duration-300 p-[2px]`}>
                                    <SubAgentForm onSubmitSuccess={handleFormSuccess} />
                                </div>
                            </SwiperSlide>

                            {/* Step 2 */}
                            <SwiperSlide>
                                <div className={`${activeStep == 2 ? "max-h-auto" : "max-h-0"} transition-all duration-300 p-[2px]`}>
                                    <CompanyDocs onSubmitSuccess={handleFormSuccess} />
                                </div>
                            </SwiperSlide>

                            {/* Step 3 */}
                            <SwiperSlide>
                                <div className={`${activeStep == 3 ? "max-h-auto" : "max-h-0"} transition-all duration-300 p-[2px]`}>
                                    <ContractSign />
                                </div>
                            </SwiperSlide>

                        </Swiper>
                    </div>

                </div>

            </div>

            <img src="/images/worldmap.svg" className='opacity-5 absolute left-1/2 -translate-x-1/2 w-3/4 h-full top-40' alt="" />

        </div>
    )
}

export default Onboarding
