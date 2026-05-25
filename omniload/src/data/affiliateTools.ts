export interface AffiliateTool {
  name: string;
  category: 'VPN' | 'Cloud Storage' | 'Video Editing' | 'AI Subtitle' | 'Creator Tools' | 'Stock Media';
  description: string;
  url: string;
  icon: string; // emoji
}

export const affiliateTools: AffiliateTool[] = [
  {
    name: 'NordVPN',
    category: 'VPN',
    description: 'Secure and fast VPN for private browsing and content access.',
    url: '#affiliate-nordvpn',
    icon: '🔒',
  },
  {
    name: 'Google Drive',
    category: 'Cloud Storage',
    description: 'Store your media files securely in the cloud with 15GB free.',
    url: '#affiliate-gdrive',
    icon: '☁️',
  },
  {
    name: 'CapCut',
    category: 'Video Editing',
    description: 'Free, powerful video editor for creators on any platform.',
    url: '#affiliate-capcut',
    icon: '🎬',
  },
  {
    name: 'Descript',
    category: 'AI Subtitle',
    description: 'AI-powered transcription and subtitle generation for videos.',
    url: '#affiliate-descript',
    icon: '📝',
  },
  {
    name: 'Canva Pro',
    category: 'Creator Tools',
    description: 'Design professional thumbnails, banners, and social content.',
    url: '#affiliate-canva',
    icon: '🎨',
  },
  {
    name: 'Pexels',
    category: 'Stock Media',
    description: 'Free, high-quality stock photos and videos for any project.',
    url: '#affiliate-pexels',
    icon: '📸',
  },
  {
    name: 'Surfshark',
    category: 'VPN',
    description: 'Affordable VPN with unlimited devices and strong encryption.',
    url: '#affiliate-surfshark',
    icon: '🛡️',
  },
  {
    name: 'Dropbox',
    category: 'Cloud Storage',
    description: 'Reliable cloud storage with smart sync and easy sharing.',
    url: '#affiliate-dropbox',
    icon: '📦',
  },
];
