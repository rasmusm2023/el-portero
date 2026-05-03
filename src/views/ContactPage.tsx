"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ReserveInlineSelect } from "@/components/reservation/ReserveInlineSelect";
import { CONTACT_SUBJECT_SLUGS } from "@/data/contactSubjects";
import { CONTACT_FORM_MIN_SUBMIT_MS } from "@/lib/contactAntiSpam";
import type { MessageKey } from "@/i18n/strings";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";

/** Matches the subject field: white panel + light border/shadow (reserve bar style). */
const fieldShellClass =
  "mt-2 rounded-md border border-ink/15 bg-white px-3 py-2.5 shadow-[0_1px_3px_rgba(10,10,10,0.06)] sm:px-4";

const fieldShellErrorClass =
  "border-rose-500/55 shadow-[0_1px_3px_rgba(190,18,60,0.08)] ring-1 ring-rose-500/20";

const fieldControlClass =
  "w-full min-h-11 border-0 bg-transparent font-sans text-sm font-medium text-ink placeholder:text-ink-muted/45 outline-none focus:ring-0 focus-visible:outline-none";

type FieldKey = "name" | "email" | "subject" | "message";

function isValidEmail(value: string): boolean {
  const s = value.trim();
  if (!s) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function validateFields(
  name: string,
  email: string,
  subject: string,
  message: string,
): Partial<Record<FieldKey, MessageKey>> {
  const errors: Partial<Record<FieldKey, MessageKey>> = {};
  if (!name.trim()) {
    errors.name = "page.contact.validationName";
  }
  const em = email.trim();
  if (!em) {
    errors.email = "page.contact.validationEmail";
  } else if (!isValidEmail(em)) {
    errors.email = "page.contact.validationEmailFormat";
  }
  if (!subject) {
    errors.subject = "page.contact.validationSubject";
  }
  if (!message.trim()) {
    errors.message = "page.contact.validationMessage";
  }
  return errors;
}

export function ContactPage() {
  const { locale } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [openMenu, setOpenMenu] = useState<"subject" | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, MessageKey>>>({});
  const [sendSuccess, setSendSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  /** Honeypot: must stay empty (bots often fill it). */
  const [honeypot, setHoneypot] = useState("");
  const [formError, setFormError] = useState<MessageKey | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const formReadyAtRef = useRef<number | null>(null);

  const subjectOptions = useMemo(
    () =>
      CONTACT_SUBJECT_SLUGS.map((slug) => ({
        value: slug,
        label: t(locale, `page.contact.subject.${slug}` as MessageKey),
      })),
    [locale],
  );

  useEffect(() => {
    formReadyAtRef.current = Date.now();
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  function clearFieldError(key: FieldKey) {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setSendSuccess(false);
    setFormError(null);
  }

  function focusFirstError(next: Partial<Record<FieldKey, MessageKey>>) {
    if (next.name) nameRef.current?.focus();
    else if (next.email) emailRef.current?.focus();
    else if (next.subject) {
      document.getElementById("contact-subject")?.focus();
    } else if (next.message) messageRef.current?.focus();
  }

  function encodeFormBody(values: Record<string, string>) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(values)) {
      params.set(k, v);
    }
    return params.toString();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSendSuccess(false);
    setFormError(null);

    if (honeypot.trim() !== "") {
      return;
    }

    const readyAt = formReadyAtRef.current;
    if (
      CONTACT_FORM_MIN_SUBMIT_MS > 0 &&
      readyAt != null &&
      Date.now() - readyAt < CONTACT_FORM_MIN_SUBMIT_MS
    ) {
      setFormError("page.contact.validationTooFast");
      return;
    }

    const next = validateFields(name, email, subject, message);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      focusFirstError(next);
      return;
    }

    const subjectDisplay =
      subjectOptions.find((o) => o.value === subject)?.label ?? subject;
    const emailSubject = `Contact form: ${subjectDisplay} - ${name.trim()}`;

    setSubmitting(true);
    try {
      // Netlify Forms: POST urlencoded body to "/" (Netlify captures it in production).
      // OpenNext on Netlify requires posting to a static HTML file in /public (see public/__forms.html).
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormBody({
          "form-name": "contact",
          name: name.trim(),
          email: email.trim(),
          subject,
          subjectDisplay,
          emailSubject,
          message: message.trim(),
          website: honeypot,
        }),
      });

      if (!res.ok) {
        setFormError("page.contact.errorSendFailed");
        return;
      }

      setSendSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      setSubject("");
      setErrors({});
    } catch {
      setFormError("page.contact.errorSendFailed");
    } finally {
      setSubmitting(false);
    }
  }

  const hasErrors = Object.keys(errors).length > 0;

  function shellClass(key: FieldKey) {
    return [fieldShellClass, errors[key] ? fieldShellErrorClass : ""].filter(Boolean).join(" ");
  }

  return (
    <div className="mx-auto w-full max-w-[var(--container-max)] px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8 lg:pt-16">
      <header className="text-center">
        <h1 className="font-hero-title text-[clamp(2.25rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[0.14em] text-ink uppercase">
          {t(locale, "page.contact.heroTitle")}
        </h1>
        <p className="mx-auto mt-10 max-w-2xl font-sans text-base leading-[1.75] text-ink-muted sm:mt-12 sm:text-lg">
          {t(locale, "page.contact.heroBody")}
        </p>
      </header>

      <section
        aria-labelledby="contact-form-heading"
        className="mx-auto mt-12 max-w-2xl sm:mt-16 md:mt-20"
      >
        <h2 id="contact-form-heading" className="sr-only">
          {t(locale, "page.contact.title")}
        </h2>

        {hasErrors ? (
          <p
            className="mb-6 rounded-md border border-rose-500/35 bg-rose-50/90 px-4 py-3 text-sm text-rose-900"
            role="status"
            aria-live="polite"
          >
            {t(locale, "page.contact.validationSummary")}
          </p>
        ) : null}

        {formError ? (
          <p
            className="mb-6 rounded-md border border-rose-500/35 bg-rose-50/90 px-4 py-3 text-sm text-rose-900"
            role="alert"
            aria-live="assertive"
          >
            {t(locale, formError)}
          </p>
        ) : null}

        {sendSuccess ? (
          <p
            className="mb-6 rounded-md border border-ink/15 bg-paper-dark/50 px-4 py-3 text-sm text-ink"
            role="status"
            aria-live="polite"
          >
            {t(locale, "page.contact.sendSuccess")}
          </p>
        ) : null}

        <form
          className="relative space-y-6"
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="website"
          onSubmit={handleSubmit}
          noValidate
        >
          <input type="hidden" name="form-name" value="contact" />
          <div>
            <label
              htmlFor="contact-name"
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/50"
            >
              {t(locale, "page.contact.labelName")}
            </label>
            <div className={shellClass("name")}>
              <input
                ref={nameRef}
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearFieldError("name");
                }}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                placeholder={t(locale, "page.contact.placeholderName")}
                className={fieldControlClass}
              />
            </div>
            {errors.name ? (
              <p id="contact-name-error" className="mt-2 text-sm text-rose-700">
                {t(locale, errors.name)}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/50"
            >
              {t(locale, "page.contact.labelEmail")}
            </label>
            <div className={shellClass("email")}>
              <input
                ref={emailRef}
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                placeholder={t(locale, "page.contact.placeholderEmail")}
                className={fieldControlClass}
              />
            </div>
            {errors.email ? (
              <p id="contact-email-error" className="mt-2 text-sm text-rose-700">
                {t(locale, errors.email)}
              </p>
            ) : null}
          </div>

          <div className="relative z-20">
            <span
              id="contact-subject-label"
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/50"
            >
              {t(locale, "page.contact.labelSubject")}
            </span>
            <div className={shellClass("subject")}>
              <ReserveInlineSelect
                id="contact-subject"
                name="subject"
                labelId="contact-subject-label"
                value={subject}
                onValueChange={(v) => {
                  setSubject(v);
                  clearFieldError("subject");
                }}
                options={subjectOptions}
                placeholder={t(locale, "page.contact.subjectPlaceholder")}
                isOpen={openMenu === "subject"}
                onOpenToggle={() =>
                  setOpenMenu((m) => (m === "subject" ? null : "subject"))
                }
                onClose={() => setOpenMenu(null)}
                ariaInvalid={Boolean(errors.subject)}
                ariaDescribedBy={
                  errors.subject ? "contact-subject-error" : undefined
                }
              />
            </div>
            {/* Hidden fields for Netlify emails (human-friendly subject and label). */}
            <input
              type="hidden"
              name="subjectDisplay"
              value={subjectOptions.find((o) => o.value === subject)?.label ?? subject}
            />
            <input
              type="hidden"
              name="emailSubject"
              value={`Contact form: ${
                subjectOptions.find((o) => o.value === subject)?.label ?? subject
              } - ${name}`.trim()}
            />
            {/* Focus target when subject invalid — ReserveInlineSelect owns the visible button; we focus via id after mount is complex; use native query */}
            {errors.subject ? (
              <p id="contact-subject-error" className="mt-2 text-sm text-rose-700">
                {t(locale, errors.subject)}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/50"
            >
              {t(locale, "page.contact.labelMessage")}
            </label>
            <div className={shellClass("message")}>
              <textarea
                ref={messageRef}
                id="contact-message"
                name="message"
                rows={6}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  clearFieldError("message");
                }}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
                placeholder={t(locale, "page.contact.placeholderMessage")}
                className={`${fieldControlClass} min-h-[10rem] resize-y leading-relaxed`}
              />
            </div>
            {errors.message ? (
              <p id="contact-message-error" className="mt-2 text-sm text-rose-700">
                {t(locale, errors.message)}
              </p>
            ) : null}
          </div>

          {/* Honeypot: hidden from view; bots often autofill. Leave name unrelated to “email” to reduce heuristics. */}
          <div
            className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0"
            aria-hidden="true"
          >
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="min-h-13 w-full border border-ink bg-ink px-8 font-sans text-[11px] font-semibold tracking-[0.22em] text-paper uppercase transition-colors hover:bg-ink/90 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? t(locale, "page.contact.submitting") : t(locale, "page.contact.submitSoon")}
            </button>
          </div>

          <p className="text-center text-xs leading-relaxed text-ink-muted sm:text-left">
            {t(locale, "page.contact.policyNote")}
          </p>
        </form>
      </section>
    </div>
  );
}
