import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles, getArticle, formatDate } from "@/lib/journal";
import ArticleBody from "@/components/ArticleBody";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return { title: a.seoTitle, description: a.seoDescription };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const schema = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: a.title,
    description: a.seoDescription, datePublished: a.date, dateModified: a.date, inLanguage: "en-AU",
    author: { "@type": "Person", name: "Nick Brand" },
    publisher: { "@type": "Organization", name: "Fifty Pages of Shades" },
    mainEntityOfPage: `${site.url}/journal/${a.slug}`,
  };
  return (
    <article className="mx-auto max-w-content px-5 py-16 md:px-10">
      <JsonLd data={schema} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal", href: "/journal" }, { label: a.title }]} />
      <div className="text-xs uppercase tracking-widest2 text-stone">{a.silo} · {formatDate(a.date)} · {a.readingMins} min read</div>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">{a.title}</h1>
      <p className="mt-5 max-w-2xl font-serif text-2xl leading-relaxed text-ink/80">{a.dek}</p>
      <div className="mt-10"><ArticleBody blocks={a.body} /></div>

      <div className="mt-14 max-w-2xl border-t border-line pt-6 text-sm text-ink/60">
        <span className="font-serif text-lg text-ink">Nick Brand</span> — Sydney fine-art photographer creating black-and-white
        bodyscapes of the human form, in limited editions. <Link href="/about/" className="underline">About the artist</Link>.
      </div>

      <div className="mt-10 flex max-w-2xl flex-wrap gap-3">
        <Link href="/artworks/" className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink">View Available Works</Link>
        <Link href="/journal/" className="border border-line px-6 py-3 text-xs uppercase tracking-widest2 text-ink/70 transition hover:border-ink hover:text-ink">More from the Journal</Link>
      </div>
    </article>
  );
}
