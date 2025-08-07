"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function ViewAllButton({ url }: { url: string }) {
  const { t } = useLanguage();

  return (
    <div className="text-center mt-12">
      <Link href={url}>
        <Button size="lg" variant="outline">
          {t("view-all")}
        </Button>
      </Link>
    </div>
  );
}
