"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  category: string
}

export default function Pagination({ currentPage, totalPages, category }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    if (category) {
      params.set('category', category)
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex justify-center items-center space-x-4 mt-12">
      <Button
        variant="outline"
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        size="sm"
        className="text-xs sm:text-sm"
      >
        ←
      </Button>
      <span className="text-gray-600 text-xs sm:text-sm">
        {currentPage} / {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        size="sm"
        className="text-xs sm:text-sm"
      >
        →
      </Button>
    </div>
  )
}