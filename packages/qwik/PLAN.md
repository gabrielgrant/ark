# @ark-ui/qwik — Implementation Plan & Guide

This document is **self-contained**: it assumes no prior conversation context.
It is the single source of truth for adding Qwik support to Ark UI, written so
that any contributor (human or AI) can pick up the work end-to-end. Read Parts
0–3 fully before writing any code. Every non-obvious rule in Part 2 was
established **empirically** (by running tests, not by reading docs) — do not
"simplify" them away without re-running the verification that guards them.

---

## Part 0 — What this is and current status

**Goal:** an `@ark-ui/qwik` package with the same component API as
`@ark-ui/react|solid|vue|svelte` (~60 headless components over Zag.js state
machines), built on the **`@zag-js/qwik`** framework adapter.

**Status: COMPONENT SURFACE COMPLETE — 60 component directories, 293 headless
tests + browser interaction suites, every commit individually gated
(typecheck / lint / headless / browser). Remaining work: infrastructure steps
I2 (library build), I4 (EnvironmentProvider SSR), I5 (asChild), I6
(interaction provider); website wiring (Phase 4); upstream filings; and the
zag-adapter fixes listed in Part 5 #0–#0c — #0/#0b/#0c are RESOLVED by the
rebased adapter branch `claude/confident-sagan-d2abxy` (Qwik 2.0.0-rc.4 +
Vite 8.3.5, zag 1.47.0); see the updated Part 5.**

| Concern | Status |
| --- | --- |
| Package scaffold (`packages/qwik`), providers, utils, factory | ✅ done |
| Checkbox pilot (Root/Control/Label/Indicator/HiddenInput) | ✅ done |
| SSR render + cross-part machine context | ✅ verified (vitest, node — 12 tests) |
| Real-browser interaction (click → machine → DOM update) | ✅ verified (vitest-browser-qwik, Chromium — 8 tests) |
| QRL callback props (`onCheckedChange$`, `onOpenChange$`) — Step I3 | ✅ done (rule R9; SSR + browser tested) |
| Presence (D1) incl. exit-animation unmount, lazyMount | ✅ done + browser-verified |
| Dialog (D2): all 8 parts, open/escape/close/focus | ✅ done + browser-verified |
| Field + Fieldset (framework-level providers) | ✅ done; checkbox consumes field context |
| Typecheck / lint | ✅ clean |
| Library build (dist output) | ❌ not wired (`build` script is a no-op skip) — Step I2 |
| `EnvironmentProvider` with custom root node | ⚠️ known-broken over SSR — Step I4 |
| `asChild` polymorphism | ❌ deferred, needs design — Step I5 |
| Remaining ~57 components, website, release | ❌ Phases 2–4 |

**Key dependency fact:** `@zag-js/qwik` is an **unpublished fork** (version
`1.42.0`) living on a branch of the `zag` repo. It is NOT on npm. See Part 1 —
a fresh `bun install` fails without the bootstrap step.

---

## Part 1 — Bootstrap (do this first, nothing works without it)

⚠️ **A fresh checkout of this branch does not install.** `packages/qwik`
depends on `@zag-js/qwik@1.42.0`, which 404s on npm. The whole Bun workspace
install fails until you link the local Zag checkout.

1. **Clone the Zag fork as a sibling** of the ark repo (the link script finds
   it by walking up for a `zag` directory):

   ```bash
   # layout must be:  <parent>/ark  and  <parent>/zag
   git clone https://github.com/gabrielgrant/zag ../zag
   cd ../zag && git checkout claude/confident-sagan-d2abxy   # the Qwik adapter branch (Qwik 2.0.0-rc.4 + Vite 8.3.5, zag machines 1.47.0)
   ```

   The adapter lives at `zag/packages/frameworks/qwik`. **Treat the zag repo
   as read-only reference** — do not edit it without explicit maintainer
   sign-off; all deliverable work happens in the ark repo.

2. **Link + install** from the ark repo root:

   ```bash
   bun run local:sync    # writes ../zag path overrides into root package.json,
                         # backs up + removes bun.lock, clears node_modules
   bun install --ignore-scripts   # --ignore-scripts avoids the website's
                                  # panda postinstall, which needs env vars
   ```

3. **Verify the toolchain** before changing anything:

   ```bash
   cd packages/qwik
   bun run typecheck                  # tsc, expect exit 0
   bun run lint                       # biome, expect exit 0
   bunx vitest run                    # headless SSR suite, expect 12 passed
   bun run test:browser               # Chromium interaction suite, expect 8 passed
   ```

4. **Before committing**, revert the local-link noise so it never lands in
   git: `bun run local:revert` (or restore `package.json` overrides to just
   `flexsearch`/`vite` and restore the backed-up `bun.lock`). The committed
   tree must not reference `../zag` paths. Check with
   `git diff package.json bun.lock` — it must be empty.

