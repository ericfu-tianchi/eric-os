import { useEffect, useRef, useState } from "react";
import { useOS } from "../store";
import batteryIcon from "../assets/icons/b/battery-v2.png";
import fuWingMark from "../assets/fu-wing-mark.png";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(t);
  }, []);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
          <img className="fu-wing-mark" src={fuWingMark} alt="Fu Tianchi logo" draggable={false} />
          <span className="os-name"><span className="os-name-main">Tianchi</span> <span className="os-name-suffix">OS</span></span>
        </button>
        <div className="right">
          <span className="status-icons">
            <img className="top-battery" src={batteryIcon} alt="Battery at 80%" draggable={false} />
          </span>
          <span>{clock}</span>
        </div>
      </nav>

      {menuOpen && (
        <div className="menu-pop" role="menu">
          <button onClick={item(() => open("about", { title: "About_Me.md" }))}>
            关于 ERIC OS <span className="k">ABOUT</span>
          </button>
          <button onClick={item(() => open("filesystem", { title: "Tianchintosh HD", payload: "tianchintosh" }))}>
            文件系统 <span className="k">DISK</span>
          </button>
          <button onClick={item(() => open("prefs", { title: "Settings" }))}>
            系统偏好设置 <span className="k">SETTINGS</span>
          </button>
          <hr />
          <button onClick={item(() => open("resume", { title: "resume.pdf" }))}>
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
