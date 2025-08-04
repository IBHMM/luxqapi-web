"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/LanguageContext"
import { fetchDoorCategories, fetchDoorsByCategory, type DoorCategory, type Door, BASE_URL } from "@/lib/api"

interface ColorVariant {
  id: number
  color: {
    id: number
    name: string
    image: string
  }
  price: string
  main_image: string
  images: string[]
}

interface DoorWithVariants extends Door {
  variants: ColorVariant[]
}

export default function ProductsPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<DoorCategory[]>([])
  const [doors, setDoors] = useState<DoorWithVariants[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // Track selected variant for each door
  const [selectedVariants, setSelectedVariants] = useState<{ [doorId: number]: number }>({})

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchDoorCategories()
        setCategories(data)

        const categoryParam = searchParams.get("category")
        if (categoryParam) {
          setSelectedCategory(categoryParam)
        } else if (data.length > 0) {
          setSelectedCategory(data[0].slug)
        }
      } catch (error) {
        console.error("Error loading categories:", error)
      }
    }

    loadCategories()
  }, [searchParams])

  useEffect(() => {
    const loadDoors = async () => {
      if (!selectedCategory) return

      setLoading(true)
      try {
        const data = await fetchDoorsByCategory(selectedCategory, currentPage)
        setDoors(data.results)
        setTotalPages(Math.ceil(data.count / 12))
        
        // Initialize selected variants to first variant of each door
        const initialVariants: { [doorId: number]: number } = {}
        data.results.forEach((door: DoorWithVariants) => {
          if (door.variants.length > 0) {
            initialVariants[door.id] = 0 // First variant index
          }
        })
        setSelectedVariants(initialVariants)
      } catch (error) {
        console.error("Error loading doors:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDoors()
  }, [selectedCategory, currentPage])

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug)
    setCurrentPage(1)
  }

  const handleColorSelect = (doorId: number, variantIndex: number) => {
    setSelectedVariants(prev => ({
      ...prev,
      [doorId]: variantIndex
    }))
  }

  const getSelectedVariant = (door: DoorWithVariants) => {
    const selectedIndex = selectedVariants[door.id] || 0
    return door.variants[selectedIndex] || door.variants[0]
  }

  const getDisplayImage = (door: DoorWithVariants) => {
    const selectedVariant = getSelectedVariant(door)
    return selectedVariant?.main_image || door.main_image || "/placeholder.svg?height=300&width=300"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("our-products")}</h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder={t("filter-by-category")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <CardContent className="p-3 sm:p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : doors.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {doors.map((door) => {
                const selectedVariant = getSelectedVariant(door)
                const displayImage = getDisplayImage(door)
                
                return (
                  <Card key={door.id} className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <Link href={`/products/${door.slug}`}>
                      <div className="aspect-square overflow-hidden">
                        <Image
                          src={BASE_URL + displayImage || "/placeholder.svg?height=300&width=300"}
                          alt={door.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    
                    <CardContent className="p-3 sm:p-4">
                      <Link href={`/products/${door.slug}`}>
                        <h3 className="font-semibold text-sm sm:text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {door.name}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-3 hidden sm:block">
                          {door.description}
                        </p>
                      </Link>
                      
                      {/* Color Variants */}
                      {door.variants.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                            {door.variants.map((variant, index) => (
                              <button
                                key={variant.id}
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleColorSelect(door.id, index)
                                }}
                                className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200 overflow-hidden ${
                                  selectedVariants[door.id] === index ? "border-blue-700" : "border-gray-200"
                                }`}
                                title={variant.color.name}
                              >
                                <Image
                                  src={BASE_URL + variant.color.image || "/placeholder.svg"}
                                  alt={variant.color.name}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                                {/* Removed the overlay indicator as per your changes */}
                              </button>
                            ))}
                          </div>
                          
                          {/* Price */}
                          {selectedVariant && (
                            <p className="text-blue-600 font-semibold text-sm sm:text-base">
                              {selectedVariant.price} AZN
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  {t("previous")}
                </Button>
                <span className="text-gray-600 text-xs sm:text-sm">
                  {t("page")} {currentPage} {t("of")} {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  {t("next")}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t("no-products")}</p>
          </div>
        )}
      </div>
    </div>
  )
}