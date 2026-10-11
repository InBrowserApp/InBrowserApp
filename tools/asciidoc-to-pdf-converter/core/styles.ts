// Fixed print theme for semantic AsciiDoc blocks, scoped to the source content.
export const styles = `
  #pdf-content h2 { margin-top: 1.6em; padding-bottom: .2em; border-bottom: 1px solid #ddd; }
  #pdf-content p, #pdf-content ul, #pdf-content ol, #pdf-content dl { margin-block: .8em; }
  #pdf-content li > p { margin-block: .3em; }
  #pdf-content pre { margin: 0; padding: .8em; background: #f4f4f5; font-size: .85em; }
  #pdf-content .title { margin-block: .8em .4em; font-weight: bold; }
  #pdf-content .details { color: #555; font-size: .9em; }
  #pdf-content .admonitionblock { margin-block: 1.2em; border-inline-start: 3px solid #777; }
  #pdf-content .admonitionblock table { table-layout: auto; }
  #pdf-content .admonitionblock td { border: 0; vertical-align: top; padding: .4em; }
  #pdf-content .admonitionblock .icon { width: 5em; white-space: nowrap !important; overflow-wrap: normal; }
  #pdf-content .admonitionblock .title { text-transform: uppercase; font-size: .75em; }
  #pdf-content .quoteblock { border-inline-start: 3px solid #ddd; padding-inline-start: 1em; }
  #pdf-content .quoteblock blockquote { margin: 0; }
  #pdf-content .exampleblock > .content { border: 1px solid #ddd; padding: 1em; }
  #pdf-content .colist td { border: 0; vertical-align: top; }
  #pdf-content .conum { font-weight: bold; }
  #pdf-content #footnotes { margin-top: 2em; font-size: .85em; }
  #pdf-content .imageblock { margin-block: 1em; }
  #pdf-content .page-break { break-after: page; }
`
