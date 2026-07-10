// src/context/CyberOSContext.tsx
// Complete state persistence subsystem with localStorage synchronization

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type GFSRole =
  | 'Associate Technology Trainee'
  | 'Junior IT Support Engineer'
  | 'Desktop / Systems Administrator'
  | 'Infrastructure / Network Engineer'
  | 'Security Operations Associate'
  | 'SOC Analyst L1'
  | 'SOC Analyst L2'
  | 'SOC Analyst L3'
  | 'Security Engineer'
  | 'Threat Hunter'
  | 'Penetration Tester'
  | 'Senior Penetration Tester'
  | 'Security Architect'
  | 'CISO';

export type ClearanceLevel = 'Unclassified' | 'Internal' | 'Restricted' | 'Highly_Confidential' | 'Compartmented_SecOps';

export interface UserProfile {
  employeeId: string;
  fullName: string;
  email: string;
  role: GFSRole;
  clearance: ClearanceLevel;
  businessUnit: string;
  location: string;
  band: string;
  avatarInitials: string;
}

export interface ModuleProgress {
  moduleId: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  quizScore: number | null;
  quizAttempts: number;
  labCompleted: boolean;
  labFlag: string | null;
  completedAt: string | null;
  xpEarned: number;
  hintsUsed: number;
  timeSpentMinutes: number;
}

export interface SocAlert {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  source: string;
  affectedAsset: string;
  technique: string;
  description: string;
  timestamp: string;
  status: 'Open' | 'In_Progress' | 'Escalated' | 'Mitigated' | 'Closed' | 'False_Positive';
  assignedTo: string | null;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  notes: string;
  actions: SocAction[];
}

export interface SocAction {
  timestamp: string;
  analyst: string;
  action: string;
  result: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string | null;
  xpBonus: number;
  category: 'module' | 'lab' | 'soc' | 'hunt' | 'special';
}

