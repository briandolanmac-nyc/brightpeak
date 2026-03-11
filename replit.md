# Renewable Energy Website Template (Next.js)

## Overview
A remixable Next.js website template for renewable energy companies. Currently branded as BrightPeak Energy. Features a homepage with hero section, service cards, case studies, testimonials, FAQ, and more. All content is data-driven via JSON files. Designed for easy rebranding — change company name, colors, logo, and images via JSON data files or the admin panel with zero code changes.

## Tech Stack
- **Framework**: Next.js 16 with App Router (TypeScript), Turbopack dev server
- **Styling**: Tailwind CSS 4 + custom CSS in `globals.css`
- **Fonts**: League Spartan (headings) + Inter (body) via `next/font/google`
- **Theming**: next-themes with data-theme attribute (light/dark only, using brand variables)
- **Color Scheme**: Centralized via Site Settings — primaryColor, primaryDark, accentColor, bannerOverlay, quoteButtonColor, contactButtonColor. All components use CSS variables (--brand-primary, --text-secondary, etc.) — no hardcoded Tailwind color classes
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
│   ├── SectionManager.tsx      # Section reorder/toggle
│   ├── ImagePicker.tsx    # Image browser/uploader modal with sharp optimization
│   └── FaqEditor.tsx      # Solar Guide/FAQ editor with category management
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
├── our-work/              # Case study pages (SEO)
│   ├── page.tsx           # Index: grid of all case studies
│   └── [slug]/page.tsx    # Detail: full case study with stats, images, video, schema
├── news/                  # News article pages (SEO)
│   ├── page.tsx           # Index: grid of all news articles
│   └── [slug]/page.tsx    # Detail: full article with NewsArticle schema
├── solar-guide/page.tsx   # Solar Guide index with category cards and FAQPage schema
├── services/page.tsx      # Services index page listing all services
├── globals.css            # All custom CSS styles (~4100 lines)
├── layout.tsx             # Root layout with fonts + theme (uses generateMetadata)
├── page.tsx               # Homepage
└── [routes]/              # Inner pages (about, contact, solar-panels, underfloor-heating, etc.)
public/
└── images/                # Static images (all generic/descriptive names for easy rebranding)
    ├── company-logo.png   # Main company logo
    ├── hero-bg.webp       # Hero background
    ├── hero/              # Hero section images
    ├── about/             # About page (company-van, founder-portrait, team)
    ├── affiliations/      # affiliation-01 through 04 (generic slots)
    ├── banners/           # Page banner backgrounds
    ├── case-studies/       # Case study project images
    ├── logos/             # certification-01 through 05 (generic slots)
    ├── news/              # News section defaults
    └── services/          # Service page images (descriptive names)
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
- `data/home/CompanySettings.json` - **Brand hub**: company name, logo (src/alt), siteUrl, copyright, phone, email, address, opening hours, social media links (centralized; used by Navigation, Footer, and all brand references)
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
- **DataLayer Events**: `src/app/components/DataLayerTracker.tsx` (client component in root layout) + component-level pushes. 12 custom events total:
  - `cta_click` — any CTA button click (includes `cta_text`, `cta_url`, `cta_section`)
  - `phone_click` — phone number link click (includes `phone_number`)
  - `email_click` — email link click (includes `email_address`)
  - `faq_open` — FAQ accordion opened (includes `faq_question`)
  - `section_view` — homepage section scrolled into view at 30% (includes `section_name`, `section_id`)
  - `video_play` — video play button clicked (includes `video_title`, `video_url`)
  - `form_submit` — form submission (includes `form_page`)
  - `scroll_depth` — page scroll milestones at 25/50/75/100% (includes `scroll_percentage`)
  - `outbound_click` — external link click, excludes social icons (includes `outbound_url`, `outbound_text`)
  - `social_click` — social media icon click in nav/footer (includes `social_platform`, `social_url`)
  - `service_card_click` — homepage service card click (includes `service_name`, `service_url`)
  - `testimonial_view` — testimonial carousel navigation (includes `testimonial_author`, `testimonial_company`); fired from `TestimonialsSection.tsx`
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

