"use client";

interface AdSlotProps {
  slot: string;
  format?: "banner" | "inline" | "sidebar";
  className?: string;
}

export default function AdSlot({ slot, format = "inline", className = "" }: AdSlotProps) {
  const heightMap = {
    banner: "h-[90px]",
    inline: "h-[250px]",
    sidebar: "h-[600px]",
  };

  return (
    <div
      className={`ad-slot ${heightMap[format]} my-6 w-full ${className}`}
      data-ad-slot={slot}
      data-ad-format={format}
    >
      {/* Ad content will be injected here */}
    </div>
  );
}
