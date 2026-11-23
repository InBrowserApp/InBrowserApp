# tldr Command Lookup

Run `pnpm tldr:refresh` from the repository root to update the command index.
Pass a commit SHA to reproduce a specific snapshot. Review and commit the updated
`commands.json` with the next release. The normal build reads this static asset.

The index pins the same upstream commit used by jsDelivr and GitHub Raw.
It contains command names and the platform/language variants available from
[tldr pages](https://github.com/tldr-pages/tldr), under the
[MIT License](https://github.com/tldr-pages/tldr/blob/main/LICENSE.md).
