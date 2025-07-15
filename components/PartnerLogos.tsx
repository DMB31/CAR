'use client'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/autoplay'
import { Autoplay } from 'swiper/modules'
import {useTranslations} from 'next-intl';

export default function PartnerLogos() {
  const t = useTranslations('PartnerLogos');
  const partners = [
    { name: t('Mercedes-Benz'), file: '/Logos/Mercedes-Benz-logo-2011-1920x1080-grand.png' },
    { name: t('BMW'), file: '/Logos/580b57fcd9996e24bc43c46e.png' },
    { name: t('Audi'), file: '/Logos/Audi-logo-1920x1080-grand.png' },
    { name: t('Peugeot'), file: '/Logos/Peugeot-logo-2010-1920x1080-grand.png' },
    { name: t('Renault'), file: '/Logos/Renault-logo-2015-2048x2048-grand.png' },
    { name: t('Volkswagen'), file: '/Logos/Volkswagen-logo-2019-1500x1500-grand.png' }
  ];

  return (
    <section className="bg-white pt-0 pb-12">
      <div className="container-custom">
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12" >{t('title')}</h3>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={32}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 }
            }}
            loop={true}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            className="!pb-4"
          >
            {partners.map((partner) => (
              <SwiperSlide key={partner.name} className="flex flex-col items-center justify-center">
                <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 group flex flex-col items-center">
                  <div className="h-24 flex items-center justify-center">
                    <Image
                      src={partner.file}
                      alt={t('alt_logo', {name: partner.name})}
                      width={96}
                      height={96}
                      className="object-contain max-h-24"
                    />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  {partner.name}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
} 