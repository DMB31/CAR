'use client'

import { Search, CheckCircle, Truck, Home } from 'lucide-react'
import { useTranslations } from 'next-intl';

export default function Steps() {
  const t = useTranslations('Steps');

  const steps = [
    {
      id: 1,
      title: t('step1_title'),
      description: t('step1_description'),
      icon: Search,
      color: 'primary',
    },
    {
      id: 2,
      title: t('step2_title'),
      description: t('step2_description'),
      icon: CheckCircle,
      color: 'secondary',
    },
    {
      id: 3,
      title: t('step3_title'),
      description: t('step3_description'),
      icon: Truck,
      color: 'primary',
    },
    {
      id: 4,
      title: t('step4_title'),
      description: t('step4_description'),
      icon: Home,
      color: 'secondary',
    },
  ]

  return (
    <section id="processus" className="bg-white section-padding">
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

        {/* Steps Grid */}
        <div className="group grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            
            return (
              <div
                key={step.id}
                className="relative"
              >
                {/* Plus de ligne de connexion */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  {/* Step Number & Icon */}
                  <div className="relative flex items-center justify-center mx-auto">
                    <div className={`w-32 h-32 flex items-center justify-center rounded-full ${
                      step.color === 'primary' 
                        ? 'bg-primary-500 hover:bg-primary-600' 
                        : 'bg-secondary-500 hover:bg-secondary-600'
                    } shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                      <span className="text-sm font-bold text-gray-700">{step.id}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </div>
            )
          })}
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