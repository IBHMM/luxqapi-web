"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Eye } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { fetchBlogs, type Blog } from "@/lib/api"

export default function BlogsPage() {
  const { t } = useLanguage()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true)
      try {
        const data = await fetchBlogs(currentPage, 9)
        setBlogs(data.results)
        setTotalPages(Math.ceil(data.count / 9))
      } catch (error) {
        console.error("Error loading blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBlogs()
  }, [currentPage])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("blogs")}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Son xəbərlər, məqalələr və faydalı məlumatlar</p>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4" />
                  <div className="h-3 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Card key={blog.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={blog.thumbnail.replace("http", "https") || "/placeholder.svg?height=200&width=400"}
                      alt={blog.title}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(blog.date).toLocaleDateString()}
                      <Eye className="h-4 w-4 ml-4 mr-2" />
                      {blog.views} {t("views")}
                    </div>
                    <h3 className="font-semibold text-xl mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <div
                      className="text-gray-600 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: blog.content.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
                      }}
                    />
                    <Link href={`/blogs/${blog.slug}`}>
                      <Button variant="outline">{t("read-more")}</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  {t("previous")}
                </Button>
                <span className="text-gray-600">
                  {t("page")} {currentPage} {t("of")} {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  {t("next")}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t("no-blogs")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
