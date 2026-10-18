import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, ChevronDown, Phone } from "lucide-react";
import { COUPLE, readGuestFromLocation } from "./guest";

const INVITATION = {
  couple: COUPLE,
  parents: {
    first: "Mr. Samaraweera & Mrs. Viviyan",
    second: "Mr. Priyantha & Mrs. Nimali",
  },
  date: {
    weekday: "Thursday",
    month: "December",
    day: "24",
    year: "2026",
    displayNumeric: "24 . 12 . 2026",
    displayLong: "Thursday, 24th December 2026",
    countdownTarget: "2026-12-24T09:00:00+05:30",
  },
  time: {
    start: "9.00 AM",
    end: "4.00 PM",
    poruwa: "10.07 AM",
  },
  venue: {
    name: "The Hotel Green Court",
    city: "Homagama",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=The+Hotel+Green+Court+Homagama",
  },
  rsvp: [
    { name: "Priyantha", display: "077 794 3413", tel: "+94777943413" },
    { name: "Samaraweera", display: "076 258 6214", tel: "+94762586214" },
  ],
} as const;

const backgroundMusic = "/Sandarenu Athi Reeka (සඳ රණ ඇත රක)  Cover Song by Nisal Sathsara ft Sachini Ranawaka.mp3";

// Web app URL from deploying code.gs (Deploy → New deployment → Web app). Ends in /exec.
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbznOYc35v-YvlswZlvd2fI54PAm3gMqra2FJ4Q61Nu4WC1tKJqJfIXmlx8UHHnBFf6-/exec";

const MAX_GUESTS = 10;

const WINE = "#6b1d3a";
const GOLD = "#b8935a";

function Flourish({ light = false, className = "" }: { light?: boolean; className?: string }) {
  const color = light ? "#e9d3a8" : GOLD;
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <div className="h-px w-12 md:w-20" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1">
        <path d="M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z" />
        <circle cx="12" cy="12" r="1.4" fill={color} />
      </svg>
      <div className="h-px w-12 md:w-20" style={{ background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`font-display text-[11px] md:text-xs tracking-[0.35em] uppercase ${light ? "text-[#f1dcc0]" : "text-[#9a7646]"}`}
    >
      {children}
    </p>
  );
}

const SAKURA_PETAL_PATH =
  "M20 48 C9 41 2 28 5 16 C7 8 12 3 16.5 4 L20 10 L23.5 4 C28 3 33 8 35 16 C38 28 31 41 20 48 Z";
const SAKURA_GRADIENTS = ["sakura-blush", "sakura-pink", "sakura-pale"] as const;

type Petal = {
  id: number;
  x: number;
  size: number;
  fallDuration: number;
  delay: number;
  drift: number;
  sway: number;
  swayDuration: number;
  flipDuration: number;
  spin: number;
  gradient: (typeof SAKURA_GRADIENTS)[number];
  depth: "far" | "mid" | "near";
};

