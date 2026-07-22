/**
 * Local development adapter for the forthcoming shared Snake record endpoint.
 * Keeping this tiny contract separate means the UI can later swap to a Worker
 * request without changing the game flow or its HUD.
 */
export type SnakeRecord = { score: number; alias: string };

const KEY = "eric-os-snake-record-preview";
const EMPTY: SnakeRecord = { score: 0, alias: "Anonymous" };

export function readSnakeRecord(): SnakeRecord {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const value = JSON.parse(raw) as Partial<SnakeRecord>;
    return {
      score: Number.isFinite(value.score) && (value.score ?? 0) >= 0 ? Math.floor(value.score ?? 0) : 0,
      alias: typeof value.alias === "string" && value.alias.trim() ? value.alias.trim() : "Anonymous",
    };
  } catch {
    return EMPTY;
  }
}

export function writeSnakeRecord(record: SnakeRecord) {
  localStorage.setItem(KEY, JSON.stringify(record));
}

/** One-time local QA reset. Remove the caller after Eric has tested the record flow. */
export function resetSnakeRecordPreview() {
  writeSnakeRecord(EMPTY);
}
