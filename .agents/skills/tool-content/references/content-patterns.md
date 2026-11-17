# Content patterns and examples

Use these to reason about a particular tool. They are options and illustrations,
not sections to paste into every page. Verify any product-specific statement
against the tool before publishing it.

## Start from the reader's next question

| Tool family | Likely questions | Content that may help |
| --- | --- | --- |
| Converter | What changes? What survives? How do I use the output? | A worked transformation and explanation of meaningful differences |
| Validator | What does valid mean here? What should I correct? | Accepted/rejected examples and interpretation of the checks |
| Generator | Which option should I choose? Where can I use the value? | A realistic workflow and the settings that change the outcome |
| Viewer/reader | Can I open this file? How do I find or export something? | Supported capabilities and navigation using actual controls |
| Calculator/parser | Which units apply? Why is this result different? | A worked calculation and a field-by-field explanation where useful |
| Recorder | How do I start, finish, and save? | A short walkthrough and permission guidance at the relevant step |

These are starting hypotheses. Existing copy, observed user questions, and the
implementation may suggest a better emphasis for a specific tool.

## Example: JSON to YAML

A useful article could start with a task: “Turn an API response into YAML for a
configuration file or documentation example.” If the page already explains this
well, go directly to the example rather than repeating the introduction.

Example input:

```json
{
  "name": "Ada",
  "active": true,
  "roles": ["editor", "reviewer"]
}
```

Illustrative YAML output, to check against the actual converter:

```yaml
name: Ada
active: true
roles:
  - editor
  - reviewer
```

The explanation can teach something concrete: properties become YAML mappings,
the array becomes a sequence, and `true` remains a boolean. The result carries
the same data even though punctuation and layout change. If serializer settings
affect quoting or ordering, explain the behavior the implementation actually has.

Potential questions, selected only if relevant to this tool:

- Why are some values quoted in the YAML output?
- Can I convert JSON containing comments or trailing commas?
- Does converting to YAML change strings, numbers, or boolean values?
- How can I convert the result back to JSON?

The comments question can explain accepted input and how to fix it. A reverse
conversion link can help someone continue their work. Neither requires a long
warning section or a mandatory FAQ wrapper.

## Example: timestamp conversion

Readers often need to understand seconds versus milliseconds, timezone display,
or how to use a converted value. A verified example with the exact timestamp,
units, timezone, and formatted result may be more helpful than a broad history
of Unix time. A question such as “Why does the same timestamp show a different
clock time?” can connect the concept to the tool's actual timezone controls.

If the tool has nuanced date handling, give that topic room. If it performs one
simple conversion with an obvious result, keep the explanation compact.

## Example: validating an identifier

“Valid” can mean a correct format/checksum rather than proof that an identifier
was issued or belongs to a particular entity. When that distinction applies,
explain what the tool checks and how to interpret the result. This is useful
result interpretation, not defensive boilerplate. Include a representative
example when it helps someone recognize or correct their own input.

## Turn vague or defensive copy into useful guidance

| Starting point | More helpful direction |
| --- | --- |
| “The ultimate online converter” | Name the concrete input, output, and supported action |
| “Results are not guaranteed” | Explain the specific behavior the reader needs to interpret, with an example |
| “Files may not work” | Describe the supported case and a practical next step for a relevant unsupported case |
| “Use at your own risk” | Address the actual decision, such as what validation does and does not establish |
| “Our powerful engine processes data” | Explain what the user supplies and what they can do with the result |

These rewrites depend on evidence. If a capability is uncertain, inspect it
before writing a confident replacement. Privacy or security guidance can be a
central topic when the tool's purpose makes it useful.

## SEO and editorial review questions

Consider the questions that matter for the change:

- Does a relevant searcher recognize their task from the title and opening?
- Does the content offer information beyond the tool's name and input labels?
- Is there a concrete example, explanation, or comparison worth keeping?
- Would someone understand the result and know what to do next?
- Are headings descriptive and aligned with what the sections actually answer?
- Are related links a useful continuation, with correct localized destinations?
- Does the description still match the current UI and supported behavior?
- Can the rendered page expose the helpful content without first running a tool?
- Is translated prose natural while preserving technical meaning and examples?

Judge the answers together. A page can be excellent with a single worked example;
another may need several detailed sections. Keyword repetition, article length,
or FAQ count by themselves say little about whether the page deserves to exist.
