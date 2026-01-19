# ADNEO — Premium Domain Finder

ADNEO is a dark, modern naming engine that generates premium domain ideas, checks availability across many extensions, and links out directly to GoDaddy for purchase.

## Highlights

- Smart / Exact / Batch search modes
- Premium variation generation with filters and scoring
- Availability-only results with GoDaddy buy links
- Real-time progress via SSE (generation → normalization → checking → scoring)
- Advanced filters (brandability, SEO, length, intent, budget)
- CSV export for curated lists

## Local development

1. Install dependencies:

   npm install

2. Start the dev server:

   npm run dev

3. Open http://localhost:3000

## API

The search experience streams progress and results from:

GET /api/search?q=...&mode=smart&tlds=.com,.io&filters={...}

The endpoint uses Server-Sent Events (SSE) to stream:

- progress events with % and step details
- result events for each available domain
- done events with summary counts

## Notes

- Availability checks are simulated for MVP UX; replace with a registrar API.
- Rate limiting is in-memory for demo purposes.
