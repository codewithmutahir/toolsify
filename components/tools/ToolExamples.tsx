import type { ToolExample } from "@/types/tool-content";

interface ToolExamplesProps {
  examples: ToolExample[];
}

export default function ToolExamples({ examples }: ToolExamplesProps) {
  if (examples.length === 0) return null;

  return (
    <section aria-label="Examples" className="mt-2xl">
      <h2 className="font-h2 text-h2 text-on-surface mb-md">Examples</h2>
      <div className="space-y-md">
        {examples.map((example, index) => (
          <article
            key={index}
            className="bg-surface-container-low rounded-xl p-lg border border-outline-variant/30"
          >
            <h3 className="font-h3 text-h3 text-on-surface mb-xs">
              {example.title}
            </h3>
            <p className="font-body text-body text-on-surface-variant leading-relaxed">
              {example.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
