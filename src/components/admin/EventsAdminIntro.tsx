"use client";

import { AdminIntroEmphasis } from "@/components/admin/AdminIntroEmphasis";
import { t, type Locale, type MessageKey } from "@/i18n/strings";

const INTRO_BULLET_KEYS = [
  "admin.events.introBulletNewEvent",
  "admin.events.introBulletEditList",
  "admin.events.introBulletDuplicate",
  "admin.events.introBulletPublished",
  "admin.events.introBulletSpecificTime",
  "admin.events.introBulletFullyBooked",
] as const satisfies readonly MessageKey[];

type Props = {
  locale: Locale;
};

export function EventsAdminIntro({ locale }: Props) {
  return (
    <div className="space-y-4">
      <p>{t(locale, "admin.events.introLead")}</p>
      <ul className="list-disc space-y-2.5 pl-5 text-base marker:text-paper/45">
        {INTRO_BULLET_KEYS.map((key) => (
          <li key={key}>
            <AdminIntroEmphasis text={t(locale, key)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
