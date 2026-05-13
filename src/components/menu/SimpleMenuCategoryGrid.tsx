"use client";

import type { DietaryTagId } from "@/lib/dietaryTags";
import type { AllergenId } from "@/lib/menuAllergens";
import type { EditableMenuPriceOption } from "@/lib/editableMenuTypes";
import { DietaryTagPills } from "@/components/menu/DietaryTagPills";
import { AllergenBadges } from "@/components/menu/AllergenBadges";
import { MenuPriceDisclaimer } from "@/components/menu/MenuPriceDisclaimer";

/**
 * Single-language menu display (admin-authored copy shown for every locale).
 */
export type SimpleMenuCategory = {
  title: string;
  items: {
    name: string;
    /** Same styling as name, smaller; omit when blank. */
    nameExtension: string;
    description: string;
    price: string;
    /** Sized variants (drinks). When non-empty these override the single price. */
    priceOptions: EditableMenuPriceOption[];
    dietaryTagIds: DietaryTagId[];
    allergenIds: AllergenId[];
  }[];
};

type Props = {
  categories: SimpleMenuCategory[];
};

/**
 * Section heading: Courier Prime bold, 2% tracking, brushed-metallic vertical gradient.
 * Sizes deliberately set the rest of the menu typographic scale (kept at ~2:1 ratios):
 *   section  ≈ 2× dish name   (36 / 48 → dish 18 / 24)
 *   dish     ≈ 2× description (18 / 24 → desc 11 / 12)
 *   price    sits between dish and description (14 / 16)
 */
const sectionTitleClass = [
  "font-menu-type text-4xl font-bold tracking-[0.02em] sm:text-5xl",
  "bg-[linear-gradient(180deg,#f5f4ee_0%,#e3e1d8_45%,#a9a8a2_72%,#6e6c66_100%)]",
  "bg-clip-text text-transparent",
].join(" ");

/** Dish name: Courier Prime regular, all caps, half the section size, horizontal silver gradient. */
const dishNameClass = [
  "font-menu-type text-lg font-normal uppercase tracking-normal leading-tight sm:text-2xl",
  "bg-[linear-gradient(90deg,#ffffff_0%,#c0c0c0_100%)]",
  "bg-clip-text text-transparent",
].join(" ");

/** Optional line after the main name — same face/gradient/caps, one step smaller. */
const dishNameExtensionClass = [
  "font-menu-type text-sm font-normal uppercase tracking-normal leading-tight sm:text-lg",
  "bg-[linear-gradient(90deg,#ffffff_0%,#c0c0c0_100%)]",
  "bg-clip-text text-transparent",
].join(" ");

/** Description: Courier Prime regular, mid-grey, ~half the dish size. */
const dishDescriptionClass =
  "mt-1.5 font-menu-type text-[11px] font-normal tracking-normal leading-relaxed text-[#989898] sm:text-xs";

/** Price: Figtree semibold, between dish & description sizes, pure white. */
const dishPriceClass =
  "font-menu-price text-sm font-semibold tracking-normal text-white tabular-nums sm:text-base";

/** Label paired with a sized price ("Small", "33cl"). Muted, typewriter face. */
const priceLabelClass =
  "font-menu-type text-[10px] font-normal uppercase tracking-[0.1em] text-paper/55 sm:text-[11px]";

export function SimpleMenuCategoryGrid({ categories }: Props) {
  return (
    <div className="flex flex-col gap-14">
      <MenuPriceDisclaimer className="-mb-10" />
      {categories.map((cat, idx) => (
        <section key={`${cat.title}-${idx}`}>
          <header className="pb-2">
            <h2 className={sectionTitleClass}>{cat.title}</h2>
          </header>
          <ul className="mt-4 divide-y divide-dashed divide-paper/12">
            {cat.items.map((item, j) => (
              <li
                key={`${item.name}-${j}`}
                className="flex justify-between gap-6 py-3.5 first:pt-3.5 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className={dishNameClass}>{item.name}</span>
                    {item.nameExtension?.trim() ? (
                      <span className={dishNameExtensionClass}>
                        {item.nameExtension.trim()}
                      </span>
                    ) : null}
                  </p>
                  {item.description ? (
                    <p className={dishDescriptionClass}>{item.description}</p>
                  ) : null}
                  <DietaryTagPills ids={item.dietaryTagIds} />
                  <AllergenBadges ids={item.allergenIds} />
                </div>
                {item.priceOptions.length > 0 ? (
                  <ul className="flex shrink-0 flex-col items-end gap-0.5 self-start">
                    {item.priceOptions.map((opt, k) => (
                      <li
                        key={`${opt.label}-${k}`}
                        className="flex items-baseline gap-2.5"
                      >
                        <span className={priceLabelClass}>{opt.label}</span>
                        <span className={dishPriceClass}>{opt.price}</span>
                      </li>
                    ))}
                  </ul>
                ) : item.price?.trim() ? (
                  <p className={`shrink-0 self-start ${dishPriceClass}`}>
                    {item.price.trim()}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
