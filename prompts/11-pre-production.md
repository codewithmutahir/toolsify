Read AGENTS.md first and follow it strictly.

## Task: Pre-Production Setup — Everything Before Going Live

---

### 1. PostHog Analytics

```bash
npm install posthog-js
```

Create `lib/posthog.ts`:
```ts
import posthog from 'posthog-js'

export function initPostHog() {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      capture_pageview: false, // handled manually via Next.js router
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      }
    })
  }
}

export default posthog
```

Create `components/analytics/PostHogProvider.tsx`:
```tsx
"use client"
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { initPostHog } from '@/lib/posthog'

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    initPostHog()
  }, [])

  useEffect(() => {
    if (pathname) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
      })
    }
  }, [pathname, searchParams])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
```

Wrap in `app/layout.tsx`:
```tsx
import PostHogProvider from '@/components/analytics/PostHogProvider'
import { Suspense } from 'react'

// Inside body:
<Suspense fallback={null}>
  <PostHogProvider>
    {children}
  </PostHogProvider>
</Suspense>
```

**Track these events across the site:**

In every tool component — track tool usage:
```ts
import posthog from '@/lib/posthog'

// When user gets a result (on calculate):
posthog.capture('tool_used', {
  tool_slug: 'bmi-calculator',
  tool_category: 'fitness',
})
```

In search component — track searches:
```ts
posthog.capture('search_performed', {
  query: searchQuery,
  results_count: results.length,
  found_result: results.length > 0,
})
```

In "Request a Tool" form — track requests:
```ts
posthog.capture('tool_requested', {
  tool_name: requestedTool,
})
```

Add `.env.local`:
```
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

### 2. Google Analytics 4

Add to `.env.local`:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Create `components/analytics/GoogleAnalytics.tsx`:
```tsx
import Script from 'next/script'

export default function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
```

Add to `app/layout.tsx` inside `<head>`:
```tsx
<GoogleAnalytics />
```

---

### 3. Google AdSense

Add to `.env.local`:
```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

Add AdSense script to `app/layout.tsx` inside `<head>`:
```tsx
<Script
  async
  src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

Create `public/ads.txt`:
```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

Update `components/ads/AdBanner.tsx` — production mode renders real `<ins>` tags:
```tsx
"use client"
import { useEffect } from 'react'

export default function AdBanner({ slot, format, className }: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {}
  }, [])

  if (process.env.NODE_ENV === 'development') {
    // dev placeholder — keep existing
    return <DevAdPlaceholder format={format} className={className} />
  }

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
```

---

### 4. Resend — "Request a Tool" Feature

```bash
npm install resend
```

Add to `.env.local`:
```
RESEND_API_KEY=re_xxxx
CONTACT_EMAIL=your@email.com
```

Create `app/api/request-tool/route.ts`:
```ts
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { toolName, description, email } = await request.json()

    if (!toolName || toolName.length < 3) {
      return NextResponse.json({ error: 'Tool name required' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Toolsify <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL!,
      subject: `🛠️ New Tool Request: ${toolName}`,
      html: `
        <h2>New Tool Request</h2>
        <p><strong>Tool Name:</strong> ${toolName}</p>
        <p><strong>Description:</strong> ${description || 'Not provided'}</p>
        <p><strong>Requested by:</strong> ${email || 'Anonymous'}</p>
        <hr/>
        <p style="color: #666; font-size: 12px;">Sent from Toolsify Request a Tool form</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
```

Create `components/tools/RequestToolModal.tsx`:
```tsx
"use client"
import { useState } from 'react'
import posthog from '@/lib/posthog'

