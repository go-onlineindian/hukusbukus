# HUKUS BUKUS

Hukus Bukus is a discovery club for curious kids. It brings together videos from the Hukus Bukus YouTube channel, a photo guide to Kashmir, creative prompts in English and Urdu, and a community noticeboard. It also links to the independently hosted Konnect Magazine.

## Run locally

Use Node.js 24 or later and the Netlify CLI.

```sh
npm install
netlify link
netlify dev --port 8889
```

The site is at `http://localhost:8889`. Netlify serves the static HTML, CSS, and native browser modules in `public/`. The review and feedback endpoints run on Netlify Server and store submissions in managed Postgres via Drizzle ORM. Netlify applies committed migrations when deploying. After changing the schema, generate a corresponding migration with `npx drizzle-kit generate --name describe_the_change`.

## Manage messages

The Reviews section opens with its comment panel expanded. Visitors can collapse it without hiding Reviews. New comments are held for approval because the site is intended for children. Feedback, suggestions, and complaints are always private. No contact details are required.

Project maintainers can list pending comments or read private messages using the authenticated Netlify CLI. Use the applicable database branch when moderating a preview rather than production.

```sh
netlify db connect --query "SELECT id, name, message, created_at FROM submissions WHERE kind = 'review' AND NOT approved ORDER BY created_at DESC"
netlify db connect --query "SELECT id, kind, message, created_at FROM submissions WHERE kind <> 'review' ORDER BY created_at DESC"
```

After reviewing a comment, replace `123` with its ID to publish that comment:

```sh
netlify db connect --query "UPDATE submissions SET approved = true WHERE id = 123 AND kind = 'review'"
```

## Maintain content

- Edit `public/videos.js` to update the channel library. Hover previews are muted and run only on fine-pointer devices. Clicking or tapping opens the full player. Some videos may require opening YouTube if the channel has disabled embedding.
- Edit `public/places.js` and `public/img/` for the field guide, touring stops, and visible photo credits.
- Update all three text fields and the illustration when editing a prompt in `public/ideas.js` so the English, Urdu, and artwork stay aligned.
- The Konnect panel uses cover art from the published magazine as its background. Styling the linked magazine site itself requires changes in its own project.
