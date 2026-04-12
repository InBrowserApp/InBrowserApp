## What is URL Encoding?

URL encoding (also called percent encoding) is a method to convert special characters into a format that can be safely transmitted over the internet. URLs can only contain certain characters, so any character that isn't allowed must be encoded.

**How it works:**

- Special characters are converted to `%` followed by their hexadecimal ASCII code
- Example: a space becomes `%20`, `{'@'}` becomes `%40`
- Only letters (A-Z, a-z), numbers (0-9), and some symbols (- \_ . ~) don't need encoding

**Common examples:**

- Space → `%20`
- `{'@'}` → `%40`
- `#` → `%23`
- `&` → `%26`
- `?` → `%3F`

**Why it's needed:**

- URLs have reserved characters with special meanings
- Ensures data is transmitted correctly
- Prevents conflicts with URL structure
- Required for web forms and API calls
