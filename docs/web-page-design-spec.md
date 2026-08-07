# Web Page Design Specification

## Purpose

Define the first version of the personal website UI. The page should feel familiar to people who review LinkedIn profiles, especially recruiters and HR readers, while remaining an independent personal website rather than a copy of LinkedIn.

The reference page is the locally saved LinkedIn export:

```text
docs/linkedin_webpage/Damian Sińczak _ LinkedIn.html
```

## Design Direction

The website should use a LinkedIn-like information architecture:

- a fixed top navigation bar
- a profile header card with background banner, avatar, name, headline, location, and contact actions
- a single centered main content column
- content grouped into distinct white section cards
- section ordering close to a professional profile/CV flow
- expandable details for richer website-only content

The implementation must not copy LinkedIn branding, logos, proprietary icons, exact class names, or private layout code. It should borrow the familiar professional profile pattern, not the product identity.

## Page Layout

The page should be a single-page profile by default.

Recommended desktop layout:

```text
sticky top bar

centered page canvas
  profile header card
  bio/about card
  experience card
  skills card
  publications card
  education card
  languages card
  contact/footer area
```

There should be no right sidebar, right rail, ad column, recommendation column, analytics panel, or "people also viewed" area. The main section should be centered on the page.

Suggested maximum content width:

- `760px` to `860px` for the main column
- `1128px` maximum for the top navigation inner container

The body background should be a muted warm gray similar in role to LinkedIn's page canvas. Cards should use a white or near-white surface with subtle border and restrained shadow.

## Top Bar

The top bar should be visually similar in structure to LinkedIn's global navigation:

- sticky at the top
- white background
- subtle bottom border
- compact height, around `52px` to `56px`
- centered inner content
- left-aligned identity mark or name
- right-aligned or center-aligned section navigation
- mobile-friendly collapsed menu

Menu options should be the main profile categories, generated from available Markdown sections:

- Bio
- Experience
- Skills
- Publications
- Education
- Languages
- Contact

If a section is missing from `content/profile.md` or filtered out for the web target, its menu item should not render. Contact is generated from frontmatter contact fields rather than from a Markdown section, and should render only when at least one contact method exists.

The top bar should include a prominent CV download action that links to the pregenerated PDF.

First-version navigation behavior:

- desktop and tablet should render text navigation links when they fit
- mobile should use a compact menu button for section links
- use text labels for section navigation in the first implementation
- section links should scroll to stable section anchors
- active section highlighting is optional for the first implementation
- the CV download action should remain visible outside the mobile section menu when space allows

## Profile Header

The first card should mirror the shape of a LinkedIn profile header:

- wide banner image or neutral professional banner area at the top
- circular profile photo overlapping the lower edge of the banner
- name as the primary heading
- professional title/headline below the name
- current company or primary professional affiliation when available
- location and contact link row
- compact action buttons, including PDF download and contact/email

The profile header should be generated from frontmatter and parsed profile data. It must not duplicate this data inside the UI component.

Profile image and banner metadata should come from `assets.photo` and `assets.banner` in `content/profile.md` frontmatter. The website should use `assets.photo.alt` for the image alt text and `assets.photo.position` / `assets.banner.position` as object-position hints when present.

The first implementation may use:

- a local profile image asset if provided
- a generated or simple neutral banner if no banner asset exists
- initials fallback if no photo asset exists

Profile header image behavior:

- banner should use `object-fit: cover`
- banner should use `assets.banner.position` as `object-position` when provided
- profile photo should render as a circular image
- profile photo should use `assets.photo.position` as `object-position` when provided
- profile photo should have stable dimensions so it does not shift layout while loading

## Content Cards

Each major section should render as a separate card with:

- section title at the top
- consistent inner padding
- no nested outer cards
- divider lines between repeated entries where needed
- concise text density suitable for CV scanning
- expandable website-only details when the Markdown metadata requests `web: collapsed`

Cards should be visually restrained. Avoid marketing-style hero sections, decorative backgrounds, oversized headings, or large explanatory text blocks.

## Section Behavior

### Bio

The Bio/About section should appear near the top and render as normal text. It should not be collapsed by default unless the Markdown explicitly requests it.

### Experience

Experience should use a LinkedIn-like list:

- company or project name
- role title
- period
- location or remote indicator when available
- concise bullet points
- expandable website-only detail area when present

Collapsed detail controls should be quiet and predictable, for example "Show details" / "Hide details". The collapsed state should come from parsed Markdown metadata, not hardcoded component rules.

### Skills

Skills should support both compact CV-style presentation and richer website details:

- skill name
- category
- level or strength indicator when provided
- short summary
- expandable detail explaining practical use and background

Skill level may be visualized as a subtle progress bar or compact meter, but it should not dominate the page.

### Publications

Publications should render as a simple list:

- title
- venue/source/date when available
- link when available
- short description
- expandable website-only detail when present

### Education And Languages

Education and languages should stay compact and easy to scan.

### Contact

Contact should be generated from frontmatter fields such as `email`, `phone`, and `links`.

The contact area should appear near the bottom of the page and may also be represented by action buttons in the profile header. It should not require a contact form in the first implementation.

## Responsive Behavior

Desktop:

- centered single column
- sticky top bar visible
- profile header card spans the column width
- navigation menu visible if it fits

Tablet:

- same single-column structure
- reduced horizontal page margins
- top bar may reduce spacing between menu items

Mobile:

- single column full width with small side margins
- top bar keeps name/identity and CV action visible
- section menu collapses behind a menu button
- profile image remains readable and should not overlap text
- action buttons may wrap onto multiple lines

All text must fit within its container at supported viewport widths.

## Visual Tokens

Initial visual tokens should be close to the professional profile pattern:

- page background: muted light gray
- surface background: white or near-white
- primary action color: professional blue
- text color: near-black for headings, dark gray for body
- secondary text: medium gray
- border: subtle light gray
- border radius: around `8px`
- card shadow: minimal or none

The page should avoid a one-note blue theme. Blue should be an action/accent color, not the whole palette.

## Accessibility Requirements

- Top navigation should use semantic `nav`.
- Main content should use semantic `main`.
- Each profile section should have a stable heading and anchor target.
- Top bar section links should scroll to those anchors.
- Expand/collapse controls should be keyboard accessible.
- Expand/collapse controls should expose `aria-expanded`.
- Color contrast must be sufficient for text and controls.
- The PDF download link should have clear accessible text.

## Content Integration

The UI must be driven by the parsed web profile model:

```ts
const webProfile = filterProfileForTarget(profile, "web");
```

The renderer should:

- render only sections available for the `web` target
- render the profile photo and banner from profile asset metadata
- build top-bar menu items from rendered sections
- generate a Contact menu item from available frontmatter contact data
- respect `web: collapsed` and `web: expanded`
- ignore PDF-only content
- link to the pregenerated PDF from frontmatter or generated build metadata

## First Implementation Acceptance Criteria

- The first viewport shows the profile header, including banner, photo, name, title, location, and primary actions.
- The page uses one centered main column and no right rail.
- Top navigation links scroll to generated section anchors.
- Mobile navigation remains usable at narrow viewport widths.
- `web: collapsed` detail content renders behind accessible expand/collapse controls.
- The PDF download link points to the pregenerated PDF artifact.
- Missing optional sections do not leave empty cards or dead navigation links.

## Non-Goals

- Do not implement a LinkedIn clone.
- Do not include social feed, analytics, ads, recommendations, messaging, notifications, or connection features.
- Do not add a right rail.
- Do not require client-side Markdown parsing.
- Do not require runtime PDF generation.

## Open Decisions

There are no web design decisions that should block the first implementation.