export interface CyberOSState {
  user: UserProfile;
  xp: number;
  totalXpEarned: number;
  level: number;
  moduleProgress: Record<number, ModuleProgress>;
  socAlerts: SocAlert[];
  achievements: Achievement[];
  bookmarks: number[];
  aiChatHistory: { role: 'user' | 'assistant'; content: string; timestamp: string }[];
  logSearchHistory: string[];
  activeLabId: number | null;
  labResetCount: number;
  siemLogFilter: string;
  siemTimeRange: string;
  darkMode: boolean;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_QUIZ_SCORE'; moduleId: number; score: number; passed: boolean }
  | { type: 'COMPLETE_LAB'; moduleId: number; flag: string }
  | { type: 'UNLOCK_MODULE'; moduleId: number }
  | { type: 'START_MODULE'; moduleId: number }
  | { type: 'ADD_XP'; amount: number }
  | { type: 'USE_HINT'; moduleId: number }
  | { type: 'RESET_LAB'; moduleId: number }
  | { type: 'UPDATE_SOC_ALERT'; alertId: string; status: SocAlert['status']; note: string }
  | { type: 'ASSIGN_SOC_ALERT'; alertId: string; analyst: string }
  | { type: 'TOGGLE_BOOKMARK'; moduleId: number }
  | { type: 'ADD_AI_MESSAGE'; role: 'user' | 'assistant'; content: string }
  | { type: 'CLEAR_AI_HISTORY' }
  | { type: 'SET_SIEM_FILTER'; filter: string }
  | { type: 'SET_SIEM_TIME_RANGE'; range: string }
  | { type: 'ADD_LOG_SEARCH'; query: string }
  | { type: 'EARN_ACHIEVEMENT'; achievementId: string }
  | { type: 'SET_ACTIVE_LAB'; labId: number | null }
  | { type: 'LOG_TIME'; moduleId: number; minutes: number }
  | { type: 'RESET_ALL' };

// ─── XP Level Thresholds ──────────────────────────────────────────────────────

const XP_LEVELS = [0, 500, 1200, 2500, 4500, 7000, 10500, 15000, 21000, 30000, 42000];

function calculateLevel(xp: number): number {
  let level = 1;
  for (let i = 0; i < XP_LEVELS.length; i++) {
    if (xp >= XP_LEVELS[i]) level = i + 1;
    else break;
  }
  return Math.min(level, 11);
}

// ─── Initial State ─────────────────────────────────────────────────────────────

const INITIAL_SOC_ALERTS: SocAlert[] = [
  {
    id: 'SOC-2026-0441',
    title: 'C2 Beacon Detected — Kubernetes Node to Russian IP',
    severity: 'Critical',
    source: 'CrowdStrike Falcon',
    affectedAsset: 'aws-ec2-prod-amw-k8s-node04.gfs.cloud (10.200.44.114)',
    technique: 'T1071.001 — Application Layer Protocol: Web Protocols',
    description: 'Regular HTTPS beaconing every 60 seconds from Kubernetes worker node to 91.229.229.99 (AS41122, RU). Payload consistent with Cobalt Strike HTTP C2 profile. PID 14823 (runc process) initiating connection.',
    timestamp: '2026-07-10T03:02:44Z',
    status: 'Open',
    assignedTo: null,
    priority: 'P1',
    notes: '',
    actions: [],
  },
  {
    id: 'SOC-2026-0440',
    title: 'LSASS Credential Dumping — Workstation GFS-LT-1101',
    severity: 'Critical',
    source: 'CrowdStrike Falcon EDR',
    affectedAsset: 'GFS-LT-1101 (10.100.10.45) — cheryl.jenkins@gfs.local',
    technique: 'T1003.001 — OS Credential Dumping: LSASS Memory',
    description: 'Non-standard process (notepad.exe) accessing lsass.exe memory regions. Mimikatz signature detected in memory. User cheryl.jenkins logged in. 3 credential pairs may have been extracted.',
    timestamp: '2026-07-10T02:58:11Z',
    status: 'In_Progress',
    assignedTo: 'a.mercer',
    priority: 'P1',
    notes: 'Investigating. Host partially isolated. Awaiting IR team for memory capture.',
    actions: [
      { timestamp: '2026-07-10T03:01:22Z', analyst: 'a.mercer', action: 'Acknowledged alert and began triage', result: 'Confirmed malicious — notepad.exe has no legitimate reason to access LSASS' },
    ],
  },
  {
    id: 'SOC-2026-0439',
    title: 'SQL Injection Attempt — Core Banking API',
    severity: 'Critical',
    source: 'Palo Alto NGFW + WAF',
    affectedAsset: 'ny-dc01-corebank-db01.gfs.local (10.10.20.11)',
    technique: 'T1190 — Exploit Public-Facing Application',
    description: 'Automated SQL injection scan detected from 198.51.100.82. 847 distinct injection payloads in 3.2 minutes targeting the /api/v2/accounts endpoint. WAF blocked 843 payloads. 4 returned HTTP 200 — potential bypass.',
    timestamp: '2026-07-10T01:47:19Z',
    status: 'Open',
    assignedTo: null,
    priority: 'P1',
    notes: '',
    actions: [],
  },
  {
    id: 'SOC-2026-0438',
    title: 'Kerberoasting Activity — Multiple SPN Requests',
    severity: 'High',
    source: 'Splunk ES Correlation Rule',
    affectedAsset: 'GFS.LOCAL Domain Controller (10.10.20.50)',
    technique: 'T1558.003 — Steal or Forge Kerberos Tickets: Kerberoasting',
    description: 'User a.mercer requested TGS tickets for 7 distinct service accounts within 90 seconds. All tickets requested with RC4 encryption (0x17). Consistent with automated Kerberoasting tools (Rubeus, GetUserSPNs).',
    timestamp: '2026-07-09T23:34:07Z',
    status: 'In_Progress',
    assignedTo: 'c.brody',
    priority: 'P2',
    notes: 'Investigating if this is authorized pen test activity. Checking with security team.',
    actions: [
      { timestamp: '2026-07-09T23:40:11Z', analyst: 'c.brody', action: 'Queried pen test schedule', result: 'No scheduled test for this time window. Escalating to P1.' },
    ],
  },
  {
    id: 'SOC-2026-0437',
    title: 'Lateral Movement — Workstation to SWIFT Enclave',
    severity: 'High',
    source: 'Zeek Network Monitor',
    affectedAsset: '10.100.10.88 → 10.10.30.11 (SWIFT Gateway)',
    technique: 'T1021.001 — Remote Services: Remote Desktop Protocol',
    description: 'RDP session (TCP/3389) established from workstation VLAN (10.100.10.88) to SWIFT Gateway (10.10.30.11). This traffic violates GFS network segmentation policy. SWIFT enclave is not accessible from workstation VLAN.',
    timestamp: '2026-07-09T22:12:33Z',
    status: 'Escalated',
    assignedTo: 'a.mercer',
    priority: 'P2',
    notes: 'Escalated to senior IR. SWIFT operations team notified.',
    actions: [
      { timestamp: '2026-07-09T22:18:05Z', analyst: 'a.mercer', action: 'Confirmed traffic anomaly via NetFlow', result: 'RDP session lasted 12 minutes. Source workstation identified as GFS-WS-0288.' },
      { timestamp: '2026-07-09T22:25:44Z', analyst: 'a.mercer', action: 'Isolated source workstation GFS-WS-0288', result: 'CrowdStrike containment applied. IT notified.' },
    ],
  },
  {
    id: 'SOC-2026-0436',
    title: 'Phishing Email — GFS Finance Team Targeted',
    severity: 'Medium',
    source: 'Microsoft Defender for Office 365',
    affectedAsset: 'GFS Exchange Online — 23 Recipients in Finance Department',
    technique: 'T1566.001 — Phishing: Spearphishing Attachment',
    description: 'Targeted phishing campaign with malicious Excel attachment (Q4-2026-Salary-Update.xlsx). Attachment contains VBA macro with obfuscated PowerShell download cradle. 2 of 23 recipients clicked — emails blocked before opening attachment.',
    timestamp: '2026-07-09T14:22:17Z',
    status: 'Mitigated',
    assignedTo: 'a.jenkins',
    priority: 'P3',
    notes: 'Attachment blocked by MDE. No successful execution. User awareness email sent.',
    actions: [
      { timestamp: '2026-07-09T14:30:00Z', analyst: 'a.jenkins', action: 'Quarantined email from all 23 mailboxes', result: 'All copies removed. No successful macro execution detected.' },
      { timestamp: '2026-07-09T14:45:00Z', analyst: 'a.jenkins', action: 'Generated IOCs from attachment (SHA256, domain)', result: 'IOCs pushed to CrowdStrike and Palo Alto firewall blocklist.' },
    ],
  },
  {
    id: 'SOC-2026-0435',
    title: 'ATM Data Exfiltration — Suspicious Outbound HTTPS',
    severity: 'Medium',
    source: 'Palo Alto NGFW NetFlow',
    affectedAsset: 'ATM Controller (10.11.200.24)',
    technique: 'T1048.003 — Exfiltration Over Alternative Protocol',
    description: 'ATM controller node initiating 487MB outbound HTTPS transfer to 203.0.113.45 (US-East, non-GFS infrastructure). This device should only communicate with GFS ATM management servers. Large outbound transfers are anomalous.',
    timestamp: '2026-07-09T23:12:09Z',
    status: 'In_Progress',
    assignedTo: null,
    priority: 'P2',
    notes: '',
    actions: [],
  },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-login', title: 'GFS Employee #1', description: 'Logged in to the GFS CyberOS platform for the first time', icon: '🏦', earnedAt: new Date().toISOString(), xpBonus: 100, category: 'special' },
  { id: 'module-1-complete', title: 'Enterprise Orientation', description: 'Completed Module 1: GFS Enterprise Foundation', icon: '🏛️', earnedAt: null, xpBonus: 200, category: 'module' },
  { id: 'module-5-complete', title: 'Security Fundamentalist', description: 'Completed all Phase 1 Foundation modules', icon: '🛡️', earnedAt: null, xpBonus: 500, category: 'module' },
  { id: 'first-lab', title: 'Lab Rat', description: 'Completed your first hands-on cyber range lab', icon: '🧪', earnedAt: null, xpBonus: 150, category: 'lab' },
  { id: 'perfect-quiz', title: 'Flawless', description: 'Scored 100% on any module quiz', icon: '💯', earnedAt: null, xpBonus: 300, category: 'module' },
  { id: 'soc-operator', title: 'SOC Operator', description: 'Triaged and resolved your first SOC alert', icon: '🖥️', earnedAt: null, xpBonus: 250, category: 'soc' },
  { id: 'threat-hunter', title: 'Threat Hunter', description: 'Completed Module 19: Threat Hunting', icon: '🎯', earnedAt: null, xpBonus: 500, category: 'hunt' },
  { id: 'capstone-complete', title: 'CISO Material', description: 'Completed the full GFS Capstone Enterprise Incident', icon: '⭐', earnedAt: null, xpBonus: 2000, category: 'special' },
  { id: 'no-hints', title: 'Self-Reliant', description: 'Completed a lab without using any hints', icon: '🧠', earnedAt: null, xpBonus: 200, category: 'lab' },
  { id: 'speed-run', title: 'Incident Responder', description: 'Triaged a P1 SOC alert within 2 minutes', icon: '⚡', earnedAt: null, xpBonus: 400, category: 'soc' },
];

const DEFAULT_MODULE_PROGRESS: Record<number, ModuleProgress> = {};
for (let i = 1; i <= 20; i++) {
  DEFAULT_MODULE_PROGRESS[i] = {
    moduleId: i,
    status: 'available',
    quizScore: null,
    quizAttempts: 0,
    labCompleted: false,
    labFlag: null,
    completedAt: null,
    xpEarned: 0,
    hintsUsed: 0,
    timeSpentMinutes: 0,
  };
}

const INITIAL_STATE: CyberOSState = {
  user: {
    employeeId: 'GFS-E2409',
    fullName: 'Alex Mercer',
    email: 'a.mercer@globalfinancial.com',
    role: 'SOC Analyst L1',
    clearance: 'Restricted',
    businessUnit: 'Security Operations Center (BU-SOC)',
    location: 'New York HQ',
    band: 'S1',
    avatarInitials: 'AM',
  },
  xp: 0,
  totalXpEarned: 0,
  level: 1,
  moduleProgress: DEFAULT_MODULE_PROGRESS,
  socAlerts: INITIAL_SOC_ALERTS,
  achievements: INITIAL_ACHIEVEMENTS,
  bookmarks: [],
  aiChatHistory: [],
  logSearchHistory: [],
  activeLabId: null,
  labResetCount: 0,
  siemLogFilter: '',
  siemTimeRange: '24h',
  darkMode: true,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: CyberOSState, action: Action): CyberOSState {
  switch (action.type) {
    case 'START_MODULE': {
      const current = state.moduleProgress[action.moduleId];
      if (!current || current.status === 'locked') return state;
      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: { ...current, status: 'in_progress' },
        },
        activeLabId: action.moduleId,
      };
    }

