"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { BASE_URL } from "@/lib/api"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface ColorVariant {
  id: number
  color: {
    id: number
    name: string
    image: string
  }
  price: string
  main_image: string
  images: {
    id: number
    image: string
    alt_text: string
  }[]
}

interface Door {
  id: number
  name: string
  slug: string
  description: string
  main_image: string
  category: string
  variants: ColorVariant[]
}

interface ProductCardProps {
  door: Door
}

export default function ProductCard({ door }: ProductCardProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [isLiked, setIsLiked] = useState(false)

  const selectedVariant = door.variants[selectedVariantIndex] || door.variants[0]
  
  // Get all images for the selected variant
  const getVariantImages = () => {
    if (!selectedVariant) return [door.main_image || "/placeholder.svg"]
    
    const images = []
    
    // Add main image if exists
    if (selectedVariant.main_image) {
      images.push(selectedVariant.main_image)
    }
    
    // Add variant images
    selectedVariant.images?.forEach(img => {
      if (img.image && img.image !== selectedVariant.main_image) {
        images.push(img.image)
      }
    })
    
    // Fallback to door main image if no images found
    if (images.length === 0 && door.main_image) {
      images.push(door.main_image)
    }
    
    return images.length > 0 ? images : ["/placeholder.svg"]
  }

  const currentImages = getVariantImages()

  const handleColorSelect = (variantIndex: number) => {
    setSelectedVariantIndex(variantIndex)
    // Reset swiper to first slide when changing color
    if (swiper) {
      swiper.slideTo(0)
    }
  }

  useEffect(() => {
    // Reset swiper when variant changes
    if (swiper) {
      swiper.slideTo(0)
    }
  }, [selectedVariantIndex, swiper])

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white rounded-xl overflow-hidden border-0">
      {/* Image Section with Swiper */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Swiper
          onSwiper={setSwiper}
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: `.swiper-button-prev-${door.id}`,
            nextEl: `.swiper-button-next-${door.id}`,
          }}
          pagination={{
            el: `.swiper-pagination-${door.id}`,
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
          }}
          spaceBetween={0}
          slidesPerView={1}
          className="w-full h-full"
        >
          {currentImages.map((image, index) => (
            <SwiperSlide key={index}>
              <Link href={`/products/${door.slug}`}>
                <div className="relative w-full h-full">
                  <Image
                    src={`${BASE_URL}${image}`}
                    alt={`${door.name} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows - Always visible on mobile, hover on desktop */}
        {currentImages.length > 1 && (
          <>
            <button className={`swiper-button-prev-${door.id} absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-lg active:scale-95`}>
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button className={`swiper-button-next-${door.id} absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-lg active:scale-95`}>
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}

        {/* Pagination Dots - Always visible */}
        {currentImages.length > 1 && (
          <div className={`swiper-pagination-${door.id} !bottom-3`} />
        )}



        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium">
            {door.category}
          </Badge>
        </div>

        {/* Image Counter - Always visible when multiple images */}
        {currentImages.length > 1 && (
          <div className="absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="text-white text-xs font-medium">
              1/{currentImages.length}
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 sm:p-6">
        <Link href={`/products/${door.slug}`}>
          <h3 className="font-bold text-base sm:text-xl mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 text-gray-900">
            {door.name}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base line-clamp-3 mb-4 leading-relaxed">
            {door.description}
          </p>
        </Link>
        
        {/* Color Variants */}
        {door.variants.length > 0 && (
          <div className="space-y-4">
            {/* Color Options */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                {door.variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={(e) => {
                      e.preventDefault()
                      handleColorSelect(index)
                    }}
                    className={`relative w-6 h-6 sm:w-10 sm:h-10 rounded-full transition-all duration-300 overflow-hidden ${
                      selectedVariantIndex === index 
                        ? "ring-2 ring-blue-500 ring-offset-2 scale-110" 
                        : "ring-2 ring-gray-200 hover:ring-gray-300 hover:scale-105"
                    }`}
                    title={variant.color.name}
                  >
                    <Image
                      src={`${BASE_URL}${variant.color.image}`}
                      alt={variant.color.name}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Price */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Qiymət:</span>
              <span className="text-xs sm:text-2xl font-bold text-blue-600">
                {selectedVariant?.price} AZN
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.7);
          opacity: 1;
          width: 8px;
          height: 8px;
        }
        
        .swiper-pagination-bullet-active {
          background: white;
          transform: scale(1.2);
        }
      `}</style>
    </Card>
  )
}