import Link from 'next/link';

const platformLinks = [
  { name: 'YouTube Downloader', href: '/#tools' },
  { name: 'Instagram Saver', href: '/#tools' },
  { name: 'TikTok Downloader', href: '/#tools' },
  { name: 'Twitter/X Downloader', href: '/#tools' },
  { name: 'Facebook Downloader', href: '/#tools' },
  { name: 'Pinterest Downloader', href: '/#tools' },
  { name: 'Reddit Video Saver', href: '/#tools' },
  { name: 'LinkedIn Downloader', href: '/#tools' },
];

const pageLinks = [
  { name: 'About', href: '/#faq' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'DMCA', href: '/dmca' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 inline-block">
              <span className="text-xl font-bold tracking-tight">
                Omni<span className="text-primary">Load</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Free online video and audio downloader supporting 12+ major platforms. Fast, unlimited, and no registration required.
            </p>
          </div>
          
          {/* Downloaders */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Downloaders
            </h3>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {pageLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Support
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Having issues? We&apos;re here to help.
            </p>
            <a
              href="mailto:support@omniload.com"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card-hover"
            >
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </a>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted sm:flex-row">
          <p>© {currentYear} OmniLoad. All rights reserved.</p>
          <p className="text-center">
            OmniLoad does not host any media. We only provide download links from publicly available sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
