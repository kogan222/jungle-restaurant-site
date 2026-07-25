"use client";

import { useState, type ReactNode } from "react";
import { useLanguage, type Lang } from "@/lib/i18n";
import {
  EMPTY_TRIBE_FORM,
  CONTACT_PREFERENCE_OPTIONS,
  validateTribeForm,
  isTribeFormValid,
  submitTribeForm,
  type TribeFormData,
  type ContactPreference,
} from "@/lib/tribe-form";

/* ────────────────────────────────────────────────────────
   Field set, options, and terms are reproduced faithfully from the
   client's official Google Form (forms.gle/SvDZicthTz2Dj6av7) — same
   questions, same options, same meaning. Both languages are
   professionally translated so the form respects the site's language
   toggle; the underlying stored VALUE for contactPreference stays the
   original Spanish option (ContactPreference type) so submissions are
   consistent regardless of which language a visitor filled it in —
   only the on-screen label is translated.
──────────────────────────────────────────────────────── */
const FORM_DESCRIPTION: Record<Lang, string> = {
  en: "Be part of our community and get your official wristband. To apply for this benefit, you need a valid address in Mahahual. You'll get access to benefits, special events, and exclusive experiences.",
  es: "Forma parte de nuestra comunidad y recibe tu pulsera oficial. Para aplicar para este beneficio, tienes que tener una dirección válida en Mahahual. Tendrás acceso a beneficios, eventos especiales y experiencias exclusivas.",
};

const FIELD_LABELS: Record<Lang, {
  fullName: string; birthday: string; phone: string; email: string;
  instagram: string; address: string; contactPreference: string; aboutJungleWey: string;
  phonePlaceholder: string; instagramPlaceholder: string;
}> = {
  en: {
    fullName: "Full name",
    birthday: "Date of birth",
    phone: "Phone",
    email: "Email",
    instagram: "Instagram",
    address: "Address",
    contactPreference: "How do you prefer to receive news, events, and benefits?",
    aboutJungleWey: "What does The Jungle Wey mean to you?",
    phonePlaceholder: "+52 983 000 0000",
    instagramPlaceholder: "@yourusername",
  },
  es: {
    fullName: "Nombre completo",
    birthday: "Fecha de cumpleaños",
    phone: "Teléfono",
    email: "Correo electrónico",
    instagram: "Instagram",
    address: "Dirección",
    contactPreference: "¿Cómo prefieres recibir noticias, eventos y beneficios?",
    aboutJungleWey: "¿Qué es The Jungle Wey para ti?",
    phonePlaceholder: "+52 983 000 0000",
    instagramPlaceholder: "@tuusuario",
  },
};

const CONTACT_PREFERENCE_LABELS: Record<Lang, Record<ContactPreference, string>> = {
  en: {
    Whatsapp: "WhatsApp",
    Email: "Email",
    Instagram: "Instagram",
    "Todas las anteriores": "All of the above",
  },
  es: {
    Whatsapp: "WhatsApp",
    Email: "Email",
    Instagram: "Instagram",
    "Todas las anteriores": "Todas las anteriores",
  },
};

const TERMS: Record<Lang, {
  title: string; intro: string; items: string[]; privacy: string; checkboxLabel: string;
}> = {
  en: {
    title: "Confirmation",
    intro: "By registering and receiving your wristband, you confirm that you're part of the Jungle Tribe and accept the following conditions:",
    items: [
      "Your wristband gives you a 10% discount on your bill",
      "This benefit is personal and non-transferable",
      "It cannot be combined with other promotions",
      "The wristband must be shown when ordering",
      "It does not apply to special events or experiences",
      "The benefit is valid for 1 year from the date it's issued",
    ],
    privacy: "You also agree that the information provided will be used exclusively by Jungle Wey to send information, invitations, benefits, and communications related to the Jungle Tribe. Your data will not be shared with third parties.",
    checkboxLabel: "I have read and accept the conditions",
  },
  es: {
    title: "Confirmación",
    intro: "Al registrarte y recibir tu pulsera, confirmas que formas parte de la Tribu Jungle Wey y aceptas las siguientes condiciones:",
    items: [
      "Tu pulsera te otorga un 10% de descuento en tu consumo",
      "Este beneficio es personal e intransferible",
      "No es acumulable con otras promociones",
      "La pulsera debe presentarse al ordenar",
      "No aplica en eventos o experiencias especiales",
      "La vigencia del beneficio es de 1 año a partir de su entrega",
    ],
    privacy: "Asimismo, aceptas que la información proporcionada será utilizada exclusivamente por Jungle Wey para el envío de información, invitaciones, beneficios y comunicaciones relacionadas con la Tribu Jungle Wey. Tus datos no serán compartidos con terceros.",
    checkboxLabel: "He leído y acepto las condiciones",
  },
};

