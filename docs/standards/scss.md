# SCSS standard

**Applies to:** `src/styles.scss`, `src/styles/`, and component `.scss` files.

**Primary sources:** [sass-lang.com documentation](https://sass-lang.com/documentation/) and [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS). Where this file and those sources disagree, the sources win.

## Structure

| File | Holds |
|---|---|
| `src/styles/variables.scss` | Colours, the font stack, breakpoints, the Material button shadow |
| `src/styles/mixins.scss` | Reusable mixins. **Today:** the file is empty |
| `src/styles/fonts.scss` | `@font-face` rules for the fonts in `src/assets/fonts/` |
| `src/styles.scss` | Global utility classes (`flex-row-container`, `margin-bottom-10`, ...) |
| `*.component.scss` | Styles only that component uses |

The Material theme is the prebuilt `deeppurple-amber.css`, listed in `angular.json`.

## Rules

- Sass modules: `@use` and `@forward`. `src/styles.scss` loads `mixins`, `fonts`, and `variables` with `@use`. Component styles load variables with `@use 'styles/variables' as *`. The `src` directory is a Sass include path, set in `angular.json`. New files use `@use`.
- Reuse a global utility class before writing a new rule. Add a new utility class only when two or more components need it.
- Component styles stay under the `anyComponentStyle` budget in `angular.json`: warning at 6 kB, error at 10 kB.
- Do not use `::ng-deep`. Do not set `ViewEncapsulation.None` to reach into a Material component.
- Do not block zoom or remove focus outlines. The viewport meta does not set `maximum-scale`.
