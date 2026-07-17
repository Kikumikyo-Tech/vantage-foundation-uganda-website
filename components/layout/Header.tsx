"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground"
            aria-label={site.name}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              V
            </span>
            <span className="hidden sm:inline">Vantage Foundation</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-foreground"
                )}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Button href={site.primaryCta.href} size="sm">
              {site.primaryCta.label}
            </Button>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </Container>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 bg-white md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <Container>
            <div className="flex h-16 items-center justify-between">
              <Link
                href="/"
                className="text-xl font-bold tracking-tight"
                onClick={() => setOpen(false)}
              >
                Vantage Foundation
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </Container>
          <nav className="flex flex-col gap-4 px-4 pt-8" aria-label="Mobile navigation">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-lg font-medium",
                  pathname === item.href ? "text-primary" : "text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button
              href={site.primaryCta.href}
              className="mt-4"
              onClick={() => setOpen(false)}
            >
              {site.primaryCta.label}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
