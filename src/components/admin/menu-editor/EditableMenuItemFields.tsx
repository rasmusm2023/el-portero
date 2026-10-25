"use client";

import { Plus, X } from "lucide-react";
import { deskField, deskHint, deskLabel } from "@/components/admin/events/EventsDesk";
import type { EditableMenuItem, EditableMenuKind } from "@/lib/editableMenuTypes";
import { t, type Locale } from "@/i18n/strings";
import type { DietaryTagOption } from "@/lib/dietaryTags";
import { ALLERGEN_OPTIONS } from "@/lib/menuAllergens";
import type { DietaryTagId } from "@/lib/dietaryTags";
import type { AllergenId } from "@/lib/menuAllergens";

const fieldClass = deskField;

/** Solid fills — the public pill styles are tuned for a dark menu and disappear on this light desk. */
const adminDietaryActive: Record<string, string> = {
  alcoholFree: "border-violet-700 bg-violet-600 text-white shadow-sm",
  vegan: "border-emerald-700 bg-emerald-600 text-white shadow-sm",
  vegetarian: "border-lime-800 bg-lime-600 text-white shadow-sm",
  glutenFree: "border-amber-700 bg-amber-400 text-amber-950 shadow-sm",
  lactoseFree: "border-sky-700 bg-sky-600 text-white shadow-sm",
};
const inlineField =
  "h-10 min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";
const areaClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

type Props = {
  locale: Locale;
  tab: EditableMenuKind;
  item: EditableMenuItem;
  busy: boolean;
  priceOptionsEnabled: boolean;
  allergensEnabled: boolean;
  dietaryTagOptions: DietaryTagOption[];
  onNameChange: (value: string) => void;
  onNameExtensionChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onToggleDietaryTag: (id: DietaryTagId) => void;
  onToggleAllergen: (id: AllergenId) => void;
  onAddPriceOption: () => void;
  onUpdatePriceOption: (pi: number, field: "label" | "price", value: string) => void;
  onRemovePriceOption: (pi: number) => void;
};

