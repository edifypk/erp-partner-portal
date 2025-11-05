"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Navigation } from 'swiper/modules'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Tick02Icon } from 'hugeicons-react'
import SubAgentForm from './SubAgentForm'
import CompanyDocs from './CompanyDocs'
import ContractSign from './ContractSign'
import { useAuth } from "@/context/AuthContextProvider"
import axios from "axios"

const Onboarding = () => {
    const [swiper, setSwiper] = useState()
    const [activeStep, setActiveStep] = useState(1)
    const [onboardingStatus, setOnboardingStatus] = useState('in_progress')
    const [loadingStatus, setLoadingStatus] = useState(true)
    const nextButtonRef = useRef(null)
    const { user } = useAuth()

    // Fetch onboarding status
    useEffect(() => {
        const fetchOnboardingStatus = async () => {
            if (!user?.subagent_team_member?.agent?.id) return;

            try {
                setLoadingStatus(true);
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${user.subagent_team_member.agent.id}`,
                    { withCredentials: true }
                );

                const agentData = response.data.data;
                setOnboardingStatus(agentData.onboarding_status || 'in_progress');
            } catch (error) {
                console.error("Error fetching onboarding status:", error);
            } finally {
                setLoadingStatus(false);
            }
        };

        fetchOnboardingStatus();
    }, [user]);

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
    const handleFormSuccess = async (data) => {
        
        // Refresh onboarding status after form submission
        if (user?.subagent_team_member?.agent?.id) {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/${user.subagent_team_member.agent.id}`,
                    { withCredentials: true }
                );
                const agentData = response.data.data;
                setOnboardingStatus(agentData.onboarding_status || 'in_progress');
            } catch (error) {
                console.error("Error refreshing onboarding status:", error);
            }
        }
        
        nextStep()
    }

    const nextStep = () => {
        // console.log('nextStep called, activeStep:', activeStep, 'swiper:', swiper)
        if (activeStep < steps.length) {
            // console.log('Going to next step...')
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

    // Handle step click navigation
    const handleStepClick = (stepIndex) => {
        const targetStep = stepIndex + 1;
        // console.log('handleStepClick called, targetStep:', targetStep, 'activeStep:', activeStep, 'onboardingStatus:', onboardingStatus)
        
        // Block access to contract step (step 3) unless onboarding status is pending_contract or approved
        if (targetStep === 3 && !['pending_contract', 'approved'].includes(onboardingStatus)) {
            console.log('Cannot navigate to contract step - onboarding status not ready:', onboardingStatus)
            return;
        }
        
        // Only allow navigation to completed steps or the next step
        if (targetStep <= activeStep || targetStep === activeStep + 1) {
            console.log('Navigating to step:', targetStep)
            setActiveStep(targetStep)
            if (swiper) {
                swiper.slideTo(stepIndex)
            }
        } else {
            console.log('Cannot navigate to step:', targetStep, '- not accessible yet')
        }
    }

    // Sync Swiper with activeStep changes
    useEffect(() => {
        if (swiper && swiper.activeIndex !== activeStep - 1) {
            // console.log('Syncing swiper to activeStep:', activeStep)
            swiper.slideTo(activeStep - 1)
        }
    }, [activeStep, swiper])


    console.log('onboardingStatus:', user)


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
                                        <button
                                            onClick={() => handleStepClick(index)}
                                            className='w-8 h-8 font-semibold relative border bg-linear-to-br rounded-full p-[2px] from-primary to-primary cursor-pointer hover:scale-105 transition-transform'
                                        >
                                            <div className='w-full h-full rounded-full flex justify-center items-center text-white'>
                                                <Tick02Icon strokeWidth={2.5} size={25} />
                                            </div>

                                            <div className='absolute text-gray-500 whitespace-nowrap tracking-tighter text-xs -bottom-6 left-1/2 -translate-x-1/2'>
                                                {step.label}
                                            </div>
                                        </button>
                                        :
                                        <button
                                            onClick={() => handleStepClick(index)}
                                            className={`w-8 h-8 font-semibold text-sm flex justify-center items-center relative rounded-full border transition-all duration-200
                                        ${(() => {
                                            // Special handling for contract step (index 2)
                                            if (index === 2 && !['pending_contract', 'approved'].includes(onboardingStatus)) {
                                                return "border-gray-300 text-gray-400 cursor-not-allowed opacity-50";
                                            }
                                            
                                            // Regular step logic
                                            if (activeStep >= (index + 1)) {
                                                return "bg-linear-to-r text-white from-primary to-primary cursor-pointer hover:scale-105";
                                            } else if (activeStep + 1 === (index + 1)) {
                                                return "border-primary text-primary cursor-pointer hover:scale-105 hover:bg-primary/10";
                                            } else {
                                                return "border-gray-300 text-gray-400 cursor-not-allowed opacity-50";
                                            }
                                        })()}`}
                                            disabled={activeStep + 1 < (index + 1) || (index === 2 && !['pending_contract', 'approved'].includes(onboardingStatus))}
                                        >
                                            {index + 1}

                                            <div className='absolute text-gray-500 whitespace-nowrap tracking-tighter text-xs -bottom-6 left-1/2 -translate-x-1/2'>
                                                {step.label}
                                            </div>
                                        </button>
                                }




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
                                    <div className="">
                                        <CompanyDocs onSubmitSuccess={handleFormSuccess} />
                                    </div>
                                </div>
                            </SwiperSlide>

                            {/* Step 3 */}
                            <SwiperSlide>
                                <div className={`${activeStep == 3 ? "max-h-auto" : "max-h-0"} transition-all duration-300 p-[2px]`}>
                                    <div className="">
                                        <ContractSign />
                                    </div>
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
