import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useOS } from "../store";

/**
 * SnakeChat — "Ask the snake" about Tianchi (POST /api/ask → Workers AI, see worker/).
 *
 * The conversation lives in a module-level store, not component state, so it survives
 * the panel closing and the whole desktop unmounting while Snake is played; a page
 * reload starts fresh. Every way it can go sideways has an in-character answer:
 *
 *   slow     no reply after 7 s        → "still chewing…" next to the typing dots
 *   error    no reply by 25 s / network / server error → retry button + email card
 *   offline  the browser is offline → retry button
 *   fast     > 8 questions a minute (browser, and per IP in the Worker) → 15 s lock
 *   full     > 20 questions this visit → 3 min digest lock; any Snake game digests at once
 *   quota    the day's free AI is used up → email card, and the input turns into
 *            "write to Tianchi": Send opens a pre-filled email instead
 */

export type ChatAction = "play" | "dress" | "resume" | "about" | "school" | "ai" | "email";
type Lang = "en" | "zh";
type Msg = {
  role: "user" | "assistant";
  content: string;
  action?: ChatAction; // a button under the answer ("email" renders the email card)
  retry?: string; // a question the visitor can resend with one click
  canned?: boolean; // our own line, never sent back to the model as context
};
type Lock = { kind: "fast" | "full"; from: number; until: number } | null;

export const EMAIL = "ericfu-tianchi@outlook.com";
const CAP = 20;
const DIGEST_MS = 3 * 60_000;
const FAST_N = 8;
const FAST_WINDOW_MS = 60_000;
const FAST_LOCK_MS = 15_000;
const SLOW_MS = 7_000;
const TIMEOUT_MS = 25_000;

const COPY = {
  hello: { en: "Hi! I live on Tianchi's desktop and know his work inside out. Ask me anything.", zh: "嗨！我住在 Tianchi 的桌面上，他的事我门儿清。随便问吧。" },
  slow: { en: "Still chewing on that one…", zh: "还在嚼这个问题……" },
  error: { en: "That one got stuck in my throat. 🐍 Try again, or ask Tianchi directly:", zh: "这个问题卡在我喉咙里了 🐍 再试一次，或者直接问 Tianchi：" },
  fast: { en: "Whoa, slow down — I can only swallow one question at a time. 🐍", zh: "慢点慢点，我一口只能吞一个问题 🐍" },
  full: { en: "I've eaten so many questions I'm too long to move. Play a round of Snake while I digest?", zh: "问题吃太多了，我已经长到动不了了。趁我消化，来一局贪吃蛇？" },
  burp: { en: "Burp. 🐍 All digested — ask away!", zh: "嗝～消化完了，继续问吧！" },
  quota: { en: "My brain ran out of apples for today 🍎 But the real Tianchi answers too — ask him directly:", zh: "今天的苹果吃完了 🍎 不过 Tianchi 本人也会回，直接问他吧：" },
  offline: { en: "Looks like you're offline — my brain needs Wi-Fi. 📡", zh: "你好像断网了，我的脑子需要 Wi-Fi 📡" },
  mailed: { en: "Envelope's ready — just hit Send in your mail app. ✉️", zh: "信封准备好了，在邮件里点发送就行 ✉️" },
};
const ACTION_LABEL: Record<Exclude<ChatAction, "email">, string> = {
  play: "Play Snake",
  dress: "Dress me up",
  resume: "Open resume",
  about: "Open About Me",
  school: "See school projects",
  ai: "See AI projects",
};
const STARTERS = ["What does Tianchi do?", "What is he building lately?", "Show me his AI projects"];

const langOf = (text: string): Lang => (/[一-鿿]/.test(text) ? "zh" : "en");

/* ── store ── */
type State = {
  msgs: Msg[];
  lang: Lang;
  asked: number; // answered questions since the last digest
  sentAt: number[]; // send times inside the fast window
  lock: Lock;
  mail: boolean; // quota gone: Send writes an email instead
  busy: boolean;
  slow: boolean;
  digestOnReturn: boolean; // a Snake game started while full → digest when the desktop comes back
  pending?: string; // the question that hit the full stomach, offered again after the burp
};
let state: State = { msgs: [], lang: "en", asked: 0, sentAt: [], lock: null, mail: false, busy: false, slow: false, digestOnReturn: false };
const listeners = new Set<() => void>();
const set = (patch: Partial<State>) => { state = { ...state, ...patch }; listeners.forEach((l) => l()); };
const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
const say = (content: string, extra: Partial<Msg> = {}) => set({ msgs: [...state.msgs, { role: "assistant", content, canned: true, ...extra }] });

