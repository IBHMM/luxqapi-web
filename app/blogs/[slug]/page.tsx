import Image from "next/image"
import { Calendar, Eye } from "lucide-react"
import { fetchBlogDetail, type Blog } from "@/lib/api"
import "./sytle.css"
import Loading from "@/components/blog/Loading"
import { BackToAllBlogs } from "@/components/blog/BacktoAllBlogs"
import P from "@/components/home/p"

export default async function BlogDetailPage({params}: { params: { slug: string } }) {
  const { slug } = params
  const blog = await fetchBlogDetail(slug)

  if (!blog) {
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
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackToAllBlogs />

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
              {blog.views} <P text="views" className="px-1" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{blog.title}</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 ">
          <div
            className="blog"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>
    </div>
  )
}
