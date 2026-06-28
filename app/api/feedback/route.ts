import { NextRequest, NextResponse } from "next/server";
import {
  getFeedbackEmail,
  getResendClient,
} from "@/lib/resend";
import { escapeHtml } from "@/lib/utils";

const RATINGS = ["up", "down"] as const;
type Rating = (typeof RATINGS)[number];

function isRating(value: string): value is Rating {
  return (RATINGS as readonly string[]).includes(value);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { toolName, toolSlug, rating, comment, userEmail } =
      await request.json();

    const trimmedToolName = toolName?.trim();
    const trimmedToolSlug = toolSlug?.trim();

    if (!trimmedToolName || !trimmedToolSlug) {
      return NextResponse.json(
        { error: "Tool name and slug are required" },
        { status: 400 }
      );
    }

    if (!rating || !isRating(rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const trimmedComment = comment?.trim();
    if (trimmedComment && trimmedComment.length > 1000) {
      return NextResponse.json(
        { error: "Comment must be 1000 characters or fewer" },
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
        { status: 503 }
      );
    }

    const timestamp = new Date().toUTCString();
    const ratingEmoji = rating === "up" ? "👍" : "👎";
    const ratingLabel = rating === "up" ? "Helpful" : "Not helpful";

    const feedbackEmail = getFeedbackEmail();
    if (!feedbackEmail) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    await resend.emails.send({
      from: "Toolsify <noreply@toolsify.online>",
      to: feedbackEmail,
      ...(trimmedEmail ? { replyTo: trimmedEmail } : {}),
      subject: `[Toolsify Feedback] ${ratingEmoji} ${trimmedToolName}`,
      html: `
        <h2>Tool Feedback</h2>
        <p><strong>Tool:</strong> ${escapeHtml(trimmedToolName)}</p>
        <p><strong>Slug:</strong> ${escapeHtml(trimmedToolSlug)}</p>
        <p><strong>Rating:</strong> ${ratingEmoji} ${escapeHtml(ratingLabel)}</p>
        ${
          trimmedComment
            ? `<p><strong>Comment:</strong></p><p>${escapeHtml(trimmedComment).replace(/\n/g, "<br/>")}</p>`
            : "<p><strong>Comment:</strong> <em>None</em></p>"
        }
        <p><strong>User Email:</strong> ${escapeHtml(trimmedEmail || "Not provided")}</p>
        <p><strong>Submitted:</strong> ${escapeHtml(timestamp)}</p>
        <hr/>
        <p style="color: #666; font-size: 12px;">Sent from Toolsify feedback widget</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send feedback" }, { status: 500 });
  }
}