/** Empty the stomach: back to full speed, with a burp. */
function digest() {
  const retry = state.pending;
  set({ asked: 0, lock: null, digestOnReturn: false, pending: undefined });
  say(COPY.burp[state.lang], { retry });
}
/** Called on a timer and whenever the chat opens: lift locks that have run out. */
function settle(now = Date.now()) {
  if (!state.lock || now < state.lock.until) return;
  if (state.lock.kind === "full") digest();
  else set({ lock: null });
}
/** After a Snake game: digest at once if the snake was full. Returns true if it did. */
export function digestAfterGame() {
  if (!state.digestOnReturn) return false;
  digest();
  return true;
}
// Any game started while the snake is full (bubble, chat button, desktop icon) counts.
useOS.subscribe((s, prev) => {
  if (s.snakeMode && !prev.snakeMode && state.lock?.kind === "full") set({ digestOnReturn: true });
});

function mailto(question?: string) {
  const subject = "Hi Tianchi — a question from your snake 🐍";
  const body = question ? `Hi Tianchi,\n\nYour snake couldn't answer this one:\n“${question}”\n\n` : "Hi Tianchi,\n\n";
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
function openMail(question?: string) {
  const a = document.createElement("a");
  a.href = mailto(question);
  a.click();
}

async function send(text: string) {
  const q = text.trim();
  if (!q || state.busy || state.lock) return;
  const lang = langOf(q);
  const now = Date.now();
  const history = state.msgs;
  set({ lang, msgs: [...history, { role: "user", content: q }] });

  if (state.mail) {
    openMail(q);
    return say(COPY.mailed[lang]);
  }
  if (state.asked >= CAP) {
    set({ lock: { kind: "full", from: now, until: now + DIGEST_MS }, pending: q });
    return say(COPY.full[lang]); // the "skip the wait" button under the log offers the game
  }
  const recent = state.sentAt.filter((t) => now - t < FAST_WINDOW_MS);
  if (recent.length >= FAST_N) {
    set({ lock: { kind: "fast", from: now, until: now + FAST_LOCK_MS } });
    return say(COPY.fast[lang], { retry: q });
  }
  set({ sentAt: [...recent, now], busy: true, slow: false });

  const ctrl = new AbortController();
  const slowTimer = window.setTimeout(() => set({ slow: true }), SLOW_MS);
  const killTimer = window.setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const context = [...history.filter((m) => !m.canned), { role: "user", content: q }].map(({ role, content }) => ({ role, content }));
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: context }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { reply?: string; action?: ChatAction; limited?: "fast" | "quota" | "error" };
    if (data.limited === "fast") {
      const t = Date.now();
      set({ lock: { kind: "fast", from: t, until: t + FAST_LOCK_MS } });
      say(COPY.fast[lang], { retry: q });
    } else if (data.limited === "quota") {
      set({ mail: true });
      say(COPY.quota[lang], { action: "email" });
    } else if (data.limited === "error" || !data.reply) {
      say(COPY.error[lang], { action: "email", retry: q });
    } else {
      set({ asked: state.asked + 1, msgs: [...state.msgs, { role: "assistant", content: data.reply, action: data.action }] });
    }
  } catch {
    if (!navigator.onLine) say(COPY.offline[lang], { retry: q });
    else say(COPY.error[lang], { action: "email", retry: q });
  } finally {
    window.clearTimeout(slowTimer);
    window.clearTimeout(killTimer);
    set({ busy: false, slow: false });
  }
}

/* ── UI ── */

function EmailCard({ question }: { question?: string }) {
  const [copied, setCopied] = useState<"" | "ok" | "manual">("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied("ok");
    } catch {
      setCopied("manual"); // clipboard blocked: the address is selectable, say how
    }
    window.setTimeout(() => setCopied(""), 2200);
  };
  return (
    <div className="sguide-mail">
      <div className="addr">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><rect x="1.5" y="3.5" width="13" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M2.5 4.8 8 9l5.5-4.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
        <span>{EMAIL}</span>
      </div>
      <div className="row">
        <button type="button" onClick={copy}>{copied === "ok" ? "Copied ✓" : copied === "manual" ? "Select & ⌘C" : "Copy"}</button>
        <a href={mailto(question)}>Write to Tianchi →</a>
      </div>
      <p>Tianchi reads every email — usually faster than I digest.</p>
    </div>
  );
}

