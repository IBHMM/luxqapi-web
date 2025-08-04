"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Globe, Home, Package, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

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

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center font-bold text-xl text-gray-900">
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
              <div className="block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Globe className="h-4 w-4 mr-2" />
                      {language.toUpperCase()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setLanguage("az")}>
                      Azərbaycan
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("ru")}>
                      Русский
                    </DropdownMenuItem>
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