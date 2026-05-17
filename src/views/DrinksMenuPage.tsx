"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  isEditableMenuPublished,
  primaryPublishedMenusPath,
} from "@/lib/editableMenuPublished";
import { MenusComingSoonSubpage } from "@/views/MenusComingSoonSubpage";

export function DrinksMenuPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const { remote, ready } = useEditablePublishedMenu("drinks");
  const dinnerState = useEditablePublishedMenu("dinner");
  const visibility = useMenusPublicVisibility();

  const mustLeave =
    isFirebaseConfigured() && ready && !isEditableMenuPublished(remote);

  useEffect(() => {
    if (!mustLeave) return;
    if (visibility.ready && !visibility.showFullMenu) return;
    router.replace(
      primaryPublishedMenusPath(
        dinnerState.ready,
        dinnerState.remote,
        ready,
        remote,
      ),
    );
  }, [
    mustLeave,
    router,
    visibility.ready,
    visibility.showFullMenu,
    dinnerState.ready,
    dinnerState.remote,
    ready,
    remote,
  ]);

  if (visibility.ready && !visibility.showFullMenu) {
    return <MenusComingSoonSubpage />;
  }

  const publishedLive = isEditableMenuPublished(remote);
  const simple = remote && publishedLive ? editableDocToSimpleCategories(remote) : null;

  const showLoading = !visibility.ready || (!ready && isFirebaseConfigured());

  if (mustLeave) {
    return (
      <PageShell showDocumentHeader={false}>
        <MenuPager />
        <p className="mb-8 text-sm text-ink-muted">Loading…</p>
      </PageShell>
    );
  }

  return (
    <PageShell showDocumentHeader={false}>
      <MenuPager />
      {showLoading ? <p className="mb-8 text-sm text-ink-muted">Loading…</p> : null}
      {!showLoading && simple ? (
        <SimpleMenuCategoryGrid categories={simple} />
      ) : !showLoading && !isFirebaseConfigured() ? (
        <MenuCategoryGrid categories={drinksMenuCategories} locale={locale} />
      ) : null}
    </PageShell>
  );
}
