# SalesCraft AI

An AI-powered sales page generator built with Laravel 11 + Inertia.js + React + Vite.

## Stack

- **Backend:** Laravel 11, PHP 8.2+, Laravel Fortify (auth), Eloquent ORM
- **Frontend:** React 18, Inertia.js v2, Tailwind CSS, shadcn/ui, Vite 5
- **AI:** OpenAI gpt-4o-mini (structured JSON output)
- **Infrastructure:** MySQL, Redis (rate limiting + concurrency locks)

## Features

- User authentication (register, login, logout)
- Product input form with tone selection
- AI-generated structured sales pages (headline, benefits, features, testimonials, CTA)
- Saved pages history with search, view, re-generate, and delete
- Live preview mode + public shareable preview URL
- Rate limiting (10 generations/hour per user)
- Redis distributed lock — prevents duplicate concurrent generation

## Setup

See [SETUP.md](SETUP.md) for full installation and deployment instructions.

## Routes

| Page | Route | Auth |
|------|-------|------|
| Dashboard | `/dashboard` | Yes |
| New Generation | `/generate` | Yes |
| Saved Pages | `/pages` | Yes |
| View Page | `/pages/{id}` | Yes |
| Public Preview | `/preview/{id}` | No |
