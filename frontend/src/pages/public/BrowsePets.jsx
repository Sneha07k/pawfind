import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import doggoAnimation from "../lottie/Doggo.json";
import PetCard from "../../components/PetCard";
import { searchPets } from "../../api/petApi";
import catLoaderAnimation from "../lottie/CatLoader.json";

/* ---------------------------------------------------------------------- */
/*  Design tokens — "fun" pass, pulled straight from Doggo.lottie's own   */
/*  palette so the mascot and the page read as one piece:                 */
/*  Bubblegum pink #FF5FC4 · Vivid orange #FF7A17 · Teal #00D9B5          */
/*  Sky blue #1AB5FF · Sunshine yellow #FFCF56 · Ink #241E29              */
/* ---------------------------------------------------------------------- */

const PAW_POSITIONS = [
  { top: "6%", left: "4%", size: 34, rotate: -18, delay: "0s", duration: "7s" },
  {
    top: "18%",
    left: "88%",
    size: 26,
    rotate: 24,
    delay: "1.2s",
    duration: "8s",
  },
  {
    top: "62%",
    left: "92%",
    size: 40,
    rotate: -8,
    delay: "0.6s",
    duration: "9s",
  },
  {
    top: "78%",
    left: "2%",
    size: 28,
    rotate: 12,
    delay: "2s",
    duration: "7.5s",
  },
  {
    top: "42%",
    left: "50%",
    size: 20,
    rotate: -30,
    delay: "1.6s",
    duration: "8.5s",
  },
];

function PawPrint({ size = 28, style }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      style={style}
      className="pointer-events-none select-none"
      aria-hidden="true"
    >
      <ellipse cx="32" cy="42" rx="16" ry="14" fill="currentColor" />
      <ellipse cx="12" cy="22" rx="7" ry="9" fill="currentColor" />
      <ellipse cx="28" cy="12" rx="7.5" ry="9.5" fill="currentColor" />
      <ellipse cx="46" cy="14" rx="7" ry="9" fill="currentColor" />
      <ellipse cx="56" cy="30" rx="6.5" ry="8.5" fill="currentColor" />
    </svg>
  );
}

