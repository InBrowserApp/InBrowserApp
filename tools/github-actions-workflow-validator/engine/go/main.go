//go:build js && wasm

package main

import (
	"bytes"
	"errors"
	"io"
	"strings"
	"syscall/js"

	"github.com/rhysd/actionlint"
	"go.yaml.in/yaml/v4"
)

func extraDocumentIssue(source []byte) map[string]any {
	decoder := yaml.NewDecoder(bytes.NewReader(source))
	var document yaml.Node
	if err := decoder.Decode(&document); err != nil {
		return nil
	}

	var extra yaml.Node
	err := decoder.Decode(&extra)
	if err == io.EOF {
		return nil
	}
	line, column := extra.Line, extra.Column
	var parseError *yaml.ParserError
	if errors.As(err, &parseError) {
		line, column = parseError.Line, parseError.Column
	}
	return map[string]any{"code": "singleDocument", "line": line, "column": column}
}

func checkWorkflow(_ js.Value, args []js.Value) any {
	// The browser checks one workflow in isolation. Leave ShellCheck and
	// Pyflakes disabled, because they require executable binaries.
	linter, err := actionlint.NewLinter(io.Discard, &actionlint.LinterOptions{})
	if err != nil {
		return map[string]any{"error": err.Error()}
	}

	source := []byte(args[0].String())
	diagnostics, err := linter.Lint("<stdin>", source, nil)
	if err != nil {
		return map[string]any{"error": err.Error()}
	}

	issues := make([]any, 0, len(diagnostics)+1)
	for _, diagnostic := range diagnostics {
		issues = append(issues, map[string]any{
			"message": diagnostic.Message,
			"line":    diagnostic.Line,
			"column":  diagnostic.Column,
			"warning": diagnostic.Kind == "runner-label" && strings.Contains(diagnostic.Message, " is unknown."),
		})
	}
	if extra := extraDocumentIssue(source); extra != nil {
		issues = append(issues, extra)
	}
	return map[string]any{"issues": issues}
}

func main() {
	js.Global().Set("checkGithubWorkflow", js.FuncOf(checkWorkflow))
	select {}
}
