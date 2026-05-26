import { Fragment } from "react";
import { normalizeEventDescriptionText } from "@/lib/eventDescriptionText";

type EventDescriptionProps = {
  text: string;
  className?: string;
};

function normalizeDescriptionLines(text: string): string[] {
  return normalizeEventDescriptionText(text)
    .replace(/[ \t\u00a0]{3,}/g, "\n")
    .split("\n");
}

export function EventDescription({ text, className }: EventDescriptionProps) {
  const lines = normalizeDescriptionLines(text);

  return (
    <p className={className} data-event-description="preserve-lines" style={{ whiteSpace: "pre-wrap" }}>
      {lines.map((line, index) => (
        <Fragment key={`${index}-${line}`}>
          {index > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </p>
  );
}
