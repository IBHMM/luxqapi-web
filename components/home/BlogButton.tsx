"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BlogButton({ blog }: { blog: { slug: string } }) {
  const { t } = useLanguage();

  return (
    <Link href={`/blogs/${blog.slug}`}>
      <Button variant="outline" size="sm">
        {t("read-more")}
      </Button>
    </Link>
  );
}
