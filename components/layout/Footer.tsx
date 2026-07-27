import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "@/components/shared/Container";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/Button";

export function Footer() {
  const footerNav = site.nav.filter((item) => item.href !== "/");

  return (
    <footer className="border-t border-border bg-surface">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo href="/" variant="horizontal" height={36} alt={site.name} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {site.mission}
            </p>
            <Button href={site.primaryCta.href} size="sm" className="mt-6">
              {site.primaryCta.label}
            </Button>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Explore
            </h2>
            <ul className="mt-4 space-y-2">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Contact
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="hover:text-primary"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-primary"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li>{site.contact.address}</li>
            </ul>
            <div className="mt-4 flex gap-4">
              {site.socials.instagram && (
                <a
                  href={site.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Instagram
                </a>
              )}
              {site.socials.linkedin && (
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Newsletter
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Get updates on our work, stories and ways to support.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 text-sm text-muted-foreground md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}. All rights
            reserved.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link href="/reports-and-accountability" className="hover:text-primary">
              Reports & Accountability
            </Link>
            <Link href="/faq" className="hover:text-primary">
              FAQ
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/safeguarding" className="hover:text-primary">
              Safeguarding
            </Link>
            <Link href="/accessibility" className="hover:text-primary">
              Accessibility
            </Link>
            <Link href="/brand-guide" className="hover:text-primary">
              Brand Guide
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
