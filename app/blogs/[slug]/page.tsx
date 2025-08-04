"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { fetchBlogDetail, type Blog } from "@/lib/api"
import "./sytle.css"

export default function BlogDetailPage() {
  const { t } = useLanguage()
  const params = useParams()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBlog = async () => {
      if (!params.slug) return

      try {
        const data = await fetchBlogDetail(params.slug as string)
        setBlog(data)
      } catch (error) {
        console.error("Error loading blog:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBlog()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4" />
            <div className="aspect-video bg-gray-200 rounded-lg mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("error")}</h1>
          <p className="text-gray-600 mb-4">Bloq tapılmadı</p>
          <Link href="/blogs">
            <Button>{t("blogs")}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/blogs" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("blogs")}
        </Link>

        {/* Blog Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="aspect-video overflow-hidden">
            <Image
              src={blog.thumbnail.replace("http", "https") || "/placeholder.svg?height=400&width=800"}
              alt={blog.title}
              width={800}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(blog.date).toLocaleDateString("az-AZ", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              <Eye className="h-4 w-4 ml-6 mr-2" />
              {blog.views} {t("views")}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{blog.title}</h1>
          </div>
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 ">
          <div
            className="blog"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Back to Blogs */}
        <div className="text-center mt-12">
          <Link href="/blogs">
            <Button size="lg" variant="outline">
              {t("blogs")} səhifəsinə qayıt
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
