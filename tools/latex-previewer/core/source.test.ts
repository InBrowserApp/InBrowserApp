import { expect, test, vi } from "vitest"
import { decodeSource, failure } from "./source"
import { inspectStructure } from "./diagnostics"

test("decodes Unicode without guessing a damaged byte stream", () => {
  expect(
    decodeSource(new TextEncoder().encode("\\section{日本語} café"))
  ).toContain("日本語")
  expect(decodeSource(Uint8Array.from([255, 254, 65, 0]))).toBe("A")
  expect(decodeSource(Uint8Array.from([254, 255, 0, 65]))).toBe("A")
  expect(decodeSource(new Uint8Array())).toBe("")
  expect(() => decodeSource(Uint8Array.from([255]))).toThrow("ENCODING")
  expect(() => decodeSource(Uint8Array.from([0]))).toThrow("ENCODING")
  const spy = vi
    .spyOn(TextDecoder.prototype, "decode")
    .mockImplementation(() => {
      throw new RangeError("allocation")
    })
  expect(() => decodeSource(new Uint8Array())).toThrow(RangeError)
  spy.mockRestore()
})
test("reports genuine allocation failures separately from unreadable sources", () => {
  expect(failure(new RangeError())).toBe("resourceLimit")
  expect(failure(new Error("WebAssembly memory exhausted"))).toBe(
    "resourceLimit"
  )
  expect(failure(new Error("ENCODING"))).toBe("encoding")
  expect(failure(new Error("bad"))).toBe("invalid")
  expect(failure(new WebAssembly.RuntimeError("unreachable"))).toBe("invalid")
  expect(failure(null)).toBe("invalid")
})
test("ignores comments, escaped delimiters and literal verbatim content", () => {
  expect(
    inspectStructure(String.raw`\begin{document}
\section{Title \{literal\}} % { $ \begin{bad}
\verb|{$}| \verb*+}+ \begin{verbatim} { $ \begin{bad}\end{verbatim}
\begin{lstlisting}$ {\end{lstlisting}\begin{minted}{tex} $ {\end{minted}
Inline $x$ and $$x$$ and \(x\) and \[x\].
\begin{itemize}\item x\end{itemize}\end{document}% }`)
  ).toEqual([])
})
test("keeps potential syntax problems visible with original source lines", () => {
  expect(inspectStructure("\\begin{document}\n\\section{unfinished")).toEqual([
    { line: 2, code: "groupSyntax" },
    { line: 1, code: "environmentSyntax" },
  ])
  expect(inspectStructure("}\n\\end{bad}\n$x")).toEqual([
    { line: 1, code: "groupSyntax" },
    { line: 2, code: "environmentSyntax" },
    { line: 3, code: "mathSyntax" },
  ])
  expect(inspectStructure(String.raw`\(x\[y\] \) $$x$`)).toEqual([
    { line: 1, code: "mathSyntax" },
    { line: 1, code: "mathSyntax" },
    { line: 1, code: "mathSyntax" },
    { line: 1, code: "mathSyntax" },
  ])
  expect(inspectStructure(String.raw`\begin{verbatim} unfinished`)).toEqual([
    { line: 1, code: "environmentSyntax" },
  ])
  expect(inspectStructure("\\verb")).toEqual([])
  expect(inspectStructure("\\verb|unfinished")).toEqual([])
  expect(inspectStructure("\\begin text\\")).toEqual([])
  expect(inspectStructure("\\(a$b\\)")).toEqual([])
})
