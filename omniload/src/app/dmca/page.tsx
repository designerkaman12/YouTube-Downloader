import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "DMCA Policy",
  description: "OmniLoad DMCA Policy — How to submit a copyright takedown request or counter-notification.",
  alternates: { canonical: `${SITE_CONFIG.url}/dmca` },
};

export default function DMCAPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">DMCA Policy</h1>
        <p className="mb-10 text-sm text-[hsl(var(--muted-foreground))]">Last updated: June 1, 2026</p>

        <div className="prose max-w-none space-y-6">
          <h2>1. Overview</h2>
          <p>OmniLoad respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond promptly to claims of copyright infringement committed using our service.</p>

          <h2>2. Important Notice</h2>
          <p>OmniLoad does not host, store, cache, or redistribute any media content. Our service provides tools to download publicly available content from third-party platforms. We act as a technical intermediary only.</p>

          <h2>3. Filing a DMCA Takedown Notice</h2>
          <p>If you believe that content accessible through OmniLoad infringes your copyright, please submit a written notification containing the following:</p>
          <ul>
            <li>A physical or electronic signature of the copyright owner or authorized agent</li>
            <li>Identification of the copyrighted work claimed to have been infringed</li>
            <li>Identification of the material that is claimed to be infringing and its location</li>
            <li>Your contact information (address, phone number, email)</li>
            <li>A statement that you have a good faith belief that the use is not authorized by the copyright owner</li>
            <li>A statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on behalf of the owner</li>
          </ul>

          <h2>4. Where to Send Notices</h2>
          <p>DMCA takedown notices should be sent to:</p>
          <p><strong>Email:</strong> <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a></p>
          <p>Please include &quot;DMCA Takedown Request&quot; in the subject line.</p>

          <h2>5. Counter-Notification</h2>
          <p>If you believe your content was wrongly removed, you may submit a counter-notification containing:</p>
          <ul>
            <li>Your physical or electronic signature</li>
            <li>Identification of the removed material and its former location</li>
            <li>A statement under penalty of perjury that the material was removed by mistake</li>
            <li>Your name, address, and phone number</li>
            <li>Consent to the jurisdiction of your local federal district court</li>
          </ul>

          <h2>6. Repeat Infringers</h2>
          <p>OmniLoad will terminate access for users who are determined to be repeat infringers in appropriate circumstances.</p>

          <h2>7. Contact</h2>
          <p>For DMCA-related inquiries, contact us at <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.</p>
        </div>
      </div>
    </div>
  );
}