    case 'SET_QUIZ_SCORE': {
      const current = state.moduleProgress[action.moduleId];
      const xpEarned = action.passed && current.xpEarned === 0 ? Math.floor(500 * (action.score / 100)) : 0;
      return {
        ...state,
        xp: state.xp + xpEarned,
        totalXpEarned: state.totalXpEarned + xpEarned,
        level: calculateLevel(state.xp + xpEarned),
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: {
            ...current,
            quizScore: Math.max(current.quizScore ?? 0, action.score),
            quizAttempts: current.quizAttempts + 1,
            xpEarned: current.xpEarned + xpEarned,
          },
        },
      };
    }

    case 'COMPLETE_LAB': {
      const current = state.moduleProgress[action.moduleId];
      const xpEarned = current.labCompleted ? 0 : 500;
      const now = new Date().toISOString();
      // Unlock next module
      const nextId = action.moduleId + 1;
      const nextModule = state.moduleProgress[nextId];
      const updatedProgress: Record<number, ModuleProgress> = {
        ...state.moduleProgress,
        [action.moduleId]: {
          ...current,
          labCompleted: true,
          labFlag: action.flag,
          status: 'completed',
          completedAt: current.completedAt ?? now,
          xpEarned: current.xpEarned + xpEarned,
        },
      };
      if (nextModule && nextModule.status === 'locked') {
        updatedProgress[nextId] = { ...nextModule, status: 'available' };
      }
      return {
        ...state,
        xp: state.xp + xpEarned,
        totalXpEarned: state.totalXpEarned + xpEarned,
        level: calculateLevel(state.xp + xpEarned),
        moduleProgress: updatedProgress,
        activeLabId: null,
      };
    }

    case 'UNLOCK_MODULE': {
      const current = state.moduleProgress[action.moduleId];
      if (!current || current.status !== 'locked') return state;
      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: { ...current, status: 'available' },
        },
      };
    }

    case 'ADD_XP': {
      const newXp = state.xp + action.amount;
      return {
        ...state,
        xp: newXp,
        totalXpEarned: state.totalXpEarned + action.amount,
        level: calculateLevel(newXp),
      };
    }

    case 'USE_HINT': {
      const current = state.moduleProgress[action.moduleId];
      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: { ...current, hintsUsed: current.hintsUsed + 1 },
        },
      };
    }

    case 'RESET_LAB': {
      const current = state.moduleProgress[action.moduleId];
      return {
        ...state,
        labResetCount: state.labResetCount + 1,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: { ...current, status: 'in_progress', labFlag: null, labCompleted: false },
        },
      };
    }

    case 'UPDATE_SOC_ALERT': {
      const now = new Date().toISOString();
      return {
        ...state,
        socAlerts: state.socAlerts.map(alert =>
          alert.id === action.alertId
            ? {
                ...alert,
                status: action.status,
                notes: action.note || alert.notes,
                actions: action.note
                  ? [...alert.actions, { timestamp: now, analyst: state.user.employeeId, action: `Status updated to ${action.status}`, result: action.note }]
                  : alert.actions,
              }
            : alert
        ),
      };
    }

    case 'ASSIGN_SOC_ALERT': {
      const now = new Date().toISOString();
      return {
        ...state,
        socAlerts: state.socAlerts.map(alert =>
          alert.id === action.alertId
            ? {
                ...alert,
                assignedTo: action.analyst,
                status: 'In_Progress',
                actions: [
                  ...alert.actions,
                  { timestamp: now, analyst: action.analyst, action: 'Alert self-assigned', result: 'Investigation initiated' },
                ],
              }
            : alert
        ),
      };
    }

    case 'TOGGLE_BOOKMARK': {
      const isBookmarked = state.bookmarks.includes(action.moduleId);
      return {
        ...state,
        bookmarks: isBookmarked
          ? state.bookmarks.filter(id => id !== action.moduleId)
          : [...state.bookmarks, action.moduleId],
      };
    }

    case 'ADD_AI_MESSAGE': {
      return {
        ...state,
        aiChatHistory: [
          ...state.aiChatHistory,
          { role: action.role, content: action.content, timestamp: new Date().toISOString() },
        ],
      };
    }

    case 'CLEAR_AI_HISTORY': {
      return { ...state, aiChatHistory: [] };
    }

    case 'SET_SIEM_FILTER': {
      return { ...state, siemLogFilter: action.filter };
    }

    case 'SET_SIEM_TIME_RANGE': {
      return { ...state, siemTimeRange: action.range };
    }

    case 'ADD_LOG_SEARCH': {
      const history = [action.query, ...state.logSearchHistory.filter(q => q !== action.query)].slice(0, 20);
      return { ...state, logSearchHistory: history };
    }

    case 'EARN_ACHIEVEMENT': {
      return {
        ...state,
        achievements: state.achievements.map(a =>
          a.id === action.achievementId && !a.earnedAt
            ? { ...a, earnedAt: new Date().toISOString() }
            : a
        ),
      };
    }

    case 'SET_ACTIVE_LAB': {
      return { ...state, activeLabId: action.labId };
    }

    case 'LOG_TIME': {
      const current = state.moduleProgress[action.moduleId];
      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: { ...current, timeSpentMinutes: current.timeSpentMinutes + action.minutes },
        },
      };
    }

    case 'RESET_ALL': {
      return INITIAL_STATE;
    }

    default:
      return state;
  }
}

