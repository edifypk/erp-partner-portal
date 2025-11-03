"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowRight, CircleAlert } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useAuth } from "@/context/AuthContextProvider"

const imogis = [
    {
        name: "handshake",
        url: "/images/login-imogies/handshake.webp"
    },
    {
        name: "smile",
        url: "/images/login-imogies/smile.webp"
    },
    {
        name: "beforeSleep1",
        url: "/images/login-imogies/beforeSleep1.webp"
    },
    {
        name: "beforeSleep2",
        url: "/images/login-imogies/beforeSleep2.webp"
    },
    {
        name: "whileSleep",
        url: "/images/login-imogies/whileSleep.webp"
    },
    {
        name: "yawn",
        url: "/images/login-imogies/yawn.webp"
    },
    {
        name: "duringEmailTyping",
        url: "/images/login-imogies/duringEmailTyping.webp"
    },
    {
        name: "duringPasswordTyping",
        url: "/images/login-imogies/duringPasswordTyping.webp"
    },
    {
        name: "thinkingFace",
        url: "/images/login-imogies/thinkingFace.webp"
    },
    {
        name: "loginSuccess",
        url: "/images/login-imogies/loginSuccess.webp"
    },
    {
        name: "suddenWakeup",
        url: "/images/login-imogies/suddenWakeup.webp"
    },
    {
        name: "loginFailed",
        url: "/images/login-imogies/loginFailed.webp"
    }
]

