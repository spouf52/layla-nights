# LAŸLA NIGHTS — STELLAR EDITION — App Plan

> One-night festival companion · The Source Marrakech · Nov 7 · 18:00–03:00
> Informational app for guests/ravers: line-up, schedule, site map, general info, FAQ, ticket display.
> English-only · online-ok for MVP · stills only, no in-app video.

## 0. Where we stand (Sep 2026)

Working Expo SDK 57 app in this folder (`npx expo start` to run, `npx expo export --platform web` verified).
`src/` implements §§3–8 below: 5 tabs, artist sheets, tickets + real QR, demo clock, placeholder art.
UI refresh (Sep 14): authentic portraits for all five artists, promo-based cover still, condensed display typography, photo grid, artist detail, shared save controls, custom five-tab dock, schedule, FAQ and ticket styling. Source records: `assets/ASSET-SOURCES.md`. NAIT spelling confirmed by the organizer; old `/artist/nail` links still resolve.
Still pending: final approved photo rights/press-pack selections, final 2D map render (§5), CMS wiring, ticketing provider.

### Locked decisions (Sep 14)
- **DJ photos: REAL PORTRAITS IN PREVIEW.** Latest organizer request supersedes the earlier placeholder-only decision. All five artists use sourced, bundled photographs. `Artist.image` supports later CMS replacement. Publication approval remains pending; intentional art is only the image-failure fallback (§5).
- **2D map render: INCOMING (done soon).** Externally produced → app integrates per the map brief (§5). Prototype pins stand in until it lands.
- **Live preview: YES.** Build the Playing-Now engine with a demo clock for testing; real device time on event day (§6).
- **No video in app.** Promo clip stays out; Home/onboarding use graded still frames. No `expo-video`/`expo-av` deps — lighter binary, less battery drain.

### Stack: Expo (locked for MVP)
Earlier brainstorm pick was Flutter (team preference), but with ~8 weeks to Nov 7 and iOS+Android ASAP plus frequent non-tech edits: **Expo + EAS Update** (OTA text/time fixes without store review, one codebase). Revisit Flutter post-event. A rewrite now costs 2–3 weeks with zero user-facing gain.

## 1. MVP scope

### P0 — must ship
1. Home: identity (name/edition/date/venue), countdown, announcement banner, tonight preview, Playing-Now banner on event day (or demo mode)
2. Line-up: photo-optional grid + search + stage filter → artist detail sheet (photo or placeholder, genre, stage, set time, save). Minimal text: face, name, time, one action.
3. Schedule + My Schedule: day timeline by stage, local favorites, overlap hint, reminders, red `● LIVE` pill via Playing-Now engine
4. Site map: zoomable 2D render (incoming) + glowing pins (entrance, reception, stages, food, water, toilets, first aid, parking) + category filter + POI bottom sheet
5. Info + FAQ: accordion, answers ≤2 lines, safety/emergency pinned red on top, tap-to-call CTA. All CMS-driven.
6. Tickets: order display — big QR (`qr_url`), order ID, buyer name, “Add to Wallet” deep link (`wallet_url`), brightness boost, screenshot fallback. No purchase in app.
7. Announcements via push (lineup drop, set-time change, emergency)

### P1 — if time before freeze
- Real DJ photos + final map render swapped in via CMS (no binary update)
- Offline cache of schedule/map JSON + images (`expo-file-system` + `expo-image` disk cache)
- Share My Schedule (deep link `/schedule?ids=...`)
- Apple/Google Wallet pass file

### Out of scope (post-event)
In-app checkout, entry scanning, interactive vector map, social/friends, cashless wallet, AR, in-app video.

## 2. Tech stack (Expo MVP)

- **App:** Expo 57, React 19, React Native 0.86, expo-router, TypeScript strict
- **UI:** `expo-image` (blurhash placeholders, disk cache), `expo-symbols` (SF), `expo-blur` / `expo-glass-effect`, `react-native-reanimated` 4.x (transform/opacity only), `react-native-gesture-handler`, `react-native-safe-area-context`, `FlashList` for line-up/schedule
- **State/data:** local TS snapshot → fetch CMS JSON at launch (15-min cache). Favorites in SecureStore/AsyncStorage. `demoClock` util: `{ mode: 'live' | 'demo', demoTime }` — every time-dependent UI reads through it; demo toggle hidden in Settings (and TestFlight builds) for pre-event testing.
- **Content (non-tech editors):** Sanity (recommended) or Contentful. Schemas: `artist, stage, set, poi, faq, info_page, announcement`. Local snapshot is the fallback when offline/CMS empty.
- **Push/analytics/crash:** `expo-notifications` + FCM topics (`lineup`, `schedule_changes`, `emergency`); Firebase Analytics + Crashlytics via EAS; `expo-constants` + `expo-device` for targeting
- **Ship:** EAS Build (iOS+Android) + EAS Update (OTA text/time fixes), TestFlight + Play Internal → production. Need Apple Developer + Play Console + EAS project now.

