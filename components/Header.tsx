'use client'

import { useState } from 'react'
import { Menu, X, Car, Phone } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = useTranslations('Header')
  const locale = useLocale()
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Détermine si nous sommes sur une page de blog
  const isOnBlogPage = pathname.includes('/blog')
  const homeUrl = `/${locale}`

  const navLinks = [
    { href: isOnBlogPage ? `${homeUrl}#services` : '#services', label: t('nav_services') },
    { href: `${homeUrl}/catalogue`, label: t('nav_catalog') },
    { href: isOnBlogPage ? `${homeUrl}#devis` : '#devis', label: t('nav_quote') },
    { href: isOnBlogPage ? `${homeUrl}#contact` : '#contact', label: t('nav_contact') }
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-3 md:py-4">
          {/* Logo */}
          <Link href={homeUrl} className="flex items-center gap-2 rtl:flex-row-reverse hover:opacity-80 transition-opacity">
            <div className="bg-primary-500 p-1.5 md:p-2 rounded-lg shadow-md">
              <Car className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-sm md:text-base font-bold text-gray-900 drop-shadow-sm">{t('title')}</h1>
              <p className="text-xs text-gray-600 hidden sm:block">{t('subtitle')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href={homeUrl} className="nav-link">{t('nav_home')}</Link>
            {navLinks.map((link) => (
              link.href.startsWith('#') ? (
                <a key={link.href} href={link.href} className="nav-link">{link.label}</a>
              ) : (
                <Link key={link.href} href={link.href} className="nav-link">{link.label}</Link>
              )
            ))}
            <Link href={`${homeUrl}/blog`} className="nav-link">{t('nav_blog')}</Link>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 ml-6" dir="ltr">
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline font-semibold tracking-wide">{t('phone_number')}</span>
            </div>
            <LanguageSwitcher />
            <a href={isOnBlogPage ? `${homeUrl}#devis` : '#devis'} className="btn-primary text-sm px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform">
              {t('free_quote')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:bg-gray-200 focus:outline-none transition-colors border border-gray-200 shadow-sm"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg rounded-b-xl">
            <div className="px-4 mb-4 flex justify-end">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-gray-100 focus:bg-gray-200 focus:outline-none transition-colors border border-gray-200"
                aria-label="Fermer le menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-3 px-4">
              <Link
                href={homeUrl}
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 text-base font-medium rounded-lg hover:bg-gray-50 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav_home')}
              </Link>
              {navLinks.map((link) => (
                link.href.startsWith('#') ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-gray-700 hover:text-primary-600 transition-colors py-2 text-base font-medium rounded-lg hover:bg-gray-50 px-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-700 hover:text-primary-600 transition-colors py-2 text-base font-medium rounded-lg hover:bg-gray-50 px-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <Link
                href={`${homeUrl}/blog`}
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 text-base font-medium rounded-lg hover:bg-gray-50 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              
              {/* Language Switcher - Plus visible dans le menu mobile */}
              <div className="py-2 px-2">
                <div className="text-sm font-semibold text-gray-600 mb-2">Langue / Language / اللغة</div>
                <LanguageSwitcher />
              </div>
              
              <div className="pt-4 border-t border-gray-200 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 rtl:flex-row-reverse">
                  <Phone className="w-4 h-4" />
                  <span className="font-semibold tracking-wide">{t('phone_number')}</span>
                </div>
                <a href={isOnBlogPage ? `${homeUrl}#devis` : '#devis'} className="btn-primary w-full text-center block rounded-full py-2 shadow-md hover:scale-105 transition-transform" onClick={() => setIsMenuOpen(false)}>
                  {t('free_quote')}
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 