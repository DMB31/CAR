'use client'

import { useState } from 'react'
import { Calculator, Car, MapPin, Euro, Send, CheckCircle, Download, Edit3, Printer as PrintIcon, Sparkles, TrendingUp, Shield, Clock } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

export default function QuoteForm() {
  const t = useTranslations('QuoteForm');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    brand: '',
    model: '',
    year: '',
    vehicleType: '',
    priceEur: '',
    engineType: '',
    cylindree: '',
    origin: '',
    destination: '',
    urgency: '',
    message: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [calculationResult, setCalculationResult] = useState<{
    priceEur: number;
    prixDZD: number;
    prixBaseTaxes: number;
    droitDouane: number;
    montantDroitDouane: number;
    prct: number;
    tcs: number;
    tva: number;
    tic: number;
    totalDroitsTaxes: number;
    reduction: number;
    montantReduction: number;
    totalFinal: number;
    coutTotalVehicule: number;
  } | null>(null)

  // Taux de change modifiables
  const [exchangeRates, setExchangeRates] = useState({
    marcheNoir: 260,
    bancaire: 150
  })
  const [isEditingRates, setIsEditingRates] = useState(false)

  const calculateCustomsDuty = () => {
    if (!formData.priceEur || !formData.engineType || !formData.vehicleType) {
      return null
    }

    const priceEur = parseFloat(formData.priceEur)
    const cylindree = parseInt(formData.cylindree) || 0
    
    // Prix en DZD (marché noir)
    const prixDZD = priceEur * exchangeRates.marcheNoir
    
    // Prix de base pour calcul des taxes (taux bancaire)
    const prixBaseTaxes = priceEur * exchangeRates.bancaire

    // Calcul du droit de douane
    let droitDouane = 0
    
    if (formData.engineType === 'diesel' || formData.engineType === 'electrique') {
      droitDouane = 0.30 // 30%
    } else if (formData.engineType === 'essence' || formData.engineType === 'hybride') {
      if (cylindree < 1000) {
        droitDouane = 0.15 // 15%
      } else if (cylindree >= 1000 && cylindree <= 1500) {
        droitDouane = 0.15 // 15%
      } else if (cylindree > 1500 && cylindree <= 1800) {
        droitDouane = 0.30 // 30%
      } else if (cylindree > 1800) {
        droitDouane = 0.30 // 30%
      }
    }

    // Calcul des taxes
    const montantDroitDouane = prixBaseTaxes * droitDouane
    const prct = prixBaseTaxes * 0.02 // 2%
    const tcs = prixBaseTaxes * 0.02 // 2%
    
    // Base pour TVA
    const baseTVA = prixBaseTaxes + montantDroitDouane + prct + tcs
    const tva = baseTVA * 0.19 // 19%
    
    // TIC (Taxe Intérieure de Consommation) pour cylindrée > 2000cm³
    let tic = 0
    if (cylindree > 2000) {
      tic = prixBaseTaxes * 0.60 // 60%
    }

    // Total des droits et taxes
    let totalDroitsTaxes = montantDroitDouane + prct + tcs + tva + tic

    // Réductions pour véhicules d'occasion
    let reduction = 0
    if (formData.vehicleType === 'occasion') {
      if (formData.engineType === 'electrique') {
        reduction = 0.80 // 80%
      } else if ((formData.engineType === 'essence' || formData.engineType === 'hybride') && cylindree <= 1800) {
        reduction = 0.50 // 50%
      } else if ((formData.engineType === 'essence' || formData.engineType === 'hybride') && cylindree > 1800) {
        reduction = 0.20 // 20%
      }
    }

    const montantReduction = totalDroitsTaxes * reduction
    const totalFinal = totalDroitsTaxes - montantReduction
    const coutTotalVehicule = prixDZD + totalFinal

    return {
      priceEur,
      prixDZD,
      prixBaseTaxes,
      droitDouane: droitDouane * 100,
      montantDroitDouane,
      prct,
      tcs,
      tva,
      tic,
      totalDroitsTaxes,
      reduction: reduction * 100,
      montantReduction,
      totalFinal,
      coutTotalVehicule
    }
  }

  const generatePDF = async () => {
    if (!calculationResult) return
    
    setIsGeneratingPDF(true)
    
    try {
      // This is a simplified example. For a real app, consider a server-side PDF generation library.
      const pdfContent = `
        <!DOCTYPE html>
        <html dir="${locale === 'ar' ? 'rtl' : 'ltr'}">
        <head>
          <meta charset="UTF-8">
          <title>${t('result_calculation_title')}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            /* Add styles here */
          </style>
        </head>
        <body>
          <h1>${t('result_calculation_title')}</h1>
          {/* This is a very basic structure. More complex layout would be needed. */}
          <p>${t('result_calculation_subtitle')}</p>
          
          <h2>${t('result_costs_title')}</h2>
          <table>
            <thead>
              <tr>
                <th>${t('result_table_header_element')}</th>
                <th>${t('result_table_header_amount')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${t('result_table_item_price')}</td>
                <td>${calculationResult.prixDZD.toLocaleString()} DZD</td>
              </tr>
              <tr>
                <td>${t('result_table_item_total_taxes')}</td>
                <td>${calculationResult.totalFinal.toLocaleString()} DZD</td>
              </tr>
              <tr style="font-weight: bold;">
                <td>${t('result_total_cost')}</td>
                <td>${calculationResult.coutTotalVehicule.toLocaleString()} DZD</td>
              </tr>
            </tbody>
          </table>

        </body>
        </html>
      `

      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(pdfContent)
        printWindow.document.close()
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert(t('error_generating_pdf'))
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setCalculationResult(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      brand: '',
      model: '',
      year: '',
      vehicleType: '',
      priceEur: '',
      engineType: '',
      cylindree: '',
      origin: '',
      destination: '',
      urgency: '',
      message: ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Calculer les droits de douane
      const calculation = calculateCustomsDuty()
      
      // Préparer les données pour Google Sheets
      const submissionData = {
        timestamp: new Date().toLocaleString('fr-FR'),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        vehicleType: formData.vehicleType,
        priceEur: formData.priceEur,
        engineType: formData.engineType,
        cylindree: formData.cylindree,
        origin: formData.origin,
        destination: formData.destination,
        urgency: formData.urgency,
        message: formData.message,
        exchangeRateMarcheNoir: exchangeRates.marcheNoir,
        exchangeRateBancaire: exchangeRates.bancaire,
        calculatedTotal: calculation ? calculation.coutTotalVehicule : 'N/A',
        customsDutyAmount: calculation ? calculation.totalFinal : 'N/A'
      }

      // Envoyer vers MongoDB via l'API Next.js
      await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })

      console.log('Formulaire envoyé avec succès vers MongoDB')
      setCalculationResult(calculation)
      setIsSubmitted(true)
      
      // Ne pas réinitialiser automatiquement - laisser l'utilisateur contrôler
      
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(t('error_submitting_form'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleExchangeRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExchangeRates({
      ...exchangeRates,
      [e.target.name]: parseFloat(e.target.value) || 0
    })
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i) // Seulement 3 années : actuelle et 2 précédentes

  // Options pour les marques de véhicules
  const vehicleBrands = [
    'Audi',
    'BMW',
    'Mercedes-Benz',
    'Volkswagen',
    'Peugeot',
    'Renault',
    'Citroën',
    'Toyota',
    'Honda',
    'Nissan',
    'Ford',
    'Hyundai',
    'Kia',
    'Mazda',
    'Mitsubishi',
    'Subaru',
    'Volvo',
    'Skoda',
    'SEAT',
    'Fiat',
    'Alfa Romeo',
    'Jaguar',
    'Land Rover',
    'Porsche',
    'Tesla',
    'Autre'
  ]

  // Fonction pour vérifier si le véhicule doit être considéré comme occasion
  const isVehicleUsed = (year: string) => {
    if (!year) return false
    const vehicleYear = parseInt(year)
    // Si l'année n'est pas dans les 3 dernières années, c'est occasion
    return vehicleYear < (currentYear - 2)
  }

  // Effect pour mettre à jour automatiquement le type de véhicule
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value
    const newFormData = {
      ...formData,
      year: newYear
    }
    
    // Si le véhicule a plus de 3 ans, forcer le type à "occasion"
    if (isVehicleUsed(newYear)) {
      newFormData.vehicleType = 'occasion'
    }
    
    setFormData(newFormData)
  }

  if (isSubmitted && calculationResult) {
    return (
      <section id="devis" className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Results Header with Modern Design */}
            <div className="text-center mb-12">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-20 scale-110"></div>
                <div className="relative w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-secondary-500 to-secondary-700 bg-clip-text text-transparent mb-4">
                {t('result_calculation_title')}
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {t('result_calculation_subtitle')}
              </p>
            </div>

            {/* Modern Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center items-center mb-12">
              <button
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isGeneratingPDF 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  {isGeneratingPDF ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t('result_button_generating_pdf')}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>{t('result_button_open_pdf')}</span>
                    </>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => window.print()}
                className="group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <PrintIcon className="w-5 h-5" />
                  <span>{t('result_button_print')}</span>
                </div>
              </button>
              
              <button
                onClick={resetForm}
                className="group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-900 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <Calculator className="w-5 h-5" />
                  <span>{t('result_button_new_calc')}</span>
                </div>
              </button>
            </div>

            {/* Modern Results Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              {/* Exchange Rates Notice */}
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-primary-600">{t('result_rates_title')}</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="font-semibold text-primary-600">{t('result_rates_price_note')}</p>
                    <p className="text-2xl font-bold text-primary-700">1 EUR = {exchangeRates.marcheNoir} DZD</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="font-semibold text-primary-600">{t('result_rates_tax_note')}</p>
                    <p className="text-2xl font-bold text-primary-700">1 EUR = {exchangeRates.bancaire} DZD</p>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-secondary-500 mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                  <span>{t('result_costs_title')}</span>
                </h3>
                
                <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th className="px-6 py-4 text-left font-semibold text-secondary-500">{t('result_table_header_element')}</th>
                        <th className="px-6 py-4 text-left font-semibold text-secondary-500">{t('result_table_header_base')}</th>
                        <th className="px-6 py-4 text-left font-semibold text-secondary-500">{t('result_table_header_rate')}</th>
                        <th className="px-6 py-4 text-right font-semibold text-secondary-500">{t('result_table_header_amount')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-secondary-500">{t('result_table_item_price')}</td>
                        <td className="px-6 py-4 text-gray-600">{calculationResult.priceEur.toLocaleString()} EUR</td>
                        <td className="px-6 py-4 text-gray-600">{t('exchange_rate_marcheNoir_label')} ({exchangeRates.marcheNoir})</td>
                        <td className="px-6 py-4 text-right font-bold text-secondary-500">{calculationResult.prixDZD.toLocaleString()} DZD</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-secondary-500">{t('result_table_item_customs')}</td>
                        <td className="px-6 py-4 text-gray-600">{calculationResult.prixBaseTaxes.toLocaleString()} DZD</td>
                        <td className="px-6 py-4 text-gray-600">{calculationResult.droitDouane}%</td>
                        <td className="px-6 py-4 text-right font-semibold text-secondary-500">{calculationResult.montantDroitDouane.toLocaleString()} DZD</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-secondary-500">{t('result_table_item_prct')}</td>
                        <td className="px-6 py-4 text-gray-600">{calculationResult.prixBaseTaxes.toLocaleString()} DZD</td>
                        <td className="px-6 py-4 text-gray-600">2%</td>
                        <td className="px-6 py-4 text-right font-semibold text-secondary-500">{calculationResult.prct.toLocaleString()} DZD</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-secondary-500">{t('result_table_item_tcs')}</td>
                        <td className="px-6 py-4 text-gray-600">{calculationResult.prixBaseTaxes.toLocaleString()} DZD</td>
                        <td className="px-6 py-4 text-gray-600">2%</td>
                        <td className="px-6 py-4 text-right font-semibold text-secondary-500">{calculationResult.tcs.toLocaleString()} DZD</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-secondary-500">{t('result_table_item_tva')}</td>
                        <td className="px-6 py-4 text-gray-600">{(calculationResult.prixBaseTaxes + calculationResult.montantDroitDouane + calculationResult.prct + calculationResult.tcs).toLocaleString()} DZD</td>
                        <td className="px-6 py-4 text-gray-600">19%</td>
                        <td className="px-6 py-4 text-right font-semibold text-secondary-500">{calculationResult.tva.toLocaleString()} DZD</td>
                      </tr>
                      {calculationResult.tic > 0 && (
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-secondary-500">{t('result_table_item_tic')}</td>
                          <td className="px-6 py-4 text-gray-600">{calculationResult.prixBaseTaxes.toLocaleString()} DZD</td>
                          <td className="px-6 py-4 text-gray-600">60%</td>
                          <td className="px-6 py-4 text-right font-semibold text-secondary-500">{calculationResult.tic.toLocaleString()} DZD</td>
                        </tr>
                      )}
                      <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-t-2 border-gray-300">
                        <td className="px-6 py-4 font-bold text-secondary-500">{t('result_table_item_total_taxes')}</td>
                        <td className="px-6 py-4 text-gray-600">-</td>
                        <td className="px-6 py-4 text-gray-600">-</td>
                        <td className="px-6 py-4 text-right font-bold text-secondary-500 text-lg">{calculationResult.totalDroitsTaxes.toLocaleString()} DZD</td>
                      </tr>
                      {calculationResult.reduction > 0 && (
                        <>
                          <tr className="hover:bg-primary-50 transition-colors bg-primary-25">
                            <td className="px-6 py-4 text-primary-600">{t('result_table_item_reduction')}</td>
                            <td className="px-6 py-4 text-primary-500">{calculationResult.totalDroitsTaxes.toLocaleString()} DZD</td>
                            <td className="px-6 py-4 text-primary-500">-{calculationResult.reduction}%</td>
                            <td className="px-6 py-4 text-right font-semibold text-primary-600">-{calculationResult.montantReduction.toLocaleString()} DZD</td>
                          </tr>
                          <tr className="bg-gradient-to-r from-primary-100 to-primary-50 border-t-2 border-primary-300">
                            <td className="px-6 py-4 font-bold text-primary-700">{t('result_table_item_total_after_reduction')}</td>
                            <td className="px-6 py-4 text-primary-500">-</td>
                            <td className="px-6 py-4 text-primary-500">-</td>
                            <td className="px-6 py-4 text-right font-bold text-primary-700 text-lg">{calculationResult.totalFinal.toLocaleString()} DZD</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Cost Highlight */}
              <div className="relative overflow-hidden rounded-3xl p-8 mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500"></div>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative text-center text-white">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xl font-semibold mb-2 opacity-90">
                    {t('result_total_cost_title')}
                  </p>
                  <p className="text-4xl md:text-5xl font-bold mb-4">
                    {calculationResult.coutTotalVehicule.toLocaleString()} DZD
                  </p>
                  <p className="text-xl opacity-90">
                    {t('result_equivalent_title')} {(calculationResult.coutTotalVehicule / exchangeRates.marcheNoir).toLocaleString()} EUR
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-primary-700">Notification</h4>
                  </div>
                  <p className="text-primary-600">
                    {t('result_email_notification')}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-secondary-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-secondary-600">{t('result_tip_title')}</h4>
                  </div>
                  <p className="text-secondary-500 text-sm">
                    {t('result_tip_content')} <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Ctrl+P</kbd>
                  </p>
                </div>
              </div>

              {/* Important Notes */}
              <div className="mt-8 bg-gradient-to-r from-accent-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
                <h4 className="font-bold text-secondary-600 mb-4 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span>{t('result_notes_title')}</span>
                </h4>
                <ul className="text-sm text-secondary-500 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t('result_note_1')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t('result_note_2')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t('result_note_3')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{t('result_note_4')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="devis" className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 section-padding scroll-mt-32">
      <div className="container-custom">
        {/* Modern Section Header */}
        <div className="text-center space-y-4 lg:space-y-6 mb-12 lg:mb-20">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary-500 rounded-full blur-3xl opacity-20 scale-110"></div>
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold bg-gradient-to-r from-secondary-500 via-secondary-600 to-secondary-700 bg-clip-text text-transparent mb-6">
                {t('title')}
              </h2>
              <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
            </div>
          </div>
          <p className="text-lg sm:text-xl lg:text-1xl text-gray-600 max-w-2xl lg:max-w-4xl mx-auto leading-relaxed px-4">
            {t('subtitle')}
          </p>
        </div>

        {isSubmitted ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 text-center">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-primary-500 rounded-full blur-2xl opacity-30 scale-110"></div>
                <div className="relative w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-secondary-500 to-secondary-600 bg-clip-text text-transparent mb-4">
                {t('submitted_title')}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {t('submitted_subtitle')}
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setCalculationResult(null)
                  resetForm()
                }}
                className="group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>{t('result_reset')}</span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl lg:max-w-5xl mx-auto">
            {/* Modern Form Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 overflow-hidden mx-4 sm:mx-0">
              {/* Form Header */}
              

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-8 lg:space-y-10">
                
                {/* Personal Information Section */}
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center space-x-3 lg:space-x-4 pb-3 lg:pb-4 border-b border-gray-200">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm lg:text-base">1</span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-secondary-500">
                      {t('section_personal_info')}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-semibold text-secondary-500">{t('form_name')}</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-semibold text-secondary-500">{t('form_email')}</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-semibold text-secondary-500">{t('form_phone')}</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base" 
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Information Section */}
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center space-x-3 lg:space-x-4 pb-3 lg:pb-4 border-b border-gray-200">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm lg:text-base">2</span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-secondary-500">
                      {t('section_vehicle_info')}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                    <div className="space-y-2">
                      <label htmlFor="brand" className="block text-sm font-semibold text-secondary-500">{t('form_brand')}</label>
                      <select 
                        id="brand" 
                        name="brand" 
                        value={formData.brand} 
                        onChange={handleChange} 
                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base" 
                        required
                      >
                        <option value="">{t('form_select_placeholder')}</option>
                        {vehicleBrands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="model" className="block text-sm font-semibold text-secondary-500">{t('form_model')}</label>
                      <input 
                        type="text" 
                        id="model" 
                        name="model" 
                        value={formData.model} 
                        onChange={handleChange} 
                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="year" className="block text-sm font-semibold text-secondary-500">{t('form_year')}</label>
                      <select 
                        id="year" 
                        name="year" 
                        value={formData.year} 
                        onChange={handleYearChange} 
                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base" 
                        required
                      >
                        <option value="">{t('form_select_placeholder')}</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="vehicleType" className="block text-sm font-semibold text-secondary-500">{t('form_vehicleType')}</label>
                      <select 
                        id="vehicleType" 
                        name="vehicleType" 
                        value={formData.vehicleType} 
                        onChange={handleChange} 
                        disabled={isVehicleUsed(formData.year)}
                        className={`w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base ${
                          isVehicleUsed(formData.year) ? 'bg-gray-100 cursor-not-allowed opacity-75' : ''
                        }`}
                        required
                      >
                        <option value="">{t('form_select_placeholder')}</option>
                        <option value="neuf">{t('form_vehicleType_option_new')}</option>
                        <option value="occasion">{t('form_vehicleType_option_used')}</option>
                      </select>
                      {isVehicleUsed(formData.year) && (
                        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2">
                          <span className="font-medium">Automatique:</span> Véhicule classé comme "occasion" car il a plus de 3 ans.
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="priceEur" className="block text-sm font-semibold text-secondary-500">{t('form_priceEur')}</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          id="priceEur" 
                          name="priceEur" 
                          value={formData.priceEur} 
                          onChange={handleChange} 
                          className="w-full px-3 lg:px-4 py-2.5 lg:py-3 pl-10 lg:pl-12 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base" 
                          required 
                        />
                        <Euro className="absolute left-3 lg:left-4 top-3.5 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="engineType" className="block text-sm font-semibold text-secondary-500">{t('form_engineType')}</label>
                      <select 
                        id="engineType" 
                        name="engineType" 
                        value={formData.engineType} 
                        onChange={handleChange} 
                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base" 
                        required
                      >
                        <option value="">{t('form_select_placeholder')}</option>
                        <option value="diesel">{t('form_engineType_option_diesel')}</option>
                        <option value="essence">{t('form_engineType_option_essence')}</option>
                        <option value="hybride">{t('form_engineType_option_hybride')}</option>
                        <option value="electrique">{t('form_engineType_option_electrique')}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="cylindree" className="block text-sm font-semibold text-secondary-500">{t('form_cylindree')}</label>
                      <input 
                        type="number" 
                        id="cylindree" 
                        name="cylindree" 
                        value={formData.cylindree} 
                        onChange={handleChange} 
                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base" 
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Additional Info Section */}
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center space-x-3 lg:space-x-4 pb-3 lg:pb-4 border-b border-gray-200">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm lg:text-base">3</span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-secondary-500">
                      {t('section_additional_info')}
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 lg:gap-6 mb-6">
                    <div className="space-y-2">
                      <label htmlFor="origin" className="block text-sm font-semibold text-secondary-500">{t('form_origin')}</label>
                      <div className="relative">
                        <select
                          id="origin"
                          name="origin"
                          value={formData.origin}
                          onChange={handleChange}
                          className="w-full px-3 lg:px-4 py-2.5 lg:py-3 pl-10 lg:pl-12 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base"
                        >
                          <option value="">--</option>
                          <option value="europe">Europe</option>
                          <option value="chine">Chine</option>
                          <option value="dubai">Dubai</option>
                          <option value="usa">USA</option>
                        </select>
                        <MapPin className="absolute left-3 lg:left-4 top-3.5 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="destination" className="block text-sm font-semibold text-secondary-500">{t('form_destination')}</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          id="destination" 
                          name="destination" 
                          value={formData.destination} 
                          onChange={handleChange} 
                          className="w-full px-3 lg:px-4 py-2.5 lg:py-3 pl-10 lg:pl-12 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base" 
                        />
                        <MapPin className="absolute left-3 lg:left-4 top-3.5 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="urgency" className="block text-sm font-semibold text-secondary-500">{t('form_urgency')}</label>
                      <select 
                        id="urgency" 
                        name="urgency" 
                        value={formData.urgency} 
                        onChange={handleChange} 
                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base"
                      >
                        <option value="">{t('form_select_placeholder')}</option>
                        <option value="basse">{t('form_urgency_option_low')}</option>
                        <option value="moyenne">{t('form_urgency_option_medium')}</option>
                        <option value="haute">{t('form_urgency_option_high')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-semibold text-secondary-500">{t('form_message')}</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      rows={4} 
                      className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Exchange Rates Section */}
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center space-x-3 lg:space-x-4 pb-3 lg:pb-4 border-b border-gray-200">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-sm lg:text-base">4</span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-secondary-500">{t('exchange_rate_title')}</h3>
                  </div>
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary-500 rounded-lg lg:rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                        </div>
                        <h4 className="text-lg lg:text-xl font-bold text-primary-700">Taux de Change</h4>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setIsEditingRates(!isEditingRates)} 
                        className="flex items-center space-x-2 text-sm bg-primary-200 hover:bg-primary-300 text-primary-700 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl transition-colors"
                      >
                        <Edit3 className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span>{isEditingRates ? t('exchange_rate_save') : t('exchange_rate_edit')}</span>
                      </button>
                    </div>
                    {isEditingRates ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-primary-700">
                            {t('exchange_rate_marcheNoir_label')} (1 EUR = ? DZD)
                          </label>
                          <input
                            type="number"
                            name="marcheNoir"
                            value={exchangeRates.marcheNoir}
                            onChange={handleExchangeRateChange}
                            className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-primary-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/80"
                            min="1"
                            step="1"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-primary-700">
                            {t('exchange_rate_bancaire_label')} (1 EUR = ? DZD)
                          </label>
                          <input
                            type="number"
                            name="bancaire"
                            value={exchangeRates.bancaire}
                            onChange={handleExchangeRateChange}
                            className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-primary-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/80"
                            min="1"
                            step="1"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/60 rounded-xl p-4">
                          <p className="text-primary-700 font-semibold">{t('exchange_rate_marcheNoir_display')}</p>
                          <p className="text-2xl font-bold text-primary-600">1 EUR = {exchangeRates.marcheNoir} DZD</p>
                        </div>
                        <div className="bg-white/60 rounded-xl p-4">
                          <p className="text-primary-700 font-semibold">{t('exchange_rate_bancaire_display')}</p>
                          <p className="text-2xl font-bold text-primary-600">1 EUR = {exchangeRates.bancaire} DZD</p>
                        </div>
                      </div>
                    )}
                    <p className="text-sm text-primary-600 mt-4 text-center bg-white/40 rounded-lg p-3">
                      {t('exchange_rate_note')}
                    </p>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col lg:flex-row gap-4 pt-8 border-t border-gray-200">
                  <button 
                    type="button" 
                    onClick={() => setCalculationResult(calculateCustomsDuty())} 
                    className="group relative overflow-hidden flex-1 px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-900 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-3">
                      <Calculator className="w-6 h-6" />
                      <span className="text-lg">{t('button_calculate')}</span>
                    </div>
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="group relative overflow-hidden flex-1 px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-3">
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-6 h-6" />
                      )}
                      <span className="text-lg">{t('button_submit')}</span>
                    </div>
                  </button>
                </div>
              </form>

              {/* Calculation Result - Show in same container */}
              {calculationResult && (
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 border-t border-primary-200 p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary-700">{t('result_title')}</h3>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-secondary-500">{t('result_total_cost')}</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                        {calculationResult.coutTotalVehicule.toLocaleString()} DZD
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <button 
                      onClick={generatePDF} 
                      disabled={isGeneratingPDF} 
                      className="group relative overflow-hidden flex-1 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center space-x-2">
                        {isGeneratingPDF ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Download className="w-5 h-5" />
                        )}
                        <span>{isGeneratingPDF ? t('pdf_generating') : t('result_download_pdf')}</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setCalculationResult(null)
                        resetForm()
                      }}
                      className="group relative overflow-hidden flex-1 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-900 text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center space-x-2">
                        <Calculator className="w-5 h-5" />
                        <span>{t('result_reset')}</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
} 