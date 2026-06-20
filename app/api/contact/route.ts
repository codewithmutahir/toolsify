import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";
import {
  getContactEmail,
  getResendClient,
  getResendFromAddress,
} from "@/lib/resend";
import { verifyRecaptchaToken } from "@/lib/recaptcha";
import { escapeHtml } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const ipLimit = await checkRateLimit(getClientIp(request), {
      prefix: "contact:ip",
      limit: 5,
      window: "1 h",
    });

    if (!ipLimit.allowed) {
      return NextResponse.json(rateLimitResponse(ipLimit.retryAfter), {
        status: 429,
        headers: { "Retry-After": String(ipLimit.retryAfter) },
      });
    }

    const { name, email, subject, message, recaptchaToken } =
      await request.json();

    const host = request.headers.get("host")?.split(":")[0];
    const captcha = await verifyRecaptchaToken(recaptchaToken, "contact", host);
    if (!captcha.ok) {
      return NextResponse.json(
        { error: "Captcha verification failed. Please try again." },
        { status: 400 }
      );
    }

    if (!name?.trim() || name.trim().length < 2) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email?.trim() || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    const emailLimit = await checkRateLimit(trimmedEmail, {
      prefix: "contact:email",
      limit: 3,
      window: "1 h",
    });

    if (!emailLimit.allowed) {
      return NextResponse.json(rateLimitResponse(emailLimit.retryAfter), {
        status: 429,
        headers: { "Retry-After": String(emailLimit.retryAfter) },
      });
    }

    if (!message?.trim() || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    const resend = getResendClient();
    const contactEmail = getContactEmail();

    if (!resend || !contactEmail) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    const trimmedName = name.trim();
    const trimmedSubject = subject?.trim() || "General inquiry";
    const trimmedMessage = message.trim();

    await resend.emails.send({
      from: getResendFromAddress(),
      to: contactEmail,
      replyTo: trimmedEmail,
      subject: `📬 Contact: ${trimmedSubject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(trimmedSubject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(trimmedMessage).replace(/\n/g, "<br/>")}</p>
        <hr/>
        <p style="color: #666; font-size: 12px;">Sent from Toolsify contact form</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
