---
title: Diagrams that stay with the article
description: A Mermaid flowchart rendered to a static SVG during the site build.
publishedAt: 2026-09-04
---

This article demonstrates a diagram written directly in Markdown. The build
creates a local SVG, so the published page has no diagram-rendering JavaScript.

```mermaid
flowchart LR
  Author[Author writes Markdown] --> Build[Static site build]
  Build --> SVG[Generated SVG diagram]
  SVG --> Reader[Reader opens article]
```
