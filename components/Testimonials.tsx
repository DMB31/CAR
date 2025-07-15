'use client'

import { Star, Quote } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl';

export default function Testimonials() {
  const t = useTranslations('Testimonials');

  const testimonials = [
    {
      id: 1,
      name: t('testimonial1_name'),
      location: t('testimonial1_location'),
      vehicle: t('testimonial1_vehicle'),
      rating: 5,
      comment: t('testimonial1_comment'),
      avatar: t('testimonial1_avatar')
    },
    {
      id: 2,
      name: t('testimonial2_name'),
      location: t('testimonial2_location'),
      vehicle: t('testimonial2_vehicle'),
      rating: 5,
      comment: t('testimonial2_comment'),
      avatar: t('testimonial2_avatar')
    },
    {
      id: 3,
      name: t('testimonial3_name'),
      location: t('testimonial3_location'),
      vehicle: t('testimonial3_vehicle'),
      rating: 5,
      comment: t('testimonial3_comment'),
      avatar: t('testimonial3_avatar')
    },
    {
      id: 4,
      name: t('testimonial4_name'),
      location: t('testimonial4_location'),
      vehicle: t('testimonial4_vehicle'),
      rating: 5,
      comment: t('testimonial4_comment'),
      avatar: t('testimonial4_avatar')
    }
  ]

  return (
    <section id="temoignages" className="bg-white section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t('section_title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('section_subtitle')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-lg transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-20 rtl:right-auto rtl:left-6">
                <Quote className="w-8 h-8 text-primary-500" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4 rtl:space-x-reverse">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.comment}"
              </p>

              {/* Author Info */}
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.location} • {testimonial.vehicle}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="bg-primary-500 rounded-2xl p-8 text-white mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">{t('stat1_value')}</div>
              <div className="text-primary-100">{t('stat1_label')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{t('stat2_value')}</div>
              <div className="text-primary-100">{t('stat2_label')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{t('stat3_value')}</div>
              <div className="text-primary-100">{t('stat3_label')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{t('stat4_value')}</div>
              <div className="text-primary-100">{t('stat4_label')}</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('cta_title')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('cta_subtitle')}
            </p>
            <a href="#devis" className="btn-primary">
              {t('cta_button')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
} 