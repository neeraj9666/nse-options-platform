
# NSE Options Platform

Electron + Node.js + React + TimescaleDB based high-performance options analytics platform.

## Features
- TimescaleDB hypertables (time-series optimized)
- Materialized views for OI snapshots
- React virtualized option chain table
- Electron desktop deployment

## Run (Dev)
npm install
npm run start


Options Trading Platform (Electron)
Overview

This project is a desktop-based Options Analysis & Backtesting Platform built using:

Electron (desktop shell)

React (UI / renderer)

Node.js (IPC + backend logic)

PostgreSQL / TimescaleDB (market data storage)

The platform is designed with institutional trading principles:

High information density

Deterministic time-based playback

Snapshot-correct option chains

Strict separation of concerns

Core Architectural Principles (Must Read)
1. Option Chain Definition (Non-Negotiable)

An Option Chain Snapshot is defined as:

(symbol, expiry, timestamp)


At any moment:

ONE symbol (e.g. NIFTY)

ONE expiry (weekly or monthly)

ONE timestamp

❌ Time ranges
❌ Mixed expiries
❌ DISTINCT ON hacks

Any violation makes the data financially incorrect.

2. Backend Rules

All database access lives in:

src/services/db.service.js


Backend returns raw, unformatted data

No UI formatting in SQL

No auto-fetching at Electron startup

Only DB call at startup: connection test

3. Frontend Rules

Frontend handles:

CE / PE / BOTH filtering

Center-strike slicing

Date/time formatting

Playback time control

Backend never knows about UI state

Playback = changing timestamp, not query logic

Folder Structure (Authoritative)
options-platform/
├── src/                         # Electron + Backend
│   ├── main.js                  # Electron main process
│   ├── preload.js               # Secure IPC bridge
│   └── services/
│       └── db.service.js        # ALL DB queries (single source of truth)
│
├── client/                      # React Renderer
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── app/
│       │   └── AppShell.jsx     # Layout shell
│       │
│       ├── components/
│       │   ├── HeaderBar.jsx    # Master Control Bar
│       │   ├── TimeTravelBar.jsx# Playback UI
│       │   └── OptionChain/
│       │       ├── ChainTable.jsx
│       │       └── StrikeWindowControl.jsx
│       │
│       ├── state/
│       │   └── playbackStore.js # currentTime (single source of truth)
│       │
│       ├── utils/
│       │   ├── formatters.js    # dd-mm-yyyy formatting
│       │   └── centerStrike.js  # ±N strike slicing logic
│       │
│       ├── App.js               # React root
│       └── index.js
│
├── docker-compose.yml           # TimescaleDB container
├── package.json                 # Electron tooling
└── README.md

Key Data Flow
React UI
  ↓
IPC (preload.js)
  ↓
Electron main.js
  ↓
db.service.js
  ↓
PostgreSQL / TimescaleDB


Playback works by changing the timestamp and re-requesting the snapshot.

Deprecated / Removed (Do NOT Reintroduce)

These patterns are explicitly banned:

getSampleOptionChain

load-chain IPC

DISTINCT ON (strike_price)

time BETWEEN x AND y for UI

SQL to_char() formatting

Mixed-expiry queries

Current Status
✅ Completed

Electron shell stable

IPC contract stable

DB snapshot correctness

Expiry locking

Time formatting (frontend)

Option chain rendering

Architecture ready for scale

⏳ Planned / Future

Playback engine (play / pause / step)

Slider UI

Virtualized tables

OI charts

Multi-expiry selector

Strategy backtesting

How to Continue Development

Any new work must:

Preserve snapshot correctness

Respect playback time as first-class state

Avoid DB coupling with UI logic

This project is intentionally designed for long-term extensibility.