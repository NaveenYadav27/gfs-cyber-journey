import { useMemo, useState } from "react";
import {
  CAREER_LADDER,
  DEPARTMENTS,
  EXPLORER_TRACKS,
  JOBS,
  JOURNEY,
  ORG_TREE,
  RELATIONSHIP_GRAPH,
  SKILL_MATRIX,
  type Department,
  type JobPosting,
  type LadderRole,
} from "./data";

/* ---------- Small primitives ---------- */

function Chip({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "cyan" | "emerald" | "amber" | "rose" | "violet";
}) {
  const tones: Record<string, string> = {
    default: "border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--muted-foreground)]",
    cyan: "border-[color:var(--cyan)]/40 bg-[color:var(--cyan)]/10 text-[color:var(--cyan)]",
    emerald: "border-[color:var(--emerald)]/40 bg-[color:var(--emerald)]/10 text-[color:var(--emerald)]",
    amber: "border-[color:var(--amber)]/40 bg-[color:var(--amber)]/10 text-[color:var(--amber)]",
    rose: "border-[color:var(--rose)]/40 bg-[color:var(--rose)]/10 text-[color:var(--rose)]",
    violet: "border-[color:var(--violet)]/40 bg-[color:var(--violet)]/10 text-[color:var(--violet)]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cyan)]">
          <span className="h-px w-8 bg-[color:var(--cyan)]/60" />
          {eyebrow}
        </div>
        <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[color:var(--muted-foreground)]">
            {description}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

const TRACK_TONE: Record<LadderRole["track"], "cyan" | "emerald" | "amber" | "rose" | "violet" | "default"> = {
  Technology: "cyan",
  "Security Ops": "emerald",
  Engineering: "violet",
  GRC: "amber",
  Offensive: "rose",
  Architecture: "cyan",
  Leadership: "amber",
};

/* ---------- Top bar ---------- */

function TopBar() {
  const items = [
    { label: "Enterprise Career Framework", active: true },
    { label: "Internal Job Board" },
    { label: "Departments" },
    { label: "Career Explorer" },
    { label: "Skills Matrix" },
    { label: "Learning Paths" },
  ];
  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--border)]/70 bg-[color:var(--background)]/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-[color:var(--primary)]/15 text-[color:var(--primary)] ring-1 ring-inset ring-[color:var(--primary)]/40">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
              CyberOS · Enterprise
            </div>
            <div className="font-semibold">Global Financial Services</div>
          </div>
        </div>
        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((it) => {
            const idMap: Record<string, string> = {
              "Enterprise Career Framework": "framework",
              "Internal Job Board": "jobs",
              "Departments": "departments",
              "Career Explorer": "explorer",
              "Skills Matrix": "skills",
              "Learning Paths": "learning",
            };
            const targetId = idMap[it.label];
            
            return (
              <button
                key={it.label}
                onClick={() => {
                  if (targetId === "learning") {
                    window.location.href = "/dashboard";
                  } else {
                    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  it.active
                    ? "bg-[color:var(--surface-3)] text-[color:var(--foreground)] ring-1 ring-inset ring-[color:var(--border)]"
                    : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                }`}
              >
                {it.label}
              </button>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden text-right text-xs leading-tight md:block">
            <div className="font-medium">Aarav Mehta</div>
            <div className="text-[color:var(--muted-foreground)]">SOC Analyst L1 · Bengaluru</div>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[color:var(--cyan)] to-[color:var(--violet)] text-xs font-semibold text-[color:var(--primary-foreground)]">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  const stats = [
    { value: "40+", label: "Cybersecurity roles at GFS" },
    { value: "20", label: "Cyber departments" },
    { value: "9", label: "Progression bands" },
    { value: "43", label: "Countries · one framework" },
  ];
  return (
    <section id="framework" className="relative overflow-hidden border-b border-[color:var(--border)]/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--emerald)]" />
            Enterprise Cybersecurity Career Framework
          </div>
          <h1 className="text-4xl font-semibold leading-[1.05] md:text-6xl">
            Build your career at <span className="text-gradient-cyber">GFS.</span>
            <br />
            <span className="text-[color:var(--muted-foreground)]">
              From technology foundations to executive leadership.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[color:var(--muted-foreground)]">
            You just joined Global Financial Services. This is not a certification checklist —
            it is the internal map of every cybersecurity career at GFS. Explore departments,
            move between teams through Internal Job Postings, and see exactly where each role
            leads next.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button onClick={() => window.location.href = '/dashboard'} className="rounded-md bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110">
              Open my career journey
            </button>
            <button onClick={() => document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] px-5 py-2.5 text-sm font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-3)]">
              Browse internal jobs · 68 open
            </button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--border)] md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-[color:var(--surface-1)] px-4 py-5">
                <div className="font-display text-2xl font-semibold text-[color:var(--cyan)]">{s.value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-[color:var(--muted-foreground)]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <HeroCareerMountain />
      </div>
    </section>
  );
}

function HeroCareerMountain() {
  return (
    <div className="card-elev relative min-h-[420px] overflow-hidden p-6">
      <div className="flex items-center justify-between text-xs">
        <span className="uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
          Career altitude · GFS
        </span>
        <Chip tone="cyan">Live</Chip>
      </div>
      <svg viewBox="0 0 400 320" className="mt-4 h-[340px] w-full">
        <defs>
          <linearGradient id="ridge" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.82 0.14 210)" />
            <stop offset="100%" stopColor="oklch(0.68 0.20 295)" />
          </linearGradient>
          <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.14 210 / 0.25)" />
            <stop offset="100%" stopColor="oklch(0.82 0.14 210 / 0)" />
          </linearGradient>
        </defs>
        <path d="M0 280 L60 240 L110 260 L170 190 L220 210 L270 130 L320 160 L360 70 L400 100 L400 320 L0 320 Z" fill="url(#fill)" />
        <path d="M0 280 L60 240 L110 260 L170 190 L220 210 L270 130 L320 160 L360 70 L400 100" fill="none" stroke="url(#ridge)" strokeWidth="2" />
        {[
          { x: 60, y: 240, label: "Trainee" },
          { x: 170, y: 190, label: "SOC L1" },
          { x: 270, y: 130, label: "Sr Engineer" },
          { x: 360, y: 70, label: "Architect" },
        ].map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="5" fill="oklch(0.82 0.14 210)" />
            <circle cx={p.x} cy={p.y} r="10" fill="oklch(0.82 0.14 210 / 0.2)" />
            <text x={p.x + 10} y={p.y - 8} fill="currentColor" className="fill-[color:var(--foreground)] text-[10px]">
              {p.label}
            </text>
          </g>
        ))}
        <g>
          <circle cx="380" cy="40" r="12" fill="oklch(0.68 0.20 295 / 0.25)" />
          <text x="360" y="30" className="fill-[color:var(--violet)] text-[10px] font-semibold">
            CISO
          </text>
        </g>
      </svg>
      <div className="mt-2 grid grid-cols-3 gap-3 text-xs">
        <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] p-3">
          <div className="text-[color:var(--muted-foreground)]">Your band</div>
          <div className="mt-1 font-semibold text-[color:var(--cyan)]">S1 · SOC L1</div>
        </div>
        <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] p-3">
          <div className="text-[color:var(--muted-foreground)]">Next milestone</div>
          <div className="mt-1 font-semibold">S2 · SOC L2</div>
        </div>
        <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] p-3">
          <div className="text-[color:var(--muted-foreground)]">Readiness</div>
          <div className="mt-1 font-semibold text-[color:var(--emerald)]">68%</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Career Ladder ---------- */

const TRACKS: (LadderRole["track"] | "All")[] = [
  "All",
  "Technology",
  "Security Ops",
  "Engineering",
  "GRC",
  "Offensive",
  "Architecture",
  "Leadership",
];

function CareerLadder() {
  const [track, setTrack] = useState<(typeof TRACKS)[number]>("All");
  const rows = useMemo(
    () => (track === "All" ? CAREER_LADDER : CAREER_LADDER.filter((r) => r.track === track)),
    [track],
  );
  return (
    <section id="ladder" className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeader
        eyebrow="Enterprise Cybersecurity Career Framework"
        title="One ladder. Nine bands. Real GFS roles."
        description="Replace 'Beginner → Expert' with the actual progression that runs across Global Financial Services — from Associate Technology Trainee to Chief Information Security Officer."
        right={
          <div className="flex flex-wrap gap-1.5">
            {TRACKS.map((t) => (
              <button
                key={t}
                onClick={() => setTrack(t)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  track === t
                    ? "border-[color:var(--primary)]/60 bg-[color:var(--primary)]/15 text-[color:var(--primary)]"
                    : "border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        }
      />
      <div className="card-elev relative overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_120px_120px] gap-4 border-b border-[color:var(--border)] px-5 py-3 text-[11px] uppercase tracking-wider text-[color:var(--muted-foreground)]">
          <div>Band</div>
          <div>Role</div>
          <div>Experience</div>
          <div>Track</div>
        </div>
        <ol className="relative">
          <span className="pointer-events-none absolute left-[52px] top-0 h-full w-px bg-gradient-to-b from-transparent via-[color:var(--cyan)]/40 to-transparent" />
          {rows.map((r, i) => (
            <li
              key={r.title}
              className="group grid grid-cols-[80px_1fr_120px_120px] items-start gap-4 border-b border-[color:var(--border)]/50 px-5 py-4 last:border-b-0 hover:bg-[color:var(--surface-2)]/60"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full border border-[color:var(--cyan)]/50 bg-[color:var(--background)] text-[10px] font-semibold text-[color:var(--cyan)]">
                  {i + 1}
                </span>
                <span className="font-mono text-xs text-[color:var(--muted-foreground)]">{r.band}</span>
              </div>
              <div>
                <div className="font-semibold">{r.title}</div>
                <div className="mt-0.5 text-xs leading-relaxed text-[color:var(--muted-foreground)]">
                  {r.summary}
                </div>
              </div>
              <div className="text-xs text-[color:var(--muted-foreground)]">{r.years}</div>
              <div>
                <Chip tone={TRACK_TONE[r.track]}>{r.track}</Chip>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Where Can You Go? (Org Tree) ---------- */

function OrgTree() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeader
        eyebrow="Where can you go?"
        title="Cybersecurity at GFS is an entire enterprise organization."
        description="Every branch below is a full team with its own leaders, budget, roadmap and open roles. Cybersecurity is not one job — it is a company inside the company."
      />
      <div className="card-elev p-6">
        {ORG_TREE.map((root) => (
          <div key={root.name}>
            <div className="mx-auto max-w-md rounded-lg border border-[color:var(--cyan)]/40 bg-[color:var(--cyan)]/10 px-5 py-4 text-center">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--cyan)]">CISO</div>
              <div className="mt-1 font-semibold">{root.name}</div>
              <div className="mt-1 text-xs text-[color:var(--muted-foreground)]">{root.title}</div>
            </div>
            <div className="relative mt-6 grid gap-4 md:grid-cols-3">
              <div className="pointer-events-none absolute inset-x-0 top-[-16px] hidden h-6 md:block">
                <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="h-full w-full">
                  <path d="M50 0 V12 M8 24 V12 H92 V24" stroke="oklch(0.30 0.03 250)" fill="none" />
                </svg>
              </div>
              {root.children.map((c) => (
                <div
                  key={c.name}
                  className="group rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-1)] p-4 transition hover:border-[color:var(--cyan)]/40 hover:bg-[color:var(--surface-2)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-semibold leading-tight">{c.name}</div>
                    <Chip tone="emerald">{c.open} open</Chip>
                  </div>
                  <div className="mt-2 text-xs text-[color:var(--muted-foreground)]">
                    Reports into CISO · Multi-region team
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-[color:var(--muted-foreground)]">
              And that's before you count Awareness, Human Risk, Fraud Cyber, Financial Crime Tech and
              the regional cyber teams embedded in every GFS business unit.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Departments ---------- */

function DepartmentGrid() {
  const [openCode, setOpenCode] = useState<string | null>(DEPARTMENTS[0].code);
  const open = DEPARTMENTS.find((d) => d.code === openCode) ?? null;
  return (
    <section id="departments" className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeader
        eyebrow="Cybersecurity as a company"
        title="20 departments. One mission."
        description="Pick any team to see what they own, who they hire, what they use and where they are hiring right now."
      />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
        <div className="grid grid-cols-2 gap-2 self-start md:grid-cols-3 lg:grid-cols-2">
          {DEPARTMENTS.map((d) => (
            <button
              key={d.code}
              onClick={() => setOpenCode(d.code)}
              className={`rounded-lg border p-3 text-left transition ${
                openCode === d.code
                  ? "border-[color:var(--primary)]/60 bg-[color:var(--primary)]/10"
                  : "border-[color:var(--border)] bg-[color:var(--surface-1)] hover:bg-[color:var(--surface-2)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)]">
                  {d.code}
                </span>
                <Chip tone={d.openPositions > 3 ? "emerald" : "default"}>{d.openPositions} IJP</Chip>
              </div>
              <div className="mt-1.5 text-sm font-semibold leading-tight">{d.name}</div>
              <div className="mt-1 text-xs text-[color:var(--muted-foreground)]">{d.teamSize}</div>
            </button>
          ))}
        </div>
        <DepartmentDetail dept={open} />
      </div>
    </section>
  );
}

function DepartmentDetail({ dept }: { dept: Department | null }) {
  if (!dept) return null;
  return (
    <div className="card-elev sticky top-24 self-start p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--cyan)]">
            Department · {dept.code}
          </div>
          <h3 className="mt-1 text-2xl font-semibold">{dept.name}</h3>
        </div>
        <Chip tone="emerald">{dept.openPositions} open roles</Chip>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted-foreground)]">{dept.mission}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <InfoBlock label="Team size" value={dept.teamSize} />
        <InfoBlock label="Business impact" value={dept.impact} />
      </div>

      <div className="mt-6">
        <BlockTitle>Responsibilities</BlockTitle>
        <ul className="mt-2 grid gap-1.5 text-sm sm:grid-cols-2">
          {dept.responsibilities.map((r) => (
            <li key={r} className="flex items-start gap-2">
              <span className="mt-2 h-1 w-1 flex-none rounded-full bg-[color:var(--cyan)]" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <BlockTitle>Career paths</BlockTitle>
        <div className="mt-2 rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 font-mono text-xs text-[color:var(--muted-foreground)]">
          {dept.careerPaths.join(" · ")}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <BlockTitle>Required skills</BlockTitle>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {dept.skills.map((s) => (
              <Chip key={s} tone="cyan">
                {s}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <BlockTitle>Technology stack</BlockTitle>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {dept.stack.map((s) => (
              <Chip key={s} tone="violet">
                {s}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] p-3">
      <div className="text-[10px] uppercase tracking-wider text-[color:var(--muted-foreground)]">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function BlockTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
      {children}
    </div>
  );
}

/* ---------- Career Explorer ---------- */

function CareerExplorer() {
  const [idx, setIdx] = useState(0);
  const track = EXPLORER_TRACKS[idx];
  return (
    <section id="explorer" className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeader
        eyebrow="Career Explorer"
        title="Pick a track. See exactly where it leads."
        description="These are not certifications — they are the real progression steps used by GFS Cyber leadership when planning promotions and internal moves."
      />
      <div className="card-elev p-6">
        <div className="flex flex-wrap gap-2">
          {EXPLORER_TRACKS.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setIdx(i)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                i === idx
                  ? "border-[color:var(--primary)]/60 bg-[color:var(--primary)]/15 text-[color:var(--primary)]"
                  : "border-[color:var(--border)] bg-[color:var(--surface-2)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
        <div className="relative mt-8 overflow-x-auto">
          <div className="flex min-w-max items-stretch gap-3">
            {track.steps.map((s, i) => (
              <div key={s.title} className="flex items-center gap-3">
                <div className="w-56 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-1)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[color:var(--muted-foreground)]">{s.band}</span>
                    <Chip tone={i === 0 ? "cyan" : i === track.steps.length - 1 ? "amber" : "default"}>
                      Step {i + 1}
                    </Chip>
                  </div>
                  <div className="mt-2 text-sm font-semibold leading-tight">{s.title}</div>
                  <div className="mt-1 text-xs text-[color:var(--muted-foreground)]">{s.years} yrs</div>
                </div>
                {i < track.steps.length - 1 && (
                  <svg width="26" height="18" viewBox="0 0 26 18" fill="none" className="text-[color:var(--cyan)]/70">
                    <path d="M0 9 H22 M16 3 L22 9 L16 15" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Internal Job Postings ---------- */

function InternalJobs() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState<string>("All");
  const depts = ["All", ...Array.from(new Set(JOBS.map((j) => j.department)))];
  const filtered = JOBS.filter(
    (j) =>
      (dept === "All" || j.department === dept) &&
      (q === "" || j.title.toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <section id="jobs" className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeader
        eyebrow="Internal Job Postings · IJP"
        title="Current internal opportunities at GFS Cybersecurity"
        description="Move across teams. Take a stretch role. Come back with new skills. Every posting below is a real internal vacancy — the same board GFS employees see in Workday."
        right={
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search role…"
              className="w-56 rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm outline-none placeholder:text-[color:var(--muted-foreground)] focus:border-[color:var(--primary)]/60"
            />
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[color:var(--primary)]/60"
            >
              {depts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((j) => (
          <JobCard key={j.id} j={j} />
        ))}
      </div>
    </section>
  );
}

function JobCard({ j }: { j: JobPosting }) {
  const eligTone =
    j.eligibility === "Eligible now" ? "emerald" : j.eligibility === "Eligible in 6 mo" ? "amber" : "rose";
  return (
    <article className="card-elev flex h-full flex-col p-5 transition hover:border-[color:var(--primary)]/40 hover:shadow-[0_10px_40px_-20px_oklch(0.82_0.14_210_/_0.5)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--muted-foreground)]">
            {j.id} · {j.businessUnit}
          </div>
          <h3 className="mt-1 text-base font-semibold leading-tight">{j.title}</h3>
        </div>
        {j.promotion && <Chip tone="violet">Promotion</Chip>}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <Field label="Department" value={j.department} />
        <Field label="Experience" value={j.experience} />
        <Field label="Location" value={j.location} />
        <Field label="Hiring manager" value={j.hiringManager} />
        <Field label="Open positions" value={`${j.openings} seat${j.openings > 1 ? "s" : ""}`} />
        <Field label="Level" value={j.level} />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[color:var(--muted-foreground)]">
          <span>Skill match</span>
          <span className="font-mono text-[color:var(--foreground)]">{j.skillMatch}%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[color:var(--surface-3)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[color:var(--cyan)] to-[color:var(--emerald)]"
            style={{ width: `${j.skillMatch}%` }}
          />
        </div>
      </div>
      <div className="mt-4 rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] p-3 text-xs">
        <div className="text-[10px] uppercase tracking-wider text-[color:var(--muted-foreground)]">
          Learning path
        </div>
        <div className="mt-1 text-[color:var(--foreground)]">{j.learningPath}</div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Chip tone={eligTone as "emerald" | "amber" | "rose"}>{j.eligibility}</Chip>
        <button className="text-xs font-semibold text-[color:var(--cyan)] hover:underline">
          View posting →
        </button>
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-[color:var(--muted-foreground)]">
        {label}
      </div>
      <div className="mt-0.5 text-[color:var(--foreground)]">{value}</div>
    </div>
  );
}

/* ---------- Your Career Journey ---------- */

function YourJourney() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeader
        eyebrow="Your career journey"
        title="Where you are today. Where you're going next."
        description="Personalized from your GFS profile and CyberOS activity. This is what your next promotion actually looks like."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="card-elev p-6">
          <div className="flex items-center gap-2">
            <Chip tone="cyan">Now</Chip>
            <span className="text-xs text-[color:var(--muted-foreground)]">Since {JOURNEY.current.startedAt}</span>
          </div>
          <div className="mt-3 text-xl font-semibold">{JOURNEY.current.role}</div>
          <div className="text-sm text-[color:var(--muted-foreground)]">{JOURNEY.current.department}</div>

          <div className="my-6 h-px bg-[color:var(--border)]" />

          <div className="flex items-center gap-2">
            <Chip tone="emerald">Next · {JOURNEY.next.band}</Chip>
            <span className="text-xs text-[color:var(--muted-foreground)]">Expected {JOURNEY.next.expected}</span>
          </div>
          <div className="mt-3 text-xl font-semibold">{JOURNEY.next.role}</div>
          <div className="text-xs text-[color:var(--muted-foreground)]">
            Compensation impact · {JOURNEY.next.salaryRange}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[color:var(--muted-foreground)]">
              <span>Promotion readiness</span>
              <span className="font-mono text-[color:var(--foreground)]">{JOURNEY.next.readiness}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[color:var(--surface-3)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[color:var(--emerald)] via-[color:var(--cyan)] to-[color:var(--violet)]"
                style={{ width: `${JOURNEY.next.readiness}%` }}
              />
            </div>
          </div>

          <div className="mt-6">
            <BlockTitle>Skills for the next role</BlockTitle>
            <ul className="mt-2 space-y-1.5 text-sm">
              {JOURNEY.requiredSkills.map((s) => (
                <li key={s.name} className="flex items-center justify-between rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2">
                  <span>{s.name}</span>
                  {s.have ? (
                    <Chip tone="emerald">Have it</Chip>
                  ) : (
                    <Chip tone="amber">Gap</Chip>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-6">
          <JourneyList title="Recommended labs" items={JOURNEY.labs} tone="cyan" />
          <JourneyList title="Recommended modules" items={JOURNEY.modules} tone="violet" />
          <JourneyList title="Recommended certifications" items={JOURNEY.certifications} tone="amber" />
          <JourneyList title="Recommended enterprise projects" items={JOURNEY.projects} tone="emerald" />
        </div>
      </div>
    </section>
  );
}

function JourneyList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "cyan" | "violet" | "amber" | "emerald";
}) {
  return (
    <div className="card-elev p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <Chip tone={tone}>{items.length}</Chip>
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2"
          >
            <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-[color:var(--surface-3)] font-mono text-[10px] text-[color:var(--muted-foreground)]">
              →
            </span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Skills Matrix ---------- */

const MATRIX_ROLES = [
  { code: "SOC", tone: "cyan" as const },
  { code: "IR", tone: "cyan" as const },
  { code: "Hunt", tone: "cyan" as const },
  { code: "CTI", tone: "violet" as const },
  { code: "AppSec", tone: "violet" as const },
  { code: "CloudSec", tone: "emerald" as const },
  { code: "IAM", tone: "emerald" as const },
  { code: "GRC", tone: "amber" as const },
  { code: "Red", tone: "rose" as const },
  { code: "Blue", tone: "emerald" as const },
  { code: "Purple", tone: "violet" as const },
  { code: "Arch", tone: "amber" as const },
];

function SkillsMatrix() {
  return (
    <section id="skills" className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeader
        eyebrow="Skills Matrix"
        title="Every skill mapped to every role."
        description="One dot means 'useful'. Three dots mean 'core'. Use this to plan an internal move or the next module inside CyberOS."
      />
      <div className="card-elev overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-[color:var(--border)] text-left">
              <th className="px-4 py-3 font-medium text-[color:var(--muted-foreground)]">Skill</th>
              <th className="px-4 py-3 font-medium text-[color:var(--muted-foreground)]">Category</th>
              {MATRIX_ROLES.map((r) => (
                <th key={r.code} className="px-3 py-3 text-center">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--muted-foreground)]">
                    {r.code}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SKILL_MATRIX.map((row) => (
              <tr key={row.skill} className="border-b border-[color:var(--border)]/50 last:border-b-0 hover:bg-[color:var(--surface-2)]/50">
                <td className="px-4 py-2.5 font-medium">{row.skill}</td>
                <td className="px-4 py-2.5 text-[color:var(--muted-foreground)]">{row.category}</td>
                {MATRIX_ROLES.map((r) => {
                  const v = (row.roles as Record<string, 1 | 2 | 3 | undefined>)[r.code];
                  return (
                    <td key={r.code} className="px-3 py-2.5 text-center">
                      {v ? <DotScale v={v} tone={r.tone} /> : <span className="text-[color:var(--muted-foreground)]/30">·</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-end gap-4 text-[11px] text-[color:var(--muted-foreground)]">
        <span className="flex items-center gap-1.5"><DotScale v={1} tone="cyan" /> Useful</span>
        <span className="flex items-center gap-1.5"><DotScale v={2} tone="cyan" /> Important</span>
        <span className="flex items-center gap-1.5"><DotScale v={3} tone="cyan" /> Core</span>
      </div>
    </section>
  );
}

function DotScale({
  v,
  tone,
}: {
  v: 1 | 2 | 3;
  tone: "cyan" | "emerald" | "violet" | "amber" | "rose";
}) {
  const c: Record<string, string> = {
    cyan: "bg-[color:var(--cyan)]",
    emerald: "bg-[color:var(--emerald)]",
    violet: "bg-[color:var(--violet)]",
    amber: "bg-[color:var(--amber)]",
    rose: "bg-[color:var(--rose)]",
  };
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i <= v ? c[tone] : "bg-[color:var(--surface-3)]"}`}
        />
      ))}
    </span>
  );
}

/* ---------- Role Relationship Graph ---------- */

function RoleGraph() {
  const nodes = [
    { id: "SOC", x: 80, y: 220 },
    { id: "IR", x: 220, y: 300 },
    { id: "Hunt", x: 360, y: 250 },
    { id: "Malware", x: 500, y: 320 },
    { id: "Detection Eng", x: 620, y: 220 },
    { id: "CTI", x: 760, y: 260 },
    { id: "Purple", x: 700, y: 130 },
    { id: "SecEng", x: 540, y: 90 },
    { id: "Cloud Sec", x: 380, y: 130 },
    { id: "IAM", x: 220, y: 110 },
    { id: "AppSec", x: 100, y: 90 },
    { id: "DevSecOps", x: 300, y: 30 },
    { id: "GRC", x: 860, y: 380 },
    { id: "Cyber Risk", x: 720, y: 400 },
    { id: "Architecture", x: 500, y: 200 },
  ];
  const idx = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const edges = [
    ["SOC", "IR"],
    ["IR", "Hunt"],
    ["Hunt", "Malware"],
    ["Malware", "Detection Eng"],
    ["Detection Eng", "CTI"],
    ["CTI", "Purple"],
    ["Purple", "SecEng"],
    ["SecEng", "Architecture"],
    ["Cloud Sec", "Architecture"],
    ["IAM", "Cloud Sec"],
    ["AppSec", "DevSecOps"],
    ["DevSecOps", "SecEng"],
    ["GRC", "Cyber Risk"],
    ["Cyber Risk", "Architecture"],
    ["Hunt", "Detection Eng"],
    ["IR", "Detection Eng"],
    ["Cloud Sec", "SecEng"],
  ] as const;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeader
        eyebrow="Role Relationship Graph"
        title="Everything connects. That's the point."
        description="Every role at GFS Cybersecurity feeds another. A career here is not a straight line — it is a graph you get to walk through."
      />
      <div className="card-elev relative overflow-hidden">
        <svg viewBox="0 0 960 440" className="h-[440px] w-full">
          <defs>
            <linearGradient id="edge" x1="0" x2="1">
              <stop offset="0%" stopColor="oklch(0.82 0.14 210 / 0.6)" />
              <stop offset="100%" stopColor="oklch(0.68 0.20 295 / 0.6)" />
            </linearGradient>
          </defs>
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={idx[a].x}
              y1={idx[a].y}
              x2={idx[b].x}
              y2={idx[b].y}
              stroke="url(#edge)"
              strokeWidth="1.2"
              opacity="0.9"
            />
          ))}
          {nodes.map((n) => (
            <g key={n.id} className="cursor-default">
              <circle cx={n.x} cy={n.y} r="22" fill="oklch(0.22 0.03 250)" stroke="oklch(0.82 0.14 210 / 0.7)" />
              <text
                x={n.x}
                y={n.y + 4}
                textAnchor="middle"
                className="fill-[color:var(--foreground)] text-[9px] font-semibold"
              >
                {n.id}
              </text>
            </g>
          ))}
        </svg>
        <div className="grid gap-2 border-t border-[color:var(--border)] p-4 text-xs md:grid-cols-2 lg:grid-cols-3">
          {RELATIONSHIP_GRAPH.map((e) => (
            <div key={`${e.from}-${e.to}`} className="flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] px-3 py-2">
              <span className="font-semibold">{e.from}</span>
              <span className="text-[color:var(--muted-foreground)]">→</span>
              <span className="font-semibold">{e.to}</span>
              <span className="ml-auto text-[10px] uppercase tracking-wider text-[color:var(--muted-foreground)]">
                {e.via}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer CTA ---------- */

function FooterCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-6">
      <div className="card-elev relative overflow-hidden p-8 md:p-12">
        <div className="absolute inset-0 -z-10 opacity-60">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[color:var(--cyan)]/20 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[color:var(--violet)]/20 blur-3xl" />
        </div>
        <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--cyan)]">
              Your journey starts now
            </div>
            <h3 className="mt-2 text-3xl font-semibold md:text-4xl">
              CyberOS is not teaching certifications.
              <br />
              It is preparing you for a career at GFS.
            </h3>
            <p className="mt-3 max-w-xl text-sm text-[color:var(--muted-foreground)]">
              Every module you complete maps to a real GFS role, a real GFS team and a real GFS opening.
              Choose the direction. We'll build the path with you.
            </p>
          </div>
          <div className="grid gap-3">
            <button className="rounded-md bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-110">
              Talk to my Career Coach
            </button>
            <button className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-2)] px-5 py-3 text-sm font-medium transition hover:bg-[color:var(--surface-3)]">
              Export my development plan (PDF)
            </button>
            <button className="rounded-md border border-[color:var(--border)] bg-transparent px-5 py-3 text-sm text-[color:var(--muted-foreground)] transition hover:text-[color:var(--foreground)]">
              Nominate me for a mentorship pod
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-[color:var(--muted-foreground)]">
        <div>
          © GFS Global Financial Services · Cybersecurity Career Framework v4.2 · Internal use only
        </div>
        <div className="flex gap-4">
          <span>NIST NICE aligned</span>
          <span>ISO 27001</span>
          <span>DORA ready</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */

export function CareerPortal() {
  return (
    <div className="min-h-screen text-[color:var(--foreground)]">
      <TopBar />
      <Hero />
      <CareerLadder />
      <OrgTree />
      <DepartmentGrid />
      <CareerExplorer />
      <InternalJobs />
      <YourJourney />
      <SkillsMatrix />
      <RoleGraph />
      <FooterCTA />
    </div>
  );
}

export default CareerPortal;