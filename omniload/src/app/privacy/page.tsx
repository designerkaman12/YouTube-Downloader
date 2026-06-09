import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "OmniLoad Privacy Policy — Learn how we collect, use, and protect your data. GDPR and CCPA compliant.",
  alternates: { canonical: `${SITE_CONFIG.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mb-10 text-sm text-[hsl(var(--muted-foreground))]">
          Last updated: June 1, 2026
        </p>

        <div className="prose max-w-none space-y-6">
          <h2>1. Introduction</h2>
          <p>
            Welcome to OmniLoad (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at {SITE_CONFIG.url} (the &quot;Site&quot;).
          </p>
          <p>
            By using OmniLoad, you agree to the collection and use of information in accordance with this policy.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <p>
            When you use OmniLoad, you may provide us with URLs of videos or audio content you wish to download. We do not require registration, and we do not collect personal identification information such as names, email addresses, or phone numbers through our download service.
          </p>
          <h3>2.2 Automatically Collected Information</h3>
          <p>We may automatically collect certain information when you visit our Site, including:</p>
          <ul>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>IP address (anonymized)</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
            <li>Device information</li>
          </ul>

          <h2>3. Cookies and Tracking Technologies</h2>
          <h3>3.1 Cookies We Use</h3>
          <p>OmniLoad uses the following types of cookies:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for the website to function properly, including theme preference and cookie consent status.</li>
            <li><strong>Analytics Cookies:</strong> We use Google Analytics to understand how visitors interact with our website. These cookies collect information in an anonymous form.</li>
            <li><strong>Advertising Cookies:</strong> We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites.</li>
          </ul>
          <h3>3.2 Google AdSense</h3>
          <p>
            We use Google AdSense to display advertisements on our Site. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet.
          </p>
          <p>
            You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. Alternatively, you can opt out of third-party vendor cookies by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info</a>.
          </p>
          <h3>3.3 Google Analytics</h3>
          <p>
            We use Google Analytics to analyze website traffic and usage patterns. Google Analytics uses cookies to collect information about how visitors use our Site. This data is used to compile reports and help us improve the Site. The cookies collect information in an anonymous form, including the number of visitors, where visitors come from, and the pages they visit.
          </p>

          <h2>4. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our download service</li>
            <li>Improve and optimize our website experience</li>
            <li>Analyze usage patterns and trends</li>
            <li>Display relevant advertisements through Google AdSense</li>
            <li>Detect and prevent technical issues</li>
          </ul>

          <h2>5. Data Storage and Security</h2>
          <p>
            OmniLoad does not store any downloaded content on our servers. All download processing happens in real-time, and no copies of downloaded files are retained. We use HTTPS encryption to secure all data transmitted between your browser and our servers.
          </p>

          <h2>6. Third-Party Services</h2>
          <p>We may share anonymized data with the following third-party services:</p>
          <ul>
            <li><strong>Google AdSense:</strong> For displaying advertisements</li>
            <li><strong>Google Analytics:</strong> For website analytics</li>
          </ul>
          <p>
            These third parties have their own privacy policies and may collect information as described in their respective privacy policies.
          </p>

          <h2>7. Your Rights (GDPR/CCPA)</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li><strong>Right to Access:</strong> Request a copy of the data we hold about you</li>
            <li><strong>Right to Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Right to Opt-Out:</strong> Opt out of personalized advertising</li>
            <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
          </p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            OmniLoad is not directed at children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected information from a child, please contact us immediately.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <ul>
            <li>Email: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a></li>
            <li>Website: <a href={SITE_CONFIG.url}>{SITE_CONFIG.url}</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
