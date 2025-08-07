import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Eye } from "lucide-react"
import { fetchBlogs, type Blog } from "@/lib/api"
import { BlogHeader } from "./home/BlogHeader"
import { BlogButton } from "./home/BlogButton"
import ViewAllButton from "./home/ViewAllButton"
import P from "./home/p"

export default function BlogSection({ blogs }: { blogs?: Blog[] }) {

  if (!blogs) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
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
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlogHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <Card key={blog.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <Image
                  src={blog.thumbnail.replace("http", "https") || "/placeholder.svg?height=200&width=400"}
                  alt={blog.title}
                  width={400}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-xl"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(blog.date).toLocaleDateString()}
                  <Eye className="h-4 w-4 ml-4 mr-2" />
                  {blog.views} <P text="views" className="inline px-1" />
                </div>
                <h3 className="font-semibold text-lg mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <div
                  className="text-gray-600 text-sm mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: blog.content.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
                  }}
                />
                <BlogButton blog={blog} />
              </CardContent>
            </Card>
          ))}
        </div>

        <ViewAllButton url="/blogs"/>
      </div>
    </section>
  )
}