export function EditableMenuItemFields({
  locale,
  tab,
  item,
  busy,
  priceOptionsEnabled,
  allergensEnabled,
  dietaryTagOptions,
  onNameChange,
  onNameExtensionChange,
  onDescriptionChange,
  onPriceChange,
  onToggleDietaryTag,
  onToggleAllergen,
  onAddPriceOption,
  onUpdatePriceOption,
  onRemovePriceOption,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={deskLabel}>
          {t(locale, "admin.menus.nameLabel")}
        </label>
        <input
          value={item.name}
          onChange={(e) => onNameChange(e.target.value)}
          className={fieldClass}
          disabled={busy}
        />
      </div>
      <div className="sm:col-span-2">
        <label className={deskLabel}>
          {t(locale, "admin.menus.nameExtensionLabel")}{" "}
          <span className="font-normal text-slate-400">{t(locale, "admin.menus.optional")}</span>
        </label>
        <input
          value={item.nameExtension}
          onChange={(e) => onNameExtensionChange(e.target.value)}
          placeholder={t(locale, "admin.menus.nameExtensionPlaceholder")}
          className={fieldClass}
          disabled={busy}
        />
      </div>
      <div className="sm:col-span-2">
        <label className={deskLabel}>
          {t(locale, "admin.menus.descriptionLabel")}
        </label>
        <textarea
          value={item.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className={areaClass}
          disabled={busy}
        />
      </div>
      <div>
        <label className={deskLabel}>
          {t(locale, "admin.menus.priceLabel")}
        </label>
        <input
          value={item.price}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder={
            priceOptionsEnabled && item.priceOptions.length > 0
              ? t(locale, "admin.menus.priceHiddenPlaceholder")
              : t(locale, "admin.menus.priceExamplePlaceholder")
          }
          className={fieldClass}
          disabled={busy}
        />
        {priceOptionsEnabled && item.priceOptions.length > 0 ? (
          <p className={`mt-2 ${deskHint}`}>
            {t(locale, "admin.menus.priceHiddenNote")}
          </p>
        ) : null}
      </div>
      {priceOptionsEnabled ? (
        <div className="sm:col-span-2">
          <p className={deskLabel}>
            {t(locale, "admin.menus.sizeVariantsTitle")}
          </p>
          <p className={`mt-1 ${deskHint}`}>{t(locale, "admin.menus.sizeVariantsHint")}</p>
          {item.priceOptions.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {item.priceOptions.map((opt, pi) => (
                <li key={pi} className="flex flex-wrap items-center gap-2">
                  <input
                    value={opt.label}
                    onChange={(e) => onUpdatePriceOption(pi, "label", e.target.value)}
                    placeholder={t(locale, "admin.menus.sizeLabelPlaceholder")}
                    className={`${inlineField} flex-1`}
                    disabled={busy}
                  />
                  <input
                    value={opt.price}
                    onChange={(e) => onUpdatePriceOption(pi, "price", e.target.value)}
                    placeholder={t(locale, "admin.menus.priceFieldPlaceholder")}
                    className={`${inlineField} w-28 shrink-0`}
                    disabled={busy}
                  />
                  <button
                    type="button"
                    aria-label={t(locale, "admin.menus.removeVariantAria").replace("{n}", String(pi + 1))}
                    onClick={() => onRemovePriceOption(pi)}
                    className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={busy}
                  >
                    <X className="size-3.5" aria-hidden />
                    {t(locale, "admin.menus.removeVariant")}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <button
            type="button"
            className="mt-3 inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onAddPriceOption}
            disabled={busy}
          >
            <Plus className="size-3.5" aria-hidden />
            {t(locale, "admin.menus.addSize")}
          </button>
        </div>
      ) : null}
      <div className="sm:col-span-2">
        <p className={deskLabel}>{t(locale, "admin.menus.dietaryTagsTitle")}</p>
        <p className={`mt-1 ${deskHint}`}>
          {tab === "drinks"
            ? t(locale, "admin.menus.dietaryHintDrinks")
            : t(locale, "admin.menus.dietaryHintFood")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {dietaryTagOptions.map((opt) => {
            const selected = item.dietaryTagIds.includes(opt.id);
            const Icon = opt.Icon;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={busy}
                aria-pressed={selected}
                onClick={() => onToggleDietaryTag(opt.id)}
                className={[
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-left text-xs font-medium transition-colors disabled:cursor-not-allowed",
                  selected
                    ? adminDietaryActive[opt.id]
                    : "border-dashed border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-800",
                ].join(" ")}
              >
                <Icon className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
      {allergensEnabled ? (
        <div className="sm:col-span-2">
          <p className={deskLabel}>{t(locale, "admin.menus.allergensTitle")}</p>
          <p className={`mt-1 ${deskHint}`}>{t(locale, "admin.menus.allergensHint")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ALLERGEN_OPTIONS.map((opt) => {
              const selected = item.allergenIds.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={busy}
                  aria-pressed={selected}
                  title={`${opt.number}. ${opt.name}`}
                  onClick={() => onToggleAllergen(opt.id)}
                  className={[
                    "inline-flex cursor-pointer items-center gap-2 rounded-full border px-2 py-1 text-left text-xs font-medium transition-colors disabled:cursor-not-allowed",
                    selected
                      ? "border-amber-300 bg-amber-50 text-amber-900"
                      : "border-dashed border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-700",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className={[
                      "inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] tabular-nums leading-none",
                      selected
                        ? "border-amber-300 bg-amber-100 text-amber-900"
                        : "border-slate-300 bg-white text-slate-600",
                    ].join(" ")}
                  >
                    {opt.number}
                  </span>
                  <span className="pr-1 normal-case tracking-normal">{opt.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
