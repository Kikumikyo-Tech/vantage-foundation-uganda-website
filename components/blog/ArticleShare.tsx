"use client";

import { useState } from "react";
import {
  Check,
  Link2,
  MessageCircle,
  Share2,
} from "lucide-react";

interface ArticleShareProps {
  title: string;
  url: string;
}

const controlClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary-light/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export function ArticleShare({ title, url }: ArticleShareProps) {
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "copied" | "error"
  >("idle");
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} ${url}`);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <footer className="mt-12 border-t border-border pt-8 md:mt-16">
      <h2 className="text-lg font-bold text-foreground">Share this article</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={controlClasses}
          aria-label="Share this article on LinkedIn"
        >
          <Share2 aria-hidden="true" size={18} />
          LinkedIn
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={controlClasses}
          aria-label="Share this article on Facebook"
        >
          <Share2 aria-hidden="true" size={18} />
          Facebook
        </a>
        <a
          href={`https://wa.me/?text=${encodedText}`}
          target="_blank"
          rel="noopener noreferrer"
          className={controlClasses}
          aria-label="Share this article on WhatsApp"
        >
          <MessageCircle aria-hidden="true" size={18} />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={copyLink}
          className={controlClasses}
          aria-label="Copy article link"
        >
          {copyStatus === "copied" ? (
            <Check aria-hidden="true" size={18} />
          ) : (
            <Link2 aria-hidden="true" size={18} />
          )}
          {copyStatus === "copied" ? "Copied" : "Copy link"}
        </button>
      </div>
      <p
        className="mt-3 min-h-5 text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        {copyStatus === "copied" && "Article link copied to your clipboard."}
        {copyStatus === "error" &&
          "The link could not be copied. Please copy it from your address bar."}
      </p>
    </footer>
  );
}
