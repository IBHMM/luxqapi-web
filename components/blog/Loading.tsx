"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Loading() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("error")}</h1>
        <p className="text-gray-600 mb-4">Bloq tapılmadı</p>
        <Link href="/blogs">
          <Button>{t("blogs")}</Button>
        </Link>
      </div>
    </div>
  );
}
