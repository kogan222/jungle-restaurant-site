import { NextResponse } from "next/server";
import {
  CONTACT_PREFERENCE_OPTIONS,
  isTribeFormValid,
  validateTribeForm,
  type TribeFormData,
} from "@/lib/tribe-form";

/*
  Jungle Tribe registration — server-only, emails every submission to the
  restaurant via Resend (https://resend.com).

  Required env vars (set in Vercel, never in source):
    RESEND_API_KEY   — Resend API key
    TRIBE_NOTIFY_TO  — inbox that receives the registrations
  Optional:
    TRIBE_FROM       — sender, e.g. "The Jungle Wey <tribe@thejunglewey.com>"
                       (must be a verified Resend domain; defaults to the
                       Resend sandbox sender, which only delivers to the
                       Resend account owner's own address)

  If anything is missing or Resend fails, this returns an error status —
  the form then shows an error instead of a fake "welcome", so a
  registration is never silently lost.
*/

export const dynamic = "force-dynamic";

const FETCH_TIMEOUT_MS = 8000;
const MAX_FIELD = 300;
const MAX_LONG = 2000;

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot — real visitors never see or fill this field. Pretend success.
  if (str(body.website, 100)) {
    return NextResponse.json({ ok: true });
  }

  const pref = str(body.contactPreference, 50);
  const data: TribeFormData = {
    fullName: str(body.fullName, MAX_FIELD),
    birthday: str(body.birthday, 20),
    phone: str(body.phone, 40),
    email: str(body.email, MAX_FIELD),
    instagram: str(body.instagram, MAX_FIELD),
    address: str(body.address, MAX_FIELD),
    contactPreference: (CONTACT_PREFERENCE_OPTIONS as string[]).includes(pref)
      ? (pref as TribeFormData["contactPreference"])
      : "",
    aboutJungleWey: str(body.aboutJungleWey, MAX_LONG),
    acceptedTerms: body.acceptedTerms === true,
  };

  if (!isTribeFormValid(validateTribeForm(data))) {
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.TRIBE_NOTIFY_TO;
  const from = process.env.TRIBE_FROM || "The Jungle Wey <onboarding@resend.dev>";
  if (!apiKey || !to) {
    console.error(
      `[tribe-register] not configured — RESEND_API_KEY ${apiKey ? "set" : "MISSING"}, TRIBE_NOTIFY_TO ${to ? "set" : "MISSING"}`
    );
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const rows: [string, string][] = [
    ["Nombre completo", data.fullName],
    ["Fecha de cumpleaños", data.birthday],
    ["Teléfono", data.phone],
    ["Correo electrónico", data.email],
    ["Instagram", data.instagram],
    ["Dirección", data.address],
    ["Preferencia de contacto", data.contactPreference],
    ["¿Qué es The Jungle Wey para ti?", data.aboutJungleWey],
    ["Aceptó las condiciones", "Sí"],
  ];

  const html =
    `<h2>Nueva registro — Jungle Tribe 🌿</h2>` +
    `<table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="border:1px solid #ddd;font-weight:bold;vertical-align:top">${esc(k)}</td>` +
          `<td style="border:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`
      )
      .join("") +
    `</table>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const subjectName = data.fullName.replace(/[\r\n]+/g, " ").slice(0, 80);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `Jungle Tribe — ${subjectName}`,
        html,
        text,
      }),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      const detail = (await res.text().catch(() => "")).slice(0, 300);
      throw new Error(`Resend responded ${res.status}: ${detail}`);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[tribe-register] email failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