export default function Login() {

    const router = useRouter()
    const { getAgentProfile } = useAuth()

    const [loginError, setLoginError] = useState(null);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [resetPasswordEmailSent, setResetPasswordEmailSent] = useState(false);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [isAgentFound, setIsAgentFound] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [imogi, setImogi] = useState(imogis[0].url)
    const [hasStartedTyping, setHasStartedTyping] = useState(false);

    const checkAgentExistsHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setImogi(imogis.find(imogi => imogi.name === "thinkingFace").url);

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users/check-user-exists`, {
                email: formData.email
            });

            setIsAgentFound(true);
            setImogi(imogis.find(imogi => imogi.name === "duringPasswordTyping").url);

            if (passwordRef.current) {
                passwordRef.current.value = "";
                passwordRef.current.focus();
            }

        } catch (error) {
            setImogi(imogis.find(imogi => imogi.name === "loginFailed").url);
            setLoginError(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
            setTimeout(() => {
                setLoginError(null);
            }, 4000)
        }
    };

    const signInHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setImogi(imogis.find(imogi => imogi.name === "thinkingFace").url);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users/login`, {
                email: formData.email,
                password: formData.password
            }, {
                withCredentials: true
            });

            setLoginError(null);
            setImogi(imogis.find(imogi => imogi.name === "loginSuccess").url);

            // get agent profile
            getAgentProfile()

            toast.success("Login successful");

            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)

        } catch (error) {
            setLoginError(error?.response?.data?.message || error?.message);
            setImogi(imogis.find(imogi => imogi.name === "loginFailed").url);
        } finally {
            setLoading(false);
            setTimeout(() => {
                setLoginError(null);
            }, 4000)
        }
    }

    const sendResetPasswordEmailHandler = async () => {
        setLoading(true);
        setImogi(imogis.find(imogi => imogi.name === "thinkingFace").url);

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users/send-reset-password-email`, {
                email: formData.email
            });

            setResetPasswordEmailSent(true);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setTimeout(() => {
                setLoginError(null);
            }, 4000)
        }
    }

    // Cycle through emojis before user interaction
    useEffect(() => {
        if (hasStartedTyping) return; // Stop cycling if typing has started

        let index = 0;
        const durations = {
            handshake: 2000, // 2 seconds
            smile: 10000,    // 10 seconds
            beforeSleep1: 2000, // 2 seconds
            beforeSleep2: 3000, // 3 seconds
            whileSleep: 5000,   // 5 seconds
            yawn: 2000,         // 2 seconds
        };

        let firstLoop = true;
        let filteredImogis = imogis;
        let timeoutId;

        const cycleEmojis = () => {
            setImogi(filteredImogis[index].url);
            const currentEmoji = filteredImogis[index].name;
            const duration = durations[currentEmoji];

            index = (index + 1) % filteredImogis.length;

            if (firstLoop && index === 0) {
                firstLoop = false;
                filteredImogis = imogis.filter(emoji => emoji.name !== 'handshake');
                index = 0;
            }

            timeoutId = setTimeout(cycleEmojis, duration);
        };

        cycleEmojis();

        return () => clearTimeout(timeoutId);
    }, [hasStartedTyping]);

    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (passwordRef.current) {
            passwordRef.current.focus();
        }
    }, [isAgentFound]);

    // Prevent body scroll on login page
    // useEffect(() => {
    //     document.body.style.overflow = 'hidden';
    //     document.documentElement.style.overflow = 'hidden';
        
    //     return () => {
    //         document.body.style.overflow = '';
    //         document.documentElement.style.overflow = '';
    //     };
    // }, []);

    return (
        <div className="fixed inset-0 h-screen overflow-hidden">
            <div className="h-full px-4 bg-black/40 absolute inset-0 z-10">
                <div className="max-w-7xl h-full flex flex-col justify-center items-center mx-auto">
                    <form onSubmit={isAgentFound ? signInHandler : checkAgentExistsHandler} className="min-w-[270px]">
                        <div className="bg-white mx-auto mb-4 rounded-full w-12 h-12 p-2">
                            <img src={imogi} alt="" />
                        </div>

                        <div className="text-white text-center font-medium mb-4 tracking-tight">Agent Portal Login</div>

                        <div className="bg-white/80 flex items-center backdrop-blur-sm rounded-full overflow-hidden relative">
                            <input
                                ref={emailRef}
                                onChange={(e) => {
                                    setFormData({ ...formData, email: e.target.value.toLowerCase() });
                                    setLoginError(null);
                                    if (!hasStartedTyping || imogi === imogis.find(imogi => imogi.name === "loginFailed").url) {
                                        setHasStartedTyping(true);
                                        setImogi(imogis.find(imogi => imogi.name === "duringEmailTyping").url);
                                    }
                                }}
                                value={formData.email}
                                disabled={loading || isAgentFound}
                                type="email"
                                required
                                placeholder={"Enter your email"}
                                className={`focus:outline-none flex-1 placeholder:text-gray-500 bg-transparent text-sm ${isAgentFound ? "pr-4" : "pr-8"} pl-4 py-2`}
                            />
                            {(!isAgentFound) && <button className={`${loading ? "border-transparent" : "border-white"} border-2 absolute text-white rounded-full right-[6px] p-[2px] top-1/2 -translate-y-1/2 flex items-center justify-center`}>
                                {
                                    loading ?
                                        <img className="w-4 h-4" src="/images/loading.gif" alt="" />
                                        :
                                        <ArrowRight strokeWidth={2} className="w-5 h-5" />
                                }
                            </button>}
                        </div>

                        {(isAgentFound && (!forgotPassword)) && <div className="bg-white/80 flex items-center mt-[10px] backdrop-blur-sm rounded-full overflow-hidden relative">
                            <input
                                ref={passwordRef}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value });
                                    setLoginError(null);
                                    if (!hasStartedTyping || imogi === imogis.find(imogi => imogi.name === "loginFailed").url) {
                                        setHasStartedTyping(true);
                                        setImogi(imogis.find(imogi => imogi.name === "duringPasswordTyping").url);
                                    }
                                }}
                                disabled={loading}
                                type={"password"}
                                required
                                placeholder={"Enter your password"}
                                className="focus:outline-none w-full placeholder:text-gray-500 bg-transparent text-sm pr-8 pl-4 py-2"
                            />
                            <button className={`${loading ? "border-transparent" : "border-white"} border-2 absolute text-white rounded-full right-[6px] p-[2px] top-1/2 -translate-y-1/2 flex items-center justify-center`}>
                                {
                                    loading ?
                                        <img className="w-4 h-4" src="/images/loading.gif" alt="" />
                                        :
                                        <ArrowRight strokeWidth={2} className="w-5 h-5" />
                                }
                            </button>
                        </div>}

                        {/* Reset Password Email Sent */}
                        {(resetPasswordEmailSent && forgotPassword) && <div className="text-green-400 font-medium justify-center text-xs mt-3 flex items-center">
                            <div className="flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="injected-svg"
                                    data-src="https://cdn.hugeicons.com/icons/mail-02-solid-rounded.svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    role="img"
                                    color="#4ade80"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.92 2.78677C12.967 2.7377 11.033 2.7377 9.07999 2.78677L9.02182 2.78823C7.497 2.82651 6.27002 2.85732 5.2867 3.02857C4.2572 3.20786 3.42048 3.55174 2.71362 4.26129C2.00971 4.96787 1.66764 5.79256 1.49176 6.80537C1.32429 7.76974 1.29878 8.96677 1.26719 10.4496L1.26593 10.5084C1.24469 11.5047 1.24469 12.4952 1.26594 13.4916L1.26719 13.5503C1.29879 15.0332 1.32429 16.2302 1.49176 17.1946C1.66764 18.2074 2.00972 19.0321 2.71362 19.7386C3.42048 20.4482 4.2572 20.7921 5.2867 20.9714C6.27001 21.1426 7.49697 21.1734 9.02177 21.2117L9.07999 21.2132C11.033 21.2622 12.967 21.2622 14.92 21.2132L14.9782 21.2117C16.503 21.1734 17.73 21.1426 18.7133 20.9714C19.7428 20.7921 20.5795 20.4482 21.2864 19.7386C21.9903 19.0321 22.3324 18.2074 22.5082 17.1946C22.6757 16.2302 22.7012 15.0332 22.7328 13.5503L22.7341 13.4916C22.7553 12.4952 22.7553 11.5047 22.7341 10.5084L22.7328 10.4496C22.7012 8.96679 22.6757 7.76976 22.5082 6.80539C22.3324 5.79258 21.9903 4.96789 21.2864 4.26131C20.5795 3.55176 19.7428 3.20788 18.7133 3.02859C17.73 2.85733 16.503 2.82652 14.9782 2.78824L14.92 2.78677ZM7.38182 7.85449C7.02527 7.64368 6.56533 7.76183 6.35452 8.11838C6.14371 8.47494 6.26186 8.93488 6.61841 9.14569L9.56043 10.8851C10.4313 11.4 11.1827 11.7501 12.0001 11.7501C12.8175 11.7501 13.569 11.4 14.4398 10.8851L17.3818 9.14569C17.7384 8.93488 17.8565 8.47494 17.6457 8.11838C17.4349 7.76183 16.975 7.64368 16.6184 7.85449L13.6764 9.59392C12.832 10.0931 12.3831 10.2501 12.0001 10.2501C11.6171 10.2501 11.1682 10.0931 10.3238 9.59392L7.38182 7.85449Z"
                                        fill="#4ade80"
                                    />
                                </svg>
                            </div>
                            <div className="ml-1">Reset Password Email Sent</div>
                        </div>}

                        {/* error message */}
                        {loginError ?
                            <p className={`text-red-500 transition-all duration-300 justify-center text-xs mt-2 flex items-center gap-1`}>
                                <CircleAlert size={14} /> {loginError}
                            </p>
                            :
                            <p onClick={() => {
                                if (forgotPassword) {
                                    setForgotPassword(false);
                                } else {
                                    setForgotPassword(true);
                                    sendResetPasswordEmailHandler();
                                }

                            }} className={`${(isAgentFound) ? "opacity-100 visible" : "opacity-0 invisible"} text-white/50 hover:text-white cursor-pointer transition-all duration-300 justify-center text-xs mt-2 flex items-center gap-1`}>
                                <CircleAlert size={14} />
                                {forgotPassword ? "Return to login" : "Reset Password?"}
                            </p>
                        }

                    </form>
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

