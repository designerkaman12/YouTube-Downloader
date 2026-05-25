import Link from 'next/link';

const productLinks = [
  { name: 'Home', href: '/' },
  { name: 'Premium', href: '/premium' },
  { name: 'Creator Tools', href: '/creator-tools' },
];

const toolLinks = [
  { name: 'YouTube Saver', href: '/youtube-video-downloader' },
  { name: 'Instagram Saver', href: '/instagram-video-downloader' },
  { name: 'TikTok Saver', href: '/tiktok-video-downloader' },
  { name: 'Audio Converter', href: '/audio-converter' },
];

const legalLinks = [
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' },
  { name: 'DMCA', href: '/dmca' },
  { name: 'Disclaimer', href: '/disclaimer' },
  { name: 'Contact', href: '/contact' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <span className="text-xl font-bold tracking-tight">
                Omni<span className="text-primary">Load</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A fast media utility for processing publicly available media links. Simple, clean, and creator-friendly.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Product
            </h3>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
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
          
          {/* Tools */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Tools
            </h3>
            <ul className="space-y-2.5">
              {toolLinks.map((link) => (
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
              {legalLinks.map((link) => (
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
          
          {/* Company */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/#faq"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@omniload.app"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted sm:flex-row">
          <p>&copy; {currentYear} OmniLoad. All rights reserved.</p>
          <p className="text-center">
            Some links on this site may be affiliate links. OmniLoad does not host any media files.
          </p>
        </div>
      </div>
    </footer>
  );
}
