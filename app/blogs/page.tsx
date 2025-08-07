import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Eye } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { fetchBlogs, type Blog } from "@/lib/api"
import { BlogHeader } from "@/components/home/BlogHeader"
import { Empty } from "@/components/blog/Empty"
import { BlogButton } from "@/components/home/BlogButton"
import P from "@/components/home/p"

interface BlogsPageProps {
  searchParams: { page?: string }
}

const BLOGS_PER_PAGE = 24

// Pagination Component
function Pagination({ 
  currentPage, 
  totalPages, 
  baseUrl = '/blogs' 
}: { 
  currentPage: number
  totalPages: number
  baseUrl?: string
}) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (currentPage <= 4) {
        // Show 1, 2, 3, 4, 5, ..., last
        for (let i = 2; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // Show 1, ..., last-4, last-3, last-2, last-1, last
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Show 1, ..., current-1, current, current+1, ..., last
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link href={`${baseUrl}?page=${currentPage - 1}`}>
          <Button 
            variant="outline" 
            size="icon"
            className="hover:bg-blue-50 hover:border-blue-300"
          >
            <svg 
              className="h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
        </Link>
      ) : (
        <Button 
          variant="outline" 
          size="icon"
          disabled 
        >
          <svg 
            className="h-4 w-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
      )}

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {pageNumbers.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <Link href={`${baseUrl}?page=${page}`}>
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  className={`min-w-[40px] ${
                    currentPage === page 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "hover:bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  {page}
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link href={`${baseUrl}?page=${currentPage + 1}`}>
          <Button 
            variant="outline" 
            size="icon"
            className="hover:bg-blue-50 hover:border-blue-300"
          >
            <svg 
              className="h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </Link>
      ) : (
        <Button 
          variant="outline" 
          size="icon"
          disabled 
        >
          <svg 
            className="h-4 w-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      )}
    </div>
  )
}



export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  // Get current page from URL params, default to 1
  const currentPage = Number(searchParams.page) || 1
  
  // Fetch blogs with pagination
  const data = await fetchBlogs(currentPage, BLOGS_PER_PAGE)

  const blogs = data?.results || []
  const totalCount = data?.count || 0
  const totalPages = Math.ceil(totalCount / BLOGS_PER_PAGE)

  // If page number is invalid, you might want to redirect or show 404
  if (currentPage > totalPages && totalPages > 0) {
    // You could redirect to the last page or first page here
    // For now, we'll just show empty results
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BlogHeader />

        {!data ? (
          // Loading skeleton
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
            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog: any) => (
                <Card key={blog.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={blog.thumbnail?.replace("http", "https") || "/placeholder.svg?height=200&width=400"}
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
                      {blog.views} <P text="views" className="px-1"/>
                    </div>
                    <h3 className="font-semibold text-xl mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <div
                      className="text-gray-600 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: blog.content?.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
                      }}
                    />
                    <BlogButton blog={blog} />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
            />
          </>
        ) : (
          <Empty />
        )}
      </div>
    </div>
  )
}