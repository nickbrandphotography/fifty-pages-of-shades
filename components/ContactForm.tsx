"use client";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

type Ctx = { work?: string; size?: string; frame?: string; price?: string };
type State = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [ctx, setCtx] = useState<Ctx>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setCtx({ work: p.get("work") || undefined, size: p.get("size") || undefined,
      frame: p.get("frame") || undefined, price: p.get("price") || undefined });
  }, []);

  const mailto = () => {
    const subject = ctx.work ? `Enquiry — ${ctx.work}` : "Enquiry — Bodyscapes";
    const body =
      (ctx.work ? `Work: ${ctx.work}\nSize: ${ctx.size}\nFrame: ${ctx.frame}\nIndicative price: ${ctx.price ? "$" + ctx.price : "-"}\n\n` : "") +
      `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, ...ctx }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) { setState("sent"); return; }
      // Provider not configured (or failed) — fall back to the user's mail client.
      mailto(); setState("idle");
    } catch {
      mailto(); setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div className="max-w-xl border border-line bg-ink/[0.03] p-8">
        <div className="eyebrow mb-2">Thank you</div>
        <p className="font-serif text-2xl">Your enquiry is with the studio.</p>
        <p className="mt-2 text-sm text-ink/60">We reply personally, usually within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-xl">
      {ctx.work && (
        <div className="mb-6 border border-line bg-ink/[0.03] p-4 text-sm">
          <div className="eyebrow mb-1">Your selection</div>
          {ctx.work} · {ctx.size} · {ctx.frame} {ctx.price && <>· ${ctx.price}</>}
        </div>
      )}
      <label className="mb-4 block">
        <span className="mb-1 block text-sm text-ink/60">Name</span>
        <input required value={name} onChange={(e) => setName(e.target.value)}
          className="w-full border border-line bg-paper px-3 py-3 outline-none focus:border-ink" />
      </label>
      <label className="mb-4 block">
        <span className="mb-1 block text-sm text-ink/60">Email</span>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-line bg-paper px-3 py-3 outline-none focus:border-ink" />
      </label>
      <label className="mb-6 block">
        <span className="mb-1 block text-sm text-ink/60">Message</span>
        <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your space, or anything you'd like to know."
          className="w-full border border-line bg-paper px-3 py-3 outline-none focus:border-ink" />
      </label>
      <button type="submit" disabled={state === "sending"}
        className="w-full border border-ink bg-ink px-6 py-4 text-xs uppercase tracking-widest2 text-paper transition hover:bg-transparent hover:text-ink disabled:opacity-50">
        {state === "sending" ? "Sending…" : "Send enquiry"}
      </button>
      <p className="mt-3 text-xs text-ink/45">No pressure, no sales scripts. Your details are never shared.</p>
    </form>
  );
}
