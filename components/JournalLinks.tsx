import Link from "next/link";
import { articles } from "@/lib/journal";

/** Short reading list that links to the journal guides. Pass `exclude` to hide the current article. */
export default function JournalLinks({ exclude, heading = "Further reading" }: { exclude?: string; heading?: string }) {
  const list = articles.filter((a) => a.slug !== exclude);
  if (list.length === 0) return null;
  return (
    <aside className="mt-16 max-w-3xl border-t border-line pt-8" aria-label={heading}>
      <div className="eyebrow mb-3">{heading}</div>
      <ul className="space-y-2 text-sm">
        {list.map((a) => (
          <li key={a.slug}>
            <Link href={`/journal/${a.slug}/`} className="underline underline-offset-4 hover:text-ink/70">{a.title}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
