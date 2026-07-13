import { useEffect, useRef, useState } from "react";
import { useOS } from "../store";
import { PixelGlyph, PixelWordmark } from "./Pixel";
import ericLogo from "../assets/eric-logo.svg";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(t);
  }, []);
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const hh = now.getHours();
  const mm = now.getMinutes().toString().padStart(2, "0");
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${days[now.getDay()]} ${h12}:${mm} ${hh >= 12 ? "PM" : "AM"}`;
}

export function MenuBar() {
  const { open, resetDesktop } = useOS();
  const [menuOpen, setMenuOpen] = useState(false);
  const clock = useClock();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [menuOpen]);

  const item = (fn: () => void) => () => {
    fn();
    setMenuOpen(false);
  };

  return (
    <div ref={ref}>
      <nav className="menubar">
        <button className={`brand ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <img src={ericLogo} alt="Eric Fu logo" style={{ height: 21, width: "auto" }} draggable={false} />
          <PixelWordmark text="ERIC OS" cell={2.6} />
        </button>
        <div className="right">
          <span className="status-icons">
            <PixelGlyph name="wifi" size={15} title="wifi" />
            <PixelGlyph name="battery" size={22} title="battery" />
          </span>
          <span>{clock}</span>
        </div>
      </nav>

      {menuOpen && (
        <div className="menu-pop" role="menu">
          <button onClick={item(() => open("about", { title: "ABOUT.TXT" }))}>
            关于 ERIC OS <span className="k">ABOUT</span>
          </button>
          <button onClick={item(() => open("readme", { title: "README.MD" }))}>
            系统说明书 <span className="k">README</span>
          </button>
          <button onClick={item(() => open("prefs", { title: "SYSTEM PREFS" }))}>
            系统偏好设置 <span className="k">PREFS</span>
          </button>
          <hr />
          <button onClick={item(() => open("resume", { title: "RESUME.PDF" }))}>
            简历 <span className="k">PDF</span>
          </button>
          <button
            onClick={item(() => {
              resetDesktop();
              window.location.reload();
            })}
          >
            重启桌面 <span className="k">RESET</span>
          </button>
        </div>
      )}
    </div>
  );
}
