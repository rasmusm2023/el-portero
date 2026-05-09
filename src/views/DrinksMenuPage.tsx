"use client";

import { MenuPager } from "@/components/menu/MenuPager";
import { MenuCategoryGrid } from "@/components/menu/MenuCategoryGrid";
import { SimpleMenuCategoryGrid } from "@/components/menu/SimpleMenuCategoryGrid";
import { PageShell } from "@/components/layout/PageShell";
import { MENUS_PUBLIC_LIVE } from "@/config/menusPublic";
import { drinksMenuCategories } from "@/data/drinksMenu";
import { useLocale } from "@/i18n/useLocale";
import { t } from "@/i18n/strings";
import { useEditablePublishedMenu } from "@/hooks/useEditablePublishedMenu";
import { editableDocToSimpleCategories } from "@/lib/editableMenuDisplay";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { MenusComingSoonSubpage } from "@/views/MenusComingSoonSubpage";

export function DrinksMenuPage() {
  const { locale } = useLocale();
  const { remote, ready } = useEditablePublishedMenu("drinks");

  if (!MENUS_PUBLIC_LIVE) {
    return <MenusComingSoonSubpage />;
  }
  const publishedLive = Boolean(remote?.isPublished && remote.categories?.length);
  const simple = remote && publishedLive ? editableDocToSimpleCategories(remote) : null;
  const shellTitle =
    publishedLive && remote?.title?.trim()
      ? remote.title.trim()
      : t(locale, "page.menu.title");

  return (
    <PageShell title={shellTitle} titleVariant="hero">
      <MenuPager />
      {!ready && isFirebaseConfigured() ? (
        <p className="mb-8 text-sm text-ink-muted">Loading…</p>
      ) : null}
      {ready && simple ? (
        <SimpleMenuCategoryGrid categories={simple} />
      ) : ready ? (
        <MenuCategoryGrid categories={drinksMenuCategories} locale={locale} />
      ) : null}
    </PageShell>
  );
}
