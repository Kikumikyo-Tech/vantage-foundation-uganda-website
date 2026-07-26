"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Focus management: trap focus in menu, restore on close, handle Escape.
  useEffect(() => {
    if (!open) return;

    const menu = menuRef.current;
    if (!menu) return;

    // Capture the trigger ref for cleanup (ref may change before cleanup runs).
    const trigger = triggerRef.current;

    // Move focus to the close button when menu opens.
    const closeBtn = menu.querySelector<HTMLButtonElement>("[aria-label='Close menu']");
    closeBtn?.focus();

    // Lock body scroll while menu is open.
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      // Focus trap: keep Tab within the menu.
      if (e.key === "Tab") {
        const focusable = menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      // Restore focus to the trigger button when menu closes.
      trigger?.focus();
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo
            href="/"
            variant="horizontal"
            height={40}
            alt={site.name}
          />

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
            ref={triggerRef}
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
          ref={menuRef}
          id="mobile-menu"
          className="fixed inset-0 z-50 bg-white md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <Container>
            <div className="flex h-16 items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} aria-label={site.name}>
                <Logo variant="horizontal" height={36} alt={site.name} />
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
