"use client";
import { useLanguage } from "@/contexts/LanguageContext";

export function LocationTexts({ generalInfo }: { generalInfo: any }) {
  const { language } = useLanguage();

  const locationTitle =
    language === "az" ? generalInfo.location_title_az : generalInfo.location_title_ru;
  const locationContent =
    language === "az"
      ? generalInfo.about_az
      : generalInfo.about_ru;

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold mb-2">
          {locationTitle}
        </h2>
        <p className="text-gray-700 mb-4">{locationContent}</p>
      </div>
    </>
  );
}
