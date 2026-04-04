# `@workspace/tool-registry`

This package will own manifest scanning and generated registry output introduced in issue `#319`.

The boundary established in `#316` is:

- hand-written code stays in `src/`
- generated files live in `src/generated/`
- only generated files may point directly at tool entries
