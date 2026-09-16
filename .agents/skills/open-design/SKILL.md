---
name: open-design
description: Open Design system & vibe-design execution protocol for GymGear, enforcing the 9-segment DESIGN.md schema, Hallmark mechanical DNA, and OriginKit motion.
---

# Open Design Skill for GymGear

Use this skill whenever you are designing, upgrading, or modifying UI components, layouts, theme colors, or animations in the GymGear repository.

## 1. Always Read DESIGN.md First
Before proposing or writing UI code, inspect [DESIGN.md](file:///c:/Users/linhl/OneDrive/Desktop/More/DESIGN.md) located at the workspace root to check:
1. The **3 Color Themes** (`meta-blue`, `cyber-volt`, `crimson-pulse`) and semantic variables (`--theme-accent`, `--theme-bg`, etc.).
2. The **Contrast Rule**: Accent button backgrounds **MUST have 100% white text (`#ffffff`) and white SVG stroke/fill**.
3. The **Motion Physics**: OriginKit spring curves (`cubic-bezier(0.16, 1, 0.3, 1)`), tactile depress (`active:translate-y-0.5`).
4. The **Anti-Patterns**: Never introduce purple generic AI slop, never use loose CSS selectors like `a[class*="amber"]`.

## 2. Equipment Machine Spec Sheet Pattern (Hallmark)
When building equipment displays:
- Add a technical HUD overlay on the image: Target Muscle tag, Max Stack, Commercial Grade vs Home Gym badge.
- Use tactile borders (`ring-1 ring-inset ring-white/10`).
- Ensure the primary action button uses `.btn-theme-accent` with crisp white text.

## 3. Theme Consistency Checklist
Whenever creating a new component:
- Use Tailwind utility classes that respect the theme variables or provide dark/light variants cleanly.
- Do not hardcode static hex colors for primary buttons; use `var(--theme-accent)` or the mapped utility classes.
- Ensure the component is tested in both Dark Mode (`data-theme="..."`) and Light Mode (`.theme-light`).
