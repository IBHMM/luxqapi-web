"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Eye, ShoppingCart } from "lucide-react"
import { BASE_URL } from "@/lib/api"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

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

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const selectedVariant = door.variants[selectedVariantIndex] || door.variants[0]
  
  const getVariantImages = () => {
    if (!selectedVariant) return [door.main_image || "/placeholder.svg"]
    
    const images = []
    
    if (selectedVariant.main_image) {
      images.push(selectedVariant.main_image)
    }
    
    selectedVariant.images?.forEach(img => {
      if (img.image && img.image !== selectedVariant.main_image) {
        images.push(img.image)
      }
    })
    
    if (images.length === 0 && door.main_image) {
      images.push(door.main_image)
    }
    
    return images.length > 0 ? images : ["/placeholder.svg"]
  }

  const currentImages = getVariantImages()

  const handleColorSelect = (variantIndex: number) => {
    setSelectedVariantIndex(variantIndex)
    setCurrentSlide(0)
    setImageLoaded(false)
    if (swiper) {
      swiper.slideTo(0)
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Quick view for:', door.name)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Add to cart:', door.name, selectedVariant)
  }

  useEffect(() => {
    if (swiper) {
      swiper.slideTo(0)
      setCurrentSlide(0)
    }
  }, [selectedVariantIndex, swiper])

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return numPrice.toLocaleString('en-US', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    })
  }

  return (
    <Card 
      ref={cardRef}
      className="group relative overflow-hidden bg-white rounded-2xl border-0 shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-1 will-change-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

      <div className="relative min-[390px]:aspect-[7/7] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 max-[390px]:min-h-[250px]">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        <Swiper
          onSwiper={setSwiper}
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            prevEl: `.swiper-button-prev-${door.id}`,
            nextEl: `.swiper-button-next-${door.id}`,
          }}
          pagination={{
            el: `.swiper-pagination-${door.id}`,
            clickable: true,
            bulletClass: 'swiper-pagination-bullet-custom',
            bulletActiveClass: 'swiper-pagination-bullet-active-custom',
            renderBullet: (index, className) => {
              return `<span class="${className}" data-index="${index}"></span>`
            }
          }}
          autoplay={isHovered ? {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          } : false}
          spaceBetween={0}
          slidesPerView={1}
          speed={600}
          onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
          className="w-full h-full rounded-t-2xl"
        >
          {currentImages.map((image, index) => (
            <SwiperSlide key={`${selectedVariantIndex}-${index}`}>
              <Link href={`/products/${door.slug}`} className="block w-full h-full">
                <div className="relative w-full h-full group/image ">
                  <Image
                    src={`${BASE_URL}${image}`}
                    alt={`${door.name} - ${selectedVariant?.color.name || ''} - ${index + 1}`}
                    fill
                    className="object-cover transition-all duration-700 max-[390px]:object-fit"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onLoad={() => setImageLoaded(true)}
                    priority={index === 0}
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/5 transition-all duration-300" />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Enhanced Navigation */}
        {currentImages.length > 1 && (
          <>
            <button 
              className={`swiper-button-prev-${door.id} absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-xl hover:scale-110 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'} md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-0`}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button 
              className={`swiper-button-next-${door.id} absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-xl hover:scale-110 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'} md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-0`}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Custom Pagination */}
        {currentImages.length > 1 && (
          <div className={`swiper-pagination-${door.id} !bottom-4 flex justify-center gap-1.5`} />
        )}
    

        {/* Image Counter */}
        {currentImages.length > 1 && (
          <div className="absolute bottom-4 left-4 z-20 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5">
            <span className="text-white text-xs font-medium">
              {currentSlide + 1} / {currentImages.length}
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-3 sm:p-4 space-y-3">
        <Link href={`/products/${door.slug}`} className="block">
          <h3 className="font-bold text-lg sm:text-xl mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 text-gray-900 leading-tight">
            {door.name}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-4 leading-relaxed">
            {door.description}
          </p>
        </Link>
        
        {/* Enhanced Color Variants */}
        {door.variants.length > 0 && (
          <div className="space-y-3">
            {/* Color Options with Labels */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Rəng: <span className="text-gray-900">{selectedVariant?.color.name}</span>
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline-block">
                  {door.variants.length} variant
                </span>
              </div>
              
              <div className="flex gap-3">
                {door.variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={(e) => {
                      e.preventDefault()
                      handleColorSelect(index)
                    }}
                    className={`relative group/color transition-all duration-300 ${
                      selectedVariantIndex === index 
                        ? "scale-110" 
                        : "hover:scale-105"
                    }`}
                    title={variant.color.name}
                    aria-label={`Select color: ${variant.color.name}`}
                  >
                    {/* Color swatch */}
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedVariantIndex === index 
                        ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg" 
                        : "ring-2 ring-gray-200 group-hover/color:ring-gray-300 shadow-sm"
                    }`}>
                      <Image
                        src={`${BASE_URL}${variant.color.image}`}
                        alt={variant.color.name}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    
                    {/* Selection indicator */}
                    {selectedVariantIndex === index && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Enhanced Price Section */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Qiymət</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {formatPrice(selectedVariant?.price || '0')}
                  </span>
                  <span className="text-sm font-medium text-gray-600">AZN</span>
                </div>
              </div>
              
             
            </div>
          </div>
        )}
      </CardContent>

      <style jsx global>{`
        .swiper-pagination-bullet-custom {
          background: rgba(255, 255, 255, 0.6);
          opacity: 1;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .swiper-pagination-bullet-active-custom {
          background: white;
          transform: scale(1.3);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .swiper-pagination-bullet-custom:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: scale(1.1);
        }
      `}</style>
    </Card>
  )
}