"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export function Hero({generalInfo}: { generalInfo: any }) {
  const { language, t } = useLanguage();

  const heroTitle =
    language === "az" ? generalInfo.hero_title_az : generalInfo.hero_title_ru;
  const heroContent =
    language === "az"
      ? generalInfo.hero_content_az
      : generalInfo.hero_content_ru;

  return (
    <>
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
        {heroTitle}
      </h1>
      <p className="text-xl text-gray-200 mb-8 animate-fade-in-up animation-delay-200">
        {heroContent}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link className="mr-2" href="/products">
            {t("our-products")}
          </Link>
        </Button>
      </div>
    </>
  );
}
