# SalesCraft AI

> An AI-powered sales page generator — paste your product details, pick a model and tone, and get a fully structured, conversion-optimised sales page in seconds.

Built with **Laravel 13 · PHP 8.4 · Inertia.js v3 · React 19 · TypeScript · Vite 8 · Tailwind CSS v4**.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Features](#features)
3. [High-Level Architecture](#high-level-architecture)
4. [Request Lifecycle (Generation Flow)](#request-lifecycle-generation-flow)
5. [AI Provider Strategy](#ai-provider-strategy)
6. [Prompt Engineering](#prompt-engineering)
7. [Database Schema](#database-schema)
8. [Input Validation](#input-validation)
9. [Security & Concurrency](#security--concurrency)
10. [Dashboard & Stats](#dashboard--stats)
11. [Frontend Structure](#frontend-structure)
12. [Project File Tree](#project-file-tree)
13. [Routes Reference](#routes-reference)
14. [Environment Variables](#environment-variables)
15. [Local Development](#local-development)
16. [Docker & Deployment](#docker--deployment)
17. [Code Quality](#code-quality)
18. [Demo Credentials](#demo-credentials)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Language (backend) | PHP | 8.4 |
| Framework | Laravel | 13.x |
| Authentication | Laravel Fortify | 1.34+ |
| ORM | Eloquent | — |
| Bridge | Inertia.js Laravel adapter | 3.x |
| Language (frontend) | TypeScript | 5.7 |
| UI Framework | React | 19.x |
| CSS Framework | Tailwind CSS | 4.x |
| Component Library | shadcn/ui (Radix UI primitives) | — |
| Bundler | Vite | 8.x |
| Type-safe routing | Laravel Wayfinder | 0.1.x |
| Database | MySQL | 8.x |
| Cache / Sessions / Locks | Redis (Predis client) | — |
| AI — default | Groq · Llama 3.1 8B Instant | free |
| AI — alternative | Google Gemini 2.5 Flash | free |
| AI — alternative | OpenRouter · GPT OSS 20B / 120B | free tier |
| Container | Docker (php:8.4-cli-bookworm) | — |
| Cloud deploy | Railway | — |

---

## Features

### Core
- **Multi-model AI generation** — select Groq, Gemini, or OpenRouter at form time; default is Groq (Llama 3.1 8B, free)
- **Tone-aware copy** — four tone modes (Professional · Casual · Aggressive · Luxury) with distinct writing rules injected into every prompt
- **Structured JSON output** — every generation produces a typed, schema-validated object: `headline`, `sub_headline`, `description`, `benefits[]`, `features[]`, `testimonials[]`, `pricing{}`, `cta{}`
- **Per-section regeneration** — re-run AI on any single section (`hero`, `benefits`, `features`, `testimonials`, `pricing`, `cta`) without re-generating the full page
- **Template support** — `dark`, `light`, and `bold` visual templates (selectable at generation time, stored in `input_data`)

### Pages & History
- Saved pages list with title, tone, status, and date
- Full page view with live rendered preview
- Edit (pre-filled form) reloads original `input_data` into the generate form
- Delete with ownership check
- **HTML export** — downloads a standalone `.html` file of any completed page

### Sharing
- **Public preview URL** `/preview/{id}` — unauthenticated; renders `null` if page is not `completed`

### Infrastructure
- **Redis distributed lock** — 60-second TTL lock per user prevents duplicate concurrent submissions
- **In-progress guard** — also blocks if a `processing` record already exists for that user
- **Status lifecycle** — `processing → completed` on success, `processing → failed` on any exception
- **Compound indexes** on `(user_id, created_at)` and `(user_id, status)` for efficient dashboard queries

### Auth
- Register, login, logout, password reset, two-factor authentication (Fortify)
- User profile settings

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│              React 19 + Inertia.js (SPA-like)               │
└────────────────────────┬────────────────────────────────────┘
                         │  HTTP (Inertia protocol)
┌────────────────────────▼────────────────────────────────────┐
│                   Laravel 13 (PHP 8.4)                      │
│                                                             │
│  Routes ──► Controllers ──► FormRequest (validation)        │
│                  │                                          │
│           GenerateController                                │
│                  │                                          │
│         Cache::lock (Redis, 60s)                            │
│                  │                                          │
│    SalesPageGeneratorService ◄── PromptBuilder              │
│                  │                                          │
│         ┌────────┴──────────┐                               │
│         ▼                   ▼                               │
│     callGroq()         callGemini()                         │
│     callOpenRouter()                                        │
│                             │                               │
│              decodeJson() / JSON validation                 │
│                             │                               │
│              SalesPage::update() (MySQL)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Request Lifecycle (Generation Flow)

### Step-by-step

```
1. User submits form (POST /generate)
        │
2. GenerateSalesPageRequest validates all fields
        │
3. Redis distributed lock acquired
   Lock key: generate_lock:user:{userId}  TTL: 60s
   → If lock fails: return back() with error
        │
4. SalesPageGeneratorService::generate() called
        │
5. Check for in-progress record
   SalesPage::where(user_id)->where(status, 'processing')->exists()
   → If true: throw GenerationException
        │
6. SalesPage::create() with status = 'processing'
        │
7. callAI() routes to provider based on MODEL_MAP
        │
   ┌────┴──────────────────────────────────────────┐
   │  Provider        │  Endpoint                  │
   │──────────────────│────────────────────────────│
   │  groq            │  api.groq.com/openai/v1/.. │
   │  gemini          │  generativelanguage.google  │
   │  openrouter      │  openrouter.ai/api/v1/..   │
   └──────────────────────────────────────────────┘
        │
8. AI response received → decodeJson()
   (strips markdown fences, validates JSON_ERROR_NONE)
        │
9. SalesPage::update(output_data, status = 'completed')
        │
10. Redirect to /pages/{id}
        │
On any Throwable:
   SalesPage::update(status = 'failed')
   Log::error(...)
   throw GenerationException → back()->withErrors()
        │
Finally (always):
   $lock->release()
```

---

## AI Provider Strategy

### Provider Map

```php
private const MODEL_MAP = [
    'llama-3.1-8b-instant'     => ['provider' => 'groq',       'api_model' => 'llama-3.1-8b-instant'],
    'gemini-2.5-flash'         => ['provider' => 'gemini',     'api_model' => 'gemini-2.5-flash'],
    'openai/gpt-oss-20b:free'  => ['provider' => 'openrouter', 'api_model' => 'openai/gpt-oss-20b:free'],
    'openai/gpt-oss-120b:free' => ['provider' => 'openrouter', 'api_model' => 'openai/gpt-oss-120b:free'],
];
private const DEFAULT_MODEL = 'llama-3.1-8b-instant';
```

All three providers receive the same payload structure (system prompt + user prompt + JSON-mode instruction) and return the same typed JSON object. This makes adding a new provider a matter of implementing one private method and adding a row to `MODEL_MAP`.

### Provider Differences

| Provider | JSON enforcement | Temperature | Max tokens | Auth |
|---|---|---|---|---|
| Groq | `response_format: json_object` | 0.7 | 2000 | Bearer token |
| Gemini | `responseMimeType: application/json` | 0.7 | 2000 | API key in URL |
| OpenRouter | `response_format: json_object` | 0.7 | 2000 | Bearer token + Referer/X-Title headers |

### Error handling per provider

- **HTTP 429** → user-friendly "busy / rate limit" message (no stack trace)
- **Any other failure** → provider-specific message extracted from `error.message` JSON field
- **Malformed JSON** → `decodeJson()` strips markdown fences, then throws `GenerationException` on `JSON_ERROR_NONE` failure

### Per-section Regeneration

`SalesPageGeneratorService::regenerateSection()` uses `PromptBuilder::sectionPrompt()` to build a minimal, section-scoped prompt, then merges the AI response back into the existing `output_data` array:

```php
$page->update(['output_data' => array_merge($page->output_data ?? [], $decoded)]);
```

Only completed pages can be section-regenerated (`abort_if(! $page->isCompleted(), 404)`).

---

## Prompt Engineering

### Two-layer Prompt Architecture

```
┌─────────────────────────────────────────────┐
│  SYSTEM PROMPT (PromptBuilder::systemPrompt) │
│  ─ 8 strict rules                           │
│  ─ JSON-only output enforcement             │
│  ─ Copy-writing quality standards           │
│  ─ Word limits per section                  │
└──────────────────┬──────────────────────────┘
                   │ injected into every request
┌──────────────────▼──────────────────────────┐
│  USER PROMPT (PromptBuilder::userPrompt)     │
│  ─ Product: name, description               │
│  ─ Key features (array or comma string)     │
│  ─ Target audience                          │
│  ─ Price                                    │
│  ─ Unique selling points (optional)         │
│  ─ Tone + tone-specific writing rules       │
│  ─ Exact JSON schema to return              │
└─────────────────────────────────────────────┘
```

### Tone Instructions (injected verbatim)

| Tone | Writing Rule |
|---|---|
| `professional` | Formal, authoritative. Lead with data, ROI, business outcomes. No slang. Declarative headlines. |
| `casual` | Conversational, friendly. Contractions, short sentences. Warm headlines. |
| `aggressive` | Urgent, FOMO-driven. Strong imperatives ("Get it now"). Creates tension. |
| `luxury` | Aspirational, exclusive. Never use "cheap", "deal", "affordable". Elite feel. |

### Output Schema (full generation)

```json
{
  "headline":     "<outcome-focused, max 12 words>",
  "sub_headline": "<who + core benefit, max 20 words>",
  "description":  "<benefits section heading, max 15 words>",
  "benefits":     ["<Verb-led>", "<Verb-led>", "<Verb-led>", "<Verb-led>"],
  "features":     [{"title": "", "description": "<what + why it matters>"}],
  "testimonials": [{"name": "", "role": "", "quote": "<result with number>"}],
  "pricing":      {"price": "", "billing": "", "cta_text": "", "urgency": ""},
  "cta":          {"button_text": "<max 5 words>", "supporting_text": ""}
}
```

### Section Schemas (per-section regeneration)

| Section | Schema keys returned |
|---|---|
| `hero` | `headline`, `sub_headline` |
| `benefits` | `description`, `benefits[]` |
| `features` | `features[]` |
| `testimonials` | `testimonials[]` |
| `pricing` | `pricing{}` |
| `cta` | `cta{}` |

---

## Database Schema

### `sales_pages` table

```sql
CREATE TABLE sales_pages (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    title       VARCHAR(255) NOT NULL,
    input_data  JSON NOT NULL,          -- raw form inputs
    output_data JSON NULL,              -- structured AI response
    tone        VARCHAR(50) DEFAULT 'professional',
    status      ENUM('processing','completed','failed') DEFAULT 'processing',
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_created  (user_id, created_at),
    INDEX idx_user_status   (user_id, status)
);
```

**Why two JSON columns?**

| Column | Contains | Used for |
|---|---|---|
| `input_data` | Original form fields (name, description, features, audience, price, usps, tone, model, template) | Pre-filling the edit/re-generate form; re-building prompts for section regeneration |
| `output_data` | Full AI response object | Rendering the live preview, public share, and HTML export |

Keeping them separate means inputs are never lost or corrupted by AI output, and partial section updates can be merged cleanly via `array_merge`.

### Status Lifecycle

```
[form submit]
      │
      ▼
  processing ──► completed  ✅
      │
      └──────► failed       ❌
```

The `isCompleted()` model helper (`$this->status === 'completed'`) is used as a guard before export, public preview, and section regeneration.

---

## Input Validation

`GenerateSalesPageRequest` enforces:

| Field | Rules |
|---|---|
| `name` | required, string, max:255 |
| `description` | required, string, max:2000 |
| `features` | required (array or comma-separated string — normalised in `prepareForValidation`) |
| `audience` | required, string, max:500 |
| `usps` | nullable, string, max:1000 |
| `tone` | required, in:professional,casual,aggressive,luxury |
| `price` | nullable, string, max:100 |
| `model` | nullable, string, in:[four allowed model IDs] |
| `template` | nullable, string, in:dark,light,bold |

**Feature normalisation** — `prepareForValidation()` converts `"AI writing, SEO tools, CRM sync"` into `["AI writing", "SEO tools", "CRM sync"]` transparently before validation runs.

---

## Security & Concurrency

### Ownership checks

Every authenticated controller action checks `abort_if($page->user_id !== $user->id, 403)` inline — no policy class needed given the simple one-model scope.

### Redis distributed lock

```php
$lock = Cache::lock("generate_lock:user:{$user->id}", seconds: 60);

if (! $lock->get()) {
    return back()->withErrors(['concurrent' => '...']);
}

try {
    // generate
} finally {
    $lock->release();   // always released, even on exception
}
```

This prevents the following race condition:
- User double-clicks Submit → two simultaneous requests land on the server
- Without the lock, two `SalesPage` rows would be created and two expensive AI calls fired
- The lock ensures only the first request proceeds; the second gets a user-friendly error immediately

The `SalesPageGeneratorService` also has a secondary guard at the service layer checking for existing `processing` rows, providing defence in depth.

### Two-Factor Authentication

Provided by Laravel Fortify's `TwoFactorAuthentication` feature. Users can enable TOTP 2FA from the Settings page.

---

## Dashboard & Stats

`DashboardController` passes three real-time counters alongside the 6 most recent completed pages:

```php
$stats = [
    'total'      => SalesPage::where('user_id', $user->id)->where('status','completed')->count(),
    'this_month' => SalesPage::...->whereMonth('created_at', now()->month)->count(),
    'this_week'  => SalesPage::...->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
];
```

Both queries are fast because the `(user_id, status)` and `(user_id, created_at)` compound indexes are defined in the migration.

---

## Frontend Structure

```
resources/js/
├── app.tsx                  # Inertia app bootstrap
├── pages/
│   ├── welcome.tsx          # Public landing page
│   ├── dashboard.tsx        # Stats + recent pages
│   ├── Generate.tsx         # Input form (new + edit/prefill)
│   ├── Preview.tsx          # Public shareable preview
│   ├── settings.tsx         # Profile & security settings
│   └── SalesPages/
│       ├── Index.tsx        # Paginated saved pages list
│       └── Show.tsx         # Full page view + section regen
├── components/              # Shared UI primitives (shadcn/ui wrappers)
├── features/                # Domain-specific feature components
├── layouts/                 # App shell, sidebar, auth layouts
├── hooks/                   # Custom React hooks
├── actions/                 # Inertia form action helpers
├── shared/                  # Shared types / constants
├── types/                   # TypeScript type definitions
├── lib/                     # Utility functions (cn, etc.)
├── widgets/                 # Standalone composable widgets
└── wayfinder/               # Auto-generated type-safe route references
```

### Key architectural decisions

- **Inertia.js** eliminates the need for a separate API; controllers return `Inertia::render()` with typed props instead of JSON
- **Laravel Wayfinder** generates TypeScript route helpers from PHP routes, giving type-safe navigation without manual URL strings
- **TypeScript strict mode** — `tsc --noEmit` runs in CI; all page props are typed via dedicated `types/` definitions
- **shadcn/ui** — components are owned in-repo (not a dependency), making customisation straightforward without ejection

---

## Project File Tree

```
salescraft-app/
├── app/
│   ├── Exceptions/
│   │   └── GenerationException.php          # Domain exception for AI failures
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── DashboardController.php      # Stats + recent pages
│   │   │   ├── GenerateController.php       # Form → lock → generate → redirect
│   │   │   ├── PreviewController.php        # Public preview (no auth)
│   │   │   ├── RegenerateSectionController.php  # POST /pages/{id}/regenerate
│   │   │   └── SalesPageController.php      # CRUD + HTML export
│   │   └── Requests/
│   │       └── GenerateSalesPageRequest.php # Full input validation
│   ├── Models/
│   │   ├── SalesPage.php                    # Eloquent model + isCompleted()
│   │   └── User.php
│   └── Services/
│       ├── PromptBuilder.php                # All prompt logic (system, user, section)
│       └── SalesPageGeneratorService.php    # AI orchestration + provider routing
├── database/
│   └── migrations/
│       ├── ..._create_users_table.php
│       ├── ..._create_cache_table.php
│       ├── ..._create_jobs_table.php
│       ├── ..._create_sales_pages_table.php
│       └── ..._add_two_factor_columns_to_users_table.php
├── resources/
│   └── js/                                  # React + TypeScript frontend (see above)
├── Dockerfile                               # Multi-stage build (PHP 8.4 + Node 20)
├── start.sh                                 # Container entrypoint (migrate → seed → serve)
├── railway.json                             # Railway deployment config
├── composer.json
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Routes Reference

| Method | URI | Controller | Auth | Description |
|---|---|---|---|---|
| GET | `/` | — | ❌ | Landing page |
| GET | `/dashboard` | `DashboardController@index` | ✅ | Stats + recent pages |
| GET | `/generate` | `GenerateController@create` | ✅ | New generation form |
| POST | `/generate` | `GenerateController@store` | ✅ | Run AI generation |
| GET | `/pages` | `SalesPageController@index` | ✅ | Saved pages list |
| GET | `/pages/{id}` | `SalesPageController@show` | ✅ | View page + section regen UI |
| GET | `/pages/{id}/edit` | `SalesPageController@edit` | ✅ | Pre-filled generate form |
| DELETE | `/pages/{id}` | `SalesPageController@destroy` | ✅ | Delete page |
| GET | `/pages/{id}/export` | `SalesPageController@export` | ✅ | Download `.html` file |
| POST | `/pages/{id}/regenerate` | `RegenerateSectionController` | ✅ | Regenerate single section |
| GET | `/preview/{id}` | `PreviewController@show` | ❌ | Public shareable preview |

---

## Environment Variables

Copy `.env.example` to `.env`. Required variables:

```env
# ── Application ────────────────────────────────────────────────────────────────
APP_NAME="SalesCraft AI"
APP_ENV=production
APP_KEY=                        # php artisan key:generate
APP_URL=http://localhost

# ── Database ───────────────────────────────────────────────────────────────────
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=salescraft
DB_USERNAME=root
DB_PASSWORD=

# ── Redis (sessions · cache · queue · locks) ───────────────────────────────────
REDIS_CLIENT=predis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
SESSION_DRIVER=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis

# ── AI Providers — configure at least one ─────────────────────────────────────
# Groq (default model: llama-3.1-8b-instant) — console.groq.com
GROQ_API_KEY=gsk_...

# Google Gemini 2.5 Flash — aistudio.google.com
GEMINI_API_KEY=AIza...

# OpenRouter (GPT OSS 20B / 120B, 30+ free models) — openrouter.ai
OPENROUTER_API_KEY=sk-or-v1-...
```

> **Note:** The app throws a descriptive `GenerationException` at runtime if the selected model's key is missing — so you can safely configure only the providers you want to use.

---

## Local Development

### Prerequisites

- PHP 8.4
- Composer 2
- Node.js 20+
- MySQL 8
- Redis

### Setup

```bash
# 1. Install PHP dependencies
composer install

# 2. Install Node dependencies
npm install

# 3. Configure environment
cp .env.example .env
php artisan key:generate

# 4. Create database and run migrations
php artisan migrate

# 5. (Optional) Seed demo user
php artisan db:seed

# 6. Start all services in parallel
composer dev
```

`composer dev` runs all four services concurrently with colour-coded output:

| Colour | Service |
|---|---|
| 🔵 Blue | `php artisan serve` |
| 🟣 Purple | `php artisan queue:listen` |
| 🔴 Red | `php artisan pail --timeout=0` (log viewer) |
| 🟠 Orange | `npm run dev` (Vite HMR) |

---

## Docker & Deployment

### Dockerfile — layer strategy

```
Layer 1: System packages (apt) + PHP extensions
Layer 2: Node.js 20
Layer 3: Composer binary
Layer 4: PHP deps (composer install --no-dev)  ← cached unless composer.* changes
Layer 5: Node deps (npm ci)                    ← cached unless package*.json changes
Layer 6: Full source copy (COPY . .)
Layer 7: package:discover (temp .env)
Layer 8: npm run build (Vite production build)
Layer 9: route:cache + view:cache
Layer 10: storage permissions
```

### Container startup (`start.sh`)

```sh
php artisan config:cache
php artisan migrate --force          # auto-runs on every deploy
php artisan db:seed --force          # seeds demo user
exec php -S 0.0.0.0:8080 -t public/ server.php
```

### Railway deployment

`railway.json` configures Railway to:
- Build using the `Dockerfile`
- Restart on failure (max 3 retries)

```bash
# Deploy via Railway CLI
railway up
```

Ensure Railway environment variables include all `.env` keys — especially `APP_KEY`, `DB_*`, `REDIS_*`, and at least one `*_API_KEY`.

---

## Code Quality

### PHP

| Command | Tool | What it does |
|---|---|---|
| `composer lint` | Laravel Pint | Auto-fix PHP code style |
| `composer lint:check` | Laravel Pint | Check style (CI-safe, no writes) |
| `composer test` | PHPUnit 12 | Config clear → lint check → full test suite |
| `composer ci:check` | All tools | Lint + format + types + tests |

### JavaScript / TypeScript

| Command | Tool | What it does |
|---|---|---|
| `npm run lint` | ESLint 9 | Auto-fix JS/TS style |
| `npm run lint:check` | ESLint 9 | Check only (CI-safe) |
| `npm run format` | Prettier 3 | Format `resources/` |
| `npm run format:check` | Prettier 3 | Check formatting (CI-safe) |
| `npm run types:check` | TypeScript `tsc` | Type-check with no emit |
| `npm run build` | Vite 8 | Production build |

### CI gate

`composer ci:check` runs the full chain in order:
```
ESLint check → Prettier check → TypeScript check → PHPUnit
```
Any failure stops the chain. All checks must pass before merge.

---

## Demo Credentials

```
Email:    demo@salescraft.ai
Password: salescraft2026
```
