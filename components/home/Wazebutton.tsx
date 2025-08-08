"use client";

import { Button } from "@/components/ui/button";

export function WazeButton({ lat, lng }: { lat: string; lng: string }) {
  const lang = typeof window !== "undefined" ? localStorage.getItem("lang") || "az" : "az";

  const handleClick = () => {
    if (!lat || !lng) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const deepLink = `waze://?ll=${lat},${lng}&navigate=yes`;
    const webLink = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

    if (isMobile) {
      // Try to open Waze app
      window.location.href = deepLink;

      // Fallback after delay
      setTimeout(() => {
        window.open(webLink, "_blank");
      }, 1500);
    } else {
      window.open(webLink, "_blank");
    }
  };

  return (
    <Button onClick={handleClick}>
      {lang === "az"
        ? "Waze ilə aç"
        : lang === "ru"
        ? "Открыть в Waze"
        : "Open in Waze"}
    </Button>
  );
}
