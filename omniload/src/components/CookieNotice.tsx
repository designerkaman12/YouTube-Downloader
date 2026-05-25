'use client';

import { useSyncExternalStore, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const STORAGE_KEY = 'omniload-cookie-consent';

const shouldShow =
  process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' ||
  !!process.env.NEXT_PUBLIC_GA_ID ||
  !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

function subscribe(cb: () => void) {
  // no external subscription needed — consent is set only via user action
  void cb;
  return () => {};
}

function getConsentSnapshot(): boolean {
  if (!shouldShow) return false;
  try {
    return !localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export default function CookieNotice() {
  const needsConsent = useSyncExternalStore(subscribe, getConsentSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);
  const visible = needsConsent && !dismissed;

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      // silent fail
    }
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/90 backdrop-blur-xl"
        >
          <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:justify-between sm:py-3">
            <p className="text-center text-xs leading-relaxed text-muted-foreground sm:text-left sm:text-sm">
              We use cookies for analytics and to improve your experience.{' '}
              <Link
                href="/privacy"
                className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary-hover"
              >
                Privacy Policy
              </Link>
            </p>
            <button
              onClick={handleAccept}
              className="shrink-0 rounded-lg bg-primary px-5 py-2 text-xs font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 active:scale-95 sm:text-sm"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
