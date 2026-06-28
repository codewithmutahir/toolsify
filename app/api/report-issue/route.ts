import { NextRequest, NextResponse } from "next/server";
import {
  getReportIssueEmail,
  getResendClient,
  getResendFromAddress,
} from "@/lib/resend";
import { escapeHtml } from "@/lib/utils";

const ISSUE_TYPES = ["bug", "ui", "performance", "wrong_output", "other"] as const;
type IssueType = (typeof ISSUE_TYPES)[number];

const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
  bug: "Bug / Not Working",
  ui: "UI / Display Problem",
  performance: "Slow / Performance Issue",
  wrong_output: "Wrong Output",
  other: "Other",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isIssueType(value: string): value is IssueType {
  return (ISSUE_TYPES as readonly string[]).includes(value);
}

export async function POST(request: NextRequest) {
  try {
    const { toolUrl, issueType, description, userEmail } = await request.json();

    const trimmedToolUrl = toolUrl?.trim();
    if (!trimmedToolUrl) {
      return NextResponse.json({ error: "Tool URL is required" }, { status: 400 });
    }

    if (!issueType || !isIssueType(issueType)) {
      return NextResponse.json({ error: "Invalid issue type" }, { status: 400 });
    }

    const trimmedDescription = description?.trim();
    if (!trimmedDescription || trimmedDescription.length < 10) {
      return NextResponse.json(
        { error: "Description must be at least 10 characters" },
        { status: 400 }
      );
    }

    const trimmedEmail = userEmail?.trim();
    if (trimmedEmail && !EMAIL_RE.test(trimmedEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const resend = getResendClient();
    if (!resend) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const issueTypeLabel = ISSUE_TYPE_LABELS[issueType];
    const timestamp = new Date().toUTCString();
    const reportEmail = getReportIssueEmail();

    await resend.emails.send({
      from: getResendFromAddress(),
      to: reportEmail,
      ...(trimmedEmail ? { replyTo: trimmedEmail } : {}),
      subject: `[Toolsify Report] ${issueTypeLabel} — ${trimmedToolUrl}`,
      html: `
        <h2>Tool Issue Report</h2>
        <p><strong>Tool URL:</strong> <a href="${escapeHtml(trimmedToolUrl)}">${escapeHtml(trimmedToolUrl)}</a></p>
        <p><strong>Issue Type:</strong> ${escapeHtml(issueTypeLabel)}</p>
        <p><strong>Description:</strong></p>
        <p>${escapeHtml(trimmedDescription).replace(/\n/g, "<br/>")}</p>
        <p><strong>Reporter Email:</strong> ${escapeHtml(trimmedEmail || "Not provided")}</p>
        <p><strong>Submitted:</strong> ${escapeHtml(timestamp)}</p>
        <hr/>
        <p style="color: #666; font-size: 12px;">Sent from Toolsify Report Issue form</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send report" }, { status: 500 });
  }
}
