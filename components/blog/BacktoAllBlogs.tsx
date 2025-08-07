"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BackToAllBlogs() {
  const { t } = useLanguage();

  return (
    <Link
      href="/blogs"
      className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {t("blogs")}
    </Link>
  );
}
