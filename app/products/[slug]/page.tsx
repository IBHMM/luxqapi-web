"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageCircle, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { fetchDoorDetail, fetchRelatedDoors, type Door, BASE_URL } from "@/lib/api"

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
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState("")

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!door) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("error")}</h1>
          <p className="text-gray-600 mb-4">Məhsul tapılmadı</p>
          <Link href="/products">
            <Button>{t("our-products")}</Button>
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
  const currentImageSrc = allImages[selectedImage]?.image || door.main_image || "/placeholder.svg?height=600&width=600"

  const openLightbox = (imageSrc: string) => {
    setLightboxImage(imageSrc)
    setLightboxOpen(true)
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const handleVariantChange = (index: number) => {
    setSelectedVariant(index)
    setSelectedImage(0) // Reset to first image when variant changes
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image with Slider Controls */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white group">
              <Image
                src={BASE_URL + currentImageSrc}
                alt={door.name}
                width={600}
                height={600}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openLightbox(BASE_URL + currentImageSrc)}
              />
              
              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-5 w-5" />
              </div>

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={BASE_URL + image.image}
                      alt={image.alt_text || door.name}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {door.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{door.name}</h1>
              <p className="text-gray-600 text-lg">{door.description}</p>
            </div>

            {/* Color Variants */}
            {door.variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">{t("colors") || "Rənglər"}</h3>
                <div className="flex flex-wrap gap-3">
                  {door.variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(index)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        selectedVariant === index 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {/* Color Image */}
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                        <Image
                          src={BASE_URL + variant.color.image}
                          alt={variant.color.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Color Info */}
                      <div className="text-left">
                        <div className="font-medium text-sm">{variant.color.name}</div>
                        <div className="text-blue-600 font-semibold text-sm">{variant.price} AZN</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            {currentVariant && (
              <div className="text-3xl font-bold text-blue-600">{currentVariant.price} AZN</div>
            )}

            {/* Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                {t("phone") || "Zəng et"}
              </Button>
              <Button size="lg" variant="outline" className="flex items-center bg-transparent">
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp
              </Button>
            </div>

            {/* Specifications */}
            {door.specifications && (
              <div>
                <h3 className="text-lg font-semibold mb-3">{t("specifications") || "Xüsusiyyətlər"}</h3>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: door.specifications }} />
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedDoors.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t("related-products") || "Oxşar məhsullar"}</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedDoors.slice(0, 4).map((relatedDoor) => (
                <Link key={relatedDoor.id} href={`/products/${relatedDoor.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square overflow-hidden">
                      <Image
                        src={BASE_URL + (relatedDoor.main_image || "/placeholder.svg?height=300&width=300")}
                        alt={relatedDoor.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <h3 className="font-semibold text-sm sm:text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {relatedDoor.name}
                      </h3>
                      {relatedDoor.variants.length > 0 && (
                        <p className="text-blue-600 font-semibold text-sm sm:text-base">{relatedDoor.variants[0].price} AZN</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Lightbox Image */}
            <div className="relative">
              <Image
                src={lightboxImage}
                alt={door.name}
                width={800}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>

          {/* Background Click to Close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setLightboxOpen(false)}
          />
        </div>
      )}
    </div>
  )
}