## SEO Pages (Unique URLs)
- **`/our-work`** — Index of all case studies as linked cards; each card links to `/our-work/{slug}`
- **`/our-work/[slug]`** — Individual case study detail page with stats, image gallery, video embed, Article schema
- **`/news`** — Index of all news articles; each card links to `/news/{slug}`
- **`/news/[slug]`** — Individual news article page with rich content, NewsArticle schema, breadcrumbs schema
- **`/solar-guide`** — Solar Guide index page with category cards and all questions grouped by topic
- **`/solar-guide/[slug]`** — Individual Solar Guide category pages (general, costs-financing, installation-process, performance-maintenance, battery-grid, company-warranty) each with FAQPage schema and BreadcrumbList schema for Google rich results
- **`/services`** — Services index page listing all services with cards linking to each service page
- **`/locations`** — Index of all service area locations; each card links to `/locations/{slug}`
- **`/locations/[slug]`** — Individual location landing page with LocalBusiness schema, BreadcrumbList schema, service list, highlights/stats, CTA, and cross-links to other locations
- **Location data**: `data/home/LocationsSection.json` — array of locations with slug, name, title, description (HTML), image, services list, highlights (stats)
- **Slugs**: Added `slug` field to case studies in `CaseStudiesSection.json` and news items in `NewsVideosSection.json`
- **Solar Guide (formerly FAQ)**: `data/home/FaqSection.json` uses flat data model — top-level `categories` array (`[{slug, title, description}]`) + flat `items` array (`[{question, answer, category}]`) where `category` is a slug reference. Homepage FAQ component filters active items and shows first 8 with "View All FAQs" link. Admin has custom `FaqEditor` component (`packages/admin/components/FaqEditor.tsx`) with editable category list (add/remove/rename with orphan logic) and per-item category dropdown. Removing a category orphans its items (`category: "_orphan"`) — orphaned items are hidden on the site but visible in admin for reassignment
- **Sitemap**: `src/app/sitemap.ts` dynamically includes all case study, news article, location, and Solar Guide category URLs
- **SEO data**: All new pages have entries in `data/seo.json`
- **Cross-linking**: Case study cards on homepage have "View Project →" link; news cards have "Full Article →" link
- **Navigation**: "News" links to `/news`, "Our Work" links to `/our-work`, "Locations" links to `/locations`
- **Footer**: Added Solar Guide, News, and Locations links to Resources column

## Content Management
All homepage content is stored in JSON files under `data/home/`. The admin panel (`/admin`) and sidebar editor allow editing these files at runtime. Changes are only saved when the user explicitly clicks "Save Changes" — the page does not auto-refresh.

## Submit for Review (GitHub Push)
- **"Submit for Review" button** in `/admin` sidebar pushes all `data/` JSON files to a new branch on GitHub (`content-update-YYYY-MM-DD-HHMM`)
- API endpoint: `POST /api/admin/publish` (requires admin auth)
- Uses `GITHUB_PERSONAL_ACCESS_TOKEN` env secret to authenticate with GitHub API
- Target repo: `GITHUB_REPO` env var (fallback: `briandolanmac-nyc/brightpeak`)
- Pushes both `data/` JSON files **and** `public/images/` (so image changes are included)
- Creates a branch off `main` — does NOT merge automatically
- Button is disabled until all unsaved changes are saved first
- Returns a link to the GitHub compare/PR page for review
- Includes retry logic with delays to handle GitHub API rate limits

## User Preferences
- **GitHub pushes**: Only push to GitHub when explicitly instructed by the user. Do not auto-push after changes.

## Environment Architecture
- **Preview** (Replit dev URL): Editable via admin panel, client-facing for content editing
- **Live Site** (Netlify): Read-only, public-facing, rebuilds from GitHub `main` branch
- **GitHub**: Bridge between Preview and Live Site; content changes go to branches for review
- `ADMIN_ENABLED=true` on Preview, not set on Live Site
- `ADMIN_PASSWORD` secret protects admin access
- `GITHUB_PERSONAL_ACCESS_TOKEN` secret enables Submit for Review
