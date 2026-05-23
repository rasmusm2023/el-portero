"use client";

import { Plus, X } from "lucide-react";
import { adminBtnNeutral } from "@/lib/adminUiStyles";
import type { EditableMenuItem, EditableMenuKind } from "@/lib/editableMenuTypes";
import { t, type Locale } from "@/i18n/strings";
import type { DietaryTagOption } from "@/lib/dietaryTags";
import { ALLERGEN_OPTIONS } from "@/lib/menuAllergens";
import type { DietaryTagId } from "@/lib/dietaryTags";
import type { AllergenId } from "@/lib/menuAllergens";

const fieldClass =
  "mt-2 w-full rounded-none border border-paper/15 bg-paper/8 px-3 py-2 text-paper shadow-sm placeholder:text-paper/40 focus:border-gold/45 focus:outline-none focus:ring-1 focus:ring-gold/20";

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
        <label className="block text-sm font-medium text-paper">
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
        <label className="block text-sm font-medium text-paper">
          {t(locale, "admin.menus.nameExtensionLabel")}{" "}
          <span className="font-normal text-paper/50">{t(locale, "admin.menus.optional")}</span>
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
        <label className="block text-sm font-medium text-paper">
          {t(locale, "admin.menus.descriptionLabel")}
        </label>
        <textarea
          value={item.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className={fieldClass}
          disabled={busy}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-paper">
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
          <p className="mt-1 text-[11px] leading-snug text-paper/45">
            {t(locale, "admin.menus.priceHiddenNote")}
          </p>
        ) : null}
      </div>
      {priceOptionsEnabled ? (
        <div className="sm:col-span-2">
          <p className="block text-sm font-medium text-paper">
            {t(locale, "admin.menus.sizeVariantsTitle")}
          </p>
          <p className="mt-0.5 text-xs text-paper/55">{t(locale, "admin.menus.sizeVariantsHint")}</p>
          {item.priceOptions.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {item.priceOptions.map((opt, pi) => (
                <li key={pi} className="flex flex-wrap items-center gap-2">
                  <input
                    value={opt.label}
                    onChange={(e) => onUpdatePriceOption(pi, "label", e.target.value)}
                    placeholder={t(locale, "admin.menus.sizeLabelPlaceholder")}
                    className="min-w-0 flex-1 rounded-none border border-paper/15 bg-paper/8 px-3 py-1.5 text-sm text-paper shadow-sm focus:border-gold/45 focus:outline-none focus:ring-1 focus:ring-gold/20"
                    disabled={busy}
                  />
                  <input
                    value={opt.price}
                    onChange={(e) => onUpdatePriceOption(pi, "price", e.target.value)}
                    placeholder={t(locale, "admin.menus.priceFieldPlaceholder")}
                    className="w-24 rounded-none border border-paper/15 bg-paper/8 px-3 py-1.5 text-sm text-paper shadow-sm focus:border-gold/45 focus:outline-none focus:ring-1 focus:ring-gold/20"
                    disabled={busy}
                  />
                  <button
                    type="button"
                    aria-label={t(locale, "admin.menus.removeVariantAria").replace("{n}", String(pi + 1))}
                    onClick={() => onRemovePriceOption(pi)}
                    className={`inline-flex items-center gap-1.5 ${adminBtnNeutral}`}
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
            className={`mt-3 inline-flex items-center gap-2 ${adminBtnNeutral}`}
            onClick={onAddPriceOption}
            disabled={busy}
          >
            <Plus className="size-3.5" aria-hidden />
            {t(locale, "admin.menus.addSize")}
          </button>
        </div>
      ) : null}
      <div className="sm:col-span-2">
        <p className="block text-sm font-medium text-paper">{t(locale, "admin.menus.dietaryTagsTitle")}</p>
        <p className="mt-0.5 text-xs text-paper/55">
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
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-2 text-left text-xs font-semibold tracking-[0.06em] uppercase transition-colors",
                  selected
                    ? opt.pillClass
                    : "border-dashed border-paper/20 bg-paper/5 text-paper/45 hover:border-paper/35 hover:bg-paper/10 hover:text-paper/75",
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
          <p className="block text-sm font-medium text-paper">{t(locale, "admin.menus.allergensTitle")}</p>
          <p className="mt-0.5 text-xs text-paper/55">{t(locale, "admin.menus.allergensHint")}</p>
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
                    "inline-flex items-center gap-2 rounded-full border px-2 py-1 text-left text-xs font-semibold tracking-[0.06em] transition-colors",
                    selected
                      ? "border-amber-400/40 bg-amber-950/40 text-amber-100"
                      : "border-dashed border-paper/20 bg-paper/5 text-paper/45 hover:border-paper/35 hover:bg-paper/10 hover:text-paper/75",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className={[
                      "inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] tabular-nums leading-none",
                      selected
                        ? "border-amber-300/50 bg-amber-900/70 text-amber-100"
                        : "border-paper/25 bg-paper/8 text-paper/65",
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
