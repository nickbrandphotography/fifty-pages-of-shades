import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  name?: string; email?: string; message?: string;
  work?: string; size?: string; frame?: string; price?: string;
  type?: string; company?: string;
};

export async function POST(req: Request) {
  let data: Payload;
  try { data = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad-request" }, { status: 400 }); }

  if (!data.name || !data.email) {
    return NextResponse.json({ ok: false, error: "missing-fields" }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO || "hello@bodyscapes.com.au";
  const from = process.env.ENQUIRY_FROM || "50 Pages of Shades <enquiries@bodyscapes.com.au>";

  // No email provider configured yet — tell the client to fall back to mailto.
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "email-not-configured" }, { status: 200 });
  }

  const lines = [
    data.work ? `Work: ${data.work}` : null,
    data.work ? `Size: ${data.size ?? "-"}  |  Frame: ${data.frame ?? "-"}  |  Indicative price: ${data.price ? "$" + data.price : "-"}` : null,
    data.type ? `Enquiry type: ${data.type}` : null,
    data.company ? `Company: ${data.company}` : null,
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    "",
    data.message || "(no message)",
  ].filter(Boolean).join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: data.email,
        subject: data.work ? `Enquiry — ${data.work}` : "Enquiry — 50 Pages of Shades",
        text: lines,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json({ ok: false, error: "send-failed", detail }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "send-error" }, { status: 502 });
  }
}
