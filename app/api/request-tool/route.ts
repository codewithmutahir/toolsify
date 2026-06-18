import { NextRequest, NextResponse } from "next/server";
import {
  getContactEmail,
  getResendClient,
  getResendFromAddress,
} from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const { toolName, description, email } = await request.json();

    if (!toolName || toolName.length < 3) {
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
      subject: `🛠️ New Tool Request: ${toolName}`,
      html: `
        <h2>New Tool Request</h2>
        <p><strong>Tool Name:</strong> ${toolName}</p>
        <p><strong>Description:</strong> ${description || "Not provided"}</p>
        <p><strong>Requested by:</strong> ${email || "Anonymous"}</p>
        <hr/>
        <p style="color: #666; font-size: 12px;">Sent from Toolsify Request a Tool form</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