function fieldStyle(hasError: boolean) {
  return {
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${hasError ? "rgba(240,78,48,0.6)" : "rgba(255,255,255,0.12)"}`,
    color: "white",
  } as const;
}

function Label({ children }: { children: ReactNode }) {
  return (
    <label className="block text-white/80 text-sm font-medium mb-2">
      {children}
      <span style={{ color: "#f04e30" }}> *</span>
    </label>
  );
}

function FieldError({ children }: { children: ReactNode }) {
  return <p className="text-xs mt-1.5" style={{ color: "#f56a4a" }}>{children}</p>;
}

export default function TribeForm() {
  const { t, lang } = useLanguage();
  const fl = FIELD_LABELS[lang];
  const terms = TERMS[lang];
  const [data, setData] = useState<TribeFormData>(EMPTY_TRIBE_FORM);
  const [touched, setTouched] = useState<Partial<Record<keyof TribeFormData, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const errors = validateTribeForm(data);
  const showError = (field: keyof TribeFormData) => (touched[field] || submitAttempted) && errors[field];
  const touch = (field: keyof TribeFormData) => setTouched((prev) => ({ ...prev, [field]: true }));
  const set = <K extends keyof TribeFormData>(key: K, value: TribeFormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!isTribeFormValid(errors)) return;
    setStatus("submitting");
    const res = await submitTribeForm(data);
    setStatus(res.ok ? "success" : "idle");
  };

  if (status === "success") {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{ background: "linear-gradient(135deg, #1D3927, #0e2216)", border: "1px solid rgba(206,139,77,0.25)" }}
      >
        <span className="text-4xl" aria-hidden="true">🌿</span>
        <h2 className="font-display text-3xl text-white mt-3 mb-2">{t.tribe.successTitle}</h2>
        <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">{t.tribe.successBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl p-6 md:p-10"
      style={{
        background: "linear-gradient(135deg, rgba(14,34,22,0.95), rgba(29,57,39,0.85))",
        border: "1px solid rgba(206,139,77,0.2)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}
    >
      <p
        className="text-white/55 text-sm leading-relaxed mb-8 pb-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        {FORM_DESCRIPTION[lang]}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
        <div>
          <Label>{fl.fullName}</Label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            onBlur={() => touch("fullName")}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            style={fieldStyle(!!showError("fullName"))}
          />
          {showError("fullName") && <FieldError>{t.tribe.errorRequired}</FieldError>}
        </div>

        <div>
          <Label>{fl.birthday}</Label>
          <input
            type="date"
            value={data.birthday}
            onChange={(e) => set("birthday", e.target.value)}
            onBlur={() => touch("birthday")}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            style={{ ...fieldStyle(!!showError("birthday")), colorScheme: "dark" }}
          />
          {showError("birthday") && <FieldError>{t.tribe.errorRequired}</FieldError>}
        </div>

        <div>
          <Label>{fl.phone}</Label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => set("phone", e.target.value)}
            onBlur={() => touch("phone")}
            placeholder={fl.phonePlaceholder}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/25"
            style={fieldStyle(!!showError("phone"))}
          />
          {showError("phone") && <FieldError>{t.tribe.errorPhone}</FieldError>}
        </div>

        <div>
          <Label>{fl.email}</Label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => touch("email")}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            style={fieldStyle(!!showError("email"))}
          />
          {showError("email") && <FieldError>{t.tribe.errorEmail}</FieldError>}
        </div>

        <div>
          <Label>{fl.instagram}</Label>
          <input
            type="text"
            value={data.instagram}
            onChange={(e) => set("instagram", e.target.value)}
            onBlur={() => touch("instagram")}
            placeholder={fl.instagramPlaceholder}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/25"
            style={fieldStyle(!!showError("instagram"))}
          />
          {showError("instagram") && <FieldError>{t.tribe.errorRequired}</FieldError>}
        </div>

        <div>
          <Label>{fl.address}</Label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => set("address", e.target.value)}
            onBlur={() => touch("address")}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            style={fieldStyle(!!showError("address"))}
          />
          {showError("address") && <FieldError>{t.tribe.errorRequired}</FieldError>}
        </div>
      </div>

      {/* Contact preference */}
      <div className="mt-6">
        <Label>{fl.contactPreference}</Label>
        <div className="flex flex-wrap gap-3" role="radiogroup">
          {CONTACT_PREFERENCE_OPTIONS.map((opt) => {
            const checked = data.contactPreference === opt;
            return (
              <label
                key={opt}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm cursor-pointer transition-colors"
                style={{
                  background: checked ? "rgba(240,78,48,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${checked ? "#f04e30" : "rgba(255,255,255,0.12)"}`,
                  color: checked ? "white" : "rgba(255,255,255,0.65)",
                }}
              >
                <input
                  type="radio"
                  name="contactPreference"
                  value={opt}
                  checked={checked}
                  onChange={() => { set("contactPreference", opt); touch("contactPreference"); }}
                  className="sr-only"
                />
                {CONTACT_PREFERENCE_LABELS[lang][opt]}
              </label>
            );
          })}
        </div>
        {showError("contactPreference") && <FieldError>{t.tribe.errorRequired}</FieldError>}
      </div>

      {/* Open question */}
      <div className="mt-6">
        <Label>{fl.aboutJungleWey}</Label>
        <textarea
          value={data.aboutJungleWey}
          onChange={(e) => set("aboutJungleWey", e.target.value)}
          onBlur={() => touch("aboutJungleWey")}
          rows={3}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
          style={fieldStyle(!!showError("aboutJungleWey"))}
        />
        {showError("aboutJungleWey") && <FieldError>{t.tribe.errorRequired}</FieldError>}
      </div>

      {/* Confirmación — terms */}
      <div className="mt-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <h3 className="font-display text-2xl text-white mb-3">{terms.title}</h3>
        <p className="text-white/55 text-sm leading-relaxed mb-3">{terms.intro}</p>
        <ul className="mb-4 space-y-1.5">
          {terms.items.map((item) => (
            <li key={item} className="flex gap-2 text-white/50 text-sm leading-relaxed">
              <span style={{ color: "#ce8b4d" }} aria-hidden="true">•</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-white/40 text-xs leading-relaxed mb-6">{terms.privacy}</p>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.acceptedTerms}
            onChange={(e) => { set("acceptedTerms", e.target.checked); touch("acceptedTerms"); }}
            className="mt-0.5 w-5 h-5 flex-shrink-0 rounded"
            style={{ accentColor: "#f04e30" }}
          />
          <span className="text-white/75 text-sm">{terms.checkboxLabel}</span>
        </label>
        {showError("acceptedTerms") && <FieldError>{t.tribe.errorTerms}</FieldError>}
      </div>

      {/* Submit */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-2.5 text-white font-semibold text-sm px-10 py-3.5 rounded-full transition-transform duration-200 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
          style={{ background: "linear-gradient(135deg, #f04e30, #d43e22)", boxShadow: "0 6px 24px rgba(240,78,48,0.35)" }}
        >
          {status === "submitting" ? t.tribe.submitting : t.tribe.submit}
        </button>
        {submitAttempted && !isTribeFormValid(errors) && (
          <p className="text-xs text-center" style={{ color: "#f56a4a" }}>{t.tribe.errorFormIncomplete}</p>
        )}
      </div>
    </form>
  );
}
