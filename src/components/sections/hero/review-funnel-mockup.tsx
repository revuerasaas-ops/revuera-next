"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Msg {
  id: string;
  // "incoming" = Revuera → left, grey bubble
  // "outgoing" = Customer → right, blue bubble
  dir: "incoming" | "outgoing";
  text?: string;
  isLink?: boolean;
  linkTitle?: string;
}

// ─── Message scripts ─────────────────────────────────────────────────────────
const POSITIVE: Msg[] = [
  { id: "p1", dir: "incoming", text: "Hi Sarah! Thanks for visiting Arrow Air Conditioning. How was your experience today? Reply 1–5" },
  { id: "p2", dir: "outgoing", text: "5" },
  { id: "p3", dir: "incoming", text: "Amazing, thank you! We'd love if you shared your experience on Google:" },
  { id: "p4", dir: "incoming", isLink: true, linkTitle: "Arrow Air Conditioning — leave a review" },
];

const NEGATIVE: Msg[] = [
  { id: "n1", dir: "incoming", text: "Hi Karen! Thanks for visiting Arrow Air Conditioning. How was your experience today? Reply 1–5" },
  { id: "n2", dir: "outgoing", text: "2 — wasn't great honestly" },
  { id: "n3", dir: "incoming", text: "We're really sorry to hear that. Your feedback stays completely private." },
  { id: "n4", dir: "incoming", text: "We'll be in touch to make it right." },
];

// Timing — both phones share same steps, right phone adds delay prop
const STEPS = [
  { t: 600,  action: "msg",    idx: 0 },
  { t: 1700, action: "typing"           },
  { t: 2600, action: "msg",    idx: 1 },
  { t: 3500, action: "typing"           },
  { t: 4400, action: "msg",    idx: 2 },
  { t: 5200, action: "msg",    idx: 3 },
  { t: 8500, action: "reset"            },
] as const;

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif';

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", padding: "2px 16px 4px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        background: "#E9E9EB", borderRadius: 18, borderBottomLeftRadius: 4,
        padding: "10px 14px", minWidth: 52, height: 36, justifyContent: "center",
      }}>
        {[0, 1, 2].map((i) => (
          <motion.span key={i}
            style={{ display: "block", width: 7, height: 7, borderRadius: "50%", background: "#8E8E93", flexShrink: 0 }}
            animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Bubble ───────────────────────────────────────────────────────────────────
function Bubble({ msg }: { msg: Msg }) {
  const isOut = msg.dir === "outgoing";

  if (msg.isLink) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ display: "flex", justifyContent: "flex-start", padding: "2px 16px 4px 16px" }}
      >
        <div style={{
          maxWidth: 220, background: "#fff",
          border: "1px solid rgba(0,0,0,0.1)", borderRadius: 18,
          overflow: "hidden", fontFamily: SF,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}>
          <div style={{ padding: "11px 13px 9px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#007AFF", marginBottom: 4 }}>G.PAGE</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#000", lineHeight: 1.35 }}>{msg.linkTitle}</div>
          </div>
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", background: "rgba(0,122,255,0.06)", padding: "9px 13px", display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#007AFF" }}>Leave a Review</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        display: "flex",
        justifyContent: isOut ? "flex-end" : "flex-start",
        padding: isOut ? "2px 16px 4px 56px" : "2px 56px 4px 16px",
      }}
    >
      <div style={{
        fontFamily: SF, fontSize: 15, lineHeight: 1.4, padding: "10px 14px",
        wordBreak: "break-word",
        ...(isOut ? {
          background: "#007AFF",
          color: "#fff",
          fontWeight: 500,
          borderRadius: 22,
          borderBottomRightRadius: 5,
        } : {
          background: "#E9E9EB",
          color: "#000",
          fontWeight: 400,
          borderRadius: 22,
          borderBottomLeftRadius: 5,
        }),
      }}>
        {msg.text}
      </div>
    </motion.div>
  );
}

