"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_PUB_ID, AD_SLOTS } from "@/lib/constants";

interface AdBannerProps {
  slot?: string;
  format?: "horizontal" | "rectangle" | "vertical";
  className?: string;
}

export default function AdBanner({
  slot = AD_SLOTS.banner_top,
  format = "horizontal",
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // Push ad when component mounts
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch {
      // AdSense not loaded yet — placeholder will show
    }
  }, []);

  const isPlaceholder = ADSENSE_PUB_ID === "ca-pub-XXXXXXXXXXXXXXXXXX";

  if (isPlaceholder) {
    return (
      <div className={`ad-container my-6 ${className}`} ref={adRef}>
        <span className="text-xs opacity-50">Advertisement</span>
      </div>
    );
  }

  return (
    <div className={`my-6 text-center ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slot}
        data-ad-format={
          format === "horizontal"
            ? "auto"
            : format === "rectangle"
            ? "rectangle"
            : "vertical"
        }
        data-full-width-responsive="true"
      />
    </div>
  );
}
