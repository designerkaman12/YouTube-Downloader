"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("omniload-cookie-consent");
    if (!consent) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("omniload-cookie-consent", "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("omniload-cookie-consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-fade-in-up">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h3 className="mb-1 text-sm font-bold text-[hsl(var(--foreground))]">
              🍪 Cookie Consent
            </h3>
            <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
              We use cookies to enhance your experience and serve personalized
              ads via Google AdSense. By clicking &quot;Accept&quot;, you consent to our
              use of cookies.{" "}
              <Link
                href="/privacy"
                className="text-[hsl(var(--primary))] underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={reject}
              className="rounded-xl border border-[hsl(var(--border))] px-4 py-2 text-xs font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--card-hover))]"
            >
              Reject
            </button>
            <button
              onClick={accept}
              className="rounded-xl gradient-bg px-5 py-2 text-xs font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