Key commands: `npm install`, `npx expo start`, `npx expo start --web`, `npx expo lint`.

## 3. Information architecture / routes

```text
src/app/(tabs)/index.tsx      Home (+ Playing-Now banner)
src/app/(tabs)/lineup.tsx     Line-up grid (photo-optional)
src/app/(tabs)/schedule.tsx   Schedule + My Schedule (BUILD)
src/app/(tabs)/map.tsx        2D render + pins (BUILD on brief §5)
src/app/(tabs)/info.tsx       Info + FAQ accordion
src/app/(tabs)/tickets.tsx    Tickets/QR (BUILD)
src/app/artist/[slug].tsx     Artist detail sheet (photo or placeholder)
src/lib/demoClock.ts          live/demo time source (BUILD)
src/lib/nowPlaying.ts         set-status engine: upcoming/live/done (BUILD)
```

Deep links: `/artist/:slug`, `/schedule`, `/tickets`, `/map?poi=:id` via `app.json` scheme + `expo-linking`.

Bottom nav ≤5 visible: Home, Line-up, Schedule, Map, More (Info + Tickets inside More, or Tickets as 5th tab — decide at design). Primary CTAs in thumb zone: Save set, View map, Show ticket.

## 4. Premium UI — ref image → Layla red/black

Reference ([Image 1]): black base + lime accent, 3 phones — (a) onboarding illustration + `Explore Now` pill, (b) home feed with greeting/search/chips/featured card/stacked cards/bottom nav with active pill, (c) profile with cover/avatar/stats/settings list/bottom nav. Keep the structure, swap lime → electric red, stellar/rave tone. Anti-stale rules: real photography (or art placeholders — never grey boxes), custom tab bar with red glow, motion on every transition, skeleton shimmer (never bare spinners).

### Tokens
- `background #07080C` (60%), `surface #0D1016` + `surfaceRaised #151A23` (30%), `accent #F5222D` / `accentBright #FF3440` (10%), `accentSoft rgba(245,34,45,.14)` chips/secondary, `outline rgba(248,245,240,.12)`, `outlineStrong rgba(245,34,45,.4)` active
- Text: `#F8F5F0` 100% headings / `#9DA5B0` body / `#66707D` secondary
- Radius: cards 24–28, pills 28 (H56), sheets 24 top; `MaxContentWidth 720`
- Spacing: 8-pt grid only (8/12/16/24/32/48/64). Related rows 16, groups 32.

### Type
One display condensed (Archivo Expanded / Space Grotesk — check license) for `LAŸLA NIGHTS / STELLAR`, Inter/system body. Max 4 sizes, 2 weights. Tabular nums for set times.

### Screens
1. **Onboarding (still frame, no video):** graded promo still + red spark/star motif, title `A New Chapter Begins`, sub `STELLAR EDITION — NOV 7 · THE SOURCE`, pill `Explore Now`. One-time flag.
2. **Home:** `Good Evening, Raver` + bell, search `Search artists…`, chips `All / Main Stage / Garden / Arrival`, featured headliner card (red, `Add to Schedule`), stacked set cards. Event day (or demo): red Playing-Now banner (current set + next up) on top.
3. **Line-up → detail:** photo grid (placeholder art until photos land); detail sheet: big visual, genre tag, stage + set-time pill, Save (haptic + glow), bio ≤2 lines, share.
4. **Schedule/My Schedule:** timeline, stage color dots, red `LIVE` pill, overlap warning, reminder toggle per saved set.
5. **Map:** incoming 2D render fullscreen, custom red-glow pins, category chips, POI sheet with 1-line description.
6. **Tickets/Profile:** cover art → name, stats `Saved / Tickets / Stages`, big QR card + wallet button, rows: My Schedule, Ticket issues, Info, Settings (demo-clock toggle here in test builds), Safety.

### Motion/feel
150–300ms, transform/opacity only; shared-zoom into artist detail; parallax on heroes; haptic on save; subtle grain + red glow, no full gradients; reduced-motion toggle. Tap targets ≥44px, contrast 4.5:1, error/empty/loading states for every list.

## 5. Asset brief (photos pending · map incoming)

### DJ photos — sourced for preview; final press pack pending
- Spec for photographer/management: **1080×1350 portrait, dark background, crushed blacks + red rim grade**, face well-lit, export WebP + blurhash each.
- Preview: bundled photos for Dixon, Trikk, NAIT, Didiss and Whoskenza. CMS image URL takes priority, with bundled photo fallback and intentional art as a final fallback. Identical card geometry avoids layout shift. Provenance and publication-approval status are recorded in `assets/ASSET-SOURCES.md`.
- Publish checklist per artist: photo 1080px, `time HH:MM`, stage exists, blurhash generated.