// ─── Persistence ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'cyberos_gfs_state_v6';

function loadState(): CyberOSState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const saved = JSON.parse(raw) as Partial<CyberOSState>;
    return { ...INITIAL_STATE, ...saved };
  } catch {
    return INITIAL_STATE;
  }
}

function saveState(state: CyberOSState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage quota exceeded — ignore
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CyberOSContextValue {
  state: CyberOSState;
  dispatch: React.Dispatch<Action>;
  // Convenience helpers
  completedModuleCount: number;
  progressPercent: number;
  xpToNextLevel: number;
  xpProgress: number;
  getAlertsByStatus: (status: SocAlert['status']) => SocAlert[];
  getOpenAlertCount: () => number;
}

const CyberOSContext = createContext<CyberOSContextValue | null>(null);

export function CyberOSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const completedModuleCount = Object.values(state.moduleProgress).filter(m => m.status === 'completed').length;
  const progressPercent = Math.round((completedModuleCount / 20) * 100);

  const currentLevelXp = XP_LEVELS[state.level - 1] ?? 0;
  const nextLevelXp = XP_LEVELS[state.level] ?? XP_LEVELS[XP_LEVELS.length - 1];
  const xpToNextLevel = nextLevelXp - state.xp;
  const xpProgress = Math.round(((state.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100);

  const getAlertsByStatus = useCallback(
    (status: SocAlert['status']) => state.socAlerts.filter(a => a.status === status),
    [state.socAlerts]
  );

  const getOpenAlertCount = useCallback(
    () => state.socAlerts.filter(a => a.status === 'Open' || a.status === 'In_Progress').length,
    [state.socAlerts]
  );

  return (
    <CyberOSContext.Provider
      value={{ state, dispatch, completedModuleCount, progressPercent, xpToNextLevel, xpProgress, getAlertsByStatus, getOpenAlertCount }}
    >
      {children}
    </CyberOSContext.Provider>
  );
}

export function useCyberOS(): CyberOSContextValue {
  const ctx = useContext(CyberOSContext);
  if (!ctx) throw new Error('useCyberOS must be used within CyberOSProvider');
  return ctx;
}

export { XP_LEVELS };
