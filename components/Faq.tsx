import JsonLd from "@/components/JsonLd";

export default function Faq({ items, schema = true }: { items: { q: string; a: string }[]; schema?: boolean }) {
  const data = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <div>
      {schema && <JsonLd data={data} />}
      <div className="divide-y divide-line border-y border-line">
        {items.map((i, idx) => (
          <details key={idx} className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-serif text-xl">
              {i.q}<span className="mt-1 text-stone transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">{i.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
