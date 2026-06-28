import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

const linkClass = "text-primary-container hover:underline";

function InternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={linkClass}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function MailtoLink({ email, children }: { email: string; children: ReactNode }) {
  return (
    <a href={`mailto:${email}`} className={linkClass}>
      {children}
    </a>
  );
}

function createRichRenderer(
  name: string,
  render: (chunks: ReactNode) => ReactNode
) {
  const Component = (chunks: ReactNode) => render(chunks);
  Component.displayName = name;
  return Component;
}

export function richInternalLink(href: string) {
  return createRichRenderer("RichInternalLink", (chunks) => (
    <InternalLink href={href}>{chunks}</InternalLink>
  ));
}

export function richExternalLink(href: string) {
  return createRichRenderer("RichExternalLink", (chunks) => (
    <ExternalLink href={href}>{chunks}</ExternalLink>
  ));
}

export function richMailto(email: string) {
  return createRichRenderer("RichMailtoLink", (chunks) => (
    <MailtoLink email={email}>{chunks}</MailtoLink>
  ));
}
