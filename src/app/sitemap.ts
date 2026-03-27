import type { MetadataRoute } from 'next';

const siteUrl = 'https://omniload.onrender.com';

const platforms = [
  'youtube', 'instagram', 'tiktok', 'twitter',
  'facebook', 'pinterest', 'reddit', 'vimeo',
  'snapchat', 'threads', 'dailymotion', 'bilibili',
  'spotify', 'soundcloud', 'linkedin', 'twitch',
  'tumblr', 'vk', 'likee', 'bandcamp',
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

  return [...staticPages, ...toolPages];
}
