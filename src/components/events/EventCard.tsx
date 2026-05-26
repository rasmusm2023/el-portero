import { BookTableWidgetButton } from "@/components/BookTableWidgetButton";
import { EventDescription } from "@/components/events/EventDescription";
import { EventImage } from "@/components/events/EventImage";
import { t, type Locale } from "@/i18n/strings";
import { eventCardDateLabel } from "@/lib/eventDisplayDate";
import type { HomeEvent } from "@/lib/publicEventTypes";

type EventCardProps = {
  event: HomeEvent;
  locale: Locale;
  variant: "home" | "listing";
  bookingMode?: "interactive" | "disabled";
  imageFallbackLabel?: string;
};

export function EventCard({
  event,
  locale,
  variant,
  bookingMode = "interactive",
  imageFallbackLabel,
}: EventCardProps) {
  const imageSrc = event.imageSrc.trim();
  const title = event.title[locale].trim() || t(locale, "admin.events.titleField");
  const excerpt = event.excerpt[locale] || t(locale, "admin.events.excerpt");
  const imageAlt = event.imageAlt[locale].trim() || title;
  const timeDetail = event.timeDetail[locale]?.trim();
  const showTime = event.hasSpecificTime !== false && Boolean(timeDetail);
  const fullyBooked = Boolean(event.fullyBooked);

  if (variant === "listing") {
    return (
      <article className="overflow-hidden rounded-2xl border border-border bg-paper-dark/35 ring-1 ring-border/60 sm:rounded-3xl">
        <div className="flex flex-col md:flex-row">
          <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden bg-ink/5 md:aspect-auto md:w-1/2 md:min-h-[280px] md:min-w-0 md:max-w-none">
            <EventCardImage src={imageSrc} alt={imageAlt} fallbackLabel={imageFallbackLabel} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between px-6 py-8 sm:px-10 sm:py-10">
            <div>
              <time
                className="mb-3 block text-left text-[10px] font-semibold leading-snug tracking-[0.2em] text-ink-muted uppercase sm:text-[11px]"
                dateTime={event.sortDate}
              >
                {eventCardDateLabel(event, locale)}
              </time>
              {showTime ? (
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold tracking-[0.18em] text-ink-muted/90 uppercase">
                    {timeDetail}
                  </p>
                </div>
              ) : null}
              <h2
                className={`font-display text-2xl font-medium text-paper sm:text-3xl ${
                  showTime ? "mt-3" : ""
                }`}
              >
                {title}
              </h2>
              <EventDescription
                text={excerpt}
                className="mt-4 text-ink-muted leading-relaxed"
              />
            </div>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <EventCardAction
                fullyBooked={fullyBooked}
                locale={locale}
                bookingMode={bookingMode}
                variant="listing"
              />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-paper-dark/35 shadow-sm ring-1 ring-border/60 transition-[box-shadow,ring-color] duration-300 hover:shadow-md hover:ring-border sm:rounded-3xl md:min-h-60 md:flex-row">
      <div className="relative aspect-16/10 w-full shrink-0 bg-ink/5 md:aspect-auto md:w-[46%] md:min-w-44 md:max-w-md xl:max-w-136 2xl:max-w-152">
        <EventCardImage src={imageSrc} alt={imageAlt} fallbackLabel={imageFallbackLabel} />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-4 px-5 py-6 sm:gap-5 sm:px-6 sm:py-7">
        <div className="min-w-0">
          <time
            className="mb-3 block text-left text-[10px] font-semibold leading-snug tracking-[0.2em] text-ink-muted uppercase sm:text-[11px]"
            dateTime={event.sortDate}
          >
            {eventCardDateLabel(event, locale)}
          </time>
          <h3 className="font-display text-lg font-medium leading-snug tracking-tight text-paper sm:text-xl">
            {title}
          </h3>
          {showTime ? (
            <p className="mt-2 text-[11px] font-semibold leading-snug tracking-[0.18em] text-ink-muted uppercase sm:text-xs sm:tracking-[0.2em]">
              {timeDetail}
            </p>
          ) : null}
          <EventDescription
            text={excerpt}
            className="mt-2.5 text-sm leading-relaxed text-ink-muted"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <EventCardAction
            fullyBooked={fullyBooked}
            locale={locale}
            bookingMode={bookingMode}
            variant="home"
          />
        </div>
      </div>
    </article>
  );
}

function EventCardImage({
  src,
  alt,
  fallbackLabel,
}: {
  src: string;
  alt: string;
  fallbackLabel?: string;
}) {
  return (
    <>
      {src ? (
        <EventImage
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1024px) 90vw, (max-width: 1536px) 45vw, 640px"
        />
      ) : (
        <div className="flex h-full min-h-48 items-center justify-center bg-paper/8 px-6 text-center text-sm text-paper/45">
          {fallbackLabel}
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/35 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:via-transparent md:to-paper/8"
        aria-hidden
      />
    </>
  );
}

function EventCardAction({
  fullyBooked,
  locale,
  bookingMode,
  variant,
}: {
  fullyBooked: boolean;
  locale: Locale;
  bookingMode: "interactive" | "disabled";
  variant: "home" | "listing";
}) {
  const sizeClass =
    variant === "listing"
      ? "px-4 py-2.5 text-xs sm:text-sm"
      : "px-3.5 py-2.5 text-[10px] sm:px-4 sm:py-2.5 sm:text-xs";

  if (fullyBooked || bookingMode === "disabled") {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex shrink-0 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-ink/10 ${sizeClass} font-semibold tracking-[0.2em] text-ink-muted uppercase opacity-80`}
        aria-disabled="true"
      >
        {fullyBooked ? t(locale, "page.reserve.fullyBooked") : t(locale, "nav.reserve")}
      </button>
    );
  }

  return (
    <BookTableWidgetButton
      type="button"
      className={`inline-flex shrink-0 items-center justify-center rounded-lg border border-ink bg-ink ${sizeClass} font-semibold tracking-[0.2em] text-paper uppercase transition-colors hover:bg-ink/90`}
    >
      {t(locale, "nav.reserve")}
    </BookTableWidgetButton>
  );
}
