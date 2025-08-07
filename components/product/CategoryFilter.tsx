"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type DoorCategory } from "@/lib/api"
import { useLanguage } from "@/contexts/LanguageContext"

interface CategoryFilterProps {
  categories: DoorCategory[]
  selectedCategory: string
  placeholder: string
}

export default function CategoryFilter({ categories, selectedCategory, placeholder }: CategoryFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { t } = useLanguage()

  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', categorySlug)
    params.delete('page') // Reset to page 1 when changing category
    router.push(`/products?${params.toString()}`)
  }

  return (
    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
      <SelectTrigger className="w-full sm:w-64">
        <SelectValue placeholder={t(placeholder)} />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.slug}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}