import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Call02Icon, Mail01Icon } from 'hugeicons-react'

const AccountManagerCard = () => {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className='text-center'>Account Manager</CardTitle>
            </CardHeader>


            <CardContent className="">
                <div>
                    <div className='flex flex-col gap-2 justify-center items-center text-center mt-4 mb-6'>
                        <div>
                            <Avatar className="w-20 h-20">
                                <AvatarImage src="/images/girl.png" className="w-full h-full object-center" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            <div className='font-semibold'>Haneen Shahid</div>
                            <div className='text-xs text-gray-600'>Associate Conversion Manager</div>
                        </div>
                    </div>




                    <div className='flex justify-center items-center gap-4'>
                        <a href={`tel:03001234567`} className=''>
                            <div className='flex justify-center items-center text-gray-600 w-12 h-12 hover:scale-125 transition-all duration-300 rounded-full bg-gray-100'>
                                <Call02Icon />
                            </div>
                        </a>
                        <a href={`mailto:haneen@edify.pk`}>
                            <div className='flex justify-center items-center text-gray-600 w-12 h-12 hover:scale-125 transition-all duration-300 rounded-full bg-gray-100'>
                                <Mail01Icon />
                            </div>
                        </a>
                    </div>
                </div>




            </CardContent>








        </Card>
    )
}

export default AccountManagerCard
