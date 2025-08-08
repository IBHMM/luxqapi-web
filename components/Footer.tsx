"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone, MessageCircle, Instagram } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Footer() {
  const { language, t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-2xl font-bold mb-4">
              LUX QAPI
            </p>
            <p className="text-gray-300 mb-4 max-w-[350px]">
              {t("footer-description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer-quick-links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  {t("products")}
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-300 hover:text-white transition-colors">
                  {t("blogs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("contact-us")}</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-blue-400" />
                <span className="text-gray-300">+994 077 325 69 75</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-3 text-green-400" />
                <span className="text-gray-300">WhatsApp</span>
              </div>
              <div className="flex items-center">
                <Instagram className="h-5 w-5 mr-3 text-pink-400" />
                <span className="text-gray-300">Instagram</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} {t("footer-legal")}</p>
        </div>
      </div>
    </footer>
  )
}
