---
title: Testing every piece a post can have
description: A throwaway post that exercises headings, lists, code, quotes, images and tables. Removed before merge.
date: 2026-11-17
type: Build log
topic: Swift
repo: https://github.com/amierlorenz/mieracle-study
draft: false
---

This post only exists to check the post page. It uses every element Markdown can make, so each one gets styled and checked once.

## Lists and inline bits

Some **bold**, some *italic*, a [link](https://amierlorenz.com) and `inline code`.

- Answers are short: a word, a phrase, sometimes a sentence.
- Grades map to SM-2's 0 to 5 scale.
- It has to run offline.

1. First
2. Second
3. Third

## Code and quotes

```swift
let session = LanguageModelSession(instructions: graderInstructions)
let result = try await session.respond(to: prompt, generating: Grade.self)
scheduler.review(card, quality: result.content.score)
```

> The model doesn't decide when you see a card again. It only suggests how well you knew it.

### A smaller heading

Curly braces in text are safe: {{ not a template }} and {% neither is this %}.

## Images and tables

![The review screen](/assets/headshot.webp)

| Answer type | Grader | Agreement |
|---|---|---|
| Single word | Model | 94% |
| Phrase | Model | 88% |
| Number or date | Exact match | 100% |

---

## What I'd change

A last section so the contents tracker has somewhere to finish.
