import { Fragment } from "react";
import {
  parseDescriptionInlines,
  type DescriptionInline,
  normalizeEventDescriptionText,
} from "@/lib/eventDescriptionText";

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
          <DescriptionInlines nodes={parseDescriptionInlines(line)} />
        </Fragment>
      ))}
    </p>
  );
}

function DescriptionInlines({ nodes }: { nodes: DescriptionInline[] }) {
  return nodes.map((node, index) => {
    if (node.type === "text") return <Fragment key={index}>{node.text}</Fragment>;
    if (node.type === "bold") {
      return (
        <strong key={index} className="font-semibold">
          <DescriptionInlines nodes={node.children} />
        </strong>
      );
    }
    return (
      <em key={index}>
        <DescriptionInlines nodes={node.children} />
      </em>
    );
  });
}
