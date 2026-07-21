/* ════════════════════════════════════════════════════════
   THE JUNGLE WEY — Jungle Tribe registration form

   Field set is reproduced verbatim from the client's official Google
   Form (forms.gle/SvDZicthTz2Dj6av7) — see components/tribe/TribeForm.tsx
   for the exact Spanish labels/options/terms text.

   Submission storage is intentionally NOT wired to a backend yet
   (see docs/INTEGRATIONS.md §3). Once a storage target exists — a
   Google Sheets Apps Script Web App, a small serverless function, etc.
   — only submitTribeForm() below needs to change; the form component
   doesn't need to know how/where the data ends up.
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
 * Storage stub — see file header. Resolves once validated; never
 * rejects, so the UI only needs a success state for now.
 */
export async function submitTribeForm(_data: TribeFormData): Promise<{ ok: true }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ok: true };
}
