"use client"

import { useState, useEffect, useRef } from "react"
import { CircleAlert } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import axios from "axios"
import { ViewIcon, ViewOffSlashIcon } from "hugeicons-react"



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




export default function ResetPassword({ token, agent }) {

    const router = useRouter()
    const [loginError, setLoginError] = useState(null);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const confirmPasswordRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        token: token,
        email: agent?.email,
        password: "",
        confirmPassword: ""
    })

    const [imogi, setImogi] = useState(imogis[0].url)
    const [hasStartedTyping, setHasStartedTyping] = useState(false);



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





    const resetPasswordHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        var error = null;

        if (formData.password !== formData.confirmPassword) {
            error = "Passwords Do Not Match";
        }

        if (formData.password.length < 8) {
            error = "Password Must Be At Least 8 Characters";
        }

        if (formData.password.length > 16) {
            error = "Password Must Be Less Than 16 Characters";
        }

        try {

            if (error) {
                throw new Error(error);
            }

            setImogi(imogis.find(imogi => imogi.name === "thinkingFace").url);

            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sub-agents/account/reset-password`, formData, {
                withCredentials: true
            });

            toast.success(res?.data?.message);

            setTimeout(() => {
                router.push('/login')
            }, 2000)


        } catch (err) {

            setLoginError(error || err?.response?.data?.message || err?.message);

        } finally {
            if (error) {
                setLoading(false);
            }
            setTimeout(() => {
                setLoginError(null);
            }, 4000)
        }

    }




    return (
        <div className="fixed inset-0 h-screen overflow-hidden">

            <div className="h-full px-4 bg-black/40 absolute inset-0 z-10">

                <div className="max-w-7xl h-full flex flex-col justify-center items-center mx-auto">



                    {agent ? <form onSubmit={resetPasswordHandler} className="min-w-[270px]">
                        <div className="bg-white mx-auto mb-4 rounded-full w-12 h-12 p-2">
                            <img src={imogi} alt="" />
                        </div>


                        <div className="text-white text-center font-medium mb-4 tracking-tight">Reset Password</div>


                        <div className="bg-white/80 flex items-center backdrop-blur-sm rounded-full overflow-hidden relative">

                            <input
                                ref={emailRef}
                                value={agent?.email}
                                disabled={true}
                                type="email"
                                required
                                placeholder={"Enter your email"}
                                className={`focus:outline-none pl-4 flex-1 placeholder:text-gray-500 bg-transparent text-sm py-2`}
                            />
                        </div>


                        <div className="bg-white/80 flex items-center mt-[10px] backdrop-blur-sm rounded-full overflow-hidden relative">
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
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder={"Enter New Password"}
                                className="focus:outline-none placeholder:text-xs flex-1 placeholder:text-gray-500 bg-transparent text-sm pl-4 py-2"
                            />
                            <div onClick={() => setShowPassword(!showPassword)} className="absolute cursor-pointer text-gray-400 top-1/2 -translate-y-1/2 right-3">
                                {showPassword ? <ViewIcon size={18} /> : <ViewOffSlashIcon size={18} />}
                            </div>
                        </div>


                        <div className="bg-white/80 flex items-center mt-[10px] backdrop-blur-sm rounded-full overflow-hidden relative">
                            <input
                                ref={confirmPasswordRef}
                                onChange={(e) => {
                                    setFormData({ ...formData, confirmPassword: e.target.value });
                                    setLoginError(null);
                                    if (!hasStartedTyping || imogi === imogis.find(imogi => imogi.name === "loginFailed").url) {
                                        setHasStartedTyping(true);
                                        setImogi(imogis.find(imogi => imogi.name === "duringPasswordTyping").url);
                                    }
                                }}
                                disabled={loading}
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                placeholder={"Confirm New Password"}
                                className="focus:outline-none placeholder:text-xs flex-1 placeholder:text-gray-500 bg-transparent text-sm pl-4 py-2"
                            />
                            <div onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute cursor-pointer text-gray-400 top-1/2 -translate-y-1/2 right-3">
                                {showConfirmPassword ? <ViewIcon size={18} /> : <ViewOffSlashIcon size={18} />}
                            </div>
                        </div>


                        <div className="flex justify-center mt-4">
                            <button disabled={loading} type="submit" className="bg-blue-500 disabled:opacity-50 text-white px-3 font-medium border border-white/30 py-2 text-xs rounded-full">Reset Password</button>
                        </div>





                        {/* error message */}
                        <p className={`${loginError ? "opacity-100" : "opacity-0"} h-4 text-red-500 tracking-tight transition-all duration-300 justify-center text-xs mt-2 flex items-center gap-1`}>
                            <CircleAlert size={14} /> {loginError}
                        </p>

                    </form>
                        :
                        <div className="text-white text-center font-medium mb-4 tracking-tight">
                            <div className="text-2xl font-bold">Reset Password Link Expired</div>
                            <div className="text-sm">
                                <div>This may due to the link being expired <br /> or used already.</div>
                            </div>
                        </div>
                    }




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

