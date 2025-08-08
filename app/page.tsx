import HeroSection from "@/components/HeroSection"
import CategoryGrid from "@/components/CategoryGrid"
import BlogSection from "@/components/BlogSection"
import { fetchGeneralInfo } from "@/lib/api";
import { fetchDoorCategories, type DoorCategory } from "@/lib/api"
import { fetchBlogs, type Blog } from "@/lib/api"
import { Location } from "@/components/Location";


export default async function HomePage() {
  const categoryData = await fetchDoorCategories()
  const generalInfo = await fetchGeneralInfo();
  const blogs = await fetchBlogs();


  return (
    <div>
      <HeroSection generalInfo={generalInfo} />
      <CategoryGrid categories={categoryData} />
      <Location generalInfo={generalInfo} />
      <BlogSection blogs={blogs.results} />
    </div>
  )
}
