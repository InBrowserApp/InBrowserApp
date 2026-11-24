# actionlint browser engine

`actionlint.wasm` contains [actionlint 1.7.12](https://github.com/rhysd/actionlint/tree/v1.7.12), built from the adjacent Go bridge using Go 1.26.11. The matching Go runtime is `wasm_exec.js`. The [Go and dependency notices](../../../../apps/web/public/licenses/github-actions-workflow-validator.txt) ship with the site.

Run `sh engine/refresh.sh` from the tool directory to reproduce the binary, runtime, and license inventory. The browser downloads a compressed copy when it first checks a workflow.
