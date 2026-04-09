import hljs from "highlight.js/lib/core"

const gitignore = () => ({
  name: "gitignore",
  aliases: ["ignore"],
  contains: [
    {
      scope: "comment",
      begin: /^\s*#/,
      end: /$/,
    },
    {
      scope: "meta",
      match: /^!/,
    },
    {
      scope: "keyword",
      match: /\*\*|\*|\?/,
    },
    {
      scope: "punctuation",
      match: /[/[\]]/,
    },
    {
      scope: "string",
      match: /\\[#!*?[\]\\ ]/,
    },
  ],
})

if (!hljs.getLanguage("gitignore")) {
  hljs.registerLanguage("gitignore", gitignore)
}

type HighlightedGitignoreProps = Readonly<{
  ariaLabel: string
  placeholder: string
  value: string
}>

function HighlightedGitignore({
  ariaLabel,
  placeholder,
  value,
}: HighlightedGitignoreProps) {
  if (value.trim() === "") {
    return (
      <div
        role="textbox"
        aria-label={ariaLabel}
        aria-multiline="true"
        aria-readonly="true"
        className="gitignore-highlight-empty flex min-h-full p-3 font-mono text-sm leading-6 text-muted-foreground"
      >
        {placeholder}
      </div>
    )
  }

  const highlightedGitignore = hljs.highlight(value, {
    language: "gitignore",
  }).value

  return (
    <pre
      role="textbox"
      aria-label={ariaLabel}
      aria-multiline="true"
      aria-readonly="true"
      className="gitignore-highlight hljs min-h-full min-w-max p-3"
    >
      <code dangerouslySetInnerHTML={{ __html: highlightedGitignore }} />
    </pre>
  )
}

export { HighlightedGitignore }
