"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_PUB_ID, AD_SLOTS } from "@/lib/constants";

export default function AdInArticle({ className = "" }: { className?: string }) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch {
      // AdSense not loaded
    }
  }, []);

  const isPlaceholder = ADSENSE_PUB_ID === "ca-pub-XXXXXXXXXXXXXXXXXX";

  if (isPlaceholder) {
    return (
      <div className={`ad-container my-8 min-h-[250px] ${className}`} ref={adRef}>
        <span className="text-xs opacity-50">In-Article Advertisement</span>
      </div>
    );
  }

  return (
    <div className={`my-8 text-center ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={AD_SLOTS.in_article}
      />
    </div>
  );
}
