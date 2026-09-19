# UltraTeam Tracker

Team training tracking system for ultramarathon runners training together for a 90km challenge. Built with **React 18 + Vite**, Supabase, TypeScript, Tailwind CSS, and a military/tactical HUD dark mode aesthetic.

---

## ⚡ Tech Stack

- **Frontend:** React 18, Vite 5, React Router v6, TypeScript, Tailwind CSS
- **Design System:** Tactical HUD / Brutalist Telemetry (Dark Mode, Oswald, JetBrains Mono, Chivo fonts)
- **Backend & Auth:** Supabase (PostgreSQL, Row Level Security, Triggers)
- **Deployment:** Vercel / Netlify (Frontend SPA), Supabase (Backend)

---

## 📁 Project Structure

```
ultrateam-tracker/
├── DESIGN.md                  # Design system documentation
├── README.md                  # Setup instructions
├── index.html                 # Vite HTML entry with tactical Google Fonts
├── package.json
├── tsconfig.json
├── vite.config.ts             # Vite config with @ path alias
├── tailwind.config.ts
├── postcss.config.js
├── .env.example               # Template with VITE_ prefixes
├── supabase/
│   ├── config.toml
│   ├── migrations/            # SQL migration & RLS
│   └── seed.sql
└── src/
    ├── App.tsx                # App routes & Protected layout
    ├── main.tsx               # Application entrypoint
    ├── index.css              # Tailwind and tactical scrollbar styling
    ├── vite-env.d.ts          # Vite client types
    ├── components/
    │   ├── ui/
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Card.tsx
    │   │   ├── Badge.tsx
    │   │   └── Loading.tsx
    │   ├── ActivityCard.tsx
    │   ├── ActivityForm.tsx
    │   ├── ActivityList.tsx
    │   ├── GoalForm.tsx
    │   ├── TeamCard.tsx
    │   ├── TeamMural.tsx
    │   ├── Navbar.tsx
    │   └── AuthProvider.tsx
    ├── pages/
    │   ├── LoginPage.tsx
    │   ├── DashboardPage.tsx  # War room mural
    │   ├── ActivitiesPage.tsx # User training log
    │   ├── NewActivityPage.tsx
    │   ├── EditActivityPage.tsx
    │   └── GoalsPage.tsx      # Weekly volume orders
    └── lib/
        ├── supabase.ts        # Supabase client using import.meta.env
        ├── utils.ts           # Tactical date & telemetry helpers
        └── types.ts           # TypeScript type definitions
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- Supabase account (or Supabase CLI for local database)

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Configure your variables:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Supabase Database Setup

Run the migrations in your Supabase project SQL Editor or via the Supabase CLI:

```bash
# Apply migrations located at supabase/migrations/20260918000000_init_schema.sql
```

The migration automatically creates:
- `profiles` table with automatic signup triggers
- `activities` table with training classification (`tiro`, `longo`, `leve`, `curto`)
- `weekly_goals` table enforcing 1 goal per week per runner
- Full Row Level Security (RLS) policies

### 5. Run the Application

```bash
# Start Vite development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the system.

### 6. Production Build

```bash
npm run build
```
The output will be generated in `dist/`.

---

## 🎯 Features

1. **War Room (Dashboard Mural):** Live team view displaying all operators, weekly mileage goals, and upcoming scheduled training runs.
2. **Mission Log (Activities CRUD):** Complete activity management with filters (All, Pending, Completed), pace calculations, and distance tracking.
3. **Weekly Orders (Goals):** Set weekly volume targets auto-calculated from the current Monday.
4. **Tactical Authentication:** Supabase Auth integration with session persistence and automatic profile provisioning.

---

## 📐 Design System

Engineered with high-contrast tactical styling:
- **Background:** `#060709` (Void Black)
- **Primary:** `#00FF66` (Electric Military Lime)
- **Secondary:** `#2A343D` (Stealth Cold Slate)
- **Typography:** Oswald (Display & Headings), Chivo (Mission Logs & Body), JetBrains Mono (Telemetry & Metrics)
