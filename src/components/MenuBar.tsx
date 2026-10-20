import { useEffect, useRef, useState } from "react";
import { useOS } from "../store";
import fuWingMark from "../assets/fu-wing-mark.png";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(t);
  }, []);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hh = now.getHours();
  const mm = now.getMinutes().toString().padStart(2, "0");
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()}  ${h12}:${mm} ${hh >= 12 ? "PM" : "AM"}`;
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
          <img className="fu-wing-mark" src={fuWingMark} alt="Fu Tianchi logo" draggable={false} />
          <span className="os-name"><span className="os-name-main">Tianchi</span> <span className="os-name-suffix">OS</span></span>
        </button>
        <div className="right">
          <span>{clock}</span>
        </div>
      </nav>

      {menuOpen && (
        <div className="menu-pop" role="menu">
          <button onClick={item(() => open("about", { title: "About_Me.md" }))}>About Tianchi</button>
          <button onClick={item(() => open("filesystem", { title: "Tianchintosh HD", payload: "tianchintosh" }))}>Tianchintosh HD</button>
          <button onClick={item(() => open("prefs", { title: "Settings" }))}>Settings…</button>
          <hr />
          <button onClick={item(() => open("resume", { title: "resume.pdf" }))}>Resume</button>
          <button
            onClick={item(() => {
              resetDesktop();
              window.location.reload();
            })}
          >
            Restart Desktop
          </button>
        </div>
      )}
    </div>
  );
}
