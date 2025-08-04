export interface GeneralInfo {
  id: number
  logo: string
  site_color: string
  tiktok_link: string
  instagram_link: string
  phone: string
  wp: string
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

export interface BlogResponse {
  count: number
  next: string | null
  previous: string | null
  results: Blog[]
}

export interface DoorCategory {
  id: number
  name: string
  slug: string
  image: string
  doors: number
}

export interface Color {
  id: number
  name: string
  image: string | null
}

export interface DoorImage {
  id: number
  image: string | null
  alt_text: string
}

export interface DoorVariant {
  id: number
  color: Color
  price: string
  main_image: string | null
  images: DoorImage[]
}

export interface Door {
  id: number
  name: string
  description: string
  slug: string
  specifications: string | null
  main_image: string | null
  category: string
  variants: DoorVariant[]
}

export interface DoorResponse {
  count: number
  next: string | null
  previous: string | null
  results: Door[]
}
