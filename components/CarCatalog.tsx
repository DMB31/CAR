'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search, Filter, Car, Calendar, Fuel, Settings, Euro, Phone } from 'lucide-react'
import catalogData from '@/cars-catalog.json'

interface CarData {
  id: string
  brand: string
  model: string
  year: number
  price: number
  currency: string
  fuelType: string
  transmission: string
  mileage: number
  engine: string
  power: string | undefined;
  condition: 'new' | 'used'
  images: string[]
  features: string[]
  location: string
  description?: string
  }

export default function CarCatalog() {
  const t = useTranslations('Catalog')
  const [cars, setCars] = useState<CarData[]>(catalogData.vehicles as CarData[])
  const [filteredCars, setFilteredCars] = useState<CarData[]>(catalogData.vehicles as CarData[])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedFuelType, setSelectedFuelType] = useState('all')
  const [selectedCondition, setSelectedCondition] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  // Filtres disponibles
  const brands = [...new Set(cars.map(car => car.brand))]
  const fuelTypes = [...new Set(cars.map(car => car.fuelType))]

  // Effet pour filtrer les voitures
  useEffect(() => {
    let filtered = cars

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(car => 
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par marque
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(car => car.brand === selectedBrand)
    }

    // Filtre par carburant
    if (selectedFuelType !== 'all') {
      filtered = filtered.filter(car => car.fuelType === selectedFuelType)
    }

    // Filtre par état
    if (selectedCondition !== 'all') {
      filtered = filtered.filter(car => car.condition === selectedCondition)
    }

    // Filtre par prix
    if (priceRange.min) {
      filtered = filtered.filter(car => car.price >= parseInt(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter(car => car.price <= parseInt(priceRange.max))
    }

    setFilteredCars(filtered)
  }, [searchTerm, selectedBrand, selectedFuelType, selectedCondition, priceRange, cars])

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('fr-FR').format(mileage) + ' km'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête de section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-500 to-primary-600 text-white py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-2xl md:max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Recherche */}
            <div className="sm:col-span-2 lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtre marque */}
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue placeholder={t('filter_brand')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all_brands')}</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtre carburant */}
            <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
              <SelectTrigger>
                <SelectValue placeholder={t('filter_fuel')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all_fuels')}</SelectItem>
                {fuelTypes.map(fuel => (
                  <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtre état */}
            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger>
                <SelectValue placeholder={t('filter_condition')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all_conditions')}</SelectItem>
                <SelectItem value="new">{t('condition_new')}</SelectItem>
                <SelectItem value="used">{t('condition_used')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Prix maximum */}
            <Input
              placeholder={t('max_price')}
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            />
          </div>
        </div>
      </section>

      {/* Résultats */}
      <section className="container mx-auto px-2 md:px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 md:gap-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {filteredCars.length} {t('vehicles_found')}
          </h2>
          <Button variant="outline" size="sm" className="w-full md:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            {t('more_filters')}
          </Button>
        </div>

        {/* Grille de voitures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredCars.map((car) => (
            <Card key={car.id} className="hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
              <div className="relative">
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden flex items-center justify-center">
                  <Image
                    src={car.images[0]}
                    alt={`${car.brand} ${car.model}`}
                    width={400}
                    height={225}
                    className="object-contain w-full h-full"
                  />
                </div>
                <Badge 
                  className={`absolute top-2 right-2 ${
                    car.condition === 'new' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-primary-500 hover:bg-primary-600'
                  }`}
                >
                  {car.condition === 'new' ? t('condition_new') : t('condition_used')}
                </Badge>
              </div>

              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="mb-3">
                  <h3 className="text-base md:text-lg font-bold text-gray-900">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-lg md:text-2xl font-bold text-primary-600">
                    {formatPrice(car.price, car.currency)}
                  </p>
                </div>

                <div className="space-y-2 text-xs md:text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{car.year}</span>
                  </div>
                  <div className="flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    <span>{formatMileage(car.mileage)}</span>
                  </div>
                  <div className="flex items-center">
                    <Fuel className="w-4 h-4 mr-2" />
                    <span>{car.fuelType} • {car.transmission}</span>
                  </div>
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    <span>{car.engine}</span>
                  </div>
                </div>

                {car.description && (
                  <p className="text-xs md:text-sm text-gray-600 mt-3 line-clamp-2">
                    {car.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mt-3">
                  {car.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {car.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{car.features.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 space-y-2 flex flex-col">
                <Button className="w-full" size="sm">
                  {t('see_details')}
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  {t('contact_seller')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              {t('no_results')}
            </h3>
            <p className="text-gray-600">
              {t('no_results_description')}
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('')
                setSelectedBrand('all')
                setSelectedFuelType('all')
                setSelectedCondition('all')
                setPriceRange({ min: '', max: '' })
              }}
              className="mt-4"
            >
              {t('clear_filters')}
            </Button>
          </div>
        )}
      </section>

      {/* Section contact */}
      <section className="bg-primary-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t('contact_title')}
          </h2>
          <p className="text-lg md:text-xl text-red-100 mb-8">
            {t('contact_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary-900 hover:bg-gray-100 w-full sm:w-auto">
              <Phone className="w-5 h-5 mr-2" />
              {t('contact_phone')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-900 w-full sm:w-auto">
              {t('contact_quote')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 