'use client'

import { useTranslations } from 'next-intl'
import { Plane, ClipboardCheck, Ban, FileStack, Lightbulb, AlertTriangle } from 'lucide-react'
import {ReactNode} from "react";

// Helper component to avoid repetition in lists with icons
const ListItem = ({ icon, children }: { icon: ReactNode, children: ReactNode }) => (
    <li className="flex items-start">
        <div className="text-xl w-6 text-center mr-2 rtl:ml-2 rtl:mr-0 flex-shrink-0">{icon}</div>
        <div className="text-sm lg:text-base text-gray-600">{children}</div>
    </li>
);

// Helper component for document categories
const DocumentCategory = ({ title, items }: { title: string; items: string[] }) => (
    <div>
        <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
        <ul className="space-y-2">
            {items.map((item, index) => (
                <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-[9px] mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0"></span>
                    <span className="text-sm lg:text-base text-gray-600">{item}</span>
                </li>
            ))}
        </ul>
    </div>
)

export default function CcrLicense() {
    const t = useTranslations('CcrLicense')

    return (
        <section className="bg-gray-50 section-padding">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center space-y-4 mb-12 lg:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                        {t('section_title')}
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto px-4">
                        {t('section_subtitle')}
                    </p>
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
                    {/* Definition */}
                    <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col">
                        <div className="mb-4 lg:mb-6 flex-shrink-0">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-500 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                                <Plane className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                            </div>
                        </div>
                        <div className="space-y-3 lg:space-y-4 text-center flex-grow flex flex-col">
                            <h3 className="text-lg lg:text-xl font-bold text-secondary-500">
                                {t('definition_title')}
                            </h3>
                            <p className="text-sm lg:text-base text-gray-600 leading-relaxed flex-grow">
                                {t('definition_description')}
                            </p>
                        </div>
                        <div className="mt-4 space-y-2 pt-4 border-t border-gray-200">
                             <p className="text-sm lg:text-base font-semibold text-gray-700">
                                 {t('definition_highlight1')}
                             </p>
                             <p className="text-sm font-medium text-gray-600">
                                 {t('definition_highlight2')}
                             </p>
                             <p className="text-sm font-medium text-gray-600">
                                 {t('definition_highlight3')}
                             </p>
                         </div>
                    </div>

                    {/* Conditions */}
                    <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <div className="mb-4 lg:mb-6">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-500 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                                <ClipboardCheck className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                            </div>
                        </div>
                        <div className="space-y-3 lg:space-y-4">
                            <h3 className="text-lg lg:text-xl font-bold text-secondary-500 text-center">
                                {t('conditions_title')}
                            </h3>
                            <ul className="space-y-2 lg:space-y-3">
                                <ListItem icon="✅">{t('conditions_item1')}</ListItem>
                                <ListItem icon="✅">{t('conditions_item2')}</ListItem>
                                <ListItem icon="✅">{t('conditions_item3')}</ListItem>
                                <ListItem icon="✅">{t('conditions_item4')}</ListItem>
                                <ListItem icon="✅">{t('conditions_item5')}</ListItem>
                                <ListItem icon="✅">{t('conditions_item6')}</ListItem>
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
                                <ListItem icon="⛔">{t('limitations_item1')}</ListItem>
                                <ListItem icon="⛔">{t('limitations_item2')}</ListItem>
                                <ListItem icon="⛔">
                                    <span>{t('limitations_item3_title')}</span>
                                    <ul className="list-disc list-inside ml-4 rtl:ml-0 rtl:mr-4 text-sm text-gray-500 mt-1">
                                        <li>{t('limitations_item3_essence')}</li>
                                        <li>{t('limitations_item3_diesel')}</li>
                                    </ul>
                                </ListItem>
                                <ListItem icon="⛔">{t('limitations_item4')}</ListItem>
                                <ListItem icon="⛔">{t('limitations_item5')}</ListItem>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Documents & Regulations Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
                    {/* Documents */}
                    <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <div className="mb-4 lg:mb-6">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-500 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                                <FileStack className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg lg:text-xl font-bold text-secondary-500 text-center">
                                {t('documents_title')}
                            </h3>
                            <div className="space-y-4">
                                <DocumentCategory title={t('documents_salaried_title')} items={[t('documents_salaried_item1'), t('documents_salaried_item2'), t('documents_salaried_item3'), t('documents_salaried_item4'), t('documents_salaried_item5'), t('documents_salaried_item6')]} />
                                <DocumentCategory title={t('documents_unemployed_title')} items={[t('documents_unemployed_item1')]} />
                                <DocumentCategory title={t('documents_student_title')} items={[t('documents_student_item1')]} />
                                <DocumentCategory title={t('documents_merchant_title')} items={[t('documents_merchant_item1'), t('documents_merchant_item2')]} />
                                <DocumentCategory title={t('documents_retired_title')} items={[t('documents_retired_item1')]} />
                            </div>
                        </div>
                    </div>

                    {/* Regulations */}
                    <div className="bg-white rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <div className="mb-4 lg:mb-6">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-500 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                                <FileStack className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                            </div>
                        </div>
                        <div className="space-y-3 lg:space-y-4">
                            <h3 className="text-lg lg:text-xl font-bold text-secondary-500 text-center">
                                {t('regulations_title')}
                            </h3>
                            <ul className="space-y-2 lg:space-y-3">
                                <ListItem icon="📌">{t('regulations_item1')}</ListItem>
                                <ListItem icon="📌">{t('regulations_item2')}</ListItem>
                                <ListItem icon="📌">{t('regulations_item3')}</ListItem>
                                <ListItem icon="📌">{t('regulations_item4')}</ListItem>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Notices */}
                <div className="space-y-8">
                    <div className="bg-primary-50 rounded-xl lg:rounded-2xl p-6 lg:p-8 max-w-4xl mx-auto border-l-4 rtl:border-r-4 rtl:border-l-0 border-primary-500">
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center mr-4 rtl:ml-4 rtl:mr-0">
                                <Lightbulb className="w-6 h-6 lg:w-8 lg:h-8 text-primary-500" />
                            </div>
                            <h4 className="text-lg lg:text-xl font-bold text-primary-700">
                                {t('tip_title')}
                            </h4>
                        </div>
                        <p className="text-sm lg:text-base text-primary-800 leading-relaxed md:pl-14 rtl:md:pr-14 rtl:md:pl-0">
                            {t('tip_description')}
                        </p>
                    </div>
             
                </div>
            </div>
        </section>
    )
} 