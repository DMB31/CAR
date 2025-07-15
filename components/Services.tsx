'use client'

import { FileText, Calculator, Award, Headphones, Shield, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl';

export default function Services() {
  const t = useTranslations('Services');

  const services = [
    {
      id: 1,
      title: t('service1_title'),
      description: t('service1_description'),
      icon: FileText,
      features: [t('service1_feature1'), t('service1_feature2'), t('service1_feature3')]
    },
    {
      id: 2,
      title: t('service2_title'),
      description: t('service2_description'),
      icon: Calculator,
      features: [t('service2_feature1'), t('service2_feature2'), t('service2_feature3')]
    },
    {
      id: 3,
      title: t('service3_title'),
      description: t('service3_description'),
      icon: Award,
      features: [t('service3_feature1'), t('service3_feature2'), t('service3_feature3')]
    },
    {
      id: 4,
      title: t('service4_title'),
      description: t('service4_description'),
      icon: Headphones,
      features: [t('service4_feature1'), t('service4_feature2'), t('service4_feature3')]
    },
    {
      id: 5,
      title: t('service5_title'),
      description: t('service5_description'),
      icon: Shield,
      features: [t('service5_feature1'), t('service5_feature2'), t('service5_feature3')]
    },
    {
      id: 6,
      title: t('service6_title'),
      description: t('service6_description'),
      icon: Clock,
      features: [t('service6_feature1'), t('service6_feature2'), t('service6_feature3')]
    }
  ]
  return (
    <section id="services" className="bg-gray-50 section-padding scroll-mt-32">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            {t('section_title')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {t('section_subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => {
            const Icon = service.icon
            
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {/* Icon */}
                <div className="mb-4 lg:mb-6">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-500 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 lg:space-y-4">
                  <h3 className="text-lg lg:text-xl font-bold text-secondary-500">
                    {service.title}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 lg:mt-16 text-center">
          <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 items-center">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary-500 mb-2">{t('bottom_stat1_value')}</div>
                <div className="text-sm lg:text-base text-secondary-500">{t('bottom_stat1_label')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary-500 mb-2">{t('bottom_stat2_value')}</div>
                <div className="text-sm lg:text-base text-secondary-500">{t('bottom_stat2_label')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary-500 mb-2">{t('bottom_stat3_value')}</div>
                <div className="text-sm lg:text-base text-secondary-500">{t('bottom_stat3_label')}</div>
              </div>
            </div>
            
            <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-gray-200">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">
                {t('bottom_cta_title')}
              </h3>
              <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6 px-4">
                {t('bottom_cta_subtitle')}
              </p>
              <button className="btn-primary">
                {t('bottom_cta_button')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 