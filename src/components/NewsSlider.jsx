"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import ImageWithFallback from '@/components/ImageWithFallback'
import { format } from 'timeago.js'

const NewsSlider = () => {


    const news = useQuery({
        queryKey: ['news'],
        queryFn: async () => {
            try {
                const response = await axios.get(`https://admin.edify.pk/api/news-articles`, {
                    params: {
                        sort: "publishedAt:desc",
                        populate: { author: { populate: ["image"] }, image: "*", category: "*" },
                        fields: ["title", "slug", "publishedAt"],
                        pagination: {
                            page: 1,
                            pageSize: 5
                        }
                    }
                })
                return response?.data?.data
            } catch (error) {
                console.log(error)
                return []
            }
        }
    })



    return (
        <div className='relative w-full h-full'>

            <Swiper
                className='h-full w-full'
                loop={true}
                navigation={{
                    nextEl: '.swiper-button-next-news',
                    prevEl: '.swiper-button-prev-news',
                }}
                autoplay={{
                    delay: 10000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                speed={1000}
                modules={[Navigation, Autoplay]}
            >
                {
                    news?.data?.map((v, i) => {
                        return (
                            <SwiperSlide>
                                <a title="Click to View Article" target='_blank' href={`https://edify.pk/news/${v?.attributes?.slug}`} className='h-full w-full relative text-white'>



                                    <ImageWithFallback
                                        width={200}
                                        id={v?.id}
                                        height={200}
                                        className='bg-gray-200 w-full h-full object-cover'
                                        src={`https://admin.edify.pk${v?.attributes?.image?.data?.attributes?.url}` || '/images/bubbles.png'}
                                        fallbackSrc='/images/bubbles.png'
                                        alt="" />

                                    <div className="absolute bottom-0 left-0 w-full px-4 pb-4 h-[40%] bg-gradient-to-t from-black via-black/85 flex flex-col justify-end">
                                        <div>
                                            {/* <div className="text-xs text-blue-400 font-medium">{v?.attributes?.category?.data?.attributes?.name}</div> */}
                                            <h2 className="text-[14px] leading-[1.3] mb-1 tracking-tight font-semibold line-clamp-2">{v?.attributes?.title}</h2>
                                            <div className="text-xs tracking-tight text-gray-400">{format(v?.attributes?.publishedAt)}</div>
                                        </div>
                                    </div>

                                </a>
                            </SwiperSlide>
                        )
                    })
                }


            </Swiper>


            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
                <div>
                    <div className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
                        News
                    </div>
                </div>
                <div className='flex items-center gap-1'>
                    <button className='rounded-full p-[2px] hover:bg-black/20 hover:backdrop-blur-lg text-gray-200 swiper-button-prev-news'>
                        <ChevronLeft />
                    </button>
                    <button className='rounded-full p-[2px] hover:bg-black/20 hover:backdrop-blur-lg text-gray-200 swiper-button-next-news'>
                        <ChevronRight />
                    </button>
                </div>
            </div>







        </div>
    )
}

export default NewsSlider
