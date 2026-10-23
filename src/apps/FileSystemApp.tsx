import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOS } from "../store";
import {
  EXTERNAL_GAMES,
  FINDER_ROOT_IDS,
  filesystemChildren,
  filesystemNode,
  filesystemTrail,
  type FileNode,
} from "../data/filesystem";
import { PixIcon, type PixIconName } from "../components/Pixel";
import { fileIconOf } from "../data/projectAssets";
import { mediaItem } from "../data/media";
import { FitName } from "../components/FitName";
import { useWindowChrome, type WindowViewMode } from "../components/WindowChrome";

function resolvedNode(node: FileNode) {
  return node.targetId ? filesystemNode(node.targetId) ?? node : node;
}

function nodeIcon(node: FileNode): PixIconName {
  if (node.id === "desktop-disk") return "computer";
  const target = resolvedNode(node);
  if (target.kind === "folder") return "folder";
  if (target.kind === "document") return target.app === "resume" ? "pdf" : "doc";
  if (target.kind === "app") return target.app === "snake" ? "snake" : "gear";
  return "doc";
}

function kindLabel(node: FileNode) {
  const target = resolvedNode(node);
  if (node.kind === "shortcut") return "Shortcut";
  if (target.kind === "folder") return "Folder";
  if (target.kind === "project") return "Case study";
  if (target.kind === "game") return "Playable app";
  if (target.kind === "placeholder") return "Coming soon";
  if (target.kind === "document") return "Document";
  if (target.kind === "image") return "Image";
  if (target.kind === "video") return "Video";
  return "Application";
}

function thumbOf(node: FileNode) {
  const target = resolvedNode(node);
  if (target.thumb) return target.thumb;
  return target.projectSlug ? fileIconOf(target.projectSlug) : target.app === "about" ? fileIconOf("about") : undefined;
}

/** Reading pages show their cover as the icon; in icon view it gets more room (thumbSize). */
function FinderNodeIcon({ node, size, thumbSize = size }: { node: FileNode; size: number; thumbSize?: number }) {
  const target = resolvedNode(node);
  const game = target.gameId ? EXTERNAL_GAMES[target.gameId] : undefined;
  if (node.icon) return <img className="finder-pixel-icon" src={node.icon} width={size} height={size} alt="" draggable={false} />;
  if (game) return <img className="finder-pixel-icon" src={game.icon} width={size} height={size} alt="" draggable={false} />;
  const thumb = thumbOf(node);
  if (thumb && (target.kind === "image" || target.kind === "video")) return <span className={`finder-media-thumb ${target.kind}`} style={{ width: thumbSize, height: thumbSize }}><img src={thumb} alt="" draggable={false} loading="lazy" /></span>;
  if (thumb) return <img className="finder-thumb-icon" src={thumb} width={thumbSize} height={thumbSize} alt="" draggable={false} />;
  return <PixIcon name={nodeIcon(node)} size={size} />;
}

type Box = { left: number; top: number; right: number; bottom: number };
const boxOf = (a: { x: number; y: number }, b: { x: number; y: number }): Box => ({ left: Math.min(a.x, b.x), top: Math.min(a.y, b.y), right: Math.max(a.x, b.x), bottom: Math.max(a.y, b.y) });
const hits = (a: Box, b: Box) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/** Icon order the visitor arranged by dragging, per folder, kept for this visit (like the desktop's free positions). */
const arranged = new Map<string, string[]>();
const ordered = (folder: string, nodes: FileNode[]) => {
  const order = arranged.get(folder);
  if (!order) return nodes;
  const rank = new Map(order.map((id, i) => [id, i]));
  return [...nodes].sort((a, b) => (rank.get(a.id) ?? 1e9) - (rank.get(b.id) ?? 1e9));
};

