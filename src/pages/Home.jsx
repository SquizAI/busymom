import React from 'react'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import HowItWorks from '../components/home/HowItWorks'
import TrustSignals from '../components/home/TrustSignals'
import TestimonialSection from '../components/home/TestimonialSection'
import Pricing from '../components/home/Pricing'
import FAQ from '../components/home/FAQ'
import CTA from '../components/home/CTA'

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Features />
      <HowItWorks />
      <TestimonialSection />
      <TrustSignals />
      <Pricing />
      <FAQ />
      <CTA />
    </div>
  )
}

export default Home
