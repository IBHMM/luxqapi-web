"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export function BlogHeader() {
  const { t } = useLanguage();

  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        {t("latest-blogs")}
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">{t("block_header")}</p>
    </div>
  );
}
