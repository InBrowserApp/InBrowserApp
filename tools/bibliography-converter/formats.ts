export const formats = {
  bibtex: { label: "BibTeX", extension: "bib", mime: "text/x-bibtex" },
  ris: {
    label: "RIS",
    extension: "ris",
    mime: "application/x-research-info-systems",
  },
  json: { label: "CSL JSON", extension: "json", mime: "application/json" },
} as const

export type Format = keyof typeof formats
export type InputFormat = Format | "auto"

export const formatOptions = Object.entries(formats)

export const example = `@article{lovelace1843,
  author = {Lovelace, Ada},
  title = {Notes on the Analytical Engine},
  journal = {Scientific Memoirs},
  year = {1843}
}

@article{lovelace-notes,
  author = {Lovelace, A.},
  title = {Notes on the Analytical Engine},
  journal = {Scientific Memoirs},
  year = {1843}
}

@book{turing1992,
  author = {Turing, Alan M.},
  title = {Collected Works of A. M. Turing},
  publisher = {North-Holland},
  year = {1992}
}`
