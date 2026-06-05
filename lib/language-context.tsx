"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Language = "en" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  locale: "en-TN" | "fr-TN"
  t: (english: string, french: string) => string
}

const STORAGE_KEY = "language"

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY)
    if (savedLanguage === "en" || savedLanguage === "fr") {
      setLanguage(savedLanguage)
      document.documentElement.lang = savedLanguage
      return
    }

    document.documentElement.lang = "en"
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      locale: language === "fr" ? ("fr-TN" as const) : ("en-TN" as const),
      t: (english: string, french: string) => (language === "fr" ? french : english),
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
