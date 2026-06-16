# Contributing

Thanks for helping TavernAI 2 reach more people.

This repository accepts community work for translations, public documentation, issue reports, and small repository-facing fixes.

## What You Can Contribute

- App locale updates in `locales/app/`.
- Documentation translation updates in `docs-site/`.
- Typo fixes in public repository files.
- Clear bug reports for public builds.
- Reproduction notes, logs, and screenshots for issues.

## App Locales

Application locale files live in `locales/app/`.

Use `locales/app/en.json` as the reference file. Keep the same keys, placeholders, and formatting markers. Translate the values only.

Before opening a pull request:

- keep JSON valid;
- do not remove keys;
- do not rename keys;
- preserve placeholders such as `{name}`, `{count}`, `%s`, or similar tokens;
- keep UI text short enough for buttons, menus, and panels.

## Documentation

Documentation mirror files live in `docs-site/`.

Use the English documentation as the source text unless a maintainer says otherwise, and always create the English base page first for any new documentation page. Keep frontmatter, links, headings, code blocks, and image paths intact unless the change is specifically about those elements.

Good documentation changes are direct and concrete. Explain what the app does, which file or screen is involved, and what the user should do next.

## Translation Quality

Translations should be submitted by someone who can personally review the target language with confidence. Native speakers are preferred; strong fluency is acceptable when the translation has been read through carefully.

AI tools may be used as a drafting aid, but raw or generic machine translations are not accepted. Do not submit a language if you cannot judge whether the result is natural, accurate, and appropriate for the app. Prefer focused changes in languages you can maintain.

## Issues

When reporting a bug, include:

- TavernAI version;
- operating system;
- edition;
- channal;
- what you were doing;
- what happened;
- what you expected;
- logs or screenshots when they help.

## Pull Requests

Keep pull requests focused. A translation update, typo fix, or documentation correction should be easy to review on its own.

Before opening a PR:

- check that changed JSON files still parse;
- avoid unrelated formatting churn;
- mention which language or page you changed;
- include screenshots only when they explain a UI or docs rendering issue.
