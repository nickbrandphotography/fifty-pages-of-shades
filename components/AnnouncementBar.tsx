import Link from "next/link";
import { site } from "@/lib/site";

export default function AnnouncementBar() {
  const n = site.nita;
  return (
    <div className="border-b border-line bg-ink text-paper">
      <div className="mx-auto max-w-content px-5 py-2 text-center text-xs tracking-wide md:px-10">
        Now showing at {n.name}, {n.street}, {n.suburb}, Sydney ·{" "}
        <Link href="/about/exhibitions/" className="underline underline-offset-2">Plan your visit</Link>
      </div>
    </div>
  );
}
