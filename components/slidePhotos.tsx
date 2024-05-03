'use client'
import React from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Swiper의 기본 CSS
import 'swiper/css/navigation'; // Navigation 모듈의 CSS

interface ClientOnlySwiperProps {
    photos: string[]; // 이미지 URL 배열을 props로 받습니다.
}

export default function ClientOnlySwiper({ photos }: ClientOnlySwiperProps) {

    const swiperButtonStyles = `
    .swiper-button-next, .swiper-button-prev {
      color: white;
    }
  `;

    return (
        <>
            <style>{swiperButtonStyles}</style>
            <div style={{ width: '640px', height: '640px' }}> {/* 고정된 크기 */}

                {photos && photos.length > 0 ? (
                    <Swiper

                        modules={[Navigation]}
                        navigation={true}
                        slidesPerView={1} // 한 번에 하나의 슬라이드만 보여주기
                        loop={true} // 루프 활성화
                        className="mySwiper w-full h-full"
                    >
                        {photos.map((photo, index) => (
                            <SwiperSlide key={index} className="flex justify-center align-middle items-center w-full h-full">
                                <img src={`${photo}/public`} alt={`Image ${index}`} className="object-cover w-full h-full" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p>No photos available.</p>
                )}


            </div>
        </>
    );
};
