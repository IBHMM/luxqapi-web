"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Package, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import az from "@/public/azerbaijan.png";
import ru from "@/public/russia.png";

export default function HeaderClient({ generalInfo }: { generalInfo: any }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const navigation = [
    { name: t("home"), href: "/", icon: Home },
    { name: t("products"), href: "/products", icon: Package },
    { name: t("blogs"), href: "/blogs", icon: BookOpen },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const setlang = (lang: "az" | "ru"): any => {
    if (lang === "az" || lang === "ru") {
      setLanguage(lang);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="flex items-center font-bold text-xl text-gray-900"
            >
              LUX QAPI
            </Link>

            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Phone Button */}
              {generalInfo?.phone && (
                <a
                  href={`tel:${generalInfo.phone.replace(/\s+/g, "")}`}
                  className="flex items-center text-xs md:text-sm font-medium text-black hover:text-green-700 transition-colors border border-black px-3 py-1 rounded-md hover:border-green-700 hover:bg-green-50 flex-shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h2a2 2 0 012 2v1.5a1 1 0 01-.293.707l-1.414 1.414a16.97 16.97 0 006.586 6.586l1.414-1.414A1 1 0 0115.5 14H17a2 2 0 012 2v2a2 2 0 01-2 2h-.5C9.61 20 4 14.39 4 7.5V7a2 2 0 01-1-2z"
                    />
                  </svg>
                  {generalInfo.phone}
                </a>
              )}

              {/* Language Dropdown */}
              <div className="block">
                <DropdownMenu
                  open={isDropdownOpen}
                  onOpenChange={setIsDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="p-2">
                      <Image
                        src={language === "az" ? az : ru}
                        alt={language}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-auto p-0 rounded-md border shadow-md bg-white"
                    style={{ minWidth: "auto", width: "fit-content" }}
                  >
                    <div className="flex flex-col items-center space-y-1 p-2">
                      <button
                        onClick={() => {
                          setlang("az");
                          setIsDropdownOpen(false);
                        }}
                        className={`p-1 rounded-full hover:scale-105 transition-transform ${
                          language === "az" ? "ring-2 ring-blue-500" : ""
                        }`}
                      >
                        <Image
                          src={az}
                          alt="Azerbaijani"
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                      </button>

                      <button
                        onClick={() => {
                          setlang("ru");
                          setIsDropdownOpen(false);
                        }}
                        className={`p-1 rounded-full hover:scale-105 transition-transform ${
                          language === "ru" ? "ring-2 ring-blue-500" : ""
                        }`}
                      >
                        <Image
                          src={ru}
                          alt="Russian"
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                      </button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
          <div className="flex justify-around items-center py-2">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex flex-col items-center justify-center py-2 px-4 text-gray-600 hover:text-blue-600 transition-colors min-w-0 flex-1"
                >
                  <IconComponent className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium truncate">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
