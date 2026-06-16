import Link from "next/link";
import type { Block } from "@/lib/journal";

function inline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const href = m[2];
    out.push(
      href.startsWith("/")
        ? <Link key={i++} href={href} className="underline decoration-line underline-offset-4 hover:decoration-ink">{m[1]}</Link>
        : <a key={i++} href={href} className="underline">{m[1]}</a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="max-w-2xl">
      {blocks.map((b, i) => {
        if ("h2" in b) return <h2 key={i} className="mt-10 font-serif text-2xl">{b.h2}</h2>;
        if ("quote" in b) return <blockquote key={i} className="mt-6 border-l-2 border-ink pl-5 font-serif text-xl text-ink/80">{b.quote}</blockquote>;
        return <p key={i} className="mt-5 leading-relaxed text-ink/75">{inline(b.p)}</p>;
      })}
    </div>
  );
}
