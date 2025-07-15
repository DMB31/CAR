'use client'

import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{t('title')}</h1>
                <p className="text-sm text-gray-400">{t('subtitle')}</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              {t('description')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('quick_links_title')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="#accueil" className="text-gray-400 hover:text-white transition-colors">
                  {t('link_home')}
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-white transition-colors">
                  {t('link_services')}
                </a>
              </li>
              <li>
                <a href="#processus" className="text-gray-400 hover:text-white transition-colors">
                  {t('link_process')}
                </a>
              </li>
              <li>
                <a href="#temoignages" className="text-gray-400 hover:text-white transition-colors">
                  {t('link_testimonials')}
                </a>
              </li>
              <li>
                <a href="#devis" className="text-gray-400 hover:text-white transition-colors">
                  {t('link_quote')}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  {t('link_contact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('services_title')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('service_import')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('service_customs')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('service_homologation')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('service_transport')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('service_simulation')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('contact_title')}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Phone className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">{t('phone')}</p>
                  <p className="text-sm text-gray-500">{t('phone_schedule')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Mail className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">{t('email')}</p>
                  <p className="text-sm text-gray-500">{t('email_response')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <MapPin className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">{t('address_line1')}</p>
                  <p className="text-gray-400">{t('address_line2')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-gray-800">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('newsletter_title')}</h3>
              <p className="text-gray-400">
                {t('newsletter_subtitle')}
              </p>
            </div>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <input
                type="email"
                placeholder={t('newsletter_placeholder')}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="btn-primary whitespace-nowrap">
                {t('newsletter_button')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              {t('copyright')}
            </div>
            <div className="flex space-x-6 text-sm rtl:space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                {t('legal_notice')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                {t('privacy_policy')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                {t('terms')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                {t('sitemap')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 