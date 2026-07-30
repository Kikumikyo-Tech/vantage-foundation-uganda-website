import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "@/components/shared/Container";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/Button";

export function Footer() {
  const programmeLinks = [
    { label: "Vantage Care", href: "/programmes/health" },
    { label: "KikumiKyo Academy", href: "/programmes/education" },
    { label: "Humanitarian Assistance", href: "/programmes/humanitarian" },
    { label: "Water, Sanitation and Hygiene", href: "/programmes/water" },
  ];

  const impactLinks = [
    { label: "Projects", href: "/projects" },
    { label: "Impact Results", href: "/impact" },
    { label: "Reports and Accountability", href: "/reports-and-accountability" },
    { label: "Where We Work", href: "/impact#where-we-work" },
  ];

  const getInvolvedLinks = [
    { label: "Donate", href: "/donate" },
    { label: "Volunteer", href: "/get-involved#volunteer" },
    { label: "Partner", href: "/get-involved#partner" },
    { label: "Sponsor", href: "/get-involved#sponsor" },
    { label: "Corporate Social Responsibility", href: "/get-involved#csr" },
  ];

  const legalLinks = [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Safeguarding", href: "/safeguarding" },
    { label: "Accessibility", href: "/accessibility" },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Organisation summary */}
          <div className="lg:col-span-1">
            <Logo href="/" variant="horizontal" height={56} alt={site.name} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {site.legalName} is a youth-led nonprofit improving access to
              health, education, clean water and humanitarian support in
              underserved Ugandan communities.
            </p>
            <Button href={site.primaryCta.href} size="sm" className="mt-6">
              {site.primaryCta.label}
            </Button>
          </div>

          {/* Programmes */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Programmes
            </h2>
            <ul className="mt-4 space-y-2">
              {programmeLinks.map((item) => (
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

          {/* Impact and accountability */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Impact & Accountability
            </h2>
            <ul className="mt-4 space-y-2">
              {impactLinks.map((item) => (
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

          {/* Get involved */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Get Involved
            </h2>
            <ul className="mt-4 space-y-2">
              {getInvolvedLinks.map((item) => (
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
        </div>

        {/* Contact, social, newsletter */}
        <div className="grid gap-12 border-t border-border py-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Contact information */}
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
            <div className="mt-4 space-y-1">
              {site.contact.offices.map((office) => (
                <p key={office.label} className="text-sm text-muted-foreground">
                  <span className="font-medium">{office.label}:</span>{" "}
                  {office.city}, {office.region}
                </p>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
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
              {site.socials.youtube && (
                <a
                  href={site.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  YouTube
                </a>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Newsletter
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Get updates on our work, stories and ways to support.
            </p>
            <div className="mt-4 max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Legal links and copyright */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 text-sm text-muted-foreground md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}. All rights
            reserved.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6">
            {legalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
