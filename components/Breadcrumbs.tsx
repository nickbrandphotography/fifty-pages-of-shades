import Link from "next/link";
export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="mb-8 text-xs text-ink/50">
      {items.map((it, i) => (
        <span key={i}>
          {it.href ? <Link href={it.href} className="hover:text-ink">{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length - 1 && <span className="px-2">/</span>}
        </span>
      ))}
    </nav>
  );
}
