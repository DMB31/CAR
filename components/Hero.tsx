'use client'

import { ArrowRight, Shield, Clock, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section id="accueil" className="bg-white section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left rtl:lg:text-right">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {t('title_part1')}{' '}
                <span className="text-primary-500">{t('title_part2')}</span>{' '}
                {t('title_part3')}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t('subtitle')}
              </p>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
              <div className="flex items-center space-x-2 bg-gray-50 px-3 sm:px-4 py-2 rounded-full shadow-sm rtl:space-x-reverse">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                <span className="text-xs sm:text-sm font-medium text-secondary-500">{t('benefit1')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 sm:px-4 py-2 rounded-full shadow-sm rtl:space-x-reverse">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                <span className="text-xs sm:text-sm font-medium text-secondary-500">{t('benefit2')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 sm:px-4 py-2 rounded-full shadow-sm rtl:space-x-reverse">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                <span className="text-xs sm:text-sm font-medium text-secondary-500">{t('benefit3')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#devis" className="btn-primary text-center">
                {t('cta_quote')}
              </a>
              <a href="#services" className="btn-outline text-center">
                {t('cta_services')}
              </a>
            </div>

            {/* Stats */}
            
          </div>

          {/* Visual */}
          <div className="relative order-first lg:order-last">
            <div className="aspect-[4/3] bg-gray-100 rounded-xl lg:rounded-2xl overflow-hidden shadow-xl lg:shadow-2xl relative">
              <Image
                src="/Logos/AUDI_A3.jpg"
                alt={t('image_alt')}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-primary-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg">
              <span className="text-xs sm:text-sm font-semibold">{t('tag1')}</span>
            </div>
            <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-secondary-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg">
              <span className="text-xs sm:text-sm font-semibold">{t('tag2')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 