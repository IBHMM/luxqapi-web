"use client"

import { useLanguage } from "@/contexts/LanguageContext"


export default function P({text, className}: {text: string, className?: string}) {

    const { t } = useLanguage()

    return <p className={className}>{t(text)}</p>
}