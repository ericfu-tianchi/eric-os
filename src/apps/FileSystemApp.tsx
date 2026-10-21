import { useEffect, useMemo, useState } from "react";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => setSelectedId(null), [current.id]);

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
    if (node.kind === "video" && node.mediaId) return open("player", { title: node.name, payload: node.mediaId });
    if (node.html) return open("html-doc", { title: node.name, payload: node.id });
    if (node.app === "snake") return setSnakeMode(true);
    if (node.app) return open(node.app, { title: node.name });
  };

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

      <main className="finder-content" onClick={() => setSelectedId(null)}>
        {children.length === 0 ? (
          <div className="finder-empty">
            <PixIcon name="folder" size={48} />
            <strong>{current.name} is ready for its next chapter.</strong>
            <span>This space is intentionally quiet for now.</span>
          </div>
        ) : view === "icon" ? (
          <div className={`finder-icon-grid ${children.some(thumbOf) ? "has-thumbs" : ""}`} role="list">
            {children.map((node) => (
              <button
                type="button"
                key={node.id}
                className={`finder-icon-item ${node.kind === "placeholder" ? "placeholder" : ""} ${selectedId === node.id ? "selected" : ""}`}
                onClick={(e) => { e.stopPropagation(); setSelectedId(node.id); }}
                onDoubleClick={() => openNode(node)}
                onKeyDown={(e) => { if (e.key === "Enter") openNode(node); }}
              >
                <span className="finder-icon-slot"><FinderNodeIcon node={node} size={66} thumbSize={104} /></span>
                <span className="finder-item-name">{node.name}</span>
                <span className="finder-item-meta">{node.description ?? kindLabel(node)}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="finder-list" role="list">
            <div className="finder-list-head" aria-hidden>
              <span className="sorted">Name</span><span>Kind</span><span>Size</span>
            </div>
            {children.map((node) => (
              <button
                type="button"
                key={node.id}
                className={`finder-list-row ${node.kind === "placeholder" ? "placeholder" : ""} ${selectedId === node.id ? "selected" : ""}`}
                onClick={(e) => { e.stopPropagation(); setSelectedId(node.id); }}
                onDoubleClick={() => openNode(node)}
                onKeyDown={(e) => { if (e.key === "Enter") openNode(node); }}
              >
                <span className="finder-list-name"><FinderNodeIcon node={node} size={18} /><span>{node.name}</span></span>
                <span>{kindLabel(node)}</span>
                <span>{/\d+ items?/.test(node.description ?? "") ? node.description : "—"}</span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
