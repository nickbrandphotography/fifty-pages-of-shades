export function Lede({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 max-w-2xl font-serif text-2xl leading-relaxed text-ink/85">{children}</p>;
}
export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 max-w-2xl">
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-3 space-y-4 text-ink/65">{children}</div>
    </section>
  );
}
