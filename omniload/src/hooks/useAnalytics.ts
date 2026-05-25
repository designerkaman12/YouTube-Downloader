'use client';

type EventName =
  | 'url_submitted'
  | 'info_fetch_success'
  | 'info_fetch_error'
  | 'download_clicked'
  | 'affiliate_clicked'
  | 'premium_cta_clicked'
  | 'newsletter_signup'
  | 'page_view';

interface EventParams {
  platform?: string;
  format?: string;
  tool_name?: string;
  error_type?: string;
  [key: string]: string | undefined;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: EventParams }) => void;
  }
}

export function useAnalytics() {
  const trackEvent = (eventName: EventName, params?: EventParams) => {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
    }
    // Plausible
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(eventName, { props: params });
    }
  };

  return { trackEvent };
}
