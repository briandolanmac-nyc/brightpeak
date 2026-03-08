# BrightPeak Energy - Next.js Website

## Overview
A Next.js website for BrightPeak Energy (brightpeak-energy.com), an Irish renewable energy company. Features a homepage with hero section, service cards, case studies, testimonials, FAQ, and more. All content is data-driven via JSON files.

## Tech Stack
- **Framework**: Next.js 16 with App Router (TypeScript), Turbopack dev server
- **Styling**: Tailwind CSS 4 + custom CSS in `globals.css`
- **Fonts**: League Spartan (headings) + Inter (body) via `next/font/google`
- **Theming**: next-themes with data-theme attribute (light/dark + custom themes)
- **Color Scheme**: Centralized via Site Settings — Primary (#009968), Primary Dark (#007a54), Accent (#fcb900), Banner Overlay (#0f172a), Quote Button Color, Contact Button Color
- **CTA Button Colors**: All Quote/calculator CTA buttons use `--btn-quote` variable; all Contact CTA buttons use `--btn-contact` variable. Both editable in Site Settings.

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
│   ├── PageBanner.tsx     # Reusable page banner with translucent background image
│   ├── Providers.tsx      # Client-side theme provider wrapper
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
- **Rich text editor**: Fields matching `RICH_TEXT_PATH_PATTERNS` (config.ts) render a TipTap toolbar editor (bold, italic, underline, H2/H3/H4 headings, lists, links). Enabled for: `summary`, `content`, `answer`, `description`, `desc`, `paragraph`, `body`, `text`, and `paragraphs[n]` fields. Content stored as HTML in JSON, rendered with `dangerouslySetInnerHTML` + `sanitizeHtml()` on the front-end. CSS: `packages/admin/styles/richtext.css`. Front-end uses `.rich-html` class for consistent styling.
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
- `data/home/SiteSettings.json` - Brand colors (primaryColor, primaryDark, accentColor, bannerOverlay, quoteButtonColor, contactButtonColor), font, border radius
- `data/home/CompanySettings.json` - Company name, phone, email, address, opening hours, social media links (centralized; used by Navigation + Footer)
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

## Contact Form & Submissions
- **Contact form**: `src/app/components/ContactForm.tsx` (client component) with submit/success/error states
- **API endpoint**: `POST /api/contact/route.ts` saves submissions to `data/contact-submissions.json`
- **Admin submissions API**: `GET/PUT /api/admin/submissions/route.ts` with auth — list, mark read/unread, delete
- **Admin submissions viewer**: `packages/admin/components/SubmissionsViewer.tsx` — accessible via "Inbox > Contact Submissions" in admin sidebar
- **Email sending**: Deferred until SMTP credentials are provided (Nodemailer ready to integrate)

## URL Variant System
- `getUrlForVariant(variant, siteSettings)` in `src/app/lib/siteSettings.ts` maps button variants to URLs:
  - `"primary"` → Voltflo calculator URL (from SiteSettings.json)
  - `"secondary"` → Contact form URL (from SiteSettings.json)
  - `"basic_form"` → `/contact`
- All page data files use `variant` instead of `href` on primaryButton/secondaryButton

## Custom Pages System
- **Data file**: `data/pages/CustomPages.json` — stores an array of custom page definitions
- **Dynamic route**: `src/app/[slug]/page.tsx` — renders enabled custom pages at their slug URL
- **Helper**: `src/app/lib/customPages.ts` — loads and types custom page data
- **Three page types**: 
  - `section` — Card-based page with banner, eyebrow/title, and cards (subHeading/paragraph/image)
  - `iframe` — Full-page iframe that renders an external URL below the banner
  - `image` — Full-width image page for special offers/promotions (image from URL or internal path)
- **Two placement options**:
  - `page` — Standalone page at its slug URL (e.g., `/my-service`)
  - `homepage` — Renders as a section on the homepage, appended after ordered sections. Key: `custom_{slug}` in sectionMap
- **Homepage section component**: `src/app/components/home/CustomHomeSection.tsx`
- **Enable/Disable**: When `enabled: false`, the page returns 404 (page placement) or doesn't render (homepage)
- **No inheritance**: New pages start completely blank — no content from other pages
- **Static routes take priority**: Existing routes (solar-panels, about, etc.) always win over the dynamic `[slug]` route
- **Admin**: Editable under "Custom Pages" in Top Level Settings group. Type and placement shown as radio buttons. `EMPTY_ARRAY_TEMPLATES.pages` and `EMPTY_ARRAY_TEMPLATES.cards` in config.ts provide templates for empty arrays
- **Iframe CSS**: `.custom-iframe-section` and `.custom-iframe` in globals.css — full-width, `calc(100vh - 140px)` height
- **Image CSS**: `.custom-image-section` and `.custom-image-full` in globals.css — centered, max-width 1400px
- **Admin color coding**: Custom page cards are color-coded by type — green (section), blue (iframe), amber/orange (image) — in both sidebar and full admin page
- **Conditional field hiding**: `iframeUrl` only shows for iframe type, `imageUrl` only shows for image type, `content` (cards) hidden for image type
- **Auto-sync**: When a custom page's placement changes to/from "homepage", the Page Settings section list updates immediately via `syncCustomPageSections()` in utils.ts

## Content Management
All homepage content is stored in JSON files under `data/home/`. The admin panel (`/admin`) and sidebar editor allow editing these files at runtime. Changes are only saved when the user explicitly clicks "Save Changes" — the page does not auto-refresh.

## Submit for Review (GitHub Push)
- **"Submit for Review" button** in `/admin` sidebar pushes all `data/` JSON files to a new branch on GitHub (`content-update-YYYY-MM-DD-HHMM`)
- API endpoint: `POST /api/admin/publish` (requires admin auth)
- Uses `GITHUB_PERSONAL_ACCESS_TOKEN` env secret to authenticate with GitHub API
- Target repo: `briandolanmac-nyc/brightpeak`
- Pushes both `data/` JSON files **and** `public/images/` (so image changes are included)
- Creates a branch off `main` — does NOT merge automatically
- Button is disabled until all unsaved changes are saved first
- Returns a link to the GitHub compare/PR page for review
- Includes retry logic with delays to handle GitHub API rate limits

## Environment Architecture
- **Preview** (Replit dev URL): Editable via admin panel, client-facing for content editing
- **Live Site** (Netlify): Read-only, public-facing, rebuilds from GitHub `main` branch
- **GitHub**: Bridge between Preview and Live Site; content changes go to branches for review
- `ADMIN_ENABLED=true` on Preview, not set on Live Site
- `ADMIN_PASSWORD` secret protects admin access
- `GITHUB_PERSONAL_ACCESS_TOKEN` secret enables Submit for Review
