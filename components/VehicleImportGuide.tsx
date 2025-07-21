'use client'

import { useState } from 'react'
import { Car, Users, CreditCard, FileText, CheckCircle, AlertTriangle, ExternalLink, Calculator, Calendar, Shield, Gavel } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function VehicleImportGuide() {
  const t = useTranslations('VehicleImport')
  const [activeTab, setActiveTab] = useState('new-vehicles')

  const tabs = [
    { id: 'new-vehicles', label: t('tab_new_vehicles'), icon: Car },
    { id: 'used-vehicles', label: t('tab_used_vehicles'), icon: Calendar },
    { id: 'special-cases', label: t('tab_special_cases'), icon: Users },
    { id: 'procedures', label: t('tab_procedures'), icon: FileText }
  ]

  return (
    <section id="import-guide" className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center space-y-4 lg:space-y-6 mb-12 lg:mb-20">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary-500 rounded-full blur-3xl opacity-20 scale-110"></div>
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold bg-gradient-to-r from-secondary-500 via-secondary-600 to-secondary-700 bg-clip-text text-transparent mb-6">
                {t('section_title')}
              </h2>
              <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
            </div>
          </div>
          <p className="text-lg sm:text-xl lg:text-1xl text-gray-600 max-w-2xl lg:max-w-4xl mx-auto leading-relaxed px-4">
            {t('section_subtitle')}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 lg:gap-4 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 lg:px-6 py-3 lg:py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Based on Active Tab */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'new-vehicles' && <NewVehiclesContent />}
          {activeTab === 'used-vehicles' && <UsedVehiclesContent />}
          {activeTab === 'special-cases' && <SpecialCasesContent />}
          {activeTab === 'procedures' && <ProceduresContent />}
        </div>

        {/* Official Sources */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">{t('sources_title')}</h3>
            <p className="text-blue-700 mb-6">{t('sources_subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <a 
              href="https://www.douane.gov.dz/spip.php?article45&lang=fr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 group-hover:text-blue-700">{t('source_douane_title')}</h4>
                  <p className="text-blue-600 text-sm">{t('source_douane_desc')}</p>
                </div>
              </div>
            </a>
            
            <a 
              href="https://www.trade.gov/country-commercial-guides/algeria-import-requirements-and-documentation" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 group-hover:text-green-700">{t('source_trade_title')}</h4>
                  <p className="text-green-600 text-sm">{t('source_trade_desc')}</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// Composant pour les véhicules neufs
function NewVehiclesContent() {
  const t = useTranslations('VehicleImport')
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center">
          <Car className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-secondary-500">{t('new_vehicles_title')}</h3>
          <p className="text-gray-600">{t('new_vehicles_subtitle')}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Conditions générales */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
            <h4 className="font-bold text-green-900 mb-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{t('new_conditions_title')}</span>
            </h4>
            <ul className="space-y-3 text-green-800">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{t('new_condition_1')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{t('new_condition_2')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{t('new_condition_3')}</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
            <h4 className="font-bold text-blue-900 mb-4 flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>{t('new_taxes_title')}</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-blue-800">{t('new_tax_customs')}</p>
                <p className="text-blue-600">15% - 30%</p>
              </div>
              <div>
                <p className="font-semibold text-blue-800">{t('new_tax_vat')}</p>
                <p className="text-blue-600">19%</p>
              </div>
              <div>
                <p className="font-semibold text-blue-800">{t('new_tax_prct')}</p>
                <p className="text-blue-600">2%</p>
              </div>
              <div>
                <p className="font-semibold text-blue-800">{t('new_tax_tcs')}</p>
                <p className="text-blue-600">2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents requis */}
        <div>
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6">
            <h4 className="font-bold text-orange-900 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>{t('new_documents_title')}</span>
            </h4>
            <ul className="space-y-3 text-orange-800">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{t('new_document_1')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{t('new_document_2')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{t('new_document_3')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{t('new_document_4')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>{t('new_document_5')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Note importante */}
      <div className="mt-8 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-amber-900 mb-2">{t('new_note_title')}</h4>
            <p className="text-amber-800">{t('new_note_content')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant pour les véhicules d'occasion
function UsedVehiclesContent() {
  const t = useTranslations('VehicleImport')
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 bg-secondary-500 rounded-2xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-secondary-500">{t('used_vehicles_title')}</h3>
          <p className="text-gray-600">{t('used_vehicles_subtitle')}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Conditions d'âge */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
            <h4 className="font-bold text-purple-900 mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{t('used_age_title')}</span>
            </h4>
            <ul className="space-y-3 text-purple-800">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{t('used_age_1')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{t('used_age_2')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{t('used_age_3')}</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
            <h4 className="font-bold text-green-900 mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>{t('used_reductions_title')}</span>
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-800">{t('used_electric')}</span>
                <span className="font-bold text-green-600">-80%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-800">{t('used_petrol_small')}</span>
                <span className="font-bold text-green-600">-50%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-800">{t('used_petrol_large')}</span>
                <span className="font-bold text-green-600">-20%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Restrictions techniques */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
          <h4 className="font-bold text-red-900 mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{t('used_restrictions_title')}</span>
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-red-800">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{t('used_restriction_1')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{t('used_restriction_2')}</span>
              </li>
            </ul>
            <ul className="space-y-2 text-red-800">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{t('used_restriction_3')}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                <span>{t('used_restriction_4')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant pour les cas particuliers
function SpecialCasesContent() {
  const t = useTranslations('VehicleImport')
  
  return (
    <div className="space-y-8">
      {/* Particuliers résidents */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-blue-600">{t('residents_title')}</h3>
            <p className="text-gray-600">{t('residents_subtitle')}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
            <h4 className="font-bold text-blue-900 mb-3">{t('residents_conditions_title')}</h4>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• {t('residents_condition_1')}</li>
              <li>• {t('residents_condition_2')}</li>
              <li>• {t('residents_condition_3')}</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
            <h4 className="font-bold text-green-900 mb-3">{t('residents_procedure_title')}</h4>
            <ol className="space-y-2 text-green-800 text-sm">
              <li>1. {t('residents_step_1')}</li>
              <li>2. {t('residents_step_2')}</li>
              <li>3. {t('residents_step_3')}</li>
              <li>4. {t('residents_step_4')}</li>
            </ol>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
            <h4 className="font-bold text-purple-900 mb-3">{t('residents_limits_title')}</h4>
            <div className="space-y-2 text-purple-800 text-sm">
              <p><strong>{t('residents_limit_quota')}</strong> {t('residents_quota_details')}</p>
              <p><strong>{t('residents_limit_power')}</strong> {t('residents_power_details')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Moudjahidine */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-600">{t('moudjahidine_title')}</h3>
            <p className="text-gray-600">{t('moudjahidine_subtitle')}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 mb-6">
              <h4 className="font-bold text-green-900 mb-4">{t('moudjahidine_benefits_title')}</h4>
              <ul className="space-y-2 text-green-800">
                <li>• {t('moudjahidine_benefit_1')}</li>
                <li>• {t('moudjahidine_benefit_2')}</li>
                <li>• {t('moudjahidine_benefit_3')}</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6">
              <h4 className="font-bold text-amber-900 mb-4">{t('moudjahidine_eligible_title')}</h4>
              <ul className="space-y-2 text-amber-800">
                <li>• {t('moudjahidine_eligible_1')}</li>
                <li>• {t('moudjahidine_eligible_2')}</li>
                <li>• {t('moudjahidine_eligible_3')}</li>
                <li>• {t('moudjahidine_eligible_4')}</li>
              </ul>
            </div>
          </div>
          
          <div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
              <h4 className="font-bold text-blue-900 mb-4">{t('moudjahidine_documents_title')}</h4>
              <ul className="space-y-2 text-blue-800">
                <li>• {t('moudjahidine_document_1')}</li>
                <li>• {t('moudjahidine_document_2')}</li>
                <li>• {t('moudjahidine_document_3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CCR */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-orange-600">{t('ccr_title')}</h3>
            <p className="text-gray-600">{t('ccr_subtitle')}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6">
            <h4 className="font-bold text-orange-900 mb-3">{t('ccr_advantages_title')}</h4>
            <ul className="space-y-2 text-orange-800 text-sm">
              <li>• {t('ccr_advantage_1')}</li>
              <li>• {t('ccr_advantage_2')}</li>
              <li>• {t('ccr_advantage_3')}</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
            <h4 className="font-bold text-red-900 mb-3">{t('ccr_criteria_title')}</h4>
            <ul className="space-y-2 text-red-800 text-sm">
              <li>• {t('ccr_criteria_1')}</li>
              <li>• {t('ccr_criteria_2')}</li>
              <li>• {t('ccr_criteria_3')}</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
            <h4 className="font-bold text-purple-900 mb-3">{t('ccr_documents_title')}</h4>
            <ul className="space-y-2 text-purple-800 text-sm">
              <li>• {t('ccr_document_1')}</li>
              <li>• {t('ccr_document_2')}</li>
              <li>• {t('ccr_document_3')}</li>
              <li>• {t('ccr_document_4')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant pour les procédures
function ProceduresContent() {
  const t = useTranslations('VehicleImport')
  
  return (
    <div className="space-y-8">
      {/* Procédures douanières */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-indigo-600">{t('procedures_title')}</h3>
            <p className="text-gray-600">{t('procedures_subtitle')}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-2xl p-6">
              <h4 className="font-bold text-indigo-900 mb-4">{t('procedures_calculation_title')}</h4>
              <div className="space-y-3 text-indigo-800">
                <p><strong>{t('procedures_base_title')}</strong></p>
                <p className="text-sm">{t('procedures_base_content')}</p>
                <p><strong>{t('procedures_exchange_title')}</strong></p>
                <p className="text-sm">{t('procedures_exchange_content')}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
              <h4 className="font-bold text-green-900 mb-4">{t('procedures_digital_title')}</h4>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>• {t('procedures_digital_1')}</li>
                <li>• {t('procedures_digital_2')}</li>
                <li>• {t('procedures_digital_3')}</li>
                <li>• {t('procedures_digital_4')}</li>
              </ul>
            </div>
          </div>

          <div>
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-6">
              <h4 className="font-bold text-yellow-900 mb-4">{t('procedures_taxes_title')}</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-800">{t('procedures_tax_customs')}</span>
                  <span className="font-bold text-yellow-600">15% - 30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-800">{t('procedures_tax_prct')}</span>
                  <span className="font-bold text-yellow-600">2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-800">{t('procedures_tax_tcs')}</span>
                  <span className="font-bold text-yellow-600">2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-800">{t('procedures_tax_vat')}</span>
                  <span className="font-bold text-yellow-600">19%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-800">{t('procedures_tax_tic')}</span>
                  <span className="font-bold text-yellow-600">60%*</span>
                </div>
                <p className="text-xs text-yellow-700 mt-2">* {t('procedures_tax_tic_note')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Évolutions 2024-2025 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-purple-600">{t('evolutions_title')}</h3>
            <p className="text-gray-600">{t('evolutions_subtitle')}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
            <h4 className="font-bold text-purple-900 mb-4">{t('evolutions_new_title')}</h4>
            <ul className="space-y-2 text-purple-800">
              <li>• {t('evolutions_new_1')}</li>
              <li>• {t('evolutions_new_2')}</li>
              <li>• {t('evolutions_new_3')}</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-2xl p-6">
            <h4 className="font-bold text-pink-900 mb-4">{t('evolutions_controls_title')}</h4>
            <ul className="space-y-2 text-pink-800">
              <li>• {t('evolutions_controls_1')}</li>
              <li>• {t('evolutions_controls_2')}</li>
              <li>• {t('evolutions_controls_3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 