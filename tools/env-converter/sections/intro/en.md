## Convert environment configuration

Paste a `.env` file and choose JSON or YAML, or convert a flat JSON/YAML object back to `.env`. Import local files, swap the input and output, and copy or download the result. Everything runs in your browser; configuration is never uploaded or stored in browser history or local storage.

### Values and quotes

Environment variables are strings: `PORT=3000`, `DEBUG=false` and `CODE=0012` stay `"3000"`, `"false"` and `"0012"`. JSON/YAML numbers and booleans are converted to strings. Null, arrays and nested objects need an explicit string value. Quote YAML values such as `0012` when their exact spelling matters.

The parser supports blank lines, `#` comments, an `export` prefix, and single, double or backtick quotes with multiline values. Only double-quoted `\n` and `\r` sequences are expanded. Quotes and backslashes otherwise stay literal, following common dotenv behavior. Keys use letters, digits and underscores and cannot start with a digit. The output chooses a quote style that preserves the value.

### Configuration checks

Duplicate `.env` keys show their line numbers; the last definition is used. Missing closing quotes, text after closing quotes and invalid assignments show errors with links to the affected line. Curly quotes produce a warning. JSON/YAML duplicate keys are errors.

Comments, original quote style and formatting are not preserved. References such as `${NAME}` and shell commands stay literal and are never executed. Different `.env` loaders have different rules; this tool follows the documented subset rather than interpreting shell scripts.

See the [Node.js .env specification](https://nodejs.org/api/environment_variables.html#dotenv) and [dotenv parsing rules](https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow).
