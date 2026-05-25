# 🚀 OmniLoad

**A fast, modern media link utility for publicly available content.**

[Live Demo](https://omniload.onrender.com) · [Report Bug](https://github.com/designerkaman12/YouTube-Downloader/issues) · [Request Feature](https://github.com/designerkaman12/YouTube-Downloader/issues)

---

## 📋 Overview

OmniLoad is a browser-based media link utility that helps users process publicly available media links for personal, permitted, and lawful use. Built with Next.js and React, it provides a clean, fast interface for handling media from popular platforms.

> **Disclaimer:** OmniLoad is designed for processing publicly available content where the user has permission. Users are solely responsible for ensuring their use complies with applicable laws, copyright regulations, and platform terms of service.

## ✨ Features

- **Fast Link Processing** — Process media links in seconds
- **Multiple Platforms** — Supports popular platforms including YouTube, Instagram, TikTok, X/Twitter, Facebook, and more
- **Multiple Formats** — Choose from various quality and format options where available
- **Audio Extraction** — Convert video links to audio (MP3, OGG, WAV, OPUS)
- **No Signup Required** — Use immediately without creating an account
- **Mobile Responsive** — Works on desktop and mobile browsers
- **SEO Optimized** — Platform-specific landing pages with structured data
- **Privacy Focused** — No user data stored, minimal tracking

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS v4, Framer Motion
- **Icons:** Lucide React
- **Deployment:** Render (free tier)
- **APIs:** RapidAPI (media processing), Cobalt API (YouTube)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- RapidAPI key ([Get one here](https://rapidapi.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/designerkaman12/YouTube-Downloader.git
cd YouTube-Downloader/omniload

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RAPIDAPI_KEY` | Yes | API key for media processing |
| `COBALT_API_URL` | No | Custom Cobalt API instance URL |
| `NEXT_PUBLIC_SITE_URL` | No | Site URL for SEO (default: https://omniload.onrender.com) |
| `NEXT_PUBLIC_ADS_ENABLED` | No | Enable ad slots (default: false) |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics measurement ID |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Plausible analytics domain |
| `NEXT_PUBLIC_AFFILIATE_ENABLED` | No | Enable affiliate section (default: true) |
| `RATE_LIMIT_ENABLED` | No | Enable rate limiting (default: true) |
| `CONTACT_EMAIL` | No | Contact email (default: support@omniload.app) |

## 📁 Project Structure

```
omniload/
├── src/
│   ├── app/
│   │   ├── api/           # API routes (info, proxy, stream, thumbnail, subscribe, health)
│   │   ├── youtube-video-downloader/   # SEO landing page
│   │   ├── instagram-video-downloader/ # SEO landing page
│   │   ├── tiktok-video-downloader/    # SEO landing page
│   │   ├── twitter-video-downloader/   # SEO landing page
│   │   ├── facebook-video-downloader/  # SEO landing page
│   │   ├── audio-converter/            # SEO landing page
│   │   ├── video-to-mp3/               # SEO landing page
│   │   ├── creator-tools/              # SEO landing page
│   │   ├── premium/       # Premium pricing page
│   │   ├── privacy/       # Privacy policy
│   │   ├── terms/         # Terms of service
│   │   ├── dmca/          # DMCA policy
│   │   ├── contact/       # Contact page
│   │   ├── disclaimer/    # Disclaimer
│   │   ├── layout.tsx     # Root layout with SEO
│   │   ├── page.tsx       # Homepage
│   │   ├── globals.css    # Global styles
│   │   ├── sitemap.ts     # Dynamic sitemap
│   │   └── robots.ts      # Robots.txt
│   ├── components/        # React components
│   ├── data/              # Static data (affiliate tools)
│   ├── hooks/             # Custom hooks (analytics)
│   └── lib/               # Utilities (downloader, security)
├── public/                # Static assets
├── .env.example           # Environment template
└── package.json
```

## 🏗️ Deployment

### Render (Recommended)

1. Connect your GitHub repository
2. Set root directory to `omniload`
3. Build command: `npm install && npm run build`
4. Start command: `npm run start`
5. Add environment variables in Render dashboard

### Vercel

1. Import the repository
2. Set root directory to `omniload`
3. Add environment variables
4. Deploy

## 💰 Monetization Setup

OmniLoad includes built-in monetization infrastructure:

### Display Ads

Set `NEXT_PUBLIC_ADS_ENABLED=true` and integrate your ad provider (AdSense, Ezoic, Adsterra) by updating the `AdSlot` component.

### Affiliate Links

Edit `src/data/affiliateTools.ts` to add your real affiliate URLs. Set `NEXT_PUBLIC_AFFILIATE_ENABLED=true`.

### Premium Plans

The premium page (`/premium`) shows pricing cards with "Coming Soon" buttons. Integrate Stripe for payment processing when ready.

### Email Capture

The newsletter signup calls `/api/subscribe`. Integrate with Resend, Mailchimp, or Brevo for actual email delivery.

## 🔒 Security

- **Rate Limiting:** Per-IP rate limiting on all API endpoints
- **SSRF Protection:** URL allowlist prevents server-side request forgery
- **Input Validation:** URLs validated against known platform patterns
- **No Data Storage:** No user files or URLs are persistently stored
- **Error Sanitization:** Internal errors are not exposed to clients

## ⚖️ Legal Disclaimer

OmniLoad is a media link utility tool. It is designed for processing publicly available content where the user has explicit permission or legal right to access and save the content.

- Users are solely responsible for ensuring compliance with all applicable laws and platform terms of service
- OmniLoad is NOT affiliated with YouTube, Instagram, TikTok, X/Twitter, Facebook, Meta, or any other platform
- OmniLoad does not host, store, or distribute copyrighted content
- We respond to valid DMCA takedown requests

## 🗺️ Roadmap

- [ ] Stripe payment integration for Premium plans
- [ ] Email service integration (Resend/Mailchimp)
- [ ] Browser extension
- [ ] Batch/bulk link processing
- [ ] Saved history (local storage)
- [ ] Advanced format preferences
- [ ] API access for developers
- [ ] Multi-language support

## 📄 License

This project is for educational and personal use.

## 📧 Contact

- Email: support@omniload.app
- Issues: [GitHub Issues](https://github.com/designerkaman12/YouTube-Downloader/issues)
