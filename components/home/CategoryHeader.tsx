"use client"

import { useLanguage } from "@/contexts/LanguageContext"


export default function CategoryHeader() {
    const { t } = useLanguage()
    
    return (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("product-categories")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("category-description")}</p>
        </div>
    )
}