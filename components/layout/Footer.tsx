import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/site";
import { Container } from "@/components/shared/Container";
import { NewsletterForm } from "@/components/shared/NewsletterForm";

export function Footer() {
  const footerNav = site.nav.filter((item) => item.href !== "/");

  return (
    <footer className="border-t border-border bg-black text-white">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" aria-label={site.name}>
              <Image
                src="/images/brand/vantage-logo-primary-dark.svg"
                alt={site.name}
                width={1448}
                height={1086}
                className="h-24 w-auto"
                unoptimized
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              {site.mission}
            </p>
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
                    className="text-sm text-white/70 hover:text-primary-light"
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
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="hover:text-primary-light"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-primary-light"
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
                  className="text-sm text-white/70 hover:text-primary-light"
                >
                  Instagram
                </a>
              )}
              {site.socials.linkedin && (
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-primary-light"
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
            <p className="mt-4 text-sm text-white/70">
              Get updates on our work, stories and ways to support.
            </p>
            <div className="mt-4">
              <NewsletterForm light />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-white/70 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}. All rights
            reserved.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link href="/reports-and-accountability" className="hover:text-primary-light">
              Reports & Accountability
            </Link>
            <Link href="/faq" className="hover:text-primary-light">
              FAQ
            </Link>
            <Link href="/privacy" className="hover:text-primary-light">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary-light">
              Terms
            </Link>
            <Link href="/safeguarding" className="hover:text-primary-light">
              Safeguarding
            </Link>
            <Link href="/accessibility" className="hover:text-primary-light">
              Accessibility
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
