import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { DoorCategory } from "@/lib/api"
import CategoryHeader from "./home/CategoryHeader"
import CategoryViewAllButton from "./home/ViewAllButton"

export default function CategoryGrid({ categories }: { categories?: DoorCategory[] }) {

  if (!categories) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse min-h-[350px] flex flex-col">
                <div className="aspect-square bg-gray-200" />
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CategoryHeader />
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 min-[500px]:gap-6 gap-2">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col min-h-[350px] h-full max-[500px]:min-h-[240px]">
                <div className="aspect-square overflow-hidden rounded-t-xl">
                  <Image
                    src={`https://back.luxqapi.az${category.image}` || "/placeholder.svg?height=300&width=300"}
                    alt={category.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-t-xl"
                  />
                </div>
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors max-[500px]:text-sm">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-auto">{category.doors} məhsul</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <CategoryViewAllButton url="/products" />
      </div>
    </section>
  )
}
