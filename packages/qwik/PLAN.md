# Adding Qwik support to Ark UI

Status: **Phase 0 (architecture spike) — in progress**

This document is the working plan for `@ark-ui/qwik`, an Ark UI adapter for
[Qwik](https://qwik.dev) built on the `@zag-js/qwik` Zag adapter
(branch `qwik-adapter-f` / `claude/busy-noether-lu8dvd` in the sibling `zag`
checkout). It is grounded in the existing React/Solid/Vue/Svelte Ark packages,
the Zag Qwik adapter source, and Qwik's official docs + the Qwik UI
(`qwikifiers/qwik-ui`) reference implementation.

---

## 1. What the Zag Qwik adapter gives us

`@zag-js/qwik` exposes the same public surface as every other Zag adapter, so
Ark consumes it like `@zag-js/react`/`solid`:

- `useMachine(machine, props | () => props): Service<T>` — props may be an
  object **or** a getter function (Solid/Vue-like live reads). Re-reads props at
  the event boundary because Qwik commits on its own scheduler.
- `connect(service, normalizeProps): api`
- `normalizeProps` — Qwik-flavored (`class`, `$`-suffixed handlers, **style as a
  string**, lowercased attributes, native event aliases).
- `mergeProps` (re-exported from `@zag-js/core`).
- `PropTypes` typed against `QwikIntrinsicElements`.
- `registerValueSerializer` / `ValueSerializer` — **Qwik-only**; lets machines
  that keep class instances in context (date-picker `DateValue`, color-picker
  `Color`) stay SSR-serializable.

It internally solves the hard Zag↔Qwik problems for a **single `component$`**:
SSR resume via signals (`useBindable`), a "wake" QRL replayed through
`normalizeProps` for pre-hydration interactions, an rAF render-gate, synchronous
event dispatch with `currentTarget` re-pointing, and stable style strings so
popper's CSS custom properties survive re-renders.

Constraints it imposes (seen in the Zag Qwik examples):
- Floating content renders **inline** (`portalled: false`); see §4.
- Built against **`@qwik.dev/core` 2.0.0-beta** (Qwik 2, pre-release).
- The adapter is an **unpublished fork** pinned at `1.31.x` (vs Ark's `1.41.x`).

---

## 2. THE core architectural problem (read this first)

Ark's React/Solid/Vue/Svelte packages all use one shape: a `Root` builds the
machine, calls `connect()` → `api`, and puts **`api` into framework context**;
each part (`Control`, `Label`, `Trigger`, `Content`, …) is a separately-imported
component that reads `api` from context and spreads `api.getXProps()`.

On Qwik this does **not** translate directly:

1. **Inline components cannot use `useContext`** (Qwik forbids `use*` hooks in
   inline components). So parts that read context **must be `component$`** —
   they cannot be lightweight inline functions. (This invalidates the earlier
   "make all parts inline components" idea.)
2. **`component$` parts resume independently** and the `api` from `connect()` is
   a bag of **non-serializable closures**. Putting it in context as
   `noSerialize(api)` means it is **dropped on SSR→resume**; a part that resumes
   on its own interaction sees `undefined`.
3. Qwik UI (the reference headless lib) sidesteps this entirely: it shares
   **only serializable values** through context (`Signal`s, `QRL`s, primitives)
   and **each `component$` part derives its own props locally**. It does not use
   a centralized `connect()→api`. Zag's model is the opposite.

### Chosen approach (to validate in the spike)

**Every Ark-Qwik part is a `component$`.** The machine owner (`Root` /
`RootProvider`) calls `useMachine` + `connect`, and shares the live `api`
through a context **store** holding `noSerialize(api)`:

```
const api = connect(useMachine(machine, () => props), normalizeProps)
const store = useStore({ api: noSerialize(api) })   // serializable container
useContextProvider(XContextId, store)
// each render writes the fresh api:
store.api = noSerialize(api)
```

Parts read the store, **subscribe** to `store.api`, and guard for the dormant
(pre-wake) phase:

```
const store = useContext(XContextId)
const api = store.api            // subscribes; undefined while dormant
return <ark.div {...(api?.getControlProps() ?? serverFallbackProps)} />
```

Why this can work with the existing adapter: the adapter's wake QRL is emitted
by `normalizeProps` **during SSR** as the handler for every Zag event prop, and
on first interaction it **re-executes the owner** (`activatedSig`). When the
owner re-executes it rebuilds `api` and rewrites `store.api`; parts subscribed to
`store.api` then re-render and attach live handlers, and the wake replays the
captured event.

### Open questions the Phase-0 spike MUST answer (may need Zag-adapter changes)

- During SSR, `normalizeProps` reads a **module-level** `currentWake` set by the
  owner's `useMachine`. With parts as separate `component$`, confirm the wake
  QRL is still emitted for parts' event props (Qwik SSR is async/streaming, so
  the module-level slot may be stale across part renders). If so, the adapter
  may need to expose the wake via context instead of a module global.
- Confirm that flipping the owner's `activatedSig` (or rewriting `store.api`)
  actually **re-renders the parts** and attaches live handlers on resume.
- If either fails, fallback options: (a) share the `Service` and call `connect`
  per part; (b) provide `api` via a `Signal` in context and have parts subscribe
  to it; (c) push a small change into the Zag Qwik adapter to make the
  owner→part wake/activation explicit. Adapter changes land on the zag
  `claude/busy-noether-lu8dvd` branch.

Pilot order: **Checkbox** (context, group, hidden input, no portal) →
**Dialog** (top layer, focus trap, presence). Checkbox proves the resume/context
model; Dialog proves §4 and §5.

---

## 3. Dependency strategy — work against the branch

Do **not** block on upstreaming/publishing `@zag-js/qwik`.

- Dev `@ark-ui/qwik` against the local `zag` checkout via the repo's existing
  link flow (`bun scripts local:sync`, which path-overrides every local
  `@zag-js/*`). The Qwik adapter already exists at
  `../zag/packages/frameworks/qwik` on the working branch.
- Relax `scripts/check-zag-versions.ts` so `@zag-js/qwik`'s fork version
  (`1.31.x`) does not fail the exact-version-skew check against the suite's
  `1.41.x` (add `@zag-js/qwik` to the framework-specific exempt list).
- A publishable `@ark-ui/qwik` release stays gated on the adapter being
  upstreamed + released; that does not block development.
- Pin `@qwik.dev/core` exactly (Qwik 2 beta churns).

---

## 4. Portals → native top layer (no JS portal)

Per Qwik's [portals cookbook](https://qwik.dev/docs/cookbook/portals/), Qwik's
guidance is to **not** use JS portals (they "don't work well with SSR") and
instead use native top-layer primitives:

- **Modals (dialog, drawer, alert dialog)** → native `<dialog>` +
  `HTMLDialogElement.showModal()` (renders into the browser top layer,
  escaping `overflow`/stacking with no DOM move). Reconcile with Zag's own
  focus-trap so focus isn't trapped twice.
- **Non-modal floating UI (popover, menu, tooltip, hover-card, select,
  combobox, …)** → the **Popover API** (`popover` attribute) lifts content to
  the top layer in place; Zag's popper still supplies the fixed coordinates.
  Ship/peer a Popover API polyfill for older targets (as Qwik UI does).

Implications:
- Render portalled content **inline** (`portalled: false`), matching the Zag
  adapter/examples.
- Ark's `Portal` component becomes a thin/near-no-op on Qwik (renders children
  inline, optionally toggling top-layer behavior). Keep the name/import for
  cross-framework parity; document the changed semantics.
