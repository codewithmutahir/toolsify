"use client";

import { useMemo, useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import JsonTreeView from "@/components/tools/shared/JsonTreeView";
import ToolFaq from "@/components/tools/shared/ToolFaq";
import ToolWrapper from "@/components/tools/ToolWrapper";
import {
  decodeJwt,
  formatUnixClaim,
  isExpired,
  relativeTimeFromNow,
} from "@/lib/developer/jwt";
import { getToolBySlug } from "@/constants/tools";
import { cn } from "@/lib/utils";

const tool = getToolBySlug("jwt-decoder")!;

export default function JwtDecoder() {
  const [token, setToken] = useState("");

  const decoded = useMemo(() => decodeJwt(token), [token]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://toolsify.online/${tool.slug}`,
    description: tool.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const claims =
    decoded.ok && typeof decoded.payload === "object"
      ? decoded.payload
      : null;

  return (
    <>
      <JsonLd data={schema} />
      <ToolWrapper
        title={tool.title}
        description={tool.description}
        category={tool.category}
        slug={tool.slug}
        seoContent={
          <>
            <h2 className="font-h2 text-h2 text-on-surface mb-md">
              Free JWT Decoder & Inspector
            </h2>
            <div className="space-y-md font-body text-body text-on-surface-variant leading-relaxed">
              <p>
                A JSON Web Token (JWT) is a compact way to send signed claims
                between systems. This decoder splits a token into its header,
                payload, and signature so you can inspect claims like expiry,
                issuer, and audience.
              </p>
              <p>
                This tool is for debugging and learning only. It never verifies
                whether a token signature is trustworthy.
              </p>
            </div>
            <h2 className="font-h2 text-h2 text-on-surface mb-md mt-xl">How to use</h2>
            <ol className="list-decimal list-inside space-y-sm font-body text-body text-on-surface-variant">
              <li>Paste a JWT into the input field.</li>
              <li>Review the decoded header and payload.</li>
              <li>Check standard time-based claims like exp, iat, and nbf.</li>
            </ol>
            <ToolFaq
              items={[
                {
                  question: "Is my token uploaded anywhere?",
                  answer:
                    "No. Decoding happens entirely in your browser. The token is never sent to a server.",
                },
                {
                  question: "Does this verify my JWT signature?",
                  answer:
                    "No. Signature verification requires the issuer&apos;s secret or public key. This tool only base64-decodes the header and payload for inspection.",
                },
                {
                  question: "Why should I be careful pasting JWTs online?",
                  answer:
                    "JWTs can contain sensitive session data. Only decode tokens you are comfortable exposing locally, and never paste production credentials into untrusted tools.",
                },
              ]}
            />
          </>
        }
      >
        <label
          htmlFor="jwt-input"
          className="font-label text-label font-bold text-on-surface uppercase block mb-sm"
        >
          JWT token
        </label>
        <textarea
          id="jwt-input"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          rows={4}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-lg py-md font-mono text-small focus:ring-2 focus:ring-primary-container outline-none resize-y mb-sm"
        />
        <p className="font-small text-small text-on-surface-variant mb-lg">
          This tool only decodes — it does not verify the signature. Never paste
          tokens from systems you don&apos;t trust into any online tool.
        </p>

        {!decoded.ok && token.trim() && (
          <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
            {decoded.message}
          </p>
        )}

        {decoded.ok && (
          <div className="space-y-xl">
            {claims && (
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg space-y-sm">
                <h3 className="font-h3 text-h3 text-on-surface">Claim summary</h3>
                {typeof claims.iat === "number" && (
                  <p className="font-body text-body text-on-surface-variant">
                    Issued at: {formatUnixClaim(claims.iat)}
                  </p>
                )}
                {typeof claims.nbf === "number" && (
                  <p className="font-body text-body text-on-surface-variant">
                    Not before: {formatUnixClaim(claims.nbf)}
                  </p>
                )}
                {typeof claims.exp === "number" && (
                  <p
                    className={cn(
                      "font-body text-body",
                      isExpired(claims.exp)
                        ? "text-error"
                        : "text-tertiary"
                    )}
                  >
                    Expires: {formatUnixClaim(claims.exp)} (
                    {relativeTimeFromNow(claims.exp)})
                  </p>
                )}
              </div>
            )}

            <div>
              <h3 className="font-h3 text-h3 text-on-surface mb-md">Header</h3>
              <JsonTreeView data={decoded.header} />
            </div>

            <div>
              <h3 className="font-h3 text-h3 text-on-surface mb-md">Payload</h3>
              <JsonTreeView data={decoded.payload} />
            </div>

            <div>
              <h3 className="font-h3 text-h3 text-on-surface mb-md">Signature</h3>
              <p className="font-mono text-small text-on-surface-variant break-all bg-surface-container-low border border-outline-variant rounded-lg p-md">
                {decoded.signature}
              </p>
            </div>
          </div>
        )}
      </ToolWrapper>
    </>
  );
}
