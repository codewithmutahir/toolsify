"use client";

import { useMemo, useState } from "react";
import JsonTreeView from "@/components/tools/shared/JsonTreeView";
import { useToolApi } from "@/hooks/useToolApi";
import {
  formatUnixClaim,
  isExpired,
  relativeTimeFromNow,
  type JwtDecodeResult,
} from "@/lib/developer/jwt";
import { cn } from "@/lib/utils";

export default function JwtDecoder() {
  const [token, setToken] = useState("");

  const requestBody = useMemo(
    () => (token.trim() ? { token } : null),
    [token]
  );

  const { data: decoded, error } = useToolApi<JwtDecodeResult>(
    "jwt-decoder",
    requestBody
  );

  const claims =
    decoded && typeof decoded.payload === "object" ? decoded.payload : null;

  return (
    <>
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

      {error && token.trim() && (
        <p className="font-body text-small text-on-error-container bg-error-container rounded-lg px-md py-sm mb-lg">
          {error}
        </p>
      )}

      {decoded && (
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
                    isExpired(claims.exp) ? "text-error" : "text-tertiary"
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
    </>
  );
}
