import { NextRequest, NextResponse } from "next/server";
import {
  getContactEmail,
  getResendClient,
  getResendFromAddress,
} from "@/lib/resend";
import { verifyRecaptchaToken } from "@/lib/recaptcha";
import { escapeHtml } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { toolName, description, email, recaptchaToken } =
      await request.json();

    const host = request.headers.get("host")?.split(":")[0];
    const captcha = await verifyRecaptchaToken(
      recaptchaToken,
      "request_tool",
      host
    );
    if (!captcha.ok) {
      return NextResponse.json(
        { error: "Captcha verification failed. Please try again." },
        { status: 400 }
      );
    }

    const trimmedToolName = toolName?.trim();
    if (!trimmedToolName || trimmedToolName.length < 3) {
      return NextResponse.json({ error: "Tool name required" }, { status: 400 });
    }

    const resend = getResendClient();
    const contactEmail = getContactEmail();

    if (!resend || !contactEmail) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    await resend.emails.send({
      from: getResendFromAddress(),
      to: contactEmail,
      subject: `🛠️ New Tool Request: ${trimmedToolName}`,
      html: `
        <h2>New Tool Request</h2>
        <p><strong>Tool Name:</strong> ${escapeHtml(trimmedToolName)}</p>
        <p><strong>Description:</strong> ${escapeHtml(description || "Not provided")}</p>
        <p><strong>Requested by:</strong> ${escapeHtml(email || "Anonymous")}</p>
        <hr/>
        <p style="color: #666; font-size: 12px;">Sent from Toolsify Request a Tool form</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
