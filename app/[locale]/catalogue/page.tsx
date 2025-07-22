import { useTranslations } from 'next-intl'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CarCatalog from '@/components/CarCatalog'

export default function CataloguePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <CarCatalog />
      <Footer />
    </main>
  )
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
  return {
    title: 'Catalogue de Voitures - Import Auto Algérie',
    description: 'Découvrez notre sélection de voitures neuves et d\'occasion disponibles pour l\'importation en Algérie. BMW, Mercedes, Audi, Peugeot et plus.',
    keywords: 'catalogue voitures, véhicules disponibles, import auto, BMW, Mercedes, Audi, Peugeot, Renault',
  }
} 