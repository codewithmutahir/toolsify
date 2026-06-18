import { NextRequest, NextResponse } from "next/server";
import {
  getContactEmail,
  getResendClient,
  getResendFromAddress,
} from "@/lib/resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name?.trim() || name.trim().length < 2) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email?.trim() || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
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
    const trimmedEmail = email.trim();
    const trimmedSubject = subject?.trim() || "General inquiry";
    const trimmedMessage = message.trim();

    await resend.emails.send({
      from: getResendFromAddress(),
      to: contactEmail,
      replyTo: trimmedEmail,
      subject: `📬 Contact: ${trimmedSubject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${trimmedName}</p>
        <p><strong>Email:</strong> ${trimmedEmail}</p>
        <p><strong>Subject:</strong> ${trimmedSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${trimmedMessage.replace(/\n/g, "<br/>")}</p>
        <hr/>
        <p style="color: #666; font-size: 12px;">Sent from Toolsify contact form</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
