# Nabin Paudel — Portfolio

A cinematic, responsive portfolio that presents Nabin’s video editing and mobile application development as one creative practice.

## Run locally

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Content editing

All editable personal and project content is in `src/data/portfolio.ts`; its strict types live in `src/types/portfolio.ts`.

- Replace editing media in `public/videos/edits/` and showreels in `public/videos/showreel/`. The 611 MB source master is preserved in `source-media/`; the web page uses the optimized 720×1280 copy.
- Replace or add editing posters in `public/images/edits/`.
- App screenshots live in `public/images/projects/` and app demos in `public/videos/apps/`.
- Add a professional portrait to `public/images/profile/`, then replace the portrait placeholder in `src/pages/StoryPage.tsx`.
- Add the real résumé PDF to `public/resume/` and update `resumePath` in the central data file.
- Update email, social links, project names, project facts, roles, dates, achievements, technology stacks, repository links, and demo links in `src/data/portfolio.ts`.

Search for `TODO:` to find every confirmed content gap. Samadhan is intentionally not labelled as the national-level winner. The winner badge is attached only to the separate project whose supplied folder identifies it as the winning project.

## Contact form

The form implements accessible labels, validation, loading, and failure states. It deliberately does not claim delivery. Connect a real endpoint inside `src/components/ContactForm.tsx`, then replace the documented failure branch with the backend response.

## Deployment metadata

The generated Sites URL is the current canonical origin. Update `siteUrl` in `src/data/portfolio.ts`, `index.html`, `public/robots.txt`, and `public/sitemap.xml` if moving to a custom domain.
