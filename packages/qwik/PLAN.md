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

The challenge: the `api` from `connect()` is a bag of **non-serializable
closures**, and Qwik context/props must be serializable to cross `component$`
lazy boundaries and survive SSR→resume.

### What was tested empirically (`src/__experiments__` during the spike)

- **Inline components CAN use `useContext`, including as projected children**
  (the exact `<Root><Control/></Root>` shape). Verified with three scenarios
  (inline-direct, inline-projected, component$-projected) — all read the
  provider's value. *(This corrects an earlier, wrong assumption that inline
  parts were impossible.)* So parts may be inline functions OR `component$`.
- **`component$` parts give finer-grained reactivity** (each is its own render
  host) and are the chosen default; inline parts re-render their whole enclosing
  host. Both are viable.

### Chosen approach

The machine owner (`Root`) calls `useMachine` + `connect`, and shares the live
`api` through a context **store** holding `noSerialize(api)` (created *inside*
`Root`, so the non-serializable api never crosses a prop boundary):

```
const api = connect(useMachine(machine, () => props), normalizeProps)
const store = useStore({ api: noSerialize(api) })   // serializable container
CheckboxProvider(store)
store.api = noSerialize(api)   // rewrite each render so subscribers update
```

Parts (`component$`) read `store.api` (subscribing) and guard for the dormant
(pre-wake) phase. A store/signal is required because Qwik `useContextProvider`
sets a value once — reactivity across parts needs a mutable container.

`RootProvider` and the `Context` render-prop part are **omitted on Qwik**:
passing a pre-built `api` as a `component$` prop violates Qwik's serializable-
props rule, and children-as-function isn't a Qwik idiom.

### Verified vs. still-open

Verified in the spike (see §9 for how):
- SSR renders every part with shared context (control/label/input all consistent).
- Controlled `checked` / `indeterminate` reflect through SSR.
- No serialization errors (after fixing a real bug — a non-serializable context
  default threw `Q3`; fixed with a serializable sentinel in `create-context`).
- Client interaction (click → toggle, `onCheckedChange$`) in a **real browser**.

Still to validate as components grow: the SSR→resume **wake** path under
streaming SSR (the adapter's `currentWake` is a module global; with many
machines on a page confirm parts still get wake handlers — may need a Zag-adapter
tweak to route the wake via context). Discuss any Zag change before making it.

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
- **Tests:** two layers, because of a hard constraint discovered in the spike:
  - **SSR / render tests** (`vitest`, node) using `@qwik.dev/core/testing`
    `ssrRenderToDom`. Structured like the other Ark packages (`tests/basic.tsx`
    `ComponentUnderTest` + `describe/it`). Cover render output, cross-part
    context, controlled props. `qwik-testing-library` (the `@testing-library`
    render/screen/userEvent + jest-dom analog Ark uses elsewhere) does **not yet
    support Qwik 2** (Qwik-1 peer only; v2 support in progress), so we use the
    official Qwik 2 utils until it lands.
  - **Interaction tests** must run in a **real browser**. The Zag Qwik adapter
    gates all client logic on `@qwik.dev/core/build`'s `isServer`, whose
    `isBrowser` check is `String(HTMLElement).includes("[native code]")` — this
    is `false` in node *and* jsdom, so headless harnesses keep the machine in SSR
    mode and it never starts. We run these via **Vitest browser mode + Playwright
    Chromium** (`vitest.browser.config.ts`, `*.browser.test.tsx`). In the
    sandbox, Playwright's browser download is blocked by network egress, so the
    config points `launchOptions.executablePath` at the pre-installed
    `/opt/pw-browsers` Chromium. (This is also why Zag e2e-tests its Qwik adapter
    with Playwright against the example app.) NOTE: in the current sandbox the
    pre-installed Chromium (build 1194) is skewed from the installed Playwright
    (1.58 → expects 1208) and the egress policy blocks both the browser download
    and the version-metadata lookup, so `test:browser` hangs here; it is excluded
    from the default suite and intended to run in CI with a matching browser, or
    via `qwik-testing-library` once it supports Qwik 2.
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