/** One Finder surface for Tianchintosh HD, its roots, and every nested folder. */
export function FileSystemApp({ initialId = "tianchintosh" }: { initialId?: string }) {
  const open = useOS((s) => s.open);
  const setSnakeMode = useOS((s) => s.setSnakeMode);
  const validInitial = filesystemNode(initialId)?.id ?? "tianchintosh";
  const [history, setHistory] = useState<string[]>(() => [validInitial]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewByDirectory, setViewByDirectory] = useState<Record<string, WindowViewMode>>({});
  const currentId = history[historyIndex] ?? "tianchintosh";
  const current = filesystemNode(currentId) ?? filesystemNode("tianchintosh")!;
  const children = filesystemChildren(current.id);
  const trail = filesystemTrail(current.id);
  const view = viewByDirectory[current.id] ?? "icon";
  const [selected, setSelected] = useState<string[]>([]);
  const [, bump] = useState(0);
  const items = ordered(current.id, children);
  const contentRef = useRef<HTMLElement>(null);
  const [marquee, setMarquee] = useState<Box | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; kind: "items" | "folder" } | null>(null);
  const press = useRef<{ id: string; x: number; y: number; pid: number; moved: boolean } | null>(null);
  const [drag, setDrag] = useState<{ ids: string[]; dx: number; dy: number } | null>(null);
  const area = useRef<{ x: number; y: number; base: string[] } | null>(null);

  useEffect(() => { setSelected([]); setMenu(null); }, [current.id]);
  useEffect(() => {
    if (!menu) return;
    const close = (e: Event) => { if (!(e.target as HTMLElement).closest?.(".desktop-context")) setMenu(null); };
    window.addEventListener("pointerdown", close, true);
    window.addEventListener("blur", () => setMenu(null), { once: true });
    return () => window.removeEventListener("pointerdown", close, true);
  }, [menu]);

  useEffect(() => {
    const next = filesystemNode(initialId)?.id ?? "tianchintosh";
    setHistory([next]);
    setHistoryIndex(0);
  }, [initialId]);

  const navigate = (nextId: string) => {
    if (!filesystemNode(nextId) || nextId === current.id) return;
    setHistory((entries) => [...entries.slice(0, historyIndex + 1), nextId]);
    setHistoryIndex((index) => index + 1);
  };
  const goBack = () => setHistoryIndex((index) => Math.max(0, index - 1));
  const goForward = () => setHistoryIndex((index) => Math.min(history.length - 1, index + 1));
  const setView = (next: WindowViewMode) => setViewByDirectory((views) => ({ ...views, [current.id]: next }));

  const activeSidebarId = current.id === "tianchintosh"
    ? "tianchintosh"
    : trail.find((node) => (FINDER_ROOT_IDS as readonly string[]).includes(node.id))?.id ?? "tianchintosh";

  const chrome = useMemo(() => ({
    trail: trail.map((node) => ({ label: node.name, onClick: () => navigate(node.id) })),
    meta: "",
    navigation: {
      canGoBack: historyIndex > 0,
      canGoForward: historyIndex < history.length - 1,
      onBack: goBack,
      onForward: goForward,
    },
    viewControls: { mode: view, onChange: setView },
  }), [current.id, history.length, historyIndex, view]);
  useWindowChrome(chrome);

  const openNode = (node: FileNode) => {
    if (node.kind === "shortcut" && node.targetId) {
      const target = filesystemNode(node.targetId);
      if (target) return openNode(target);
    }
    if (node.kind === "folder") return navigate(node.id);
    if (node.kind === "project" && node.projectSlug) {
      return open("project-detail", { title: node.name, payload: node.projectSlug });
    }
    if (node.kind === "game" && node.gameId) {
      const game = EXTERNAL_GAMES[node.gameId];
      return open(node.gameId, { title: game.name, maximized: true });
    }
    if (node.kind === "image" && node.mediaId) return open("preview", { title: node.name, payload: node.mediaId });
    if (node.kind === "video" && node.mediaId) {
      const tall = mediaItem(node.mediaId)?.item.portrait; // 9:16 clips open in a phone-shaped window
      return open("player", { title: node.name, payload: node.mediaId, ...(tall ? { w: 400, h: Math.min(720, window.innerHeight - 180) } : {}) });
    }
    if (node.html) return open("html-doc", { title: node.name, payload: node.id });
    if (node.app === "snake") return setSnakeMode(true);
    if (node.app) return open(node.app, { title: node.name });
  };

  const nodeById = (id: string) => items.find((n) => n.id === id);
  const openSelection = (ids = selected, newWindow = false) => {
    const nodes = ids.map(nodeById).filter((n): n is FileNode => !!n && n.kind !== "placeholder");
    setMenu(null);
    if (nodes.length === 1 && !newWindow) return openNode(nodes[0]);
    nodes.forEach((n) => {
      const t = resolvedNode(n);
      if (t.kind === "folder") open("filesystem", { title: t.name, payload: t.id });
      else openNode(n);
    });
  };

  /* positions inside the scrolling content, so marquee and drags survive scrolling */
  const local = (e: { clientX: number; clientY: number }) => {
    const el = contentRef.current!, r = el.getBoundingClientRect();
    return { x: e.clientX - r.left + el.scrollLeft, y: e.clientY - r.top + el.scrollTop };
  };
  const itemBoxes = () => {
    const el = contentRef.current!, r = el.getBoundingClientRect();
    return [...el.querySelectorAll<HTMLElement>("[data-node]")].map((n) => {
      const b = n.getBoundingClientRect();
      return { id: n.dataset.node!, box: { left: b.left - r.left + el.scrollLeft, top: b.top - r.top + el.scrollTop, right: b.right - r.left + el.scrollLeft, bottom: b.bottom - r.top + el.scrollTop } };
    });
  };

  // icons: click selects (⌘ / ⇧ add), drag moves the selection (icon view rearranges), double-click opens
  const onItemDown = (e: React.PointerEvent, id: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setMenu(null);
    if (e.metaKey || e.ctrlKey || e.shiftKey) {
      setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
      return;
    }
    if (!selected.includes(id)) setSelected([id]);
    press.current = { id, x: e.clientX, y: e.clientY, pid: e.pointerId, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onItemMove = (e: React.PointerEvent) => {
    const p = press.current;
    if (!p || p.pid !== e.pointerId || view !== "icon") return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    if (!p.moved && Math.hypot(dx, dy) < 5) return;
    p.moved = true;
    const ids = selected.includes(p.id) ? selected : [p.id];
    setDrag({ ids, dx, dy });
  };
  const onItemUp = (e: React.PointerEvent) => {
    const p = press.current; press.current = null;
    if (!p || p.pid !== e.pointerId) return;
    if (!p.moved || !drag) { if (!p.moved && !selected.includes(p.id)) setSelected([p.id]); setDrag(null); return; }
    // drop: the moved icons land in front of the icon under the pointer
    const pt = local(e);
    const boxes = itemBoxes().filter((b) => !drag.ids.includes(b.id));
    const ids = items.map((n) => n.id).filter((id) => !drag.ids.includes(id));
    let at = ids.length;
    for (const b of boxes) {
      const sameRow = pt.y >= b.box.top && pt.y <= b.box.bottom;
      if ((sameRow && pt.x < (b.box.left + b.box.right) / 2) || pt.y < b.box.top) { at = ids.indexOf(b.id); break; }
    }
    ids.splice(at, 0, ...items.map((n) => n.id).filter((id) => drag.ids.includes(id)));
    flip.current = new Map(itemBoxes().map((b) => [b.id, b.box]));
    arranged.set(current.id, ids);
    setDrag(null);
    bump((n) => n + 1);
  };

  // icons slide to their new places after a drop (FLIP)
  const flip = useRef<Map<string, Box> | null>(null);
  useLayoutEffect(() => {
    const before = flip.current; flip.current = null;
    if (!before) return;
    itemBoxes().forEach(({ id, box }) => {
      const b = before.get(id); const el = contentRef.current?.querySelector<HTMLElement>(`[data-node="${CSS.escape(id)}"]`);
      if (!b || !el || (b.left === box.left && b.top === box.top)) return;
      el.animate([{ transform: `translate(${b.left - box.left}px, ${b.top - box.top}px)` }, { transform: "none" }], { duration: 260, easing: "cubic-bezier(.2,.9,.25,1)" });
    });
  });

  // empty space: drag a selection rectangle, like the desktop
  const onAreaDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setMenu(null);
    const pt = local(e);
    const keep = e.metaKey || e.ctrlKey || e.shiftKey;
    area.current = { ...pt, base: keep ? selected : [] };
    if (!keep) setSelected([]);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onAreaMove = (e: React.PointerEvent) => {
    const a = area.current; if (!a) return;
    const box = boxOf(a, local(e));
    if (!marquee && box.right - box.left < 4 && box.bottom - box.top < 4) return;
    setMarquee(box);
    const inside = itemBoxes().filter((b) => hits(box, b.box)).map((b) => b.id);
    setSelected([...new Set([...a.base, ...inside])]);
  };
  const onAreaUp = () => { area.current = null; setMarquee(null); };

  const showMenu = (e: React.MouseEvent, kind: "items" | "folder") => {
    e.preventDefault(); e.stopPropagation();
    setMenu({ x: Math.min(e.clientX, window.innerWidth - 190), y: Math.min(e.clientY, window.innerHeight - 160), kind });
  };
  const onItemContext = (e: React.MouseEvent, id: string) => {
    if (!selected.includes(id)) setSelected([id]);
    showMenu(e, "items");
  };
  const menuIds = selected.length ? selected : [];
  const oneFolder = menuIds.length === 1 && resolvedNode(nodeById(menuIds[0]) ?? current).kind === "folder";

  const itemProps = (node: FileNode) => ({
    "data-node": node.id,
    onPointerDown: (e: React.PointerEvent) => onItemDown(e, node.id),
    onPointerMove: onItemMove,
    onPointerUp: onItemUp,
    onPointerCancel: () => { press.current = null; setDrag(null); },
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    onDoubleClick: () => openNode(node),
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter") openSelection(selected.includes(node.id) ? selected : [node.id]); },
    onContextMenu: (e: React.MouseEvent) => onItemContext(e, node.id),
    style: drag?.ids.includes(node.id) ? { transform: `translate(${drag.dx}px, ${drag.dy}px)`, zIndex: 2, opacity: 0.7, pointerEvents: "none" as const } : undefined,
  });

  return (
    <div className="finder-browser">
      <aside className="finder-sidebar" aria-label="Tianchintosh locations">
        <button
          type="button"
          className={`finder-side-root ${activeSidebarId === "tianchintosh" ? "active" : ""}`}
          onClick={() => navigate("tianchintosh")}
        >
          <PixIcon name="computer" size={20} />
          <span>Tianchintosh HD</span>
        </button>
        <div className="finder-side-rule" />
        <div className="finder-side-list">
          {FINDER_ROOT_IDS.map((id) => {
            const node = filesystemNode(id)!;
            return (
              <button
                type="button"
                key={id}
                className={`finder-side-item ${activeSidebarId === id ? "active" : ""}`}
                onClick={() => navigate(id)}
              >
                {node.sidebarIcon
                  ? <img className="finder-thumb-icon" src={node.sidebarIcon} width={20} height={20} alt="" draggable={false} />
                  : <FinderNodeIcon node={node} size={20} />}
                <span>{node.name}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="finder-content" ref={contentRef}
        onPointerDown={onAreaDown} onPointerMove={onAreaMove} onPointerUp={onAreaUp} onPointerCancel={onAreaUp}
        onContextMenu={(e) => { setSelected([]); showMenu(e, "folder"); }}>
        {children.length === 0 ? (
          <div className="finder-empty">
            <PixIcon name="folder" size={48} />
            <strong>{current.name} is ready for its next chapter.</strong>
            <span>This space is intentionally quiet for now.</span>
          </div>
        ) : view === "icon" ? (
          <div className={`finder-icon-grid ${children.some(thumbOf) ? "has-thumbs" : ""}`} role="list">
            {items.map((node) => (
              <button
                type="button"
                key={node.id}
                className={`finder-icon-item ${node.kind === "placeholder" ? "placeholder" : ""} ${selected.includes(node.id) ? "selected" : ""} ${drag?.ids.includes(node.id) ? "dragging" : ""}`}
                {...itemProps(node)}
              >
                <span className="finder-icon-slot"><FinderNodeIcon node={node} size={66} thumbSize={104} /></span>
                <FitName className="finder-item-name" text={node.name} lines={2} />
                <span className="finder-item-meta">{node.description ?? kindLabel(node)}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="finder-list" role="list">
            <div className="finder-list-head" aria-hidden>
              <span className="sorted">Name</span><span>Kind</span><span>Size</span>
            </div>
            {items.map((node) => (
              <button
                type="button"
                key={node.id}
                className={`finder-list-row ${node.kind === "placeholder" ? "placeholder" : ""} ${selected.includes(node.id) ? "selected" : ""}`}
                {...itemProps(node)}
              >
                <span className="finder-list-name"><FinderNodeIcon node={node} size={18} /><span className="finder-list-text"><FitName text={node.name} lines={1} /></span></span>
                <span>{kindLabel(node)}</span>
                <span>{/\d+ items?/.test(node.description ?? "") ? node.description : "—"}</span>
              </button>
            ))}
          </div>
        )}
        {marquee && <div className="selection-marquee" style={{ left: marquee.left, top: marquee.top, width: marquee.right - marquee.left, height: marquee.bottom - marquee.top }} aria-hidden />}
      </main>
      {menu && createPortal(
        <div className="desktop-context" style={{ left: menu.x, top: menu.y }} role="menu" onContextMenu={(e) => e.preventDefault()}>
          {menu.kind === "items" ? (<>
            <button type="button" onClick={() => openSelection()}>Open{menuIds.length > 1 ? ` ${menuIds.length} Items` : ""}</button>
            {oneFolder && <button type="button" onClick={() => openSelection(menuIds, true)}>Open in New Window</button>}
          </>) : (<>
            <button type="button" onClick={() => { setView("icon"); setMenu(null); }}>{view === "icon" ? "✓ " : ""}View as Icons</button>
            <button type="button" onClick={() => { setView("list"); setMenu(null); }}>{view === "list" ? "✓ " : ""}View as List</button>
            <hr />
            <button type="button" onClick={() => { flip.current = new Map(itemBoxes().map((b) => [b.id, b.box])); arranged.delete(current.id); setMenu(null); bump((n) => n + 1); }}>Clean Up</button>
            <button type="button" onClick={() => { setSelected(items.map((n) => n.id)); setMenu(null); }}>Select All</button>
            {historyIndex > 0 && <button type="button" onClick={() => { goBack(); setMenu(null); }}>Back</button>}
          </>)}
        </div>,
        document.body,
      )}
    </div>
  );
}
