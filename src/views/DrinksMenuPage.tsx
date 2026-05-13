"use client";

import { MenuPager } from "@/components/menu/MenuPager";
import { MenuCategoryGrid } from "@/components/menu/MenuCategoryGrid";
import { SimpleMenuCategoryGrid } from "@/components/menu/SimpleMenuCategoryGrid";
import { PageShell } from "@/components/layout/PageShell";
import { drinksMenuCategories } from "@/data/drinksMenu";
import { useLocale } from "@/i18n/useLocale";
import { useEditablePublishedMenu } from "@/hooks/useEditablePublishedMenu";
import { useMenusPublicVisibility } from "@/hooks/useMenusPublicVisibility";
import { editableDocToSimpleCategories } from "@/lib/editableMenuDisplay";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { MenusComingSoonSubpage } from "@/views/MenusComingSoonSubpage";

export function DrinksMenuPage() {
  const { locale } = useLocale();
  const { remote, ready } = useEditablePublishedMenu("drinks");
  const visibility = useMenusPublicVisibility();

  if (visibility.ready && !visibility.showFullMenu) {
    return <MenusComingSoonSubpage />;
  }
  const publishedLive = Boolean(remote?.isPublished && remote.categories?.length);
  const simple = remote && publishedLive ? editableDocToSimpleCategories(remote) : null;

  const showLoading = !visibility.ready || (!ready && isFirebaseConfigured());

  return (
    <PageShell showDocumentHeader={false}>
      <MenuPager />
      {showLoading ? <p className="mb-8 text-sm text-ink-muted">Loading…</p> : null}
      {!showLoading && simple ? (
        <SimpleMenuCategoryGrid categories={simple} />
      ) : !showLoading ? (
        <MenuCategoryGrid categories={drinksMenuCategories} locale={locale} />
      ) : null}
    </PageShell>
  );
}
