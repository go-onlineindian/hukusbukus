# Project guide

Hukus Bukus is a static, bilingual discovery site backed by a small Netlify Server. Avoid introducing a frontend build system unless the task requires one.

- `public/index.html` contains the page structure, share metadata, icon symbols, and accessible dialogs and forms.
- `public/styles.css` defines the color tokens and section styles. Keep mobile videos in two columns, use readable foreground colors in both themes, and respect reduced-motion preferences.
- `public/app.js` wires up video search, filters, previews, dialogs, touring places, ideas, theme preference, and community forms. Use native DOM methods and `textContent` for visitor-provided text.
- `public/videos.js`, `public/places.js`, and `public/ideas.js` hold the editorial content. Keep photo credits with the field guide data. Give every new idea an illustration and a complete Urdu translation; use `lang="ur"` and `dir="rtl"` in the UI.
- `netlify/server/index.mjs` serves only `/api/*`. Keep the homepage and assets static and use the server for request-driven persistence.
- `db/schema.ts` defines the Netlify Database schema. Run Drizzle Kit to generate a matching change under `netlify/database/migrations/` whenever the schema changes.

Keep comments unapproved by default and filter the public feed to approved reviews only. Never expose private feedback or queued comments from an unauthenticated endpoint. See `README.md` for local setup and moderation commands.
