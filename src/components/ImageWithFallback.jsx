"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const ImageWithFallback = (props) => {
    const { src, fallbackSrc, ...rest } = props;
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    return (
        <Image
            {...rest}
            alt=""
            src={imgSrc}
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
        />
    );
};

export default ImageWithFallback;