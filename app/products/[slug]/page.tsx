"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Phone, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ZoomIn, 
  Share2,
  Ruler,
  Palette,
  ArrowLeft,
  CheckCircle,
  Info,
  Truck,
  Shield,
  Settings
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { fetchDoorDetail, fetchRelatedDoors, type Door, BASE_URL } from "@/lib/api"

// Import Swiper modules
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

interface ColorVariant {
  id: number
  color: {
    id: number
    name: string
    image: string
  }
  price: string
  main_image: string
  images: Array<{
    id: number
    image: string
    alt_text: string
  }>
}

interface DoorWithVariants extends Door {
  variants: ColorVariant[]
}

export default function ProductDetailPage() {
  const { t } = useLanguage()
  const params = useParams()
  const [door, setDoor] = useState<DoorWithVariants | null>(null)
  const [relatedDoors, setRelatedDoors] = useState<Door[]>([])
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)

  useEffect(() => {
    const loadDoor = async () => {
      if (!params.slug) return

      try {
        const [doorData, relatedData] = await Promise.all([
          fetchDoorDetail(params.slug as string),
          fetchRelatedDoors(params.slug as string),
        ])

        setDoor(doorData)
        setRelatedDoors(relatedData)
      } catch (error) {
        console.error("Error loading door:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDoor()
  }, [params.slug])

  // Close lightbox with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false)
      }
    }

    if (lightboxOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [lightboxOpen])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="h-4 bg-gray-200 rounded w-64 mb-8" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-2xl" />
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded w-1/3" />
                <div className="flex gap-3">
                  <div className="h-12 bg-gray-200 rounded flex-1" />
                  <div className="h-12 bg-gray-200 rounded flex-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!door) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Info className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("error")}</h1>
          <p className="text-gray-600 mb-8 text-lg">Məhsul tapılmadı</p>
          <Link href="/products">
            <Button size="lg" className="shadow-lg">
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t("our-products")}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentVariant = door.variants[selectedVariant]
  const getAllImages = () => {
    const images = []
    if (currentVariant?.main_image) {
      images.push({
        id: 'main',
        image: currentVariant.main_image,
        alt_text: door.name
      })
    }
    if (currentVariant?.images && currentVariant.images.length > 0) {
      images.push(...currentVariant.images)
    }
    return images
  }

  const allImages = getAllImages()

  const openLightbox = (imageSrc: string) => {
    setLightboxImage(imageSrc)
    setLightboxOpen(true)
  }

  const handleVariantChange = (index: number) => {
    setSelectedVariant(index)
  }

  const handleWhatsAppClick = () => {
    const productInfo = `
🚪 *${door.name}*

📋 *Məhsul məlumatları:*
• Kateqoriya: ${door.category}
• Qiymət: ${currentVariant?.price || 'N/A'} AZN
• Rəng: ${currentVariant?.color?.name || 'N/A'}

📝 *Təsvir:*
${door.description}

🔧 *Xidmətlərimiz:*
✅ Pulsuz çatdırılma
✅ Professional quraşdırma  
✅ 1 il zəmanət

Bu məhsul haqqında ətraflı məlumat almaq istəyirəm.
    `.trim()

    const phoneNumber = "+994501234567" // Replace with actual phone number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(productInfo)}`
    window.open(whatsappUrl, '_blank')
  }

  const renderSpecifications = (specs: any) => {
    if (!specs || typeof specs !== 'object') return null
    
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Ruler className="h-5 w-5 mr-2 text-blue-600" />
            {t("specifications") || "Texniki xüsusiyyətlər"}
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {Object.entries(specs).map(([key, value], index) => (
            <div key={key} className={`px-6 py-4 flex justify-between items-center ${
              index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
            }`}>
              <span className="font-medium text-gray-700 capitalize">{key}</span>
              <span className="text-gray-900 font-semibold">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Ana səhifə</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600 transition-colors">{t("products") || "Məhsullar"}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{door.name}</span>
          </div>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images Section with Swiper */}
          <div className="space-y-6">
            {/* Main Swiper */}
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination, Thumbs]}
                spaceBetween={10}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                className="main-swiper aspect-square rounded-2xl overflow-hidden shadow-xl"
              >
                {allImages.map((image, index) => (
                  <SwiperSlide key={image.id}>
                    <div className="relative w-full h-full group cursor-pointer">
                      <Image
                        src={BASE_URL + image.image}
                        alt={image.alt_text || door.name}
                        width={600}
                        height={600}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onClick={() => openLightbox(BASE_URL + image.image)}
                      />
                      
                      {/* Zoom Icon */}
                      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                        <ZoomIn className="h-5 w-5" />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              {allImages.length > 1 && (
                <>
                  <button className="swiper-button-prev-custom absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full hover:bg-white shadow-lg transition-all duration-300 z-10">
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button className="swiper-button-next-custom absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full hover:bg-white shadow-lg transition-all duration-300 z-10">
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Swiper */}
            {allImages.length > 1 && (
              <Swiper
                modules={[FreeMode, Thumbs]}
                onSwiper={setThumbsSwiper}
                spaceBetween={12}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                className="thumbs-swiper"
              >
                {allImages.map((image, index) => (
                  <SwiperSlide key={`thumb-${image.id}`}>
                    <div className="aspect-square overflow-hidden rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer">
                      <Image
                        src={BASE_URL + image.image}
                        alt={image.alt_text || door.name}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium rounded-full">
                  {door.category}
                </Badge>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">{door.name}</h1>
            </div>

            {/* Price */}
            {currentVariant && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="text-4xl font-bold text-blue-600 mb-2">{currentVariant.price} AZN</div>
              </div>
            )}

            {/* Color Variants */}
            {door.variants.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-blue-600" />
                  {t("colors") || "Rəng seçimləri"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {door.variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(index)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedVariant === index 
                          ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200" 
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md bg-white"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                        <Image
                          src={BASE_URL + variant.color.image}
                          alt={variant.color.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="text-left flex-grow">
                        <div className="font-semibold text-gray-900">{variant.color.name}</div>
                        <div className="text-blue-600 font-bold text-lg">{variant.price} AZN</div>
                      </div>
                      
                      {selectedVariant === index && (
                        <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex items-center bg-green-600 hover:bg-green-700 shadow-lg transition-all duration-300 flex-1">
                  <Phone className="h-5 w-5 mr-2" />
                  {t("phone") || "Zəng et"}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex items-center border-green-600 text-green-600 hover:bg-green-50 shadow-lg transition-all duration-300 flex-1"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Service Features */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center text-gray-700">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-medium">Pulsuz çatdırılma</span>
              </div>
              <div className="flex items-center text-gray-700">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium">Professional quraşdırma</span>
              </div>
              <div className="flex items-center text-gray-700">
                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <span className="font-medium">1 il zəmanət</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs - Removed Reviews */}
        <div className="mb-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Ümumi məlumat
              </TabsTrigger>
              <TabsTrigger value="specifications" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Xüsusiyyətlər
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">Məhsul haqqında</h3>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="text-lg leading-relaxed">{door.description}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-8">
              {renderSpecifications(door.specifications)}
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedDoors.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">{t("related-products") || "Oxşar məhsullar"}</h2>
              <Link href="/products">
                <Button variant="outline">Hamısına bax</Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedDoors.slice(0, 4).map((relatedDoor) => (
                <Link key={relatedDoor.id} href={`/products/${relatedDoor.slug}`}>
                  <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white">
                    <div className="aspect-square overflow-hidden relative">
                      <Image
                        src={BASE_URL + (relatedDoor.main_image || "/placeholder.svg?height=300&width=300")}
                        alt={relatedDoor.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                        {relatedDoor.name}
                      </h3>
                      {relatedDoor.variants.length > 0 && (
                        <div className="flex items-center justify-between">
                          <p className="text-blue-600 font-bold text-xl">{relatedDoor.variants[0].price} AZN</p>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Lightbox Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={lightboxImage}
                alt={door.name}
                width={1200}
                height={1200}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>

            {/* Navigation in Lightbox */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const currentIndex = allImages.findIndex(img => BASE_URL + img.image === lightboxImage)
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1
                    setLightboxImage(BASE_URL + allImages[prevIndex].image)
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => {
                    const currentIndex = allImages.findIndex(img => BASE_URL + img.image === lightboxImage)
                    const nextIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0
                    setLightboxImage(BASE_URL + allImages[nextIndex].image)
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Background Click to Close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setLightboxOpen(false)}
          />
        </div>
      )}

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .main-swiper .swiper-pagination {
          bottom: 20px;
        }
        .main-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.7;
        }
        .main-swiper .swiper-pagination-bullet-active {
          background: white;
          opacity: 1;
        }
        .thumbs-swiper .swiper-slide {
          transition: all 0.3s ease;
        }
        .thumbs-swiper .swiper-slide-thumb-active {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}