# Vendored dependencies

## SheetJS (`xlsx`) 0.20.3

`xlsx-0.20.3.tgz` is the unchanged official distribution from
<https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz>. Keeping it in Git lets
fresh and cached installs use a local tarball without depending on the SheetJS
CDN. The npm registry's `xlsx` package does not provide this version.

- License: Apache-2.0; the archive includes `package/LICENSE` and
  `package/dist/LICENSE`.
- SHA-512 (SRI, also recorded in `pnpm-lock.yaml`):
  `sha512-oLDq3jw7AcLqKWH2AhCpVTZl8mf6X2YReP+Neh0SJUzV/BdZYjth94tG5toiMB1PPrYtxOCfaoUCkvtuH+3AJA==`
- Local changes remain in `patches/xlsx@0.20.3.patch` and are applied by pnpm
  during installation; they are not baked into the archive.

To update, download the official versioned tarball, verify its provenance and
SHA-512, and retain the original archive and bundled licenses. Update the
`xlsx` catalog entry and its local-file override in `pnpm-workspace.yaml`, and
rebase the patch registered in `package.json`. Regenerate the lockfile with
the pnpm version pinned in `package.json`, then verify a frozen install from a
fresh store, a cached install, and the spreadsheet tests.