- `Portal`'s `container` prop (portal into an arbitrary element) has no
  top-layer equivalent — drop on Qwik or fall back to a client-only DOM move
  for that case.
- Popover API baseline is recent (~2024) — decide polyfill vs min target.
- Deconflict native `<dialog>`/Popover light-dismiss/escape/focus with the
  corresponding Zag machine behavior.

---

## 5. Presence / animation

Ark's `Presence` is a thin component over the `@zag-js/presence` **machine** that
solves *unmount-with-exit-animation* (keep a node mounted while its CSS exit
animation runs) plus `lazyMount`/`unmountOnExit`. It drives animation purely via
a `data-state="open|closed"` attribute that users target with their own CSS.

- **Baseline (not custom): port `Presence` like any other machine.** It goes
  through the Qwik adapter the same way as Checkbox; the `data-state` CSS approach
  is framework-agnostic and needs no Qwik-specific machinery — cross-browser
  enter/exit animations with zero custom animation code. Verify the presence
  machine's exit detection via `animationend`/`transitionend` (which **don't
  bubble**) survives the adapter's root-level dispatch + `currentTarget`
  re-pointing.
- **Optional enhancement: Qwik view transitions**
  ([cookbook](https://qwik.dev/docs/cookbook/view-transition/)). `document.startViewTransition()`
  snapshots the outgoing element, so it can replace the "keep mounted during
  exit" dance for `unmountOnExit`. Offer as progressive enhancement only, not a
  replacement. Caveats: some pieces are Chromium-only, root transitions are
  disabled by default (`view-transition-name: none` on `:root`), needs TS 5.6+
  for `ViewTransition` types.

---

## 6. Package scaffolding — `packages/qwik` (`@ark-ui/qwik`)

```
packages/qwik/
├── package.json        # deps: all @zag-js/* (Ark pinned ver) + @zag-js/qwik; peer @qwik.dev/core
├── tsconfig.json       # jsxImportSource: @qwik.dev/core
├── vite.config.ts      # qwikVite — build + test
├── src/
│   ├── index.ts
│   ├── types.ts        # Assign, Optional, MaybeFn (getter-or-value)
│   ├── utils/          # create-context (Qwik), create-split-props, run-if-fn, index
│   ├── components/
│   │   ├── factory.tsx # ark proxy + asChild (Qwik) — §7
│   │   ├── anatomy.ts
│   │   ├── index.ts
│   │   └── <component>/
│   └── providers/      # environment, locale, interaction
```

Mirror the other packages' `exports` map (`.`, `./anatomy`, `./factory`,
`./environment`, `./locale`, `./interaction`, `./*`).

---

## 7. Cross-cutting primitives to design (compare ALL four frameworks)

Qwik is a hybrid; pick the closest source per concern rather than transliterating
Solid:

- **`create-context`** → model on **Svelte** (imperative `setContext`/`getContext`
  ≈ Qwik `useContextProvider`/`useContext`). Returns `[provide, consume, id]`.
- **Props (getter or value)** → Solid/Vue (live reads); pass `() => props` to
  `useMachine`.
- **JSX/part structure** → React/Svelte.
- **`ref`** → Qwik `Signal` refs (no `forwardRef`); compare Solid `composeRefs`.
- **`asChild`/polymorphic factory** → the hardest piece. Qwik has no
  children-as-function; re-implement with `<Slot>` / dynamic tag. Prototype
  early; if full `asChild` parity isn't feasible, define a reduced contract and
  document it.
- **`useId`** → Qwik `useId()`.

---

## 8. Component porting (~60 components)

Per component, replicate the file set used by the other packages (`use-<x>.ts`,
`<x>-root.tsx`, `<x>-root-provider.tsx`, `<x>-context.tsx`, parts,
`<x>.anatomy.ts`, `index.ts`, plus `examples/`, `tests/`, stories), adapted to
the §2 `component$`-with-store pattern. For each, diff react/solid/vue/svelte and
pick the cleanest mapping onto Qwik.

Suggested order:
1. **Spike:** Checkbox, Dialog (architecture + top layer + presence).
2. Standalone/form: Field, Switch, Radio Group, Pin Input, Number Input,
   Editable, Progress, Slider, Toggle/Toggle Group, Rating, Avatar, Clipboard,
   Collapsible, Accordion, Tabs, Segment Group.
3. Floating/top-layer: Popover, Tooltip, Hover Card, Menu (+ context menu),
   Select, Combobox, Listbox, Tree View, Navigation Menu.
4. Complex/locale/serializer: Date Picker, Date Input, Color Picker, File
   Upload, Tags Input, Toast, Tour, Carousel, Splitter, Pagination, Signature
   Pad, Steps, Timer, QR Code, Frame, Password Input, Floating Panel, Scroll
   Area, Marquee, Cascade Select, Drawer, Image Cropper.
5. Cross-cutting: `Portal`, `Presence`, `Frame`, Field/Fieldset, `Format`.

---

## 9. Build, test, tooling

- **Build/test:** `qwikVite` (needs the Qwik optimizer for `$`/`component$`).
  Output ESM + `.d.ts`; preserve per-component entry points for tree-shaking.
  Remove React's `'use client'` (not a Qwik concept).
- **Tests:** `vitest` + Qwik testing utils (`@qwik.dev/core/testing` `createDOM`
  or qwikVite test setup) instead of `@solidjs/testing-library`; keep
  `vitest-axe`. E2E lives in the Zag repo (Playwright) — the Zag Qwik example
  app already covers most components.
- **Repo tooling:** add `'qwik'` to `scripts/check-zag-versions.ts`
  `FRAMEWORK_PACKAGES` and `@zag-js/qwik` to the exempt list; add
  `"qwik": "bun run --cwd packages/qwik"` to root `package.json`; run
  `exports:sync`/`check:exports`/`check:anatomy` against the new package.

---

## 10. Website / docs

`website/src/lib/frameworks.ts`: add `'qwik'`. Then wire `framework-select`,
`install-cmd`, `stackblitz-qwik.ts`, `example`/`example-code`, `code-examples`,
`llms-qwik.txt`, MDX/highlighter, and per-component Qwik `examples/`. Can lag the
package release (ship package first, docs incrementally).

---

## 11. Phasing

- **Phase 0 — spike (de-risk):** scaffold + factory/`asChild` + providers +
  Portal/Presence; port Checkbox + Dialog; answer §2's open questions; decide
  whether Zag-adapter changes are needed. **Go/no-go gate.**
- **Phase 1 — core release:** port §8 groups 2–3; wire build/tests/`check:*`;
  publish `@ark-ui/qwik` (beta) once the adapter is upstreamed.
- **Phase 2 — complete components:** §8 group 4 incl. serializer-dependent.
- **Phase 3 — docs/website.**

---

## 12. Risks

1. **§2 compound-component resume** — the real unknown; may force Zag-adapter
   changes. De-risk in the spike before mass porting.
2. **`@zag-js/qwik` unpublished fork on Qwik 2 beta** — dev against branch; gate
   release on upstreaming.
3. **`asChild`/factory feasibility** on Qwik (§7).
4. **Native top-layer vs Zag focus/dismiss** deconfliction (§4).
5. **Qwik 2 beta churn.**