### 2D venue map — DONE SOON (integration brief)
- Deliverable: **≥3000px PNG or SVG, dark-styled to match app** (no white CAD plan), with named zones: Main Stage, Garden Stage, Arrival Room, entrance, reception/info, food, water, toilets, first aid, parking interior/exterior.
- Pins use normalized `x/y` (0–1) so one map asset works on all screens; validate `0 ≤ x,y ≤ 1` at build.
- App: pinch-zoom (`react-native-gesture-handler`), custom glow pins, category filter (`essentials | hospitality | arrival`), POI bottom sheet. Offline-bundle the final render in `assets/maps/`.

## 6. Playing-Now engine + demo preview (YES)
- All clocks go through `demoClock`: `live` (device time) vs `demo` (test timestamp set in Settings). TestFlight builds expose the toggle; production defaults to `live`.
- `nowPlaying(sets, now)` → per set: `upcoming | live | done`. Night crosses midnight (18:00→03:00 spans two dates) — compare with full datetimes, not `HH:MM` strings.
- Surfaces: red `● LIVE` pills (schedule, line-up), Home event-day banner (current + next), push at saved-set start (≤5 min tolerance).
- QA: scripted demo times (19:25 pre-doors, 22:35 mid-set, 00:35 headliner, 03:05 after-close) must all render sensibly.

## 7. Data model

```ts
Artist{slug,name,style,stage,time,accent,description,image?:string,blurhash?:string,bio,socials}
Stage{id,name,mapPin}
Set{id,artistSlug,stageId,start:string,end:string,isHeadliner} // ISO datetimes, midnight-aware
VenuePoint{id,label,category:'essentials'|'hospitality'|'arrival',coordinate,x,y,blurb?}
Faq{q,a,cat,pinned?} · InfoSection{icon,title,detail,body} · Announcement{id,title,body,at,topic}
TicketOrder{orderId,buyerName,qrUrl,walletUrl,type}
DemoClock{mode:'live'|'demo',demoTime?:string}
```

CMS mirrors 1:1; local snapshot = fallback. Validate at build: every `Set.artistSlug` resolves, no same-stage overlaps, every pin in range.

## 8. Ticket display flow (external provider, display-only)
1. Tickets tab → order ID/email (or magic link) → store `TicketOrder` JSON.
2. QR ≥280px on white card, `orderId` selectable, `walletUrl` via `expo-web-browser`.
3. Brightness boost on focus + “screenshot this” hint for gate network failure.
4. No payment/PII beyond lookup; refunds link out (“Ticket issues”).

## 9. Content ops (non-tech team)
- Sanity Studio edits (no code/release). Line-up/times/FAQ live ≤15 min via fetch; urgent text via EAS Update.
- Freeze Nov 5 — after that only `announcement` + `set.start/end`.
- Photo/map drops land via CMS/OTA only — no binary resubmits for content.

## 10. Quality gates
- `npx expo lint`, TS strict, Reanimated discipline, WebP via CDN, FlashList virtualization, `expo-image` cache + blurhash (no grey pop-in).
- Manual: contrast, 44px targets, safe areas, dark-only, reduced-motion respected.
- Test matrix: demo-clock script (§6) × airplane-mode map/schedule × real QR × push on both OSes.

## 11. Timeline to Nov 7
- Wk1–2: tokens + onboarding + schedule + tickets + map shell (placeholder art) + Sanity schemas + `demoClock`/`nowPlaying`
- Wk3–4: CMS wiring + cache + push + deep links; map render integration when delivered; content entry starts
- Wk5: DJ photos swap-in, Internal/TestFlight build, gate QR QA, demo-clock review with you
- Wk6–7: store submissions (2–7d review), safety/FAQ/legal sign-off
- Wk8 (freeze): EAS Update only; on-call for set-time changes

## 12. Risks
- Ticketing QR format unknown → gate rejection. Get sample QR + validator rules this week.
- DJ photos late → mitigated by intentional placeholder system (§5); app still looks designed, not broken.
- Map render late/off-style → mitigated by brief (§5) + prototype pins; need ≥3000px dark render by Wk4.
- Last-minute changes → CMS + EAS Update, no resubmits.
- No in-app video → lower risk (binary size, battery); stills must be high-grade to carry immersion.

## 13. Open decisions
1. Ticketing provider + QR/wallet format (Shotgun/Ticketmaster/custom?)
2. Sanity vs Contentful (default: Sanity)
3. Exact brand red hex + display font license (photos + map already tracked above)
4. Bottom nav: resolved — Tickets is a stack screen (Home CTA + deep link), tabs stay at 5
5. Push sender + who may send emergency?

## 14. Next build steps
- [x] Scaffold routes + `demoClock`/`nowPlaying` + placeholder art components (`tsc` + `expo lint` clean, web export verified)
- [x] Favorites store + overlap check (+ reminders = push, pending)
- [x] Ticket QR screen (demo lookup, real QR render; wallet link pending provider)
- [x] Playing-Now banner on Home (push topics pending)
- [ ] Sanity schemas mirroring §7 + fetch layer with local fallback
- [ ] Push topics + Home announcement center
- [ ] Map integration on incoming render + pin validation
- [x] Photo preview pass + premium mobile UI refresh (all five performers)
- [ ] Final photo approvals + TestFlight/Internal build
