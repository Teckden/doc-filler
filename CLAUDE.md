# Doc Filler Guidelines

## TypeScript

- **Named exports over default exports.** Use `export const foo` /
  `import { foo }`. Avoid `export default`.

## Components & styling

- **daisyUI first.** Reach for daisyUI components and class names before
  anything else (`card`, `btn`, `stat`, `divider`, `badge`, `hero`, `stats`,
  etc.). Use Tailwind utilities only as auxiliary fine-tuning — spacing, sizing,
  positioning. Don't rebuild a pattern in raw Tailwind when a daisyUI component
  already covers it.
- **Look up daisyUI via the Blueprint MCP server**
  (`mcp__daisyui-blueprint__daisyUI-Snippets`), not generic docs/search — it
  returns purpose-built daisyUI results.
- **Copy existing patterns before inventing.** Before styling a new
  element, find how an existing page (homepage, other public pages) solves the
  same problem and copy that class string. Consistency with the current
  codebase beats a clever isolated system.
- **No parallel design-token systems.** Don't introduce page-scoped CSS
  variables for neutrals, opacity, or dimming. Use `text-subtle` for muted text,
  and `border-base-content/N` / `bg-base-content/N` for hairlines and surfaces.
  A one-off brand color used in a single place is inlined as a literal; promote
  it to a daisyUI theme extension only when there's a real second consumer.
- **Font sizes come from the type scale only** (`text-xs` … `text-base` …
  `text-lg`). Never an arbitrary size (`text-[15px]`, `text-[0.8rem]`) — round
  the design value to the nearest step; a 1–2px drift beats a bespoke size
  every time. Fluid display headings via `text-[clamp(...)]` are the one
  exception.
- **Lengths use whole and half spacing steps only** (`p-4`, `gap-4.5`,
  `min-h-47`) — no quarter steps (`p-3.75`, `size-4.25`) and no arbitrary
  bracketed lengths (`min-h-[188px]`, `gap-[18px]`,
  `w-[min(100%-28px,58ch)]`). Round a mock's value to the nearest half step;
  normalized consistency across pages beats replicating any one mock.
- **Flex for one-dimensional layout; grid only where it earns it.** Rows and
  stacks are `flex`/`flex-col` + `gap` — don't write `grid gap-*` for a plain
  stack. Grid is for column tracks (`grid-cols-*`, `fr`/`minmax`), same-cell
  overlap (`[grid-area:1/1]`), and single-child centering
  (`grid place-items-center`).
