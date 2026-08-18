# Event Create/Edit Page — Design

## Context

`src/pages/event/create.tsx` is a visually polished 5-step wizard (Event Info,
Agenda, Tickets, Sponsors, Ad Images) that is currently **disconnected from
the real system** — all its state is seeded with hardcoded demo data and
nothing is persisted to the API.

The real, working create/edit flow lives in `src/pages/event/index.tsx` +
`src/pages/event/_form.tsx` (a Bootstrap modal), which calls
`EventModel.saveAll()` and is backed by four already-correct step components:
`_agenda.tsx`, `_tickets.tsx`, `_sponsors.tsx`, `_ads.tsx`.

Goal: make `/event/create` the real create **and** edit page (the modal goes
away from `index.tsx`), using the wizard's visual design, wired to the real
system exactly as it works today — not extended with new backend fields.

## Key finding

The wizard mockup has fields with no backend support:
- Agenda: category (OPENING/TALKSHOW/...), location — backend only stores
  `start_time`, `end_time`, `activity_name`, `notes`.
- Sponsors: name, tier (Title/Gold/Silver/Partner), tagline, color — backend
  only stores an uploaded logo image file, nothing else.
- Ad Images: type (HERO/SQUARE/RECTANGLE), resolution, size, timestamp —
  backend only stores an uploaded image file.

Decision (confirmed with user): match the real backend. Reuse the four
existing, already-correct step components unchanged rather than inventing UI
for fields that don't exist. Only Step 1 (Event Info) and the page shell are
rebuilt, since Step 1's mock fields were 100% fake with no real counterpart
wired up.

## Routing

Single page, both modes: `/event/create` (new event) and
`/event/create?id=123` (edit event 123). No new `[id].tsx` route.

- `id` comes from `router.query.id`.
- If present: fetch via `EventModel.list({ filter: 'id:' + id, per_page: 1 })`
  and take `events[0]`. This endpoint (`EventController::index`) already
  eager-loads `events_agendas`, `events_tickets`, `events_sponsors` (with
  `url`), and `events_ads` (with `preview_url`) for every row — exactly what
  `_form.tsx`'s `useEffect` currently reads off the modal's `data` prop. No
  new backend endpoint is needed.
- If absent: initialize all state blank (no demo data).
- While fetching (edit mode, before data arrives): show a full-page spinner,
  matching the pattern in `src/pages/facility/[id].tsx`.

## Page state (in `create.tsx`)

Ported from `_form.tsx`'s `Form` component:
- `formData: InEventForm`
- `agendas`, `tickets`, `sponsors` (logos), `ads` — same shapes/row-flag
  conventions (`_isNew`, `_isDeleted`, `_tempId`) already used by the four
  step components; untouched.
- `currentStep: number` (1–5) instead of the `FormStep` enum, to match the
  wizard's stepper header design.
- `errors: { [field]: string }`, `isSaving: boolean`.

## Step 1: Event Info (rebuilt)

Replace every fake field with its real counterpart, reusing the same
sub-components `_form.tsx` already uses (just outside a modal context, so
`dropdownParent`/`parentEl` props are omitted — both components already
support rendering without one):

| Mock (fake) field | Real replacement |
|---|---|
| Event Title (plain input) | Title (same, wired to `formData.title`) |
| Category (static `<option>` list) | Category `Select2Component` (EventCat) |
| Organizer (static list) | EO `Select2Component` (EventOrganizer) |
| PIC (static list) | PIC `Select2Component` (User, filtered by EO) |
| Start/End Date | Same, via `SingleDatePicker` |
| Time (free text) | **Dropped** — no backend field |
| Location Name | Same (`location_name`) |
| Full Address (textarea) | **Dropped** — backend has no separate address field; `location_name` serves this role, matching `_form.tsx` |
| Province + City (two static dropdowns) | Province only, `Select2Component` (RegProvince) → `formData.location`. No `city` field exists in `InEventForm`. |
| Latitude / Longitude | Same |
| Additional Info (fake collapsible) | **Dropped**, replaced by real fields the mock never showed: Description (textarea, required), Price Pool, Registration Fee, Event Status (`OptionEventStatus`), Thumbnail upload (file input, shows existing thumbnail when editing) |

The right-column "Event Preview" + "Tips" cards are kept, updated to read
from the real fields above (title, start_date, location_name, category).

The "Auto saved" badge in the page header is **removed** — this system only
saves on final submit; showing it would be misleading.

## Steps 2–5: reuse existing components as-is

Each step keeps the wizard's Card/heading chrome, but the body is the real
component, untouched:

- Step 2 → `<EventAgendaStep eventId={...} agendas={agendas} onChange={setAgendas} />`
- Step 3 → `<EventTicketsStep eventId={...} tickets={tickets} onChange={setTickets} />`
- Step 4 → `<EventSponsorsStep eventId={...} logos={sponsors} onChange={setSponsors} />`
- Step 5 → `<EventAdsStep eventId={...} ads={ads} onChange={setAds} />`

Right-column "preview" cards that depended on fake data (sponsor tiers, ad
image types, agenda categories) are dropped or simplified to only reflect
real fields (e.g. agenda preview can still show `start_time` +
`activity_name`; sponsor/ad preview cards are removed since there's nothing
real to preview beyond the grid the step component already renders).

No new client-side gating is added between steps — like today, "Next Step"
just advances; hard validation surfaces from the server on save, same as now.

## Save flow

Port `saveAll()` from `_form.tsx` to `create.tsx`, functionally unchanged:
build a `FormData` with event fields + `agendas`/`tickets` as JSON + sponsor
logo files + `sponsors_info` JSON + ad image files + `ads_info` JSON, call
`EventModel.saveAll(fd)`.

- Success: `showToast(..., 'success')`, then `router.push('/event')`.
- Failure: parse `error.message` (newline-separated `field message` lines)
  into `{field: message}`, set `errors`, show a failure toast. Fields with
  errors are all on Step 1 today (same as the current modal), so no
  cross-step error routing is needed.

The footer's final-step button becomes "Save All" (spinner + disabled while
`isSaving`), replacing the mock's "Create Event" button. "Cancel" stays a
`Link` to `/event`.

## `index.tsx` changes

- "Create Event" button → `Link` to `/event/create`, replacing the
  `create()` handler that opened the modal.
- Row-level edit (pencil) button → `Link` to `` `/event/create?id=${item.id}` ``,
  replacing the `update(item)` handler.
- Remove now-dead modal state/handlers: `showForm`, `formData`,
  `validationError`, `create`, `clearFormData`, `update`, `save`, and the
  `<Form .../>` render at the bottom of the page.
- `remove()` (delete) is unchanged — still needed for the delete action.
- `_form.tsx` is left in the repo but no longer imported/used by `index.tsx`.

## Out of scope

- No backend/database changes (no new columns, no new endpoints).
- No changes to `_agenda.tsx`, `_tickets.tsx`, `_sponsors.tsx`, `_ads.tsx`
  internals.
- Not deleting `_form.tsx`.
