import { useEffect, useState } from "react";
import fuWingMark from "../assets/fu-wing-mark.png";

// the 3×3 ring the little snake chases its tail around, clockwise
const RING = [0, 1, 2, 5, 8, 7, 6, 3];
const LEN = 5;

/** "Tail chase": the F mark, the name, and a tiny snake circling underneath. Once per visit; click to skip. */
export function BootSplash({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const [k, setK] = useState(0);
  useEffect(() => {
    const tick = window.setInterval(() => setK((n) => n + 1), 85);
    const t1 = window.setTimeout(() => setLeaving(true), 1500);
    const t2 = window.setTimeout(onDone, 1800);
    return () => { window.clearInterval(tick); window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [onDone]);
  const skip = () => { setLeaving(true); window.setTimeout(onDone, 150); };
  const lit = new Set(Array.from({ length: LEN }, (_, j) => RING[(k - j + RING.length * 8) % RING.length]));
  return (
    <div className={`boot ${leaving ? "leaving" : ""}`} onClick={skip} role="status" aria-label="Tianchi OS is starting">
      <img className="boot-mark" src={fuWingMark} alt="" draggable={false} />
      <span className="boot-name">Tianchi <span>OS</span></span>
      <span className="boot-spin" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => <i key={i} className={lit.has(i) ? "on" : ""} />)}
      </span>
    </div>
  );
}