function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.innerWidth < 768;
    const petalCount = isMobile ? 12 : 22;

    setPetals(
      Array.from({ length: petalCount }).map((_, i) => {
        const depthRoll = Math.random();
        const depth: Petal["depth"] = depthRoll < 0.35 ? "far" : depthRoll < 0.8 ? "mid" : "near";
        const size =
          depth === "far" ? 9 + Math.random() * 5 : depth === "mid" ? 14 + Math.random() * 6 : 21 + Math.random() * 8;
        // Nearer petals fall faster across the screen, which adds parallax depth
        const fallDuration = (depth === "far" ? 22 : depth === "mid" ? 17 : 13) + Math.random() * 6;

        return {
          id: i,
          x: Math.random() * 100,
          size,
          fallDuration,
          // Negative delay so petals are already mid-fall on first paint
          delay: -Math.random() * fallDuration,
          drift: Math.random() * 30 - 10,
          sway: 25 + Math.random() * 45,
          swayDuration: 3 + Math.random() * 3,
          flipDuration: 3.5 + Math.random() * 4,
          spin: Math.random() > 0.5 ? 1 : -1,
          gradient: SAKURA_GRADIENTS[Math.floor(Math.random() * SAKURA_GRADIENTS.length)],
          depth,
        };
      }),
    );
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-40 sakura-stage" aria-hidden="true">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="sakura-blush" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#fff7f9" />
            <stop offset="55%" stopColor="#fbcfdc" />
            <stop offset="100%" stopColor="#f19bb4" />
          </linearGradient>
          <linearGradient id="sakura-pink" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#fde8ee" />
            <stop offset="50%" stopColor="#f6b3c6" />
            <stop offset="100%" stopColor="#e58aa5" />
          </linearGradient>
          <linearGradient id="sakura-pale" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#fde2ea" />
            <stop offset="100%" stopColor="#f7c0d0" />
          </linearGradient>
          <radialGradient id="sakura-sheen" cx="0.35" cy="0.45" r="0.6">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {petals.map((p) => (
        <div
          key={p.id}
          className={`sakura-fall sakura-${p.depth}`}
          style={
            {
              left: `${p.x}vw`,
              "--fall-duration": `${p.fallDuration}s`,
              "--fall-delay": `${p.delay}s`,
              "--drift": `${p.drift}vw`,
            } as React.CSSProperties
          }
        >
          <div
            className="sakura-sway"
            style={{ "--sway": `${p.sway}px`, "--sway-duration": `${p.swayDuration}s` } as React.CSSProperties}
          >
            <div
              className="sakura-flip"
              style={{ "--flip-duration": `${p.flipDuration}s`, "--spin": p.spin } as React.CSSProperties}
            >
              <svg width={p.size} height={p.size * 1.2} viewBox="0 0 40 50">
                <path d={SAKURA_PETAL_PATH} fill={`url(#${p.gradient})`} />
                <path d={SAKURA_PETAL_PATH} fill="url(#sakura-sheen)" />
                <path d="M20 46 C19 34 19.5 22 20 12" stroke="#e48aa4" strokeOpacity="0.35" strokeWidth="0.8" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CountdownTimer() {
  const targetDate = new Date(INVITATION.date.countdownTarget).getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(targetDate - Date.now()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const t = Math.max(0, timeLeft);
  const stats = [
    { label: "Days", value: Math.floor(t / 86400000) },
    { label: "Hours", value: Math.floor((t % 86400000) / 3600000) },
    { label: "Minutes", value: Math.floor((t % 3600000) / 60000) },
    { label: "Seconds", value: Math.floor((t % 60000) / 1000) },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-8 w-full max-w-3xl mx-auto mt-10 md:mt-16">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
          className="relative h-28 sm:h-32 md:h-44 rounded-t-full border border-[#e9d3a8]/40 bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center"
        >
          <div className="absolute inset-1.5 md:inset-2.5 rounded-t-full border-[0.5px] border-[#e9d3a8]/25 pointer-events-none" />
          <span className="font-numeric text-3xl sm:text-4xl md:text-6xl font-light text-white leading-none mt-4">
            {stat.value.toString().padStart(2, "0")}
          </span>
          <span className="font-display mt-2 md:mt-4 text-[8px] sm:text-[9px] md:text-[11px] tracking-[0.25em] uppercase text-[#f1dcc0]">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function DetailRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-full border border-[#b8935a]/40 flex items-center justify-center text-[#9a7646]">
        {icon}
      </div>
      <Eyebrow>{label}</Eyebrow>
      <div className="text-xl md:text-2xl text-[#3a2a30] leading-snug">{children}</div>
    </div>
  );
}

function RsvpForm({ defaultName }: { defaultName: string }) {
  const [name, setName] = useState(defaultName);
  const [attendance, setAttendance] = useState<"accept" | "decline" | null>(null);
  const [guests, setGuests] = useState(1);
  const [wish, setWish] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!attendance) {
      setError("Please let us know if you can attend.");
      return;
    }

    setError("");
    setStatus("sending");

    try {
      if (!GOOGLE_SCRIPT_URL) throw new Error("RSVP endpoint not configured");

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: new URLSearchParams({
          action: "rsvp",
          name: name.trim(),
          attendance: attendance === "accept" ? "Attending" : "Declined",
          guests: attendance === "accept" ? String(guests) : "0",
          wish: wish.trim(),
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      const result = await response.json().catch(() => ({ ok: true }));
      if (result && result.ok === false) throw new Error(result.message);
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again or call us.");
    }
  };

  if (status === "success") {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10 space-y-3">
        <p className="font-script text-5xl" style={{ color: WINE }}>
          {attendance === "accept" ? "See you there!" : "You'll be missed"}
        </p>
        <p className="italic text-lg md:text-xl text-[#5a4148] leading-relaxed">
          {attendance === "accept"
            ? `Thank you, ${name.trim()}. We have reserved ${guests} ${guests === 1 ? "seat" : "seats"} for you.`
            : `Thank you for letting us know, ${name.trim()}. We'll miss you on our special day.`}
        </p>
        {wish.trim() && (
          <p className="italic text-base md:text-lg text-[#9a7646]">Your lovely wishes mean so much to us.</p>
        )}
      </motion.div>
    );
  }

  const choiceClass = (active: boolean) =>
    `flex-1 px-3 py-4 border font-display text-[10px] md:text-xs tracking-[0.25em] uppercase transition-colors ${active
      ? "bg-[#6b1d3a] border-[#6b1d3a] text-white"
      : "border-[#b8935a]/40 text-[#3a2a30] hover:border-[#6b1d3a]/60"
    }`;

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6 text-left">
      <label className="block">
        <span className="font-display text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#9a7646]">Your Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="mt-2 w-full bg-transparent border-b border-[#b8935a]/50 py-2 text-xl text-[#3a2a30] placeholder:text-[#3a2a30]/30 placeholder:italic focus:outline-none focus:border-[#6b1d3a]"
        />
      </label>

      <div>
        <span className="font-display text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#9a7646]">Will you attend?</span>
        <div className="mt-3 flex gap-3">
          <button type="button" onClick={() => setAttendance("accept")} className={choiceClass(attendance === "accept")}>
            Joyfully Accept
          </button>
          <button type="button" onClick={() => setAttendance("decline")} className={choiceClass(attendance === "decline")}>
            Regretfully Decline
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {attendance === "accept" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <span className="font-display text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#9a7646]">Number of Guests</span>
            <div className="mt-3 flex items-center justify-center gap-6 border border-[#b8935a]/40 py-3">
              <button
                type="button"
                aria-label="Fewer guests"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                disabled={guests <= 1}
                className="w-10 h-10 rounded-full border border-[#b8935a]/50 text-2xl leading-none text-[#6b1d3a] disabled:opacity-30"
              >
                −
              </button>
              <span className="font-numeric text-4xl w-12 text-center" style={{ color: WINE }}>{guests}</span>
              <button
                type="button"
                aria-label="More guests"
                onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                disabled={guests >= MAX_GUESTS}
                className="w-10 h-10 rounded-full border border-[#b8935a]/50 text-2xl leading-none text-[#6b1d3a] disabled:opacity-30"
              >
                +
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <label className="block">
        <span className="font-display text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#9a7646]">
          Wishes for the Couple <span className="normal-case tracking-normal italic font-serif text-sm">(optional)</span>
        </span>
        <textarea
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="Share your love and blessings…"
          className="mt-2 w-full resize-none bg-[#fdf8f4]/60 border border-[#b8935a]/40 p-3 text-lg text-[#3a2a30] leading-relaxed placeholder:text-[#3a2a30]/30 placeholder:italic focus:outline-none focus:border-[#6b1d3a]"
        />
      </label>

      {error && <p className="italic text-center text-[#a3263f]">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-4 text-white font-display text-[11px] md:text-xs tracking-[0.3em] uppercase shadow-xl hover:opacity-90 transition-opacity disabled:opacity-60"
        style={{ background: WINE }}
      >
        {status === "sending" ? "Sending…" : "Send RSVP"}
      </button>
    </form>
  );
}

export default function WeddingInvitation() {
  const [guest] = useState(() => readGuestFromLocation(window.location));
  const guestName = guest?.guestName ?? null;
  const guestLine = guest?.displayName ?? null;

  const [hasStarted, setHasStarted] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false);

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const introVideoRef = React.useRef<HTMLVideoElement>(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if ((hasStarted || isOpened) && !isPlaying && !hasAttemptedAutoplay && audioRef.current) {
      setHasAttemptedAutoplay(true);

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          const playOnInteraction = () => {
            if (audioRef.current && !isPlaying) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  window.removeEventListener("click", playOnInteraction);
                })
                .catch(() => { });
            }
          };
          window.addEventListener("click", playOnInteraction);
        });
    }
  }, [hasStarted, isOpened, isPlaying, hasAttemptedAutoplay]);

  useEffect(() => {
    if (introVideoRef.current && !hasStarted) {
      introVideoRef.current.play().catch((err) => {
        console.log("Intro video autoplay failed:", err);
      });
    }
  }, [hasStarted]);

  return (
    <main
      className={`h-[100dvh] w-full bg-[#fdf8f4] transition-all duration-1000 ${isOpened ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden flex items-center justify-center"
        } relative scroll-smooth`}
    >
      <FloatingPetals />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="video-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2 } }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          >
            <video
              ref={introVideoRef}
              src="/Wedding_invitation_intro_video_202606081545.mp4"
              muted={!hasStarted}
              playsInline
              preload="auto"
              autoPlay
              loop={!hasStarted}
              className={`w-full h-full object-cover transition-all duration-[2000ms] ease-out ${!hasStarted ? "blur-md scale-105 opacity-80" : "blur-0 scale-100 opacity-100"
                }`}
              onEnded={() => setIsOpened(true)}
              onError={() => setIsOpened(true)}
            />

            {!hasStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-[120] bg-black/45 backdrop-blur-[2px] px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-center"
                >
                  <Eyebrow light>You are invited to the wedding of</Eyebrow>
                  <motion.h2
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="font-script text-6xl md:text-8xl text-white mt-6 mb-4 drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]"
                  >
                    {INVITATION.couple.bride} <span className="text-[#e9d3a8]">&amp;</span> {INVITATION.couple.groom}
                  </motion.h2>
                  <p className="font-display text-xs md:text-sm tracking-[0.4em] text-white/85 mb-12">
                    {INVITATION.date.displayNumeric}
                  </p>

                  <button
                    onClick={() => {
                      setHasStarted(true);
                      if (introVideoRef.current) {
                        introVideoRef.current.muted = true;
                        introVideoRef.current.loop = false;
                        introVideoRef.current.currentTime = 0;
                        introVideoRef.current.play().catch((err) => console.log(err));
                      }
                    }}
                    className="group relative px-10 py-4 overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 border border-[#e9d3a8]/70 bg-black/20 backdrop-blur-sm"
                  >
                    <div className="absolute inset-[3px] border border-[#e9d3a8]/30 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e9d3a8]/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative z-10 font-display text-white text-xs md:text-sm tracking-[0.35em] uppercase">
                      Open Invitation
                    </span>
                  </button>
                </motion.div>
              </div>
            )}

            {hasStarted && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-start pt-[28vh] md:pt-32 z-[105] pointer-events-none text-center px-6"
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.8 }}
                    className="font-display text-xs md:text-sm tracking-[0.4em] uppercase mb-6"
                    style={{ color: WINE }}
                  >
                    The Wedding Of
                  </motion.p>

                  <div className="flex flex-col items-center w-full max-w-[320px] mx-auto" style={{ color: WINE }}>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 2, delay: 1.2 }}
                      className="font-script text-6xl md:text-8xl self-start drop-shadow-sm"
                    >
                      {INVITATION.couple.bride}
                    </motion.p>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 2, delay: 1.5 }}
                      className="font-script text-4xl md:text-5xl my-1"
                      style={{ color: GOLD }}
                    >
                      &amp;
                    </motion.span>
                    <motion.p
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 2, delay: 1.8 }}
                      className="font-script text-6xl md:text-8xl self-end drop-shadow-sm"
                    >
                      {INVITATION.couple.groom}
                    </motion.p>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setIsOpened(true)}
                  className="absolute bottom-10 right-6 md:right-10 z-[110] px-7 py-3 bg-white/50 backdrop-blur-md font-display text-[11px] tracking-[0.3em] uppercase border border-[#6b1d3a]/30 hover:bg-white/70 transition-all shadow-lg"
                  style={{ color: WINE }}
                >
                  Skip
                </motion.button>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="website-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="website-shell relative z-20 w-full"
          >
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsOpened(false)}
              className="fixed top-5 right-5 z-50 bg-white/80 backdrop-blur-md px-4 py-2.5 shadow-md border border-[#b8935a]/30 font-display text-[10px] tracking-[0.3em] uppercase hover:bg-white transition-colors"
              style={{ color: WINE }}
            >
              Replay
            </motion.button>

            {/* Hero */}
            <section className="w-full relative flex items-center justify-center overflow-hidden min-h-[100dvh] py-24">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url('/ChatGPT%20Image%20Jun%208,%202026,%2003_51_28%20PM.png')` }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/20 to-[#fdf8f4]" aria-hidden="true" />

              <div className="relative z-10 w-full max-w-4xl px-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.8 }}
                >
                  <Eyebrow>Together with their families</Eyebrow>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 1 }}
                  className="mt-8"
                >
                  <h1 className="font-script text-7xl sm:text-8xl md:text-9xl leading-[1.05] drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]" style={{ color: WINE }}>
                    {INVITATION.couple.bride}
                  </h1>
                  <p className="font-script text-5xl md:text-6xl my-2" style={{ color: GOLD }}>&amp;</p>
                  <h1 className="font-script text-7xl sm:text-8xl md:text-9xl leading-[1.05] drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]" style={{ color: WINE }}>
                    {INVITATION.couple.groom}
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mt-12"
                >
                  <div className="inline-flex items-center gap-4 md:gap-6 font-display text-[#3a2a30]">
                    <span className="text-[11px] md:text-sm tracking-[0.3em] uppercase border-t border-b border-[#b8935a]/50 py-2 w-24 md:w-32">
                      {INVITATION.date.weekday}
                    </span>
                    <span className="flex flex-col items-center leading-none">
                      <span className="text-[11px] md:text-xs tracking-[0.3em] uppercase text-[#9a7646]">{INVITATION.date.month}</span>
                      <span className="font-numeric text-5xl md:text-6xl my-1" style={{ color: WINE }}>{INVITATION.date.day}</span>
                      <span className="text-[11px] md:text-xs tracking-[0.3em] text-[#9a7646]">{INVITATION.date.year}</span>
                    </span>
                    <span className="text-[11px] md:text-sm tracking-[0.3em] uppercase border-t border-b border-[#b8935a]/50 py-2 w-24 md:w-32">
                      {INVITATION.time.start}
                    </span>
                  </div>

                  <p className="mt-8 font-display text-xs md:text-sm tracking-[0.3em] uppercase text-[#5a4148]">
                    {INVITATION.venue.name} · {INVITATION.venue.city}
                  </p>

                  <a
                    href="#invitation"
                    className="inline-flex items-center justify-center gap-2 mt-10 px-8 py-3.5 text-white font-display text-[11px] md:text-xs tracking-[0.3em] uppercase shadow-xl hover:opacity-90 transition-opacity"
                    style={{ background: WINE }}
                  >
                    View Invitation
                    <ChevronDown className="w-4 h-4" />
                  </a>
                </motion.div>
              </div>
            </section>

            {/* Formal invitation card */}
            <section id="invitation" className="relative py-16 md:py-28 w-full flex justify-center px-5">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative w-full max-w-2xl bg-[#fffdfa] px-6 py-14 md:px-16 md:py-20 text-center shadow-[0_40px_80px_-30px_rgba(107,29,58,0.25)]"
              >
                <div className="absolute inset-3 border border-[#b8935a]/50 pointer-events-none" />
                <div className="absolute inset-[18px] border-[0.5px] border-[#b8935a]/30 pointer-events-none" />

                <div className="relative space-y-7">
                  <Flourish />

                  <div className="space-y-3">
                    <p className="font-display text-sm md:text-lg tracking-[0.15em] text-[#3a2a30]">
                      {INVITATION.parents.first}
                    </p>
                    <p className="italic text-lg md:text-xl text-[#9a7646]">together with</p>
                    <p className="font-display text-sm md:text-lg tracking-[0.15em] text-[#3a2a30]">
                      {INVITATION.parents.second}
                    </p>
                  </div>

                  <p className="italic text-lg md:text-xl text-[#5a4148] leading-relaxed">
                    request the pleasure of your company
                  </p>

                  <div className="py-2">
                    {guestLine ? (
                      <p className="font-script text-4xl md:text-5xl leading-snug" style={{ color: WINE }}>
                        {guestLine}
                        <span className="block mx-auto mt-2 w-56 max-w-full border-b border-dotted border-[#b8935a]" />
                      </p>
                    ) : (
                      <p className="font-display text-sm md:text-base tracking-[0.2em] text-[#5a4148]">
                        Mr. &amp; Mrs. / Miss
                        <span className="block mx-auto mt-3 w-56 border-b border-dotted border-[#b8935a]" />
                      </p>
                    )}
                  </div>

                  <p className="italic text-lg md:text-xl text-[#5a4148] leading-relaxed">
                    to celebrate the marriage of their loving children
                  </p>

                  <div>
                    <p className="font-script text-6xl md:text-8xl leading-tight" style={{ color: WINE }}>
                      {INVITATION.couple.bride}
                    </p>
                    <p className="font-script text-4xl md:text-5xl -my-1" style={{ color: GOLD }}>&amp;</p>
                    <p className="font-script text-6xl md:text-8xl leading-tight" style={{ color: WINE }}>
                      {INVITATION.couple.groom}
                    </p>
                  </div>

                  <div className="border-t border-b border-[#b8935a]/40 py-6 space-y-2 font-display text-[#3a2a30]">
                    <p className="text-sm md:text-base tracking-[0.3em] uppercase">{INVITATION.date.month}</p>
                    <p className="text-base md:text-xl tracking-[0.2em] uppercase">
                      {INVITATION.date.weekday} {INVITATION.date.day} {INVITATION.date.year}
                    </p>
                    <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-[#9a7646]">
                      From {INVITATION.time.start} to {INVITATION.time.end}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-display text-base md:text-xl tracking-[0.2em] uppercase text-[#3a2a30]">
                      {INVITATION.venue.name}
                    </p>
                    <p className="font-display text-xs md:text-sm tracking-[0.35em] uppercase text-[#9a7646]">
                      {INVITATION.venue.city}
                    </p>
                  </div>

                  <p className="italic text-lg md:text-xl" style={{ color: WINE }}>
                    (Poruwa ceremony at {INVITATION.time.poruwa})
                  </p>

                  <Flourish />
                </div>
              </motion.div>
            </section>

            {/* Save the date + countdown */}
            <section className="relative py-20 md:py-40 flex flex-col items-center overflow-hidden">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url('/ChatGPT%20Image%20Jun%208,%202026,%2003_57_11%20PM.png')` }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-[#3d0f22]/30" aria-hidden="true" />

              <div className="w-full max-w-5xl px-5 flex flex-col items-center text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="flex flex-col items-center"
                >
                  <Eyebrow light>Counting down to forever</Eyebrow>
                  <h2 className="font-script text-7xl md:text-[110px] text-white leading-tight mt-4">
                    Save the Date
                  </h2>
                  <Flourish light className="mt-4" />
                  <p className="mt-6 font-display text-lg md:text-2xl tracking-[0.35em] text-[#f1dcc0]">
                    {INVITATION.date.displayNumeric}
                  </p>
                </motion.div>

                <CountdownTimer />
              </div>
            </section>

            {/* Details */}
            <section className="relative py-16 md:py-32 px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-5xl mx-auto text-center"
              >
                <Eyebrow>The Celebration</Eyebrow>
                <h2 className="font-script text-6xl md:text-8xl mt-3 leading-tight" style={{ color: WINE }}>
                  Wedding Details
                </h2>
                <Flourish className="mt-2" />

                <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                  <DetailRow icon={<Calendar className="w-5 h-5" />} label="When">
                    <p>{INVITATION.date.displayLong}</p>
                  </DetailRow>
                  <DetailRow icon={<Clock className="w-5 h-5" />} label="Schedule">
                    <p>{INVITATION.time.start} – {INVITATION.time.end}</p>
                    <p className="italic text-lg md:text-xl text-[#9a7646] mt-1">
                      Poruwa ceremony at {INVITATION.time.poruwa}
                    </p>
                  </DetailRow>
                  <DetailRow icon={<MapPin className="w-5 h-5" />} label="Where">
                    <p>{INVITATION.venue.name}</p>
                    <p className="italic text-lg md:text-xl text-[#9a7646] mt-1">{INVITATION.venue.city}</p>
                  </DetailRow>
                </div>

                <button
                  onClick={() => window.open(INVITATION.venue.googleMapsLink, "_blank")}
                  className="mt-14 inline-flex items-center justify-center gap-3 px-10 py-4 text-white font-display text-[11px] md:text-xs tracking-[0.3em] uppercase shadow-xl hover:opacity-90 transition-opacity"
                  style={{ background: WINE }}
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </button>
              </motion.div>
            </section>

            {/* RSVP */}
            <section className="relative py-16 md:py-28 px-5">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative max-w-xl mx-auto bg-[#fffdfa] px-6 py-14 md:px-14 text-center shadow-[0_40px_80px_-30px_rgba(107,29,58,0.25)]"
              >
                <div className="absolute inset-3 border border-[#b8935a]/50 pointer-events-none" />

                <div className="relative">
                  <h2 className="font-script text-6xl md:text-7xl leading-tight" style={{ color: WINE }}>
                    RSVP
                  </h2>
                  <Flourish className="mt-5" />
                  <p className="italic text-lg md:text-xl text-[#5a4148] mt-5 leading-relaxed">
                    Kindly let us know whether you will be able to join us.
                  </p>

                  <RsvpForm defaultName={guestName ?? ""} />

                  <p className="font-display text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#9a7646] mt-12">
                    Or call us
                  </p>
                  <div className="mt-4 space-y-4">
                    {INVITATION.rsvp.map((c) => (
                      <a
                        key={c.tel}
                        href={`tel:${c.tel}`}
                        className="group flex items-center justify-between gap-4 border border-[#b8935a]/40 px-5 py-4 hover:bg-[#6b1d3a] hover:border-[#6b1d3a] transition-colors"
                      >
                        <span className="font-display text-xs md:text-sm tracking-[0.25em] uppercase text-[#3a2a30] group-hover:text-white transition-colors">
                          {c.name}
                        </span>
                        <span className="flex items-center gap-2 font-numeric text-lg md:text-xl text-[#6b1d3a] group-hover:text-white transition-colors">
                          <Phone className="w-4 h-4" />
                          {c.display}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Thank you */}
            <section className="w-full relative overflow-hidden py-16 md:py-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="max-w-3xl mx-auto px-6 text-center space-y-6"
              >
                <Flourish />
                <h2 className="font-script text-6xl md:text-8xl leading-tight" style={{ color: WINE }}>
                  Thank You
                </h2>
                <p className="italic text-lg md:text-2xl text-[#5a4148] leading-relaxed">
                  Your presence and blessings will make our special day truly complete.
                  We look forward to celebrating with you.
                </p>
                <p className="font-script text-4xl md:text-5xl pt-6" style={{ color: GOLD }}>
                  {INVITATION.couple.bride} &amp; {INVITATION.couple.groom}
                </p>
                <p className="font-display text-[10px] md:text-xs tracking-[0.35em] text-[#9a7646] pt-4">
                  {INVITATION.date.displayNumeric}
                </p>
              </motion.div>
            </section>

            <footer className="w-full bg-[#4a1428] border-t border-[#D4AF37]/30 py-6 pl-6 pr-20 sm:px-20 text-center">
              <p className="text-[#D4AF37] text-xs mt-2 font-sans tracking-wider leading-relaxed">
                Want a beautiful wedding website like this? Create yours with{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:text-[#D4AF37] underline underline-offset-2 transition-colors"
                  href="https://wa.me/94707819074"
                >
                  invitemint
                </a>
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={backgroundMusic} loop />

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className="fixed bottom-6 right-6 z-[60] bg-white p-3 rounded-full shadow-lg border border-[#b8935a]/40 hover:bg-[#fdf3ee] transition-colors"
        style={{ color: WINE }}
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </motion.button>
    </main>
  );
}
