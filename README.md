# AtlasPay — Modern Banking Platform (1 folder: Laravel + Inertia React)

One codebase, one database, two clients:

```
~/Work/
├── AtlasPay/            # THIS repo — Laravel 13 + Inertia React web + Sanctum API
│   ├── app/             # Models, Http/Controllers (+ Api/), Services, Events
│   ├── resources/js/    # React 19 Inertia pages/components (served by Laravel)
│   ├── resources/css/   # Tailwind v4 design system
│   ├── resources/views/ # app.blade.php (Inertia root)
│   ├── routes/
│   │   ├── web.php      # Inertia web routes (session auth)
│   │   └── api.php      # Sanctum JSON API (mobile, token auth) — same DB
│   └── docker-compose.yml
└── AtlasPayMobile/      # Separate Expo app, uses AtlasPay's /api/* only
```

Web = Inertia (no separate frontend server in prod: `npm run build` → Laravel serves it).
Mobile = `../AtlasPayMobile`, Bearer-token API, same backend + same SQLite/Postgres DB.

## Features

### Payments & transfers
- Bank (RIB) + card transfers, 5 MAD processing fee, ownership-checked sender account
- Row-level locks (`lockForUpdate`) so concurrent transfers can't overdraw
- No self-transfers; external RIBs settle as pending-external (null recipient) instead of a fake bridge account
- Real-time `TransactionCreated` events (Reverb/Pusher)

### QR Vault
- Send / QuickPay / Request / Merchant-store token flows, 10-min expiry (store = 10y permanent)
- Encrypted token ids (`Crypt`), scanned-status broadcast, confirm + sender-approval + cancel
- Web scanner (html5-qrcode), mobile scanner (expo-camera); mobile renders codes with react-native-qrcode-svg
- Confirm endpoint verifies the caller owns one side of the token

### Daret (rotating savings circles)
- Create groups, invite members (real-time invite events), 10 MAD join fee
- Locked-balance contribution payment, automatic round payout when everyone paid
- Cycle completes when all members received a payout

### Credits
- Score-based limit (`credit_score × 10`), one active loan max, 8% interest + 1.5% origination fee
- Full-balance repayment; +50 score on-time / −100 late

### Savings vaults + budgets
- Locked goals with monthly auto-deduction (scheduled `app:process-autocut`), 2% early-unlock fee, unlock-code flow
- Monthly per-category budgets (upsert)

### AI (Anwar Twin / BankBot)
- Groq Llama-3.3-70B: spending analysis, 6-month projections, overdraft/stress scores, seasonal nudges (Ramadan, Eid, summer, rentrée)
- `POST /chat` (web) and `POST /api/chat` (mobile) share the same brain

### Reports / security
- Transaction report + DomPDF export, Recharts analytics
- Fortify session auth + 2FA for web; Sanctum tokens for mobile; verified-mail gates on money routes

## Tech

| Layer | Stack |
|---|---|
| Backend | Laravel 13, PHP 8.3+, Fortify, Sanctum, Reverb, DomPDF, Pest, Pint |
| Web | React 19, Inertia 3, Vite, Tailwind v4, Radix, Framer Motion, Recharts, qrcode.react + html5-qrcode, i18next |
| Mobile | Expo SDK 52, React Navigation, axios, expo-camera, react-native-qrcode-svg |
| Data | SQLite (dev) / Postgres (prod), database queue/cache/session |

## Run the web app

Prereqs: PHP 8.3+, Composer, Node 20+.

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install
composer dev        # server + queue + logs + vite (one command)
```

Useful:

```bash
npm run build            # production web assets
./vendor/bin/pint        # php style
./vendor/bin/pest        # php tests
npm run lint && npm run format
npm run types:check
php artisan migrate:fresh --seed
docker compose up        # app on :8000 (vite via composer dev locally)
```

Env that matters (`.env.example`): `APP_URL=http://localhost:8000`, `GROQ_API_KEY`, `REVERB_*`, `SANCTUM_STATEFUL_DOMAINS`.

## Mobile API (for `../AtlasPayMobile`)

Base: `{APP_URL}/api` (local: `http://localhost:8000/api`), `Authorization: Bearer <token>`.
Verify anytime: `php artisan route:list --path=api` (32 routes).

| Method | URI | Description |
|---|---|---|
| POST | `/api/register`, `/api/login` | Create token (register also creates wallet accounts) |
| GET/POST | `/api/user`, `/api/logout` | Me / revoke current token |
| GET | `/api/dashboard?with_ai=1`, `/api/accounts`, `/api/transactions` | Summary, accounts, paginated history |
| POST | `/api/transfer/{bank\|card}` | Transfer with fee + locks |
| POST | `/api/qr/create/{sender\|quickpay\|receiver\|store}` | New QR token |
| GET | `/api/qr/merchant/permanent` | Permanent store code |
| GET/POST | `/api/qr/{id}`, `/api/qr/{id}/scan`, `/api/qr/{id}/confirm`, `/api/qr/{id}/approve`, `/api/qr/{id}/cancel` | QR lifecycle |
| GET | `/api/qr/status/{token}` | Polling status |
| GET/POST | `/api/daret`, `/api/daret/users` | Circles + user search |
| POST | `/api/daret/{group}/{pay\|accept\|decline}` | Circle actions |
| GET/POST | `/api/credits`, `/api/credits/{credit}/repay` | Loans |
| GET/POST | `/api/savings`, `/api/savings/{goal}/{request-unlock\|unlock}` | Vaults |
| GET/POST | `/api/budgets` | Budgets |
| POST | `/api/chat` | AI assistant |

## Web routes (Inertia)

`/`, `/dashboard`, `/transfer`, `/transfer/{method}`, `/daret…`, `/credits…`, `/savings…`, `/budgets`, `/reports/transactions(+/pdf)`, `/ai`, `/chat`, `/qr/create/*`, `/qr/redirect/{id}`, `/qr/view/{id}`, `/qr/confirm|approve|cancel/{id}`, `/qr/status/{token}`.

## Database

users (KYC, credit_score, 2FA) · accounts (wallet/…​) · transactions (nullable legs, audit) · tokens (QR) · credits · budgets · savings_goals (soft deletes) · daret_groups / daret_members.

## Edge cases fixed in this pass

- Transfer required owning an **active** sender account (was: any RIB incl. other users'), blocked self-transfer, method whitelist, balance re-checked under lock, recipient `null` for external RIBs (was: hardcoded `to_account_id = 1` which FK-fails when account 1 is gone).
- `DaretController::pay` balance check moved **inside** the DB transaction with lock; errors now throw `ValidationException` instead of returning a redirect from inside the closure (which never rolled back correctly).
- `TransactionService::create` handles null legs (pool/fee/cancel records) and skips money movement + duplicate notifications for those.
- QR `confirm` now checks caller owns a leg, rejects self-pay and non-positive amounts.
- API mirrors the same rules so web and mobile can't diverge.

Still queued (say the word): QR `handleScan`/`showToken` null-wallet guard, Daret payout recipient with no active account silently skipping the round, credit repay partial payments, savings `initial_deposit > 0` with no account, transfer `amount` string-cast consistency, rate-limiting `/api/login`.

## Roadmap

- [x] Single-folder Inertia app
- [x] Sanctum API for mobile (same DB)
- [x] Expo scaffold in `../AtlasPayMobile`
- [ ] Push notifications from backend events
- [ ] Biometric login (expo-local-authentication)
- [ ] OpenAPI docs, admin dashboard, multi-currency, webhooks, CI/CD

## License

MIT.
