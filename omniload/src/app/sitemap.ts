import type { MetadataRoute } from 'next';

const siteUrl = 'https://omniload.onrender.com';

const platforms = [
  'youtube', 'instagram', 'tiktok', 'twitter',
  'facebook', 'pinterest', 'reddit', 'snapchat',
  'linkedin', 'threads', 'vimeo', 'dailymotion',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  const toolPages = platforms.map((platform) => ({
    url: `${siteUrl}/tools/${platform}-downloader`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const legalPages = ['privacy', 'terms', 'dmca'].map((page) => ({
    url: `${siteUrl}/${page}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  return [...staticPages, ...toolPages, ...legalPages];
}
