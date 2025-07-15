'use client'

import { useTranslations } from 'next-intl'
import { Car, Users, Ban, AlertTriangle, FileText } from 'lucide-react'

export default function MoujajidineLicense() {
  const t = useTranslations('MoujajidineLicense')

  return (
    <section className="bg-gray-50 section-padding">
      <div className="container-custom">
        <div className="text-center space-y-4 mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            {t('section_title')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {t('section_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Qu'est-ce que c'est */}
          <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="mb-4 lg:mb-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-500 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Car className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
            </div>
            <div className="space-y-3 lg:space-y-4 text-center">
              <h3 className="text-lg lg:text-xl font-bold text-secondary-500">
                {t('definition_title')}
              </h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                {t('definition_description')}
              </p>
              <div className="bg-primary-50 text-primary-500 p-3 lg:p-4 rounded-lg">
                <p className="text-xs lg:text-sm font-semibold">
                  {t('definition_savings')}
                </p>
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="mb-4 lg:mb-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-500 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Users className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
            </div>
            <div className="space-y-3 lg:space-y-4">
              <h3 className="text-lg lg:text-xl font-bold text-secondary-500 text-center">
                {t('conditions_title')}
              </h3>
              <ul className="space-y-2 lg:space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0"></span>
                  <span className="text-sm lg:text-base text-gray-600">{t('conditions_item1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0"></span>
                  <span className="text-sm lg:text-base text-gray-600">{t('conditions_item2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0"></span>
                  <span className="text-sm lg:text-base text-gray-600">{t('conditions_item3')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Limitations */}
          <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="mb-4 lg:mb-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-500 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Ban className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
            </div>
            <div className="space-y-3 lg:space-y-4">
              <h3 className="text-lg lg:text-xl font-bold text-secondary-500 text-center">
                {t('limitations_title')}
              </h3>
              <ul className="space-y-2 lg:space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0"></span>
                  <span className="text-sm lg:text-base text-gray-600">{t('limitations_item1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0"></span>
                  <span className="text-sm lg:text-base text-gray-600">{t('limitations_item2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0"></span>
                  <span className="text-sm lg:text-base text-gray-600">{t('limitations_item3')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Mesures réglementaires */}
          <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="mb-4 lg:mb-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-500 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
            </div>
            <div className="space-y-3 lg:space-y-4">
              <h3 className="text-lg lg:text-xl font-bold text-secondary-500 text-center">
                {t('regulations_title')}
              </h3>
              <ul className="space-y-2 lg:space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0"></span>
                  <span className="text-sm lg:text-base text-gray-600">{t('regulations_item1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0"></span>
                  <span className="text-sm lg:text-base text-gray-600">{t('regulations_item2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0"></span>
                  <span className="text-sm lg:text-base text-gray-600">{t('regulations_item3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-16 text-center">
          <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-500 rounded-lg lg:rounded-xl flex items-center justify-center mr-4 rtl:ml-4 rtl:mr-0">
                <AlertTriangle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h4 className="text-lg lg:text-xl font-bold text-secondary-500">
                {t('notice_title')}
              </h4>
            </div>
            <p className="text-sm lg:text-base text-gray-600 leading-relaxed px-4">
              {t('notice_description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 