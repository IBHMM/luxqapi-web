import { fetchDoorCategories, fetchDoorsByCategory, type DoorCategory, type Door, BASE_URL } from "@/lib/api"
import CategoryFilter from "@/components/product/CategoryFilter"
import ProductCard from "@/components/product/ProductCard"
import Pagination from "@/components/product/Pagination"
import Empty from "@/components/product/Empty"
import P from "@/components/home/p"

interface ColorVariant {
  id: number
  color: {
    id: number
    name: string
    image: string
  }
  price: string
  main_image: string
  images: string[]
}

interface DoorWithVariants extends Door {
  variants: ColorVariant[]
}

interface ProductsPageProps {
  searchParams: {
    category?: string
    page?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Fetch categories
  const categories = await fetchDoorCategories()
  
  // Determine selected category
  const selectedCategory = searchParams.category || (categories.length > 0 ? categories[0].slug : "")
  
  // Determine current page
  const currentPage = parseInt(searchParams.page || "1", 10)
  
  // Fetch doors for selected category
  let doors: DoorWithVariants[] = []
  let totalPages = 1
  
  if (selectedCategory) {
    try {
      const data = await fetchDoorsByCategory(selectedCategory, currentPage)
      doors = data.results
      totalPages = Math.ceil(data.count / 12)
    } catch (error) {
      console.error("Error loading doors:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <P text="our-products" />
          </h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              placeholder={"filter-by-category"}
            />
          </div>
        </div>

        {/* Products Grid */}
        {doors.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {doors.map((door : any) => (
                <ProductCard key={door.id} door={door} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                category={selectedCategory}
              />
            )}
          </>
        ) : (
          <Empty />
        )}
      </div>
    </div>
  )
}