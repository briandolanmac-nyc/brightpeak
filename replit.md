# Green-House Renewables - Next.js Website

## Overview
A Next.js website for Green-House Renewables, an Irish solar energy company. Features a homepage with hero section, service cards, case studies, testimonials, FAQ, and more. All content is data-driven via JSON files.

## Tech Stack
- **Framework**: Next.js 16 with App Router (TypeScript), Turbopack dev server
- **Styling**: Tailwind CSS 4 + custom CSS in `globals.css`
- **Fonts**: League Spartan (headings) + Inter (body) via `next/font/google`
- **Theming**: next-themes with data-theme attribute (light/dark + custom themes)
- **Color Scheme**: Green primary (#009968, #007a54) with amber accents

## Project Structure
```
data/                      # JSON data files (at project root, outside src/ to avoid HMR)
├── home/                  # Homepage section JSON data files (live data)
├── pages/                 # Inner page JSON data files (live data)
└── seo.json               # SEO metadata

packages/admin/            # Portable admin package (self-contained)
├── components/            # Admin UI components
│   ├── AdminSidebar.tsx   # Slide-out sidebar editor (no auto-refresh on save)
│   ├── AdminPage.tsx      # Full-page admin dashboard
│   ├── SmartEditorSidebar.tsx  # Smart form editor (sidebar variant)
│   ├── SmartEditorPage.tsx     # Smart form editor (page variant)
│   └── SectionManager.tsx      # Section reorder/toggle
├── api/
│   └── handler.ts         # API route handler (GET/PUT with schema migration)
├── styles/
│   ├── sidebar.css        # Sidebar styles
│   └── page.css           # Admin page styles
├── defaults/              # Default JSON files (schema/defaults for migration)
│   ├── home/              # Default homepage section JSON files
│   ├── pages/             # Default inner page JSON files
│   └── seo.json
├── config.ts              # Labels, order, font options, valid files list
├── utils.ts               # formatLabel, setNestedValue, FileData type
├── schema.ts              # Schema migration: creates missing files, fills missing fields
└── index.ts               # Public exports

src/app/
├── components/            # React components
│   ├── home/              # Homepage section components
│   ├── AdminSidebar.tsx   # Thin wrapper → imports from packages/admin
│   ├── FontLoader.tsx
│   └── PageLayout.tsx
├── lib/                   # Data loading utilities (reads from data/ at project root)
├── api/admin/data/
│   └── route.ts           # Thin wrapper → delegates to packages/admin handler
├── admin/
│   ├── page.tsx           # Thin wrapper → imports AdminPage from packages/admin
│   └── layout.tsx         # Admin layout (noindex)
├── globals.css            # All custom CSS styles (~3500 lines)
├── layout.tsx             # Root layout with fonts + theme (uses generateMetadata)
├── page.tsx               # Homepage
└── [routes]/              # Inner pages (about, contact, solar-panels, underfloor-heating, etc.)
public/
└── images/                # Static images, logos, branding
```

## Admin Package (packages/admin/)
The admin tool is a **portable, self-contained package** that can be reused across multiple website projects.

### How it works
- **Schema migration**: On first API request, compares JSON data files against defaults in `packages/admin/defaults/`. Creates missing files and fills in missing fields without overwriting existing content.
- **Smart editor**: Automatically generates form fields based on JSON structure (text, textarea, color picker, toggle, select, array, object, radio buttons).
- **Section manager**: Drag-and-drop reordering and enable/disable toggles for homepage sections.
- **Section groups**: Admin sidebar organizes sections into 3 groups: "Top Level Settings", "Hero Content", "Content Pages". Full-page admin shows group headers; sidebar dropdown uses `<optgroup>`.
- **Save behavior**: Changes are held in browser state until the user clicks "Save Changes". No auto-save, no auto-refresh.

### Upgrading an older site
1. Replace `packages/admin/` folder with the latest version
2. Restart the app
3. The schema migration automatically handles:
   - Missing JSON files → created from defaults
   - Missing fields in existing files → filled with default values
   - Existing content → preserved as-is

### Integration points (thin wrappers in each site)
- `src/app/components/AdminSidebar.tsx` → re-exports from packages/admin
- `src/app/admin/page.tsx` → imports AdminPage from packages/admin
- `src/app/api/admin/data/route.ts` → delegates to packages/admin handler
- `src/app/layout.tsx` → imports sidebar CSS from packages/admin

## Key Files
- `src/app/globals.css` - All custom CSS (nav, hero, sections, footer, etc.)
- `src/app/layout.tsx` - Root layout with League Spartan + Inter fonts
- `data/home/*.json` - Homepage section content (editable via admin)
- `data/home/SiteSettings.json` - Brand color and font settings
- `src/app/components/home/*.tsx` - Homepage section components

## Important: Data Directory Location
The `data/` directory is at the **project root** (not inside `src/app/`). This prevents Turbopack from watching data files and triggering unnecessary hot reloads when the admin saves changes. All JSON imports use `fs.readFileSync` (not static `import`) to avoid creating module dependencies that trigger HMR.

## Running
```bash
npm run dev    # Development server on port 5000 (Turbopack)
npm run build  # Production build
npm start      # Production server on port 5000
```

## Analytics & Tracking
- **GTM**: Google Tag Manager loaded via `next/script` (`afterInteractive`); container ID stored in `data/home/SiteSettings.json` (`gtmId` field), editable via admin
- **DataLayer Events**: `src/app/components/DataLayerTracker.tsx` (client component in root layout) pushes the following `dataLayer.push()` events:
  - `cta_click` — any CTA button click (includes `cta_text`, `cta_url`, `cta_section`)
  - `phone_click` — phone number link click (includes `phone_number`)
  - `email_click` — email link click (includes `email_address`)
  - `faq_open` — FAQ accordion opened (includes `faq_question`)
  - `section_view` — homepage section scrolled into view at 30% (includes `section_name`, `section_id`)
  - `video_play` — video play button clicked (includes `video_title`, `video_url`)
  - `form_submit` — form submission (includes `form_page`)
- **Section IDs**: All homepage sections have `id` attributes for section visibility tracking

## Content Management
All homepage content is stored in JSON files under `data/home/`. The admin panel (`/admin`) and sidebar editor allow editing these files at runtime. Changes are only saved when the user explicitly clicks "Save Changes" — the page does not auto-refresh.