// ─── iPhone — white light-mode, cropped top half only ─────────────────────────
function IPhone({
  messages, avatarLetter, avatarBg, contactName, delay = 0,
}: {
  messages: Msg[]; avatarLetter: string; avatarBg: string; contactName: string; delay?: number;
}) {
  const [shown, setShown] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<NodeJS.Timeout[]>([]);
  const started = useRef(false);

  const scrollDown = useCallback(() => {
    setTimeout(() => {
      const el = scrollRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 60);
  }, []);

  const run = useCallback((extra: number) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setShown([]);
    setTyping(false);

    STEPS.forEach((step) => {
      const h = setTimeout(() => {
        if (step.action === "msg") {
          setTyping(false);
          setShown((p) => p.includes(step.idx) ? p : [...p, step.idx]);
          scrollDown();
        } else if (step.action === "typing") {
          setTyping(true);
          scrollDown();
        } else if (step.action === "reset") {
          run(0);
        }
      }, step.t + extra);
      timers.current.push(h);
    });
  }, [scrollDown]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const h = setTimeout(() => run(delay), 900);
    return () => { clearTimeout(h); timers.current.forEach(clearTimeout); };
  }, [run, delay]);

  // Real iPhone 15 Pro proportions
  // Width: 390px logical pixels. We render at 390px wide.
  // We show only the TOP portion — status bar + contact header + message area (no bottom chrome)
  // Crop height: ~480px shows the top 73% of a full 660px phone
  const W = 390;
  const BEZEL = 14;          // frame thickness
  const CORNER = 54;         // outer border radius
  const SCREEN_CORNER = 44;  // inner screen radius

  return (
    <div style={{ position: "relative", width: W, flexShrink: 0 }}>

      {/* ── iPhone 15 Pro titanium frame ── */}
      <div style={{
        width: W,
        height: 760,
        borderRadius: CORNER,
        // Titanium Natural finish — brushed metal gradient
        background: "linear-gradient(160deg, #C8C8CC 0%, #A8A9AD 25%, #B5B5BA 50%, #9A9A9E 75%, #B0B0B5 100%)",
        boxShadow: [
          "0 40px 100px rgba(0,0,0,0.35)",
          "0 15px 40px rgba(0,0,0,0.25)",
          "0 4px 12px rgba(0,0,0,0.18)",
          "inset 0 1px 0 rgba(255,255,255,0.6)",
          "inset 0 -1px 0 rgba(0,0,0,0.15)",
        ].join(", "),
        position: "relative",
        overflow: "hidden",
        padding: BEZEL,
      }}>

        {/* Frame edge sheen */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: CORNER,
          background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(0,0,0,0.1) 100%)",
          pointerEvents: "none", zIndex: 50,
        }}/>

        {/* ── Screen ── */}
        <div style={{
          width: "100%",
          height: "100%",
          borderRadius: SCREEN_CORNER,
          background: "#fff",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}>

          {/* Dynamic Island — exact shape */}
          <div style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 126,
            height: 37,
            background: "#000",
            borderRadius: 20,
            zIndex: 30,
            // Camera pill inside
          }}>
            {/* FaceID camera dot */}
            <div style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              width: 11, height: 11, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #1a3a5c 0%, #0d1f2d 100%)",
              boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.05)",
            }}/>
          </div>

          {/* ── Status bar — light mode ── */}
          <div style={{
            height: 54, flexShrink: 0,
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between",
            padding: "0 26px 10px",
            position: "relative", zIndex: 20,
          }}>
            <span style={{ color: "#000", fontSize: 15, fontWeight: 700, letterSpacing: "-0.4px", fontFamily: SF }}>9:41</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* Signal — 4 bars */}
              <svg width="17" height="12" viewBox="0 0 17 12" fill="#000">
                <rect x="0" y="8.5" width="3" height="3.5" rx="0.7"/>
                <rect x="4.5" y="6" width="3" height="6" rx="0.7"/>
                <rect x="9" y="3" width="3" height="9" rx="0.7"/>
                <rect x="13.5" y="0" width="3" height="12" rx="0.7" opacity="0.3"/>
              </svg>
              {/* Wifi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <circle cx="8" cy="10.5" r="1.5" fill="#000"/>
                <path d="M4.2 7.3A5.25 5.25 0 018 5.8a5.25 5.25 0 013.8 1.5" stroke="#000" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
                <path d="M1.2 4.4A9.5 9.5 0 018 1.8a9.5 9.5 0 016.8 2.6" stroke="#000" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.3"/>
              </svg>
              {/* Battery */}
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
                <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="rgba(0,0,0,0.35)"/>
                <rect x="2" y="2" width="18" height="9" rx="2" fill="#000"/>
                <path d="M24 4.5a2 2 0 010 4V4.5z" fill="rgba(0,0,0,0.4)"/>
              </svg>
            </div>
          </div>

          {/* ── Contact header — light mode ── */}
          <div style={{
            height: 88, flexShrink: 0,
            background: "rgba(242,242,247,0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "0.5px solid rgba(0,0,0,0.1)",
            display: "flex", alignItems: "center",
            padding: "0 20px",
            position: "relative",
          }}>
            {/* Back */}
            <div style={{ display: "flex", alignItems: "center", gap: 3, color: "#007AFF" }}>
              <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
                <path d="M9 1L1 8.5L9 16" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Centre */}
            <div style={{
              position: "absolute", left: "50%", transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: avatarBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700, color: "#fff",
                fontFamily: SF,
              }}>
                {avatarLetter}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{ color: "#000", fontSize: 13, fontWeight: 600, fontFamily: SF }}>{contactName}</span>
                <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
                  <path d="M1 1l5 4.5L1 10" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Video call */}
            <div style={{ marginLeft: "auto" }}>
              <svg width="24" height="17" viewBox="0 0 24 17" fill="none">
                <rect x="0.5" y="0.5" width="14" height="16" rx="3.5" stroke="#007AFF" strokeWidth="1.5"/>
                <path d="M15 5.5l8-3.5v13l-8-3.5" stroke="#007AFF" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* ── Message timestamp ── */}
          <div style={{ textAlign: "center", padding: "12px 0 6px", flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: "#8E8E93", fontWeight: 500, fontFamily: SF }}>
              iMessage · Today 9:41 AM
            </span>
          </div>

          {/* ── Messages scroll area ── */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {/* Top fade — white */}
            <div style={{
              position: "absolute", top: 0, insetInline: 0, height: 28,
              background: "linear-gradient(to bottom, #fff 0%, transparent 100%)",
              zIndex: 10, pointerEvents: "none",
            }}/>

            <div
              ref={scrollRef}
              style={{
                height: "100%", overflowY: "auto",
                scrollbarWidth: "none",
                paddingTop: 4, paddingBottom: 8,
                display: "flex", flexDirection: "column",
                justifyContent: "flex-end",
              } as React.CSSProperties}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                {shown.map((idx) => (
                  <Bubble key={messages[idx].id} msg={messages[idx]} />
                ))}
                {typing && <TypingIndicator />}
              </div>
            </div>

            {/* Bottom fade */}
            <div style={{
              position: "absolute", bottom: 0, insetInline: 0, height: 24,
              background: "linear-gradient(to top, #fff 0%, transparent 100%)",
              zIndex: 10, pointerEvents: "none",
            }}/>
          </div>

          {/* ── iMessage input bar ── */}
          <div style={{
            height: 60, flexShrink: 0,
            background: "rgba(248,248,248,0.96)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "0.5px solid rgba(0,0,0,0.1)",
            display: "flex", alignItems: "center",
            padding: "0 12px", gap: 8,
          }}>
            {/* Apps + button */}
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" stroke="rgba(0,0,0,0.4)" strokeWidth="1"/>
                <path d="M7 4v6M4 7h6" stroke="rgba(0,0,0,0.4)" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            {/* Input pill */}
            <div style={{
              flex: 1, height: 36,
              background: "#fff",
              borderRadius: 18,
              border: "0.5px solid rgba(0,0,0,0.15)",
              display: "flex", alignItems: "center",
              padding: "0 14px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}>
              <span style={{ color: "rgba(0,0,0,0.25)", fontSize: 15, fontFamily: SF }}>iMessage</span>
            </div>
            {/* Mic button */}
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                <rect x="2.5" y="0.5" width="5" height="8.5" rx="2.5" stroke="rgba(0,0,0,0.4)" strokeWidth="1"/>
                <path d="M1 7a4 4 0 008 0" stroke="rgba(0,0,0,0.4)" strokeWidth="1" strokeLinecap="round" fill="none"/>
                <line x1="5" y1="11" x2="5" y2="13.5" stroke="rgba(0,0,0,0.4)" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* ── Home indicator ── */}
          <div style={{
            height: 26, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#fff",
          }}>
            <div style={{
              width: 134, height: 5,
              background: "#000",
              borderRadius: 3,
              opacity: 0.18,
            }}/>
          </div>

        </div>{/* end screen */}
      </div>{/* end frame */}

      {/* ── Physical side buttons — titanium ── */}
      {/* Power — right */}
      <div style={{
        position: "absolute", right: -3, top: 200, width: 3, height: 90,
        background: "linear-gradient(to right, #9A9A9E, #B5B5BA)",
        borderRadius: "0 2px 2px 0",
        boxShadow: "2px 0 4px rgba(0,0,0,0.25)",
      }}/>
      {/* Silent — left */}
      <div style={{
        position: "absolute", left: -3, top: 140, width: 3, height: 34,
        background: "linear-gradient(to left, #9A9A9E, #B5B5BA)",
        borderRadius: "2px 0 0 2px",
        boxShadow: "-2px 0 4px rgba(0,0,0,0.2)",
      }}/>
      {/* Vol up — left */}
      <div style={{
        position: "absolute", left: -3, top: 186, width: 3, height: 70,
        background: "linear-gradient(to left, #9A9A9E, #B5B5BA)",
        borderRadius: "2px 0 0 2px",
        boxShadow: "-2px 0 4px rgba(0,0,0,0.2)",
      }}/>
      {/* Vol down — left */}
      <div style={{
        position: "absolute", left: -3, top: 268, width: 3, height: 70,
        background: "linear-gradient(to left, #9A9A9E, #B5B5BA)",
        borderRadius: "2px 0 0 2px",
        boxShadow: "-2px 0 4px rgba(0,0,0,0.2)",
      }}/>

    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export function ReviewFunnelMockup() {
  // System 1 — tilt only
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale   = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        overflow: "hidden",
        perspective: "1400px",
        perspectiveOrigin: "50% 20%",
        background: "linear-gradient(to bottom, #f3faf0 0%, #eef7eb 60%, #f0f9ed 100%)",
      }}
    >
      <motion.div style={{ rotateX, scale, opacity }}>

        {/* "SEE IT IN ACTION" label */}
        <div style={{ textAlign: "center", paddingTop: 32, paddingBottom: 32 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.18em", color: "#86a889", fontFamily: SF,
          }}>
            See it in action
          </span>
        </div>

        {/* Two iPhones — cropped, side by side */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 40,
          padding: "0 24px",
        }}>
          {/* Left labels float below the crop */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <IPhone
              messages={POSITIVE}
              avatarLetter="S"
              avatarBg="#34C759"
              contactName="Sarah M."
              delay={0}
            />
            <div style={{ marginTop: 20, paddingBottom: 40 }}>
              <span style={{
                fontSize: 12, fontWeight: 600, padding: "7px 16px",
                borderRadius: 999, border: "1px solid #bbf7d0",
                color: "#15803d", background: "#f0fdf4", fontFamily: SF,
              }}>
                ★ Happy customer → Google
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <IPhone
              messages={NEGATIVE}
              avatarLetter="K"
              avatarBg="#8E8E93"
              contactName="Karen T."
              delay={220}
            />
            <div style={{ marginTop: 20, paddingBottom: 40 }}>
              <span style={{
                fontSize: 12, fontWeight: 600, padding: "7px 16px",
                borderRadius: 999, border: "1px solid #e7e5e4",
                color: "#57534e", background: "#fafaf9", fontFamily: SF,
              }}>
                ✗ Unhappy → stays private
              </span>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div style={{ textAlign: "center", paddingBottom: 48, marginTop: -8 }}>
          <p style={{ fontSize: 13, color: "#86a889", fontFamily: SF, margin: 0 }}>
            Smart filtering — every customer gets the right response, automatically.
          </p>
        </div>

      </motion.div>
    </section>
  );
}
