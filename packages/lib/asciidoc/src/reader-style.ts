export const readerStyle = `
  body { max-width: 72ch; }
  h1 { font-size: 2em; letter-spacing: -.025em; }
  h2 { margin-top: 1.8em; padding-bottom: .25em; border-bottom: 1px solid #ddd; }
  h3,h4 { margin-top: 1.5em; }
  p,ul,ol,dl { margin-block: .8em; }
  li > p { margin-block: .3em; }
  pre { margin: 0; padding: 1em; background: #f4f4f5; font-size: .85em; }
  code { font-family: ui-monospace,monospace; }
  :not(pre) > code { background: #f4f4f5; padding: .1em .2em; }
  .title { margin-block: .8em .4em; font-weight: 600; }
  .details { color: #555; font-size: .9em; }
  .admonitionblock { margin-block: 1.2em; border-inline-start: 3px solid #777; }
  .admonitionblock td { border: 0; vertical-align: top; }
  .admonitionblock .icon { white-space: nowrap; overflow-wrap: normal; }
  .admonitionblock .title { text-transform: uppercase; font-size: .75em; }
  .quoteblock { border-inline-start: 3px solid #ddd; padding-inline-start: 1em; }
  .quoteblock blockquote { margin: 0; }
  .exampleblock > .content { border: 1px solid #ddd; padding: 1em; }
  .colist td { border: 0; vertical-align: top; }
  .conum { font-weight: 700; }
  .include { text-decoration: line-through; }
  #footnotes { margin-top: 2em; font-size: .85em; }
  .imageblock { margin-block: 1em; }
  .imageblock img:not([src]) { min-height: 2em; }
`
