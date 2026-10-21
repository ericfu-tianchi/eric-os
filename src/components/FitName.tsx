import { useLayoutEffect, useRef, useState } from "react";

/**
 * A file name that fits, the macOS Finder way: wrap onto up to `lines` lines,
 * and if it still doesn't fit, cut from the MIDDLE so the start and the end
 * (numbers, "…Wonder", ".pdf") both stay. The full name is in the tooltip.
 */
export function FitName({ text, lines = 2, className }: { text: string; lines?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(text);

  useLayoutEffect(() => {
    const el = ref.current;
    const box = el?.parentElement;
    if (!el || !box) return;
    const fit = () => {
      const cs = getComputedStyle(el);
      const pcs = getComputedStyle(box);
      const width = box.clientWidth - parseFloat(pcs.paddingLeft) - parseFloat(pcs.paddingRight);
      if (width <= 0) return;
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.25;
      const maxH = lh * lines + 1;
      // measure in a detached twin with the same font, wrapping freely
      const m = document.createElement("span");
      m.style.cssText = `position:absolute;visibility:hidden;left:-9999px;top:0;display:block;width:${width}px;white-space:${lines > 1 ? "normal" : "nowrap"};overflow-wrap:anywhere;font:${cs.font};letter-spacing:${cs.letterSpacing};line-height:${cs.lineHeight};padding:0 ${cs.paddingRight} 0 ${cs.paddingLeft}`;
      document.body.appendChild(m);
      const fits = (s: string) => {
        m.textContent = s;
        return lines > 1 ? m.scrollHeight <= maxH : m.scrollWidth <= width;
      };
      let out = text;
      if (!fits(text)) {
        const cut = (k: number) => text.slice(0, Math.ceil(k / 2)).trimEnd() + "…" + text.slice(text.length - Math.floor(k / 2)).trimStart();
        let lo = 1, hi = text.length - 1;
        while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); if (fits(cut(mid))) lo = mid; else hi = mid - 1; }
        out = cut(lo);
      }
      m.remove();
      setShown((s) => (s === out ? s : out));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    void document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [text, lines]);

  return <span ref={ref} className={className} title={shown === text ? undefined : text}>{shown}</span>;
}
