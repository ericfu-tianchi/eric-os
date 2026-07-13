import { useEffect, useState } from "react";
import { PixelGlyph, PixelWordmark } from "./Pixel";

export function BootSplash({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const t1 = window.setTimeout(() => setLeaving(true), 1050);
    const t2 = window.setTimeout(onDone, 1250);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onDone]);
  const skip = () => {
    setLeaving(true);
    window.setTimeout(onDone, 120);
  };
  return (
    <div className={`boot ${leaving ? "leaving" : ""}`} onClick={skip} role="status" aria-label="ERIC OS 启动中">
      <span className="wordmark" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <PixelGlyph name="logo" size={52} />
        <PixelWordmark text="ERIC OS" cell={7} />
      </span>
      <div className="bar"><i /></div>
      <span className="tagline">PRODUCT · DESIGN · BUILD</span>
    </div>
  );
}