export default function RequestToolModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [toolName, setToolName] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit() {
    if (!toolName.trim()) return
    setStatus('loading')

    try {
      const res = await fetch('/api/request-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName, description, email }),
      })

      if (res.ok) {
        setStatus('success')
        posthog.capture('tool_requested', { tool_name: toolName })
        setTimeout(onClose, 2000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (!isOpen) return null

  return (
    // Modal overlay
    <div className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm z-50 flex items-center justify-center p-lg">
      <div className="bg-white rounded-xl border border-outline-variant shadow-xl w-full max-w-md p-xl">
        
        {status === 'success' ? (
          // Success state
          <div className="text-center py-lg">
            <span className="material-symbols-outlined text-tertiary-container text-[64px] mb-md block"
                  style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <h3 className="font-h2 text-h2 text-on-surface mb-sm">Request Sent!</h3>
            <p className="font-body text-body text-on-surface-variant">
              We'll review your suggestion and add it soon.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-xl">
              <div>
                <h3 className="font-h2 text-h2 text-on-surface">Request a Tool</h3>
                <p className="font-small text-small text-on-surface-variant mt-xs">
                  Can't find what you need? Let us know!
                </p>
              </div>
              <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form */}
            <div className="space-y-md">
              <div>
                <label className="font-label text-label text-on-surface-variant uppercase mb-xs block">
                  Tool Name *
                </label>
                <input
                  className="tool-input"
                  placeholder="e.g. CSS Minifier, QR Code Generator"
                  value={toolName}
                  onChange={e => setToolName(e.target.value)}
                />
              </div>
              <div>
                <label className="font-label text-label text-on-surface-variant uppercase mb-xs block">
                  Description
                </label>
                <textarea
                  className="tool-input resize-none h-24"
                  placeholder="What should it do? Any specific features?"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="font-label text-label text-on-surface-variant uppercase mb-xs block">
                  Your Email (optional)
                </label>
                <input
                  className="tool-input"
                  type="email"
                  placeholder="Get notified when it's live"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {status === 'error' && (
                <p className="font-small text-small text-error">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={!toolName.trim() || status === 'loading'}
                className="w-full bg-primary-container text-on-primary font-h3 text-h3 py-md rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Submit Request'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
```

Wire the modal to the "Request a Tool" CTA button on `/tools` page and homepage.

---

### 5. Security Headers

Update `next.config.ts`:
```ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/ads.txt',
        headers: [{ key: 'Content-Type', value: 'text/plain' }],
      },
    ]
  },
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

---

### 6. Privacy Policy Page (`app/privacy-policy/page.tsx`)

Required for AdSense approval. Server component:
```tsx
export const metadata = {
  title: 'Privacy Policy | Toolsify',
  robots: { index: false },  // don't index legal pages
}
```

Content must include:
- What data we collect (PostHog, GA4)
- Google AdSense / cookies mention
- No account data stored (tools are client-side)
- Contact email for data requests
- Last updated date

---

### 7. Terms of Service Page (`app/terms/page.tsx`)

```tsx
export const metadata = {
  title: 'Terms of Service | Toolsify',
  robots: { index: false },
}
```

Content: tool accuracy disclaimer, no warranty, fair use.

---

### 8. Sitemap & Robots

Create `app/sitemap.ts`:
```ts
import { liveTools } from '@/constants/tools'
import { categories } from '@/constants/categories'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const toolUrls = liveTools.map(tool => ({
    url: `https://toolsify.online/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const categoryUrls = categories.map(cat => ({
    url: `https://toolsify.online/tools/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    { url: 'https://toolsify.online', priority: 1.0, changeFrequency: 'daily' },
    { url: 'https://toolsify.online/tools', priority: 0.9, changeFrequency: 'weekly' },
    ...categoryUrls,
    ...toolUrls,
  ]
}
```

Create `app/robots.ts`:
```ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://toolsify.online/sitemap.xml',
  }
}
```

---

### 9. Favicon & Icons

Create and place in `public/`:
- `favicon.ico` — 32x32, orange "T" or tool icon
- `apple-touch-icon.png` — 180x180
- `og-image.png` — 1200x630 for social sharing

Update `app/layout.tsx` metadata:
```ts
export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}
```

---

### 10. 404 Page (`app/not-found.tsx`)

```tsx
export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-lg">
      <div className="text-center max-w-md">
        <span className="material-symbols-outlined text-primary-container text-[80px] mb-lg block"
              style={{ fontVariationSettings: "'FILL' 1" }}>
          search_off
        </span>
        <h1 className="font-h1 text-h1 text-on-surface mb-md">Page Not Found</h1>
        <p className="font-body text-body text-on-surface-variant mb-xl">
          The tool or page you're looking for doesn't exist.
        </p>
        <Link href="/tools" className="btn-primary inline-flex items-center gap-sm">
          Browse All Tools
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </main>
  )
}
```

---

### 11. Error Boundary (`app/error.tsx`)

```tsx
"use client"
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-lg">
      <div className="text-center max-w-md">
        <span className="material-symbols-outlined text-error text-[80px] mb-lg block">error</span>
        <h2 className="font-h1 text-h1 text-on-surface mb-md">Something went wrong</h2>
        <p className="font-body text-body text-on-surface-variant mb-xl">
          An unexpected error occurred. Please try again.
        </p>
        <button onClick={reset} className="btn-primary">Try Again</button>
      </div>
    </main>
  )
}
```

---

### 12. Vercel Analytics & Speed Insights

```bash
npm install @vercel/analytics @vercel/speed-insights
```

Add to `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Inside body before closing:
<Analytics />
<SpeedInsights />
```

---

### 13. Environment Variables — Full List

Create `.env.example` (commit this, not .env.local):
```
# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Ads
NEXT_PUBLIC_ADSENSE_CLIENT_ID=

# Email
RESEND_API_KEY=
CONTACT_EMAIL=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

Add all these to Vercel Dashboard → Project Settings → Environment Variables before deploying.

---

### Pre-Launch Final Checklist

```
Analytics
[ ] PostHog initialized — check events in PostHog dashboard
[ ] GA4 firing — check Realtime in GA4

Ads
[ ] ads.txt at /ads.txt
[ ] AdSense script in layout
[ ] Privacy Policy page exists and linked in footer

SEO
[ ] /sitemap.xml returns valid XML
[ ] /robots.txt correct
[ ] All tool pages unique title + description
[ ] 404 page works

Performance  
[ ] npm run build — zero errors
[ ] Lighthouse Performance > 85
[ ] No console errors

Security
[ ] Security headers — verify at securityheaders.com
[ ] No secrets in client bundle

UX
[ ] Request a Tool modal works — email received
[ ] 404 page looks good
[ ] Error boundary works
[ ] Favicon shows in browser tab
```

---

### Verify
```bash
npm run build    # must pass with zero errors
npm run start    # test production build locally
```

- [ ] Visit `/privacy-policy` — page exists
- [ ] Visit `/sitemap.xml` — all tool URLs listed
- [ ] Visit `/robots.txt` — correct
- [ ] Visit `/ads.txt` — correct
- [ ] PostHog events showing in dashboard
- [ ] Request a Tool form — email received in inbox
- [ ] Run `npm run lint` — zero errors