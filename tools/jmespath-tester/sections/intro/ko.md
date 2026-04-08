## What It Does

JMESPath 테스트기 lets you run a JMESPath expression against JSON data directly
in the browser. You can inspect the matched result, copy it, or download it as
formatted JSON without leaving the page.

## When To Use It

Use it when you need to prototype a JMESPath query, debug a filter expression,
or verify exactly which values a JSON query will return before you embed that
expression somewhere else.

## What To Expect

The tool validates the JSON input first, then evaluates the JMESPath
expression. If either side is invalid, the error is surfaced immediately. When
the query succeeds, the result is formatted as JSON and the result count is
shown alongside the output.
