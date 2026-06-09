import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "OmniLoad Terms of Service — Rules and guidelines for using our free video and audio download service.",
  alternates: { canonical: `${SITE_CONFIG.url}/terms` },
};

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Terms of Service</h1>
        <p className="mb-10 text-sm text-[hsl(var(--muted-foreground))]">Last updated: June 1, 2026</p>

        <div className="prose max-w-none space-y-6">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using OmniLoad ({SITE_CONFIG.url}), you accept and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our service.</p>

          <h2>2. Description of Service</h2>
          <p>OmniLoad provides a free online tool that allows users to download publicly available video and audio content from various platforms. Our service is provided &quot;as is&quot; and &quot;as available&quot; without any warranties.</p>

          <h2>3. Acceptable Use</h2>
          <p>You agree to use OmniLoad only for lawful purposes. You must not:</p>
          <ul>
            <li>Download copyrighted content without permission from the copyright holder</li>
            <li>Use the service to download private or restricted content</li>
            <li>Redistribute downloaded content for commercial purposes without authorization</li>
            <li>Use automated tools or bots to access our service</li>
            <li>Attempt to bypass any security measures on our website</li>
            <li>Use the service in any way that could damage or impair the service</li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <p>OmniLoad does not host, store, or own any of the content downloaded through our service. We provide links to publicly available content and are not responsible for the content created by third parties.</p>
          <p>Users are solely responsible for ensuring they have the right to download and use any content obtained through our service.</p>

          <h2>5. Copyright and DMCA</h2>
          <p>We respect intellectual property rights. If you believe any content accessible through our service infringes your copyright, please see our <a href="/dmca">DMCA Policy</a> for instructions on how to submit a takedown request.</p>

          <h2>6. Disclaimer of Warranties</h2>
          <p>OmniLoad is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties, express or implied, regarding:</p>
          <ul>
            <li>The availability or reliability of the service</li>
            <li>The accuracy of download quality or format options</li>
            <li>The compatibility of downloaded files with your device</li>
            <li>Freedom from viruses or other harmful components</li>
          </ul>

          <h2>7. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, OmniLoad and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.</p>

          <h2>8. Third-Party Content and Advertisements</h2>
          <p>Our website may display advertisements provided by Google AdSense and may contain links to third-party websites. We are not responsible for the content, privacy practices, or policies of third-party websites or advertisers.</p>

          <h2>9. Modifications to Terms</h2>
          <p>We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this page. Your continued use of the service after any changes constitutes acceptance of the new terms.</p>

          <h2>10. Governing Law</h2>
          <p>These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.</p>

          <h2>11. Contact</h2>
          <p>For questions about these Terms, contact us at <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.</p>
        </div>
      </div>
    </div>
  );
}
