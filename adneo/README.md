# ADNEO - Premium Domain Finder

Find premium available domains faster than anywhere else.

![ADNEO](https://img.shields.io/badge/ADNEO-Premium%20Domain%20Finder-6366f1?style=for-the-badge)

## Overview

ADNEO is a modern web application that helps you discover premium available domain names with AI-powered suggestions. Only see domains that are actually available for purchase.

## Features

### Search Modes
- **Smart Mode** - AI-powered generation of brandable domain variations
- **Exact Match** - Check specific domain names
- **Batch Mode** - Check multiple domains at once

### Extensions
50+ supported extensions across categories:
- **Top**: .com, .net, .org, .co
- **Tech/Startup**: .io, .ai, .app, .dev, .xyz, .tech, .cloud
- **Business**: .store, .shop, .biz, .agency, .solutions
- **Creative**: .studio, .design, .media, .live
- **Web3**: .crypto, .nft, .dao, .defi
- **Local**: .fr, .de, .uk, .es, .it, .eu, .ca, .us

### Advanced Filters
20+ filters for precise results:
- **Format**: Length, hyphens, numbers, prefix/suffix
- **Branding**: Pronounceability, style (Startup, Corporate, Fun, Luxury, Minimal)
- **SEO**: Keyword matching, position, SEO score
- **Business Intent**: Categories (SaaS, Finance, Health, Ecommerce, Crypto, etc.)
- **Quality**: Double letters, consonant patterns, repetitions

### Scoring System
Each domain receives a score (0-100) based on:
- Brandability (0-30)
- Pronounceability (0-20)
- SEO Keyword Fit (0-15)
- Length Score (0-15)
- Clean Characters (0-10)
- Business Intent Match (0-10)

### Real-Time Progress
- Live progress bar with percentage
- Step-by-step status updates
- Partial results displayed as they arrive
- Cancel search anytime

### Export & Actions
- Direct "Buy on GoDaddy" links for each domain
- Copy domain to clipboard
- Export results to CSV

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI primitives
- **Real-time Updates**: Server-Sent Events (SSE)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd adneo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
adneo/
├── src/
│   ├── app/
│   │   ├── api/search/      # SSE search API endpoint
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main page
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── DomainCard.tsx   # Domain result card
│   │   ├── FiltersSidebar.tsx
│   │   ├── Header.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── ResultsSection.tsx
│   │   └── SearchHero.tsx
│   ├── lib/
│   │   ├── availability-checker.ts  # Domain availability simulation
│   │   ├── domain-generator.ts      # Name generation algorithms
│   │   ├── domain-scorer.ts         # Scoring system
│   │   └── utils.ts
│   ├── store/
│   │   └── search-store.ts  # Zustand state management
│   └── types/
│       └── domain.ts        # TypeScript types
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Domain Generation Algorithms

### Smart Variations
- Premium prefixes: get, try, go, use, my, join, app, pro, neo, etc.
- Premium suffixes: hub, labs, studio, cloud, ai, stack, flow, etc.
- Brandable modifications: vowel swaps, consonant doubling
- Synonym-based alternatives
- Abbreviation patterns

### Availability Simulation
The current implementation simulates domain availability for demonstration purposes. In production, this would integrate with:
- WHOIS APIs
- Registrar APIs (GoDaddy, Namecheap, etc.)
- DNS lookup services

## Roadmap

- [ ] User accounts & favorites
- [ ] Email alerts for domain availability
- [ ] Search history
- [ ] Multi-registrar price comparison
- [ ] AI-powered naming suggestions
- [ ] Premium marketplace integration

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

**ADNEO** - Find premium available domains faster than anywhere else.
