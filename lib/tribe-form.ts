/* ════════════════════════════════════════════════════════
   THE JUNGLE WEY — Jungle Tribe registration form

   Field set is reproduced verbatim from the client's official Google
   Form (forms.gle/SvDZicthTz2Dj6av7) — see components/tribe/TribeForm.tsx
   for the exact Spanish labels/options/terms text.

   Submissions are emailed to the restaurant by app/api/tribe-register
   (Resend; env vars RESEND_API_KEY, TRIBE_NOTIFY_TO, optional
   TRIBE_FROM). To change where data goes, only that route changes.
════════════════════════════════════════════════════════ */

export type ContactPreference = "Whatsapp" | "Email" | "Instagram" | "Todas las anteriores";

export const CONTACT_PREFERENCE_OPTIONS: ContactPreference[] = [
  "Whatsapp",
  "Email",
  "Instagram",
  "Todas las anteriores",
];

export type TribeFormData = {
  fullName: string;
  birthday: string;
  phone: string;
  email: string;
  instagram: string;
  address: string;
  contactPreference: ContactPreference | "";
  aboutJungleWey: string;
  acceptedTerms: boolean;
};

export const EMPTY_TRIBE_FORM: TribeFormData = {
  fullName: "",
  birthday: "",
  phone: "",
  email: "",
  instagram: "",
  address: "",
  contactPreference: "",
  aboutJungleWey: "",
  acceptedTerms: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type TribeFormErrors = Partial<Record<keyof TribeFormData, boolean>>;

/** true = field currently invalid. No message strings here — the form
    component maps each flag to localized copy. */
export function validateTribeForm(data: TribeFormData): TribeFormErrors {
  return {
    fullName: data.fullName.trim().length < 2,
    birthday: data.birthday.trim() === "",
    phone: data.phone.replace(/\D/g, "").length < 7,
    email: !EMAIL_RE.test(data.email.trim()),
    instagram: data.instagram.trim().length < 2,
    address: data.address.trim().length < 3,
    contactPreference: data.contactPreference === "",
    aboutJungleWey: data.aboutJungleWey.trim().length < 3,
    acceptedTerms: !data.acceptedTerms,
  };
}

export function isTribeFormValid(errors: TribeFormErrors): boolean {
  return !Object.values(errors).some(Boolean);
}

/**
 * Sends the registration to /api/tribe-register (emails the restaurant).
 * Never rejects — resolves { ok: false } on any failure so the UI can show
 * an error instead of a false "welcome". `website` is the honeypot value.
 */
export async function submitTribeForm(
  data: TribeFormData,
  website = ""
): Promise<{ ok: boolean }> {
  try {
    const res = await fetch("/api/tribe-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, website }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
