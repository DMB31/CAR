import Header from '@/components/Header'
import Hero from '@/components/Hero'
import PartnerLogos from '@/components/PartnerLogos'
import Steps from '@/components/Steps'
import Services from '@/components/Services'
import VehicleImportGuide from '@/components/VehicleImportGuide'
import Testimonials from '@/components/Testimonials'
import QuoteForm from '@/components/QuoteForm'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      
      <Steps />
      <Services />
      <VehicleImportGuide />
      <QuoteForm />
      
      <ContactForm />
      <Footer />
    </main>
  )
} 