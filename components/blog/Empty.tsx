"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export function Empty() {
  const { t } = useLanguage();

  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">{t("no-blogs")}</p>
    </div>
  );
}