const mmss = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export function SnakeChat({ style, onAct, onClose }: {
  style: React.CSSProperties;
  onAct: (a: Exclude<ChatAction, "email">) => void;
  onClose: () => void;
}) {
  const s = useSyncExternalStore(subscribe, () => state);
  const [draft, setDraft] = useState("");
  const [now, setNow] = useState(Date.now());
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // tick while locked: drive the countdown and lift the lock when it runs out
  useEffect(() => {
    settle();
    if (!s.lock) return;
    const t = window.setInterval(() => { setNow(Date.now()); settle(); }, 250);
    return () => window.clearInterval(t);
  }, [s.lock]);
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight }); }, [s.msgs.length, s.busy, s.slow]);
  useEffect(() => { if (!s.lock && !s.busy) inputRef.current?.focus(); }, [s.lock, s.busy]);

  const lastQuestion = [...s.msgs].reverse().find((m) => m.role === "user")?.content;
  const left = s.lock ? s.lock.until - now : 0;
  const placeholder = s.lock?.kind === "fast"
    ? `Swallowing… ${Math.max(1, Math.ceil(left / 1000))}s`
    : s.lock?.kind === "full"
      ? `Digesting… ${mmss(left)}`
      : s.mail
        ? "Type it here — I'll pass it to Tianchi ✉️"
        : "Ask anything about Tianchi…";

  return (
    <div className="sguide-card sguide-chat" style={style} onPointerDown={(e) => e.stopPropagation()}>
      <header>
        <b>Ask the snake</b>
        <span className="tag">about Tianchi</span>
        <button type="button" className="sguide-x" aria-label="Close" onClick={onClose}>×</button>
      </header>
      <div className="sguide-log" ref={listRef}>
        <div className="msg bot">{COPY.hello.en}</div>
        {s.msgs.map((m, i) => (
          <div key={i} className={`msg ${m.role === "user" ? "me" : "bot"}`}>
            {m.content}
            {m.retry && i === s.msgs.length - 1 && !s.busy && (
              <button type="button" className="sguide-retry" disabled={!!s.lock} onClick={() => void send(m.retry!)}>
                {m.content === COPY.burp[s.lang] ? <span>Ask “{m.retry}”</span> : "Try again"}
              </button>
            )}
            {m.action === "email" && <EmailCard question={m.retry ?? lastQuestion} />}
            {m.action && m.action !== "email" && (
              <button type="button" className="sguide-cta" onClick={() => onAct(m.action as Exclude<ChatAction, "email">)}>{ACTION_LABEL[m.action]} →</button>
            )}
          </div>
        ))}
        {s.busy && (
          <div className="msg bot typing">
            <span className="dots"><i /><i /><i /></span>
            {s.slow && <span className="slow">{COPY.slow[s.lang]}</span>}
          </div>
        )}
        {s.msgs.length === 0 && (
          <div className="chips">
            {STARTERS.map((q) => <button type="button" key={q} onClick={() => void send(q)}>{q}</button>)}
          </div>
        )}
      </div>
      {s.lock && (
        <div className={`sguide-lock ${s.lock.kind}`} aria-hidden>
          <i style={{ width: `${Math.min(100, ((now - s.lock.from) / (s.lock.until - s.lock.from)) * 100)}%` }} />
        </div>
      )}
      {s.lock?.kind === "full" && (
        <button type="button" className="sguide-skip" onClick={() => onAct("play")}>Skip the wait — play a round of Snake →</button>
      )}
      <form onSubmit={(e) => { e.preventDefault(); const q = draft; setDraft(""); void send(q); }}>
        <input
          ref={inputRef}
          autoFocus
          value={draft}
          maxLength={300}
          disabled={!!s.lock}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          aria-label="Your question"
        />
        <button type="submit" disabled={!draft.trim() || s.busy || !!s.lock} aria-label={s.mail ? "Write email" : "Send"}>
          {s.mail
            ? <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden><rect x="1.5" y="3.5" width="13" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M2.5 4.8 8 9l5.5-4.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
            : "↑"}
        </button>
      </form>
      <p className="fine">
        <span>{draft.length >= 240 ? "AI answers can be wrong." : "AI answers can be wrong. Built on Cloudflare Workers AI."}</span>
        {draft.length >= 240 && <span className="count">{draft.length}/300</span>}
      </p>
    </div>
  );
}
