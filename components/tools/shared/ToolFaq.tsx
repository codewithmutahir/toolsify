interface FaqItem {
  question: string;
  answer: string;
}

interface ToolFaqProps {
  title?: string;
  items: FaqItem[];
}

export default function ToolFaq({
  title = "Frequently Asked Questions",
  items,
}: ToolFaqProps) {
  return (
    <div className="mt-xl">
      <h2 className="font-h2 text-h2 text-on-surface mb-md">{title}</h2>
      <dl className="space-y-md">
        {items.map((item, index) => (
          <div key={index}>
            <dt className="font-h3 text-h3 text-on-surface mb-xs">
              {item.question}
            </dt>
            <dd className="font-body text-body text-on-surface-variant leading-relaxed">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
