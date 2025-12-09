"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { FeaturesAccordion } from "@/components/features-accordion"
import { Footer } from "@/components/footer"

export default function Home() {
  const [lang, setLang] = useState<"ko" | "jp">("ko")

  return (
    <main className="min-h-screen">
      <HeroSection lang={lang} onLangChange={setLang} />
      <FeaturesAccordion lang={lang} onLangChange={setLang} />
      <Footer lang={lang} />
    </main>
  )
}
