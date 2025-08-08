
export const API_BASE = "https://back.luxqapi.az/api"
export const BASE_URL = "https://back.luxqapi.az"

export async function fetchGeneralInfo() {
  const response = await fetch(`${API_BASE}/general/info/`)
  if (!response.ok) {
    throw new Error("Failed to fetch general info")
  }
  return response.json()
}

export async function fetchBlogs(page = 1, pageSize = 6) {
  const response = await fetch(`${API_BASE}/blog/get-all/?page=${page}&page_size=${pageSize}`)
  if (!response.ok) {
    throw new Error("Failed to fetch blogs")
  }
  return response.json()
}

export async function fetchBlogDetail(slug: string) {
  const response = await fetch(`${API_BASE}/blog/get-detail/${slug}/`)
  if (!response.ok) {
    throw new Error("Failed to fetch blog detail")
  }
  return response.json()
}

export async function fetchDoorCategories() {
  const response = await fetch(`${API_BASE}/door/categories/`)
  if (!response.ok) {
    throw new Error("Failed to fetch door categories")
  }
  return response.json()
}

export async function fetchDoorsByCategory(slug: string, page = 1, pageSize = 12) {
  const response = await fetch(`${API_BASE}/door/door-list-by-category/${slug}/?page=${page}&page_size=${pageSize}`)
  if (!response.ok) {
    throw new Error("Failed to fetch doors by category")
  }
  return response.json()
}

export async function fetchDoorDetail(slug: string) {
  const response = await fetch(`${API_BASE}/door/door-detail/${slug}/`)
  if (!response.ok) {
    throw new Error("Failed to fetch door detail")
  }
  return response.json()
}

export async function fetchRelatedDoors(slug: string) {
  const response = await fetch(`${API_BASE}/door/related-doors/${slug}/`)
  if (!response.ok) {
    throw new Error("Failed to fetch related doors")
  }
  return response.json()
}

export interface GeneralInfo {
  id: number
  logo: string
  site_color: string
  tiktok_link: string
  instagram_link: string
  phone: string
  wp: string
  location: string
  location_title_az: string
  location_title_ru: string
  about_az: string
  about_ru: string
  hero_image: string
  hero_title_az: string
  hero_title_ru: string
  hero_content_az: string
  hero_content_ru: string
}

export interface Blog {
  id: number
  date: string
  views: number
  thumbnail: string
  slug: string
  title: string
  content: string
}

export interface DoorCategory {
  id: number
  name: string
  slug: string
  image: string
  doors: number
}

export interface Door {
  id: number
  name: string
  description: string
  slug: string
  specifications: string | null
  main_image: string | null
  category: string
  variants: any[]
}
