import Image from "next/image";
import type { Locale } from "@/i18n/strings";
import { localeFlagSrc } from "@/i18n/strings";

type LocaleFlagProps = {
  locale: Locale;
  /** Lighter ring on dark header / overlay. */
  variant?: "default" | "onDark";
};

export function LocaleFlag({ locale, variant = "default" }: LocaleFlagProps) {
  const ring =
    variant === "onDark" ? "ring-paper/25" : "ring-ink/15";

  return (
    <Image
      src={localeFlagSrc[locale]}
      alt=""
      width={24}
      height={16}
      className={`h-4 w-6 shrink-0 rounded-sm object-cover ring-1 ${ring}`}
      unoptimized
      aria-hidden
    />
  );
}