function FloatingPaws() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PAW_POSITIONS.map((p, i) => (
        <div
          key={i}
          className="absolute text-[var(--paw-color)] opacity-[0.08]"
          style={{
            top: p.top,
            left: p.left,
            transform: `rotate(${p.rotate}deg)`,
            animation: `pc-float ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        >
          <PawPrint size={p.size} />
        </div>
      ))}
      {/* A couple of extra ambient decorations — bone + ball, very low opacity */}
      <div
        className="absolute text-[var(--sky)] opacity-[0.07]"
        style={{
          top: "30%",
          left: "12%",
          animation: "pc-bob 6.5s ease-in-out 0.4s infinite",
        }}
      >
        <BoneIcon size={30} />
      </div>
      <div
        className="absolute text-[var(--yellow)] opacity-[0.12]"
        style={{
          bottom: "8%",
          left: "46%",
          animation: "pc-bounce 3.2s ease-in-out infinite",
        }}
      >
        <BallIcon size={22} />
      </div>
    </div>
  );
}

/* Interactive Lottie mascot: idles on loop, gives an extra-happy bounce
   and a little heart burst whenever it's clicked or tapped. */
function DoggoMascot() {
  const lottieRef = useRef(null);
  const [burstKey, setBurstKey] = useState(0);

  const handlePlayfulPoke = () => {
    // Replay from the top at a slightly quicker, extra-excited speed
    lottieRef.current?.setSpeed(1.6);
    lottieRef.current?.goToAndPlay(0, true);
    setBurstKey((k) => k + 1);
    window.setTimeout(() => lottieRef.current?.setSpeed(1), 900);
  };

  return (
    <div className="relative select-none">
      <button
        type="button"
        onClick={handlePlayfulPoke}
        aria-label="Say hi to Doggo"
        className="pc-mascot group block rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[var(--sky)]/30"
        style={{ animation: "pc-bob 4.5s ease-in-out infinite" }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={doggoAnimation}
          loop
          autoplay
          className="w-40 h-40 sm:w-52 sm:h-52 transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
        />
      </button>

      {/* Heart burst — retriggers on every click via the changing key */}
      <div
        key={burstKey}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute text-lg opacity-0"
            style={{
              animation: burstKey
                ? `pc-heart-pop 0.9s ease-out ${i * 0.08}s forwards`
                : "none",
              left: `${46 + i * 8}%`,
            }}
            aria-hidden="true"
          >
            💛
          </span>
        ))}
      </div>
    </div>
  );
}

function BoneIcon({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.5 8.2a2.3 2.3 0 1 0-2.9 3.4 2.3 2.3 0 0 0 0 0.8 2.3 2.3 0 1 0 2.9 3.4l9.9-4.8-9.9-2.8Z" />
      <path d="M19.5 8.2a2.3 2.3 0 1 1 2.9 3.4 2.3 2.3 0 0 1 0 0.8 2.3 2.3 0 1 1-2.9 3.4L9.6 11 19.5 8.2Z" />
    </svg>
  );
}
function BallIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M2 12h20M12 2v20M5 5c3 3 11 3 14 0M5 19c3-3 11-3 14 0"
        stroke="#fff"
        strokeOpacity="0.5"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

/* Small heart-burst used as a subtle "results refreshed" cue */
function HeartPulse({ show }) {
  return (
    <span
      className={`inline-flex items-center transition-all duration-500 ${
        show ? "opacity-100 scale-100" : "opacity-0 scale-75"
      }`}
      aria-hidden="true"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--orange)">
        <path d="M12 21s-7.2-4.6-9.8-9C.6 8.7 2 5 5.4 5c2 0 3.4 1.2 4.1 2.4C10.2 6.2 11.6 5 13.6 5 17 5 18.4 8.7 16.8 12c-2.6 4.4-9.8 9-9.8 9Z" />
      </svg>
    </span>
  );
}

/* Animated "N pets waiting" counter — presentational only, no logic change */
function useCountUp(target, active) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();
    const dur = 600;
    const from = 0;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return n;
}

function FieldShell({ icon, children }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]">
        {icon}
      </span>
      {children}
    </div>
  );
}

const inputBase =
  "w-full rounded-2xl border-2 border-[var(--line)] bg-white pl-10 pr-3 py-2.5 text-sm text-[var(--ink)] " +
  "placeholder:text-[var(--ink-soft)] shadow-[0_1px_2px_rgba(59,50,41,0.04)] transition-all duration-200 " +
  "focus:outline-none focus:border-[var(--sky)] focus:ring-4 focus:ring-[var(--sky)]/15 focus:-translate-y-0.5 " +
  "hover:border-[var(--sky)]/60";

function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-white/70 border-2 border-dashed border-[var(--line)] px-8 py-16 text-center animate-pc-fade-up">
      <div
        className="relative mb-4"
        style={{ animation: "pc-bob 3s ease-in-out infinite" }}
      >
        <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
          <circle cx="42" cy="42" r="40" fill="var(--yellow)" opacity="0.35" />
          <g fill="var(--orange)" opacity="0.9">
            <ellipse cx="42" cy="50" rx="17" ry="14" />
            <ellipse cx="20" cy="30" rx="7.5" ry="9.5" />
            <ellipse cx="36" cy="18" rx="8" ry="10" />
            <ellipse cx="52" cy="18" rx="7.5" ry="9.5" />
            <ellipse cx="64" cy="34" rx="7" ry="9" />
          </g>
        </svg>
      </div>
      <p className="pc-heading text-lg font-bold text-[var(--ink)]">
        No pets found yet <span aria-hidden="true">🐾</span>
      </p>
      <p className="mt-1 max-w-xs text-sm text-[var(--ink-soft)]">
        Let's help a furry friend find a home — try widening your search.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--orange)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:bg-[var(--orange-dark)] active:translate-y-0"
      >
        <RotateIcon /> Clear filters
      </button>
    </div>
  );
}

/* Full-width loading state: a looping cat animation standing in for the
   old skeleton grid while a search request is in flight. */
function CatLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-pc-fade-up">
      <Lottie
        animationData={catLoaderAnimation}
        loop
        autoplay
        className="w-40 h-40 sm:w-48 sm:h-48"
      />
      <p className="mt-2 text-sm font-semibold text-[var(--ink-soft)]">
        Fetching some good boys and girls...
      </p>
    </div>
  );
}

/* Tiny inline icon set — no extra dependency required */
function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function RotateIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 1 3 6.7" />
      <polyline points="3 21 3 15 9 15" />
    </svg>
  );
}
function DogIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 5.2 8 3l-3 1v3l2 1" />
      <path d="M14 5.2 16 3l3 1v3l-2 1" />
      <path d="M5 9c0-2 2-3 7-3s7 1 7 3v4a7 7 0 0 1-7 7 7 7 0 0 1-7-7Z" />
      <circle cx="9.5" cy="12" r=".6" fill="currentColor" />
      <circle cx="14.5" cy="12" r=".6" fill="currentColor" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.6 12.6 12 21.2 2.8 12 11.4 3.4H20.6Z" />
      <circle cx="16" cy="8" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function SyringeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 2 4 4" />
      <path d="m17 7 4-4" />
      <path d="m2 22 5-5" />
      <path d="m14.5 4.5 5 5L8 21H3v-5Z" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function BrowsePets() {
  const [pets, setPets] = useState([]);
  const [filters, setFilters] = useState({
    species: "",
    breed: "",
    gender: "",
    minAge: "",
    maxAge: "",
    vaccinated: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [justUpdated, setJustUpdated] = useState(false);
  const firstLoadDone = useRef(false);

  const load = () => {
    setLoading(true);
    searchPets(filters)
      .then((res) => setPets(res.data))
      .finally(() => {
        setLoading(false);
        firstLoadDone.current = true;
      });
  };

  useEffect(load, []); // initial load, unfiltered

  // Purely decorative: flash a little heart cue whenever a search finishes.
  useEffect(() => {
    if (!loading && firstLoadDone.current) {
      setJustUpdated(true);
      const t = setTimeout(() => setJustUpdated(false), 1400);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    load();
  };

  const handleReset = () => {
    const cleared = {
      species: "",
      breed: "",
      gender: "",
      minAge: "",
      maxAge: "",
      vaccinated: "",
      location: "",
    };
    setFilters(cleared);
    setLoading(true);
    searchPets(cleared)
      .then((res) => setPets(res.data))
      .finally(() => setLoading(false));
  };

  const count = useCountUp(pets.length, !loading && firstLoadDone.current);

  return (
    <div
      className="min-h-screen"
      style={{
        "--orange": "#FF7A17",
        "--orange-dark": "#E8650A",
        "--sky": "#1AB5FF",
        "--mint": "#00C9A7",
        "--pink": "#FF5FC4",
        "--yellow": "#FFCF56",
        "--sand": "#FFF1E6",
        "--line": "#FFE1CE",
        "--ink": "#241E29",
        "--ink-soft": "#8A7E70",
        "--paw-color": "#FF7A17",
        fontFamily: "'Nunito', ui-sans-serif, system-ui, sans-serif",
        background:
          "linear-gradient(180deg, #FFFDF9 0%, #FFF4EC 45%, #FFEEF7 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&family=Nunito:wght@400;600;700;800&display=swap');

        @keyframes pc-float {
          0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
          50% { transform: translateY(-14px) rotate(var(--r, 0deg)); }
        }
        @keyframes pc-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pc-bounce {
          0%, 100% { transform: translateY(0); }
          45% { transform: translateY(-16px); }
          60% { transform: translateY(0); }
          75% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        @keyframes pc-wag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(14deg); }
        }
        @keyframes pc-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pc-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pc-heart-pop {
          0%   { opacity: 0; transform: translateY(0) scale(0.6); }
          25%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-46px) scale(1.15); }
        }
        .animate-pc-fade-up { animation: pc-fade-up 0.5s ease both; }
        .animate-pc-fade-in { animation: pc-fade-in 0.6s ease both; }
        .pc-heading { font-family: 'Quicksand', ui-sans-serif, sans-serif; }

        @media (prefers-reduced-motion: reduce) {
          .animate-pc-fade-up, .animate-pc-fade-in, .pc-card, .pc-btn, .pc-mascot {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="relative overflow-hidden">
        <FloatingPaws />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 pt-10 pb-4 animate-pc-fade-in">
          {/* Hero */}
          <div className="mb-8 flex flex-col-reverse sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--mint)]/15 text-[var(--mint)] text-xs font-bold px-3 py-1 tracking-wide uppercase">
                <PawPrint size={12} /> Adoption made easy
              </span>
              <h1 className="pc-heading mt-3 text-3xl sm:text-4xl font-bold text-[var(--ink)]">
                Find Your New Best Friend
              </h1>
              <p className="mt-2 text-[var(--ink-soft)] max-w-xl mx-auto sm:mx-0">
                Every good boy, good girl, and cheeky cat deserves a couch of
                their own. Filter below and meet your new companion.
              </p>
              {firstLoadDone.current && !loading && (
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--orange-dark)]">
                  <span>
                    🐾 {count} {count === 1 ? "pet is" : "pets are"} waiting for
                    a home
                  </span>
                  <HeartPulse show={justUpdated} />
                </p>
              )}
              <p className="mt-2 text-xs text-[var(--ink-soft)] hidden sm:block">
                Say hi to Doggo — give them a poke! 👉
              </p>
            </div>
            <DoggoMascot />
          </div>

          {/* Filter form */}
          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-3xl shadow-[0_10px_30px_rgba(255,148,87,0.08)] border border-[var(--line)] p-5 sm:p-6 mb-9 grid sm:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            <FieldShell icon={<DogIcon />}>
              <input
                name="species"
                value={filters.species}
                onChange={handleChange}
                placeholder="Species (Dog, Cat...)"
                aria-label="Species"
                className={inputBase}
              />
            </FieldShell>

            <FieldShell icon={<TagIcon />}>
              <input
                name="breed"
                value={filters.breed}
                onChange={handleChange}
                placeholder="Breed"
                aria-label="Breed"
                className={inputBase}
              />
            </FieldShell>

            <div className="relative">
              <select
                name="gender"
                value={filters.gender}
                onChange={handleChange}
                aria-label="Gender"
                className={`${inputBase} pl-3 pr-8 appearance-none cursor-pointer`}
              >
                <option value="">Any gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]">
                <ChevronIcon />
              </span>
            </div>

            <div className="relative">
              <FieldShell icon={<SyringeIcon />}>
                <select
                  name="vaccinated"
                  value={filters.vaccinated}
                  onChange={handleChange}
                  aria-label="Vaccination status"
                  className={`${inputBase} pr-8 appearance-none cursor-pointer`}
                >
                  <option value="">Vaccination — any</option>
                  <option value="true">Vaccinated only</option>
                </select>
              </FieldShell>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-soft)]">
                <ChevronIcon />
              </span>
            </div>

            <FieldShell icon={<CalendarIcon />}>
              <input
                name="minAge"
                value={filters.minAge}
                onChange={handleChange}
                type="number"
                placeholder="Min age (months)"
                aria-label="Minimum age in months"
                className={inputBase}
              />
            </FieldShell>

            <FieldShell icon={<CalendarIcon />}>
              <input
                name="maxAge"
                value={filters.maxAge}
                onChange={handleChange}
                type="number"
                placeholder="Max age (months)"
                aria-label="Maximum age in months"
                className={inputBase}
              />
            </FieldShell>

            <FieldShell icon={<MapPinIcon />}>
              <input
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="Location / area"
                aria-label="Location"
                className={inputBase}
              />
            </FieldShell>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="pc-btn flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--orange)] text-white text-sm font-bold py-2.5 shadow-md transition-all duration-200 hover:bg-[var(--orange-dark)] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                      opacity="0.3"
                    />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <SearchIcon />
                )}
                {loading ? "Searching..." : "Search"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="pc-btn px-4 rounded-2xl border-2 border-[var(--line)] text-sm font-semibold text-[var(--ink)] transition-all duration-200 hover:border-[var(--sky)] hover:text-[var(--sky)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 inline-flex items-center gap-1.5"
              >
                <RotateIcon /> Reset
              </button>
            </div>
          </form>

          {/* Results */}
          <div className="pb-16">
            {loading ? (
              <CatLoader />
            ) : pets.length === 0 ? (
              <EmptyState onReset={handleReset} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {pets.map((pet, i) => (
                  <div
                    key={pet.id}
                    className="pc-card animate-pc-fade-up rounded-3xl transition-transform duration-300 hover:-translate-y-1.5 hover:scale-[1.02] focus-within:-translate-y-1.5"
                    style={{ animationDelay: `${Math.min(i, 10) * 60}ms` }}
                  >
                    <PetCard pet={pet} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
