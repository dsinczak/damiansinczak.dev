---
title: Code snippets, from shell commands to TypeScript
description: A visual test page for inline code, fenced blocks, long lines, and common programming languages.
publishedAt: 2026-10-15
draft: false
---

This post is a visual test bed for code. It includes inline code such as
`npm run dev`, a file path like `src/core/blog/posts.ts`, and a short function
call: `prepareBlogAssets()`.

## TypeScript

```ts
type Post = {
  title: string;
  publishedAt: Date;
  draft: boolean;
};

const publishedPosts = posts.filter((post) => !post.draft);
```

## Java

```java
public record Greeting(String message) {
  public static Greeting forName(String name) {
    return new Greeting("Hello, " + name + "!");
  }
}
```

## Python

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Greeting:
    message: str


def for_name(name: str) -> Greeting:
    return Greeting(f"Hello, {name}!")
```

## Shell commands

```sh
npm install
npm run dev
npm test
```

## JSON

```json
{
  "name": "damiansinczak-dev",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "test": "vitest run"
  }
}
```

## HTML and CSS

```html
<article class="post-card">
  <h2>Readable code examples</h2>
  <p>Small details make technical writing easier to scan.</p>
</article>
```

```css
.post-card {
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}
```

## Diff

```diff
- const layout = "sidebar-first";
+ const layout = "reader-first-on-mobile";
```

## Long line

This deliberately long command checks that code blocks scroll horizontally instead of
forcing the page wider on a phone.

```sh
curl --request POST --header "Content-Type: application/json" --data '{"title":"A deliberately long sample value","published":true,"tags":["typescript","accessibility","responsive-design"]}' https://example.com/api/posts
```

## Plain text

```text
The visual treatment should also work when no language is specified.
Whitespace, punctuation, and line breaks should remain intact.
```
