"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ReportIssueModal = dynamic(
  () => import("@/components/report-issue-modal"),
  { ssr: false }
);

export default function ReportIssueButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-container-lowest px-md py-sm font-label text-label text-on-surface shadow-md hover:bg-surface-container-low active:scale-[0.98] transition-all"
      >
        🐛 Report Issue
      </button>

      {isOpen && (
        <ReportIssueModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
