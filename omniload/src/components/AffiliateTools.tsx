"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const affiliateTools = [
  {
    name: "VidIQ",
    desc: "YouTube growth tool for creators — keyword research, analytics, and optimization.",
    href: "#",
    tag: "YouTube Growth",
  },
  {
    name: "Canva Pro",
    desc: "Design thumbnails, social graphics, and video templates with ease.",
    href: "#",
    tag: "Design",
  },
  {
    name: "TubeBuddy",
    desc: "Browser extension for YouTube SEO, bulk processing, and A/B testing.",
    href: "#",
    tag: "YouTube SEO",
  },
  {
    name: "Epidemic Sound",
    desc: "Royalty-free music and sound effects for content creators.",
    href: "#",
    tag: "Audio",
  },
];

export default function AffiliateTools() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Creator <span className="gradient-text">Tools</span> We Recommend
          </h2>
          <p className="mx-auto max-w-lg text-sm text-muted-foreground">
            Trusted tools to help you grow your audience and create better content.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {affiliateTools.map((tool, i) => (
            <motion.a
              key={tool.name}
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="affiliate-card group flex flex-col"
            >
              <span className="mb-2 inline-flex w-fit items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                {tool.tag}
              </span>
              <h3 className="mb-1 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <p className="mb-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                {tool.desc}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                Learn More <ExternalLink size={10} />
              </span>
            </motion.a>
          ))}
        </div>

        <p className="mt-4 text-center text-[10px] text-muted">
          Some links above may be affiliate links. We may earn a commission at no cost to you.
        </p>
      </div>
    </section>
  );
}
