/**
 * The one shared Snake record (all-time best + who set it), kept by the Worker
 * in KV (worker/index.ts, /api/record). The last record seen is cached locally
 * so the HUD can show it instantly before the network answers.
 */
export type SnakeRecord = { score: number; alias: string };

const CACHE = "eric-os-snake-record";
const EMPTY: SnakeRecord = { score: 0, alias: "Anonymous" };

function sane(value: unknown): SnakeRecord {
  const v = (value ?? {}) as Partial<SnakeRecord>;
  return {
    score: Number.isFinite(v.score) && (v.score ?? 0) >= 0 ? Math.floor(v.score ?? 0) : 0,
    alias: typeof v.alias === "string" && v.alias.trim() ? v.alias.trim() : "Anonymous",
  };
}

function remember(record: SnakeRecord) {
  try { localStorage.setItem(CACHE, JSON.stringify(record)); } catch { /* storage blocked: no cache */ }
  return record;
}

/** Last record this browser saw (instant; may be stale). */
export function cachedSnakeRecord(): SnakeRecord {
  try { return sane(JSON.parse(localStorage.getItem(CACHE) ?? "null")); } catch { return EMPTY; }
}

/** The live shared record; falls back to the cached one if the network fails. */
export async function fetchSnakeRecord(): Promise<SnakeRecord> {
  try {
    const res = await fetch("/api/record", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return remember(sane(await res.json()));
  } catch {
    return cachedSnakeRecord();
  }
}

/**
 * Claim the record. `ok` is false when someone beat it first (or the score was refused);
 * `record` is always the current record. Throws only when the server can't be reached.
 */
export async function submitSnakeRecord(score: number, alias: string, ms: number): Promise<{ ok: boolean; record: SnakeRecord }> {
  const res = await fetch("/api/record", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ score, alias, ms: Math.round(ms) }),
  });
  const data = (await res.json().catch(() => null)) as { ok?: boolean; record?: unknown } | null;
  if (!data?.record) throw new Error(`HTTP ${res.status}`);
  return { ok: !!data.ok, record: remember(sane(data.record)) };
}
