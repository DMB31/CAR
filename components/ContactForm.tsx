'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('ContactForm');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      vehicle: '',
      message: ''
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="bg-gray-50 section-padding">
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

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg">
            <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4 lg:mb-6">
              {t('form_title')}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form_name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm lg:text-base"
                    placeholder={t('form_name_placeholder')}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form_email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm lg:text-base"
                    placeholder={t('form_email_placeholder')}
                    required
                  />
                </div>
              </div>

              {/* Phone & Vehicle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form_phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm lg:text-base"
                    placeholder={t('form_phone_placeholder')}
                  />
                </div>
                <div>
                  <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form_vehicle')}
                  </label>
                  <select
                    id="vehicle"
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleChange}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm lg:text-base"
                  >
                    <option value="">{t('form_vehicle_option_default')}</option>
                    <option value="mercedes">{t('form_vehicle_option_mercedes')}</option>
                    <option value="bmw">{t('form_vehicle_option_bmw')}</option>
                    <option value="audi">{t('form_vehicle_option_audi')}</option>
                    <option value="peugeot">{t('form_vehicle_option_peugeot')}</option>
                    <option value="renault">{t('form_vehicle_option_renault')}</option>
                    <option value="volkswagen">{t('form_vehicle_option_vw')}</option>
                    <option value="other">{t('form_vehicle_option_other')}</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form_message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm lg:text-base resize-none"
                  placeholder={t('form_message_placeholder')}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>{t('form_button')}</span>
              </button>
            </form>

            {/* Form Footer */}
            <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200">
              <p className="text-xs lg:text-sm text-gray-600 text-center">
                {t('form_footer')}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 lg:space-y-8">
            <div>
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4 lg:mb-6">
                {t('info_title')}
              </h3>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4 lg:space-y-6">
              {/* Phone */}
              <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-md">
                <div className="flex items-start space-x-3 lg:space-x-4 rtl:space-x-reverse">
                  <div className="bg-primary-100 p-2 lg:p-3 rounded-lg">
                    <Phone className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('info_phone_title')}</h4>
                    <p className="text-primary-600 font-medium text-sm lg:text-base">{t('info_phone_value')}</p>
                    <p className="text-xs lg:text-sm text-gray-500">{t('info_phone_schedule')}</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-md">
                <div className="flex items-start space-x-3 lg:space-x-4 rtl:space-x-reverse">
                  <div className="bg-primary-100 p-2 lg:p-3 rounded-lg">
                    <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('info_email_title')}</h4>
                    <p className="text-primary-600 font-medium text-sm lg:text-base break-all">{t('info_email_value')}</p>
                    <p className="text-xs lg:text-sm text-gray-500">{t('info_email_response')}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-md">
                <div className="flex items-start space-x-3 lg:space-x-4 rtl:space-x-reverse">
                  <div className="bg-primary-100 p-2 lg:p-3 rounded-lg">
                    <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('info_address_title')}</h4>
                    <p className="text-gray-600 text-sm lg:text-base">{t('info_address_line1')}</p>
                    <p className="text-gray-600 text-sm lg:text-base">{t('info_address_line2')}</p>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-md">
                <div className="flex items-start space-x-3 lg:space-x-4 rtl:space-x-reverse">
                  <div className="bg-primary-100 p-2 lg:p-3 rounded-lg">
                    <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('info_schedule_title')}</h4>
                    <p className="text-gray-600 text-sm lg:text-base">{t('info_schedule_line1')}</p>
                    <p className="text-gray-600 text-sm lg:text-base">{t('info_schedule_line2')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 