**Browser-test environment notes** (encoded in `vitest.browser.config.ts`):
- If Playwright cannot download browsers (sandboxed CI), the config falls back
  to a pre-installed Chromium at `/opt/pw-browsers/...` when that path exists.
- Version skew between Playwright and a pre-installed Chromium can make the
  runner hang at startup; prefer `playwright install chromium` where the
  network allows.
- HISTORICAL (pre-rc.4 branch): earlier zag pinned @internationalized/date
  3.12.1 (vs the workspace's 3.12.2) and bun's .bun tree needed manual
  relinks for that and for @zag-js/popper's @floating-ui deps. On the
  rebased branch (zag pins 3.12.4; ark's qwik package pins the same) a
  plain `local:sync` install typechecks with NO manual relinks.
- If Vite hangs at "[optimizer] scanning dependencies", the dep-scan is
  choking on the ~86 path-linked Zag TS-source packages. Clear
  `node_modules/.vite` first; only if it persists add
  `optimizeDeps: { noDiscovery: true }` to the config (it was needed once,
  transiently, and later removed — a stale cache was the real culprit).

---

## Part 2 — Architecture rules (empirically established — do not violate)

Each rule below was proven by a failing test or a crash. The "why" is included
so future work can tell when a rule stops applying.

### R1. `ark.<tag>` MUST resolve to the tag string (host element)

`src/components/factory.tsx` is a Proxy whose `get` returns the **tag name
string**, so `<ark.div {...props}>` compiles to `jsx("div", props)` — a host
element. Qwik only wires DOM event delegation for spread `on*$` handlers on
host elements. The previous implementation (an inline-component wrapper that
re-spread props onto an inner element) rendered correct HTML but **silently
dropped all trusted user events** — clicks did nothing. This was isolated by
bisection: raw JSX ✅, direct dynamic string tag ✅, inline-component wrapper ❌.
A `component$`-based factory is also impossible (the optimizer only transforms
statically analyzable `component$` calls, not runtime Proxies).

### R2. The machine `api` crosses component boundaries ONLY via a noSerialize store

Zag's `connect()` returns an `api` of non-serializable closures. Qwik requires
context values and `component$` props to be serializable (they may be
serialized at SSR and resumed later). The working pattern (see
`checkbox-root.tsx` / `use-checkbox-context.ts`):

```tsx
// Root (the machine owner) — component$
const api = checkbox.connect(useMachine(machine, () => machineProps), normalizeProps)
const store = useStore<XApiStore>({ api: noSerialize(api) }, { deep: false })   // R21
store.api = noSerialize(api)      // rewrite EVERY render so subscribers update
XProvider(store)                  // context carries the (serializable) store

// Part — component$
const api = useXContext()         // = store.api; subscribing read
const partProps = api ? mergeProps(api.getPartProps(), props) : props
```

- The store is created **inside** Root, so the api never crosses a prop
  boundary (passing it as a prop violates Qwik's serializable-props rule —
  this is why `RootProvider` is omitted, see R6).
- Parts read `store.api` during render, which subscribes them; when Root
  re-renders (state change / resume activation) and rewrites `store.api`,
  parts re-render. Parts must guard `api === undefined` (dormant pre-wake
  client phase).
- Reading `api.getXProps()` during a part's render also subscribes the part to
  the underlying Zag bindable signals — verified: `data-state` updates on
  parts when the machine transitions.
- The store MUST be shallow (`{ deep: false }`, see R21). In practice use
  `useApiStore` from `src/utils/use-api-store.ts`, which does this.

### R3. Context defaults must be serializable; use the sentinel in `create-context.ts`

Qwik's `useContext(id, default)` **stores and serializes the default** in the
component's sequential scope. Passing a default containing functions (e.g. an
environment object with `getRootNode`) crashes SSR with error Q3. Passing no
default throws Q8 when no provider exists. `src/utils/create-context.ts`
therefore always passes a serializable `NOT_FOUND` sentinel and resolves the
real fallback in plain JS. The sentinel is detected **by marker property, not
object identity** — after SSR→resume the sentinel is a deserialized copy.

### R4. Machine props are passed as a getter function

`useMachine(machine, () => props)` — the adapter re-reads props at the event
boundary (Qwik commits renders on its own scheduler, so an event can arrive
before the render that follows a controlled-prop change). Follow the
`use-checkbox.ts` shape: build the getter from an explicit key list
(`machinePropKeys`), mirroring the `createSplitProps` key list used by the
React/Solid versions of the same component.

### R5. Headless tests cannot exercise interaction; use both test layers

The adapter gates all client behavior on `@qwik.dev/core/build`'s `isServer`.
Its `isBrowser` check is
`String(HTMLElement).includes("[native code]")` — **false in node AND jsdom**,
so in any headless harness the machine stays in SSR mode and never starts
(verified: status stays `NotStarted`; `send()` is a no-op). Hence:

- `tests/<x>.test.tsx` — headless SSR/render tests (`ssrRenderToDom` from
  `@qwik.dev/core/testing`): markup, cross-part context, controlled props.
- `tests/<x>.browser.test.tsx` — interaction tests in real Chromium via
  **`vitest-browser-qwik`** (`render` + locators + `expect.element`). Its
  `render` wires Qwik's client event system; plain `@qwik.dev/core` `render()`
  in a browser does NOT (verified: even a trivial `onClick$` never fired).
  `@qwik.dev/core/testing` cannot run in a browser (its `domino` dep throws
  `global is not defined`). Do not add `qwik-testing-library` — it is the
  jsdom-style adapter and (as of writing) Qwik-1-only.

### R6. `RootProvider` and `Context` (render-prop) parts are omitted

Other frameworks ship `XRootProvider` (accepts a user-built `api` as a prop)
and `XContext` (children-as-function). On Qwik: an `api` prop into `component$`
violates serializable-props (R2), and children-as-function is not a Qwik idiom
(children project via `<Slot>`). Revisit only with a new mechanism (e.g. a
`useX`+`bind:` signal contract); until then Qwik intentionally has API parity
minus these two parts, and `useX`/`useXContext` hooks cover the escape hatches.

### R7. No JS portals — native top layer

Qwik's own guidance (docs → cookbook → portals) is that JS portals don't work
well with SSR; use native top-layer primitives instead:
- Modals (dialog/drawer): native `<dialog>` + `showModal()`.
- Non-modal floating UI (popover/menu/tooltip/select/…): the Popover API
  (`popover` attribute); Zag's popper still supplies coordinates. Consider the
  Popover API polyfill for older targets (Qwik UI does this).
Render everything **inline** (`portalled: false` where machines accept it —
the Zag Qwik examples do exactly this). Ark's `Portal` component becomes a
near-no-op kept only for cross-framework API parity; its `container` prop has
no top-layer equivalent (document as unsupported or fall back to a
client-only DOM move). Deconflict native `<dialog>`/popover light-dismiss +
focus behavior with the Zag machine's own (one owner, not both).

### R8. Follow all four existing frameworks, not just Solid

Per concern, the closest model differs: props-as-getter → Solid/Vue;
imperative `create-context` → Svelte; JSX/part structure → React/Svelte;
refs → Qwik `Signal` refs (no `forwardRef`); ids → Qwik `useId()`. When
porting a component, open the React AND Solid versions side by side (Svelte or
Vue when those diverge) and pick the cleanest mapping.

### R9. Callback props: ship a `$`-suffixed QRL variant alongside the plain one

Plain function props (`onCheckedChange`, `onOpenChange`) work in CSR but cannot
be serialized when the component is server-rendered. Convention (implemented in
`checkbox-root.tsx` / `dialog-root.tsx`, tested both ways):

- Root accepts BOTH `onXChange` (plain, CSR-only) and `onXChange$`
  (`QRL<...>`, SSR-safe; callers wrap with `$()`).
- Inside Root's machine-props getter, compose them into the machine's single
  plain callback: `(details) => { plain?.(details); void qrl?.(details) }`.
- QRL invocation is async — fine for notification callbacks; NOT fine for
  callbacks whose synchronous return value or same-tick `preventDefault` the
  machine consumes (e.g. `onEscapeKeyDown`, `onInteractOutside`). Those stay
  plain-function-only for now; document per component.
- Exclude the `$` key from the DOM-spread rest (the component's `ownKeySet`).

### R10. Never pass a member expression to `ref` — extract to a local first

The Qwik 2 optimizer compiles JSX attribute member-expressions
(`ref={presence?.ref}`) into read-only WrappedSignals for fine-grained
reactivity; `applyRef` then crashes with `Q31: WrappedSignal is read-only`
when mounting the element. Assign the signal to a local const and pass the
identifier: `const contentRef = presence?.ref; ... ref={contentRef}`. Signal
refs (from `useSignal`) are the right ref primitive (they survive SSR
serialization); the presence hook forwards the node to the machine with a
render-time `service.send({ type: 'NODE.SET', ... })`, which is safe pre-start
because the adapter buffers events until the machine starts.

### R11. Respect HTML content models in SSR; always claim `<Slot/>`

Qwik SSR enforces HTML content-model rules strictly (error Q12), unlike
jsdom/browsers: parts that render inside interactive elements (indicators
inside a `<button>` trigger/root) must default to `<span>`, not `<div>`.
Related: NEVER render `<Slot/>` conditionally — an unclaimed projection leaves
a `<q:template>` marker at the component's position, which also trips the
content-model check. Always claim the Slot and toggle a wrapper's `hidden`
attribute instead of branching the JSX. (Found via Toggle.Indicator and
Accordion.ItemIndicator; only the SSR test gate catches this class.)

### R12. Type-friction standard fixes

- zag's `mergeProps` infers from ALL args: anatomy `parts.<x>.attrs` literals
  need `as Record<string, string>` (React does the same); otherwise keep an
  `api.getXProps()` (which carries a Dict index signature) as the first arg.
- `Assign<HTMLProps<E>, ...>`-based prop interfaces sometimes reject a direct
  `as Record<string, unknown>` cast (TS2352): cast through `unknown`.
- Tag-typed api getters (`getLabelProps`/`getTriggerProps` typed against a
  specific element's ref) may need double casts through
  `Record<string, unknown>` when merged with typed component props.
- Callbacks the machine consumes synchronously (e.g. tabs' `navigate`,
  `onEscapeKeyDown`-style interceptors, pin-input's `sanitizeValue`, slider's
  `getAriaValueText`) get NO `$` QRL variant (R9) — plain function only; note
  it in the component.

### R13. Never render machine-derived values as Slot fallbacks

`<Slot>{api?.derivedValue}</Slot>` goes STALE (or blank) when the value reads
a noSerialize context store (the R2 pattern) — the fallback does not
re-render on store updates (verified with a minimal repro: a plain
serializable store updates fine; noSerialize does not). Render the derived
value as a sibling JSX expression next to an always-claimed empty Slot:
`{api?.derivedValue}<Slot />`. Applies to every ValueText/Preview-style part.

### R15. Class-instance machine props need `noSerialize` at the prop boundary

`collection` (ListCollection) and similar class-instance props DO enter Root
as normal `component$` props, so Qwik's SSR serializer sees them (crash Q20).
Call `noSerialize(record.collection)` in Root before use — noSerialize marks
the object by reference (global WeakSet), which works even for prop-delivered
values. Caveat (documented in listbox/select roots): after a true
SSR-serialize-then-resume round trip the value deserializes as `undefined`;
consumers must re-provide it client-side (same category as the R9 plain-
callback CSR caveat).

### R17. Machine-derived attributes ONLY via the mergeProps spread

An explicit JSX attribute expression reading the api
(`hidden={api.view !== view}`) compiles to an optimizer attribute-signal that
captures the stale noSerialize api — the attribute freezes while sibling
parts keep re-rendering. Deliver every machine-derived attribute through the
spread of `api.getXProps()` / mergeProps output, never as a standalone JSX
attribute expression. (Same family as R10/R13; found via DatePicker views.)

### R18. Deep reads through the api store retain data in Qwik's serialization graph

A part merely reading `api.weekDays.length` crashed SSR with Q20: arrays/
objects read through the R2 store are retained by Qwik's serializer, and any
class instance reachable from them (DateValue, Color) then fails. `untrack()`
does NOT help; `noSerialize()`-tagging the nested instances does. Centralize
the tagging in the component's context accessor (see
`useDatePickerContext`/`useColorPickerContext`), and remember R15 extends to
CONTEXT VALUES too: `useContextProvider` verify-serializes eagerly, so
prop-derived context objects carrying class instances need tagging as well.
Serializers for machine-context classes live in `src/serializers.ts`
(ark.date, ark.date-incomplete, ark.color), imported for side effect by the
consuming use-* hooks.

Root cause (found later, see R21): the api store used to be a deep store, so
every object read through `store.api` was wrapped in a nested store and kept
in the serialized state. With the shallow store reads return the raw objects
and nothing nested is retained. The tagging above is now belt-and-braces;
keep it until it is shown to be unneeded for each component.

### R19. Qwik projects `<Slot/>` only once per component render

A second `<Slot/>` in the same render outputs nothing (minimal repro
verified). For repeat-content components (Marquee's seamless-loop clones),
give the single real copy the Slot and mirror its DOM into aria-hidden clones
with a client-only MutationObserver (see `marquee-content.tsx`).

### R20. Plain closures captured inside `$()` fail real SSR verification

The disabled `useQwikValidLexicalScope` biome rule does NOT make arbitrary
captures safe: a plain (non-QRL) function closed over inside a `$()` handler
crashes SSR with Q3. Functions that handlers need must themselves be QRLs
capturing only primitives/QRL-safe values (see `use-download.ts`).

### R21. Never hold a `noSerialize` object in a deep store

`useStore` is deep by default. When a component reads an object property of
a deep store during render, Qwik wraps that object in a nested store and
records subscriptions on it, even if the object is marked `noSerialize`. At
SSR pause the serializer keeps that nested store but writes its target (the
`noSerialize` object) as `undefined`. On resume Qwik rebuilds the nested store
with `getOrCreateStore(undefined)`, which throws `TypeError: Cannot convert
undefined or null to object`, and the state that owns it never resumes. CSR is
unaffected, which is why browser `render()` tests never showed it.

This broke every machine-backed component over real SSR + resume: the R2 api
store was deep, so parts reading `store.api.getXProps()` created a nested store
around the `noSerialize`'d api. Fix: `useStore(..., { deep: false })` in
`useApiStore`. Subscriptions are unchanged where it matters: parts track the
top-level `api` property, which the owner rewrites every render.

Guarded by `src/tests/ssr-resume.test.tsx`: it SSR-renders every
`tests/basic.tsx` fixture and deserializes every state root through the
returned `DomContainer`, the same path the browser takes on resume. Without
the fix 48 of 55 fixtures fail; with it all pass. Any new `noSerialize` value
held in a store needs `{ deep: false }` or a signal (`useSignal(noSerialize(x))`).
This is also a Qwik bug (the deep-store `get` trap ignores `noSerialize`);
reported upstream, but do not rely on a Qwik fix.

### R16. Interactive fixtures live in tests/basic.tsx, never in *.browser.test.tsx

A `component$` handler closing over module scope compiles its lazy QRL
segment as an import of the ORIGINATING module. If that module is a browser
test file, loading the segment re-executes the file's top-level `it(...)`
calls — vitest rejects with "Calling the test function inside another test
function". Keep all interactive fixtures in `tests/basic.tsx`.

### R14. Browser-test fixtures for zero-size draggable parts

Slider-style thumbs render 0×0 unstyled (and zag may keep them
`visibility: hidden` until a ResizeObserver measures them) — Playwright
actionability then times out. Give thumbs explicit width/height inline styles
in the test fixture, and prefer keyboard interaction (focus + arrow keys,
asserting `aria-valuenow`) over pointer dragging.

---

## Part 3 — Current package inventory

```
packages/qwik/
├── PLAN.md                       ← this file
├── package.json                  ← deps pinned; @zag-js/qwik 1.42.0 (unpublished, Part 1)
├── tsconfig.json                 ← jsxImportSource: @qwik.dev/core
├── biome.json                    ← disables useQwikValidLexicalScope (false-positives
│                                    on non-QRL utility closures)
├── vite.config.ts                ← qwikVite; headless vitest (excludes *.browser.test)
├── vitest.browser.config.ts      ← vitest-browser-qwik + Playwright Chromium
├── .gitignore                    ← .vitest-attachments/, __screenshots__/
└── src/
    ├── index.ts                  ← public entry
    ├── types.ts                  ← Assign, Optional, MaybeFn
    ├── utils/                    ← create-context (R3), create-split-props, run-if-fn
    ├── components/
    │   ├── factory.tsx           ← ark proxy → tag strings (R1); asChild deferred (I5)
    │   ├── anatomy.ts / index.ts
    │   ├── presence/             ← D1: exit-animation unmount, lazyMount/unmountOnExit
    │   ├── dialog/               ← D2: 8 parts; the reference for overlay components
    │   └── checkbox/             ← the reference implementation for simple ports
    │       ├── use-checkbox.ts             (machine wiring — copy this shape)
    │       ├── use-checkbox-context.ts     (noSerialize store context — R2)
    │       ├── checkbox-root.tsx           (machine owner; prop splitting)
    │       ├── checkbox-{control,label,indicator,hidden-input}.tsx
    │       ├── checkbox.anatomy.ts / checkbox.ts / index.ts
    │       └── tests/{basic,checkbox.test,checkbox.browser.test}.tsx
    └── providers/
        ├── environment/          ← default (document) env works; custom value broken over SSR (I4)
        └── locale/               ← serializable values; works
```

Repo tooling already wired: root `package.json` has a `qwik` script;
`scripts/check-zag-versions.ts` includes `'qwik'` and exempts `@zag-js/qwik`
from the version-skew check.

Not yet ported from checkbox parity with other frameworks: `Checkbox.Group` /
`GroupProvider` (needs `use-checkbox-group` — framework-level state, no zag
machine), `RootProvider`/`Context` (intentionally omitted, R6).

---

## Part 4 — Roadmap

Work through these in order. Each step lists **Do / Verify / Done-when**.
Definition of done for any step: `bun run typecheck && bun run lint &&
bunx vitest run && bun run test:browser` all green in `packages/qwik`, plus
the step's own criteria, then commit (never commit `../zag` overrides —
Part 1.4).

### Phase 1 — Dialog spike — ✅ DONE (D1, D2; D3 remains)

**D1. Port `Presence`.** ✅ DONE.
Do: mirror `packages/solid/src/components/presence/` (`use-presence.ts`,
`presence.tsx`, `split-presence-props.ts`) using the R2 store pattern;
machine props getter per R4. `<Show when>` becomes conditional JSX.
Verify: headless test (present/hidden markup, `lazyMount`/`unmountOnExit`
render strategy) + browser test (mounts on open; with a CSS
animation, stays mounted until `animationend`).
Outcome: exit detection works — the presence machine attaches native listeners
directly to the node (bypassing JSX-prop dispatch), so the non-bubbling concern
was moot. Browser test covers mounted-through-exit-animation → unmount.

**D2. Port `Dialog`.** ✅ DONE (all 8 parts).
Do: parts Root/Trigger/Backdrop/Positioner/Content/Title/Description/
CloseTrigger; store context per R2; render content inline behind Presence.
Outcome: plain div + Zag focus trap (no native <dialog>). Open, escape,
close-trigger, and focus-into-content are browser-verified; revisit the top
layer only if stacking bugs appear in real apps.
Verify: headless (open/closed markup, aria-*) + browser (trigger click opens,
escape closes, backdrop click closes, focus moves into content and returns to
trigger on close).
Done-when: both dialog test files green; PLAN Part 0 table updated.

**D3. Port `Portal` as documented near-no-op** (children rendered inline).
Keep the React `PortalProps` surface; `container`/`disabled` documented as
no-ops for now (R7).

### Phase 2 — Infrastructure (can interleave with Phase 1)

**I1. Checkbox.Group.** Port `use-checkbox-group.ts` from solid (plain
framework state, no machine): Qwik signals + `getItemProps`. The group context
value must be serializable-or-store (R2/R3). Add group tests (max selected,
disabled propagation).

**I2. Library build.** Wire `vite build` in library mode with the qwik
optimizer/linker so `dist/` ships optimizer-processed ESM + `.d.ts` with
per-component entries matching the `exports` map (`.`, `./anatomy`,
`./factory`, `./environment`, `./locale`, `./*`). Study how
`vitest-browser-qwik` and Qwik UI build libraries for Qwik 2 (`qwikVite`
`ssr`/`lib` modes; the `clean-package` prepack flow used by the other Ark
packages). Restore `"build"` in package.json (currently an echo-skip so the
root `bun run build` doesn't fail). Done-when: `bun run build` emits dist, a
scratch Qwik app can consume a built Checkbox, and root build passes.

**I3. Callback-prop QRL design.** ✅ DONE — codified as rule R9, implemented in
`checkbox-root.tsx` (`onCheckedChange$`) and `dialog-root.tsx` (`onOpenChange$`,
`onExitComplete$`); SSR test proves QRL props serialize, browser test proves
they fire. When porting, apply R9 to each notification callback and document
any synchronous-return callbacks that must stay plain-function-only.

**I4. EnvironmentProvider over SSR.** The provider currently puts plain
closures into context — same Q3 crash class as R3 when a custom `value` is
used in SSR (the default document-based path is fine because it's resolved
client-side via the sentinel fallback). Fix with the R2 store pattern
(`useStore({ env: noSerialize(...) })`) or by storing a serializable
locator + deriving closures in the consumer. Add an SSR test with a custom
root node (shadow-root case).

**I5. `asChild` decision.** Deferred by R1 (the factory renders host
elements; there is no `cloneElement`/children-as-function in Qwik). Options to
evaluate: (a) drop `asChild` on Qwik and document composition via
`useX().getXProps()` spreads; (b) a `<PropsMerge>`-style wrapper using
`Slot` + attribute forwarding at the DOM level after render (fragile);
(c) upstream Qwik primitive if one lands. Timebox the investigation; (a) is
acceptable for a beta. Record the decision here.

**I6. Interaction/focus-visible provider** (`providers/interaction` in
solid/react) — port `useFocusVisible`/`useInteractionModality` if components
being ported need them (checkbox does not).

### Phase 3 — Component porting (the long tail)

**The recipe (per component):**
1. Read the component in `packages/react/src/components/<x>/` AND
   `packages/solid/src/components/<x>/` (R8). Note the `createSplitProps` key
   list in Root — that becomes `machinePropKeys`.
2. Copy the checkbox file shapes: `use-<x>.ts` (R4 getter; env/locale/field
   contexts), `use-<x>-context.ts` (R2 store), `<x>-root.tsx` (owner),
   one file per part (`component$`, `<Slot>`, `api ? mergeProps(...) : props`
   guard), `<x>.anatomy.ts`, `<x>.ts` namespace, `index.ts` exports (minus
   RootProvider/Context per R6).
3. Convert callback props per the I3 convention.
4. Floating/overlay components: inline rendering + top layer per R7.
5. Tests: `tests/basic.tsx` (ComponentUnderTest) + headless `*.test.tsx`
   (markup/context/controlled) + `*.browser.test.tsx` (the 2–4 interactions
   that define the component: open/close, select, type, drag as applicable).
6. Update `src/components/index.ts`, `anatomy.ts`, and the package `exports`
   consumers if needed; run the full Done-when gate.

**Porting order** (dependency- and risk-sorted):
1. ✅ Field, Fieldset (checkbox wired to field context; field-item + textarea autoresize deferred)
2. ✅ Switch, Radio Group, Toggle, Toggle Group, Segment Group, Rating Group,
   Pin Input, Number Input, Editable, Slider, Angle Slider
   (+ ✅ Progress, Avatar, Collapsible, Accordion, Tabs from groups 3–4)
3. Progress, Avatar, Clipboard, QR Code, Timer, Highlight, Format
4. Collapsible, Accordion, Tabs, Splitter, Steps
5. Pin Input, Number Input, Editable, Slider, Angle Slider, Password Input
6. ✅ Popover, Tooltip, Hover Card — R7 validated for real: popper's --x/--y
   custom properties land on the inline Positioner, no portal needed
7. ✅ Menu (nested-menu wiring architecturally done; interactive nested browser
   test dropped as flaky pending Part 5 #0 adapter fix), ✅ Select, ✅ Listbox
   (+ ✅ collection helper); ✅ Combobox; remaining: Cascade Select
8. ✅ Tags Input, Pagination, Password Input, File Upload, Signature Pad,
   Scroll Area, Marquee
9. ✅ Date Input, ✅ Date Picker, ✅ Color Picker (+ ✅ locale utils
   useCollator/useDateFormatter/useFilter) — serializers registered and
   SSR-verified; previously documented as: need
   `registerValueSerializer` from `@zag-js/qwik` for `DateValue`/`Color`
   SSR-resume; register in the provider layer and document that apps must
   import it
10. ✅ Tree View, ✅ Navigation Menu, ✅ Cascade Select (designed from the zag
    machine directly), ✅ Toast, ✅ Tour, ✅ Drawer, ✅ Floating Panel,
    ✅ Carousel, ✅ Image Cropper, ✅ Frame (children render in the main
    document, not the iframe — documented gap: no cross-document portal /
    event delegation in Qwik), ✅ Client-Only, ✅ Download Trigger,
    ✅ Highlight, ✅ Format, ✅ JSON Tree View (renderValue callback omitted —
    documented gap), ✅ Focus Trap. DONE:
    Navigation Menu, Carousel, Pagination, Image Cropper, Drawer, Frame,
    Client-Only, Download Trigger, JSON Tree View
11. Collection helpers (`createListCollection` etc. — mostly re-exports)

After groups 1–5: pause and re-verify the wake path with **many machines on
one page** (the adapter serializes a module-global wake QRL per machine during
SSR; confirm interleaved parts still wake correctly under streaming SSR). If
broken, that is a Zag-adapter fix — discuss before changing zag.

### Phase 4 — Tooling, website, release

- Run/extend repo checks: `bun run check:zag` (already qwik-aware),
  `check:exports`, `check:anatomy`, `exports:sync` against packages/qwik.
- Storybook: evaluate Qwik Storybook support; if immature, skip stories for
  the beta and rely on tests + website examples (note the gap in PRs).
- Website (`website/src/lib/frameworks.ts` add `'qwik'`; then
  framework-select, install-cmd, a `stackblitz-qwik.ts`, `llms-qwik.txt`
  route, MDX/highlighter wiring, per-component `examples/`). Can lag the
  package.
- Release gating: `@zag-js/qwik` must be published (upstreaming to
  chakra-ui/zag or scoped fork) before `@ark-ui/qwik` can ship; align its
  version with the `@zag-js/*` suite or keep the check-zag exemption. Ship as
  `0.x`/beta while `@qwik.dev/core` is itself beta. Changeset + README noting
  Qwik-2-beta peer, no-portal/top-layer semantics, omitted
  RootProvider/Context, asChild status.

---

## Part 5 — Known issues & open questions (ranked)

0. **RESOLVED (rebased adapter branch): root effects on idle machines.**
   Tooltip now opens on keyboard focus — covered by
   `tooltip/tests/tooltip-focus-visible.browser.test.tsx`.

0b. **RESOLVED (rebased adapter branch): capture re-dispatch click swallow.**
   A real Playwright pointer click on tree-view's branch trigger works as a
   file's FIRST render — covered by
   `tree-view/tests/tree-view-pointer-click.browser.test.tsx` (also
   date-input contentEditable segment focus,
   `date-input/tests/date-input-pointer-click.browser.test.tsx`).
   The native `element.click()` workarounds in older multi-test files
   predate the #0q diagnosis below and may no longer be needed (not
   re-checked).

0c. **RESOLVED (rebased adapter branch): rAF render-gate livelocks.** Toast
   show→dismiss and the full tour flow pass end to end; both suites are
   re-enabled (toast's interactive test must stay its file's first render
   for a separate, unexplained reason, see #0q). Tour additionally needed fixture fixes that only matter in a
   real browser: backdrop before positioner in DOM order, and the consumer
   CSS stacking/centering zag ships in its shared tour.css.

0d. **Test-env notes for drag-capable machines** (partially stale):
   a synthetic pointer-drag sequence on slider now works
   (`slider/tests/slider-pointer-drag.browser.test.tsx`); the ~250ms settle
   before unmount for drawer/floating-panel is still in place.

0q. **Qwik core regression since 2.0.0-beta.38: dispatch right after
   `render()`.** (Earlier described as a "second container" bug; that was
   wrong.) Until Qwik finishes setting up a newly rendered container, it
   runs event handlers only after native propagation, so
   `stopPropagation()` in a child handler cannot shield an ancestor's
   handler (tree-view trigger/control double-toggle) and `preventDefault`
   comes too late. `render()` resolves before that setup is done unless it
   had to load component code, which is why a file's first render usually
   passed. The readiness flag is document-wide, so a new mount also affects
   containers that were already settled. Present in beta.38 through rc.5;
   beta.37 is correct. No zag involved. Upstream repro:
   https://github.com/gabrielgrant/qwik-repro-dispatch-after-render.
   Practical rule: tests that depend on synchronous dispatch use
   `renderReady()` (`src/tests/render-ready.ts`), which awaits
   `_whenContainerDataReady` after `render()`. Notes and the raw-render
   regression test: `src/qwik-regressions/dispatch-after-render.browser.test.tsx`.
   Toast's interactive test still has to be its file's first render, but
   for a different reason: run second, the click is delivered and the toast
   reaches the shared module-level toaster, yet no `<Toaster>` renders it.
   `renderReady()` does not help. Cause not yet known.

1. **Wake path under streaming SSR with many machines** — test written
   (`checkbox-ssr.browser.test.tsx`), still SKIPPED but the failure moved:
   vitest-browser-qwik 0.3.11 fixed the old segment-404s (the wake QRL now
   runs; the fork fix on
   gabrielgrant/vitest-browser-qwik#fix/ssr-segment-mapping is superseded
   unless its regression tests are still wanted upstream). Now the
   adapter's wake replay fails in this harness: `replayOne()`'s
   `getDomContainer(item.element)` throws Q24 (multi-machine) or the run
   hangs (single-machine) — consistent with the captured element being
   replaced by the activation render before replay. Adapter-side
   investigation needed; zag's own e2e-qwik app remains the authoritative
   wake-path coverage.
   Partial coverage now: `src/tests/ssr-resume.test.tsx` checks headlessly
   that every fixture's SSR state deserializes on resume (R21), which is
   where the real-SSR wake failure actually was. It does not exercise
   event delivery after resume, so this browser test is still wanted.

2. **EnvironmentProvider custom value over SSR** (I4).
3. **`asChild`** (I5) — API-parity gap to document if dropped.
4. **Qwik 2 beta churn** — pin `@qwik.dev/core` exactly; expect breakage on
   bumps (`_waitUntilRendered`/internal APIs used by the zag adapter are
   especially at risk).
5. **`Checkbox.Group` parity gap** (I1).

## Part 6 — Testing quick reference

```bash
cd packages/qwik
bunx vitest run                      # headless SSR suite (vite.config.ts)
bun run test:browser                 # Chromium interaction suite
bun run typecheck && bun run lint
```

- Headless tests: import `ssrRenderToDom` from `@qwik.dev/core/testing`,
  pass `{ qwikLoader: true }`, assert on `document.querySelector(...)`.
- Browser tests: `import { render } from 'vitest-browser-qwik'`, then
  `screen.getByRole(...)/getByText(...).click()` and
  `await expect.element(...).toBeChecked()/toHaveAttribute(...)`. Name files
  `*.browser.test.tsx` (that suffix is what routes them to the browser
  config and excludes them from the headless run).
- The browser config disables qwikVite's click-to-source dev overlay — it
  duplicates on-screen text and breaks strict locator matches.
- A trusted-click test that finds the element but times out on
  actionability usually means the target is zero-sized (e.g. an empty
  control div whose indicator is `hidden`) — click the label/text instead.
