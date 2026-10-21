import { useMemo } from "react";
import { EXTERNAL_GAMES, type ExternalGameId } from "../data/filesystem";
import { useWindowChrome } from "../components/WindowChrome";

/** A real hosted game, played inside a maximized Tianchi OS window. */
export function ExternalGameApp({ gameId }: { gameId: ExternalGameId }) {
  const game = EXTERNAL_GAMES[gameId];
  const chrome = useMemo(
    () => ({
      trail: [{ label: "Tianchintosh HD" }, { label: "AI Side Projects" }, { label: game.name }],
      meta: "LIVE",
    }),
    [game.name],
  );
  useWindowChrome(chrome);
  return (
    <div className="external-game">
      <iframe
        src={game.url}
        title={game.name}
        allow="autoplay; fullscreen; clipboard-read; clipboard-write"
        allowFullScreen
      />
    </div>
  );
}
