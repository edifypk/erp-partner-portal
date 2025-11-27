import React from 'react'

const HeadingWithLogo = ({ title, icon }) => {
    return (
        <div className='tracking-normal font-semibold flex items-center gap-[10px]'>
            <img src={icon} className='w-6' alt="" />
            {title}
        </div>
    )
}

export default HeadingWithLogo

