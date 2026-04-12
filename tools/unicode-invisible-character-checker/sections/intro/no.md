## Why invisible characters matter

Invisible Unicode characters are easy to miss because they do not look broken in a normal editor. The problem only shows up later: copy changes fail, identifiers stop matching, layout wraps oddly, or text starts behaving differently in RTL contexts.

## What this tool catches

This checker looks for four common groups: zero-width marks, bidi controls, special spacing characters, and format controls. It tells you exactly where they appear, gives you an annotated preview, and prepares a cleaned version you can copy or export.

## When to use it

Use it after copying text from docs, PDFs, spreadsheets, chat apps, CMS editors, or design tools. It is especially useful when a string looks normal but comparisons, rendering, or downstream processing keep behaving strangely.
