import { useOS } from "../store";

import aFolder from "../assets/icons/a/folder.png";
import aDoc from "../assets/icons/a/doc.png";
import aPdf from "../assets/icons/a/pdf.png";
import aSnake from "../assets/icons/a/snake.png";
import aComputer from "../assets/icons/a/computer.png";
import aGear from "../assets/icons/a/gear.png";
import dFolder from "../assets/icons/d/folder.png";
import dDoc from "../assets/icons/d/doc.png";
import dPdf from "../assets/icons/d/pdf.png";
import dSnake from "../assets/icons/d/snake.png";
import dComputer from "../assets/icons/d/computer.png";
import dGear from "../assets/icons/d/gear.png";

export type IconName = "folder" | "doc" | "pdf" | "snake" | "computer" | "gear";

const SETS: Record<"a" | "d", Record<IconName, string>> = {
  a: { folder: aFolder, doc: aDoc, pdf: aPdf, snake: aSnake, computer: aComputer, gear: aGear },
  d: { folder: dFolder, doc: dDoc, pdf: dPdf, snake: dSnake, computer: dComputer, gear: dGear },
};

/** dev override: ?icons=a / ?icons=d */
function forcedSet(): "a" | "d" | null {
  if (typeof window === "undefined") return null;
  const m = window.location.search.match(/icons=(a|d)/);
  return (m?.[1] as "a" | "d") ?? null;
}

export function ThemedIcon({ name, size = 48, className }: { name: IconName; size?: number; className?: string }) {
  const iconSet = useOS((s) => s.iconSet);
  const set = forcedSet() ?? iconSet;
  return (
    <span className={`glyph-wrap ${className ?? ""}`} style={{ display: "inline-flex", lineHeight: 0 }}>
      <img src={SETS[set][name]} width={size} height={size} alt="" draggable={false} />
    </span>
  );
}
