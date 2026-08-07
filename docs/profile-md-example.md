# Example `content/profile.md`

This file shows the intended shape of the canonical Markdown profile source. It is example content only, not the final CV content.

```md
---
name: Damian Sinczak
title: Professional title
location: Poland
email: name@example.com
assets:
  photo:
    src: content/profile_pic.jpg
    alt: Damian Sińczak
    position: center
  banner:
    src: content/banner.jpeg
    alt: Code editor close-up
    position: center
links:
  linkedin: https://www.linkedin.com/in/example
  github: https://github.com/example
pdf:
  filename: Damian_Sinczak_CV.pdf
outputs:
  sections:
    bio:
      target: all
      web: none
    experience:
      target: all
      web: collapsed
    publications:
      target: all
      web: collapsed
    skills:
      target: all
      web: collapsed
---

# Bio

Short professional summary.

# Experience

## Company Name
<!-- target: all; web: collapsed -->

Role: Job title
Period: 2022 - Present
Location: City or Remote

- Concise achievement shown in both website and PDF.
- Another concise achievement shown in both website and PDF.

:::detail target="web" web="collapsed"
Longer narrative description for the website only. This can explain context, responsibilities, decision-making, collaboration, technical depth, and impact in a more expressive way than the PDF should contain.
:::

# Publications

## Publication Title
<!-- target: all; web: collapsed -->

Authors, venue, year, DOI or URL.

:::detail target="web" web="collapsed"
Additional explanation of the work, motivation, contribution, relevance, and practical impact. This text appears on the website only and is collapsed by default.
:::

# Projects

## Project Name
<!-- target: web; web: collapsed -->

Description of the project.

Tech: TypeScript, React, Node.js
Link: https://example.com

# Skills

## TypeScript
<!-- target: all; web: collapsed -->

Level: 90
Category: Programming languages

Concise CV-facing skill summary.

:::detail target="web" web="collapsed"
Longer website-only description explaining how the skill was acquired, how it is used in practice, examples of relevant work, and current depth of experience.
:::

# Education

## School or Certification Name
<!-- target: all -->

Period: 2018 - 2022

Short description if needed.
```
