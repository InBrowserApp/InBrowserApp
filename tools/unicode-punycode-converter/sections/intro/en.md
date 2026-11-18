## Convert between Unicode domains and Punycode

Paste a domain such as `bücher.com` into **Unicode Domain** to get `xn--bcher-kva.com` in **ASCII Domain**. Paste an `xn--` domain into **ASCII Domain** to read it in Unicode. Both fields update as you type, and you can copy either form.

## When to use each version

Punycode represents non-ASCII characters in internationalized domain names (IDNs) with ASCII letters, digits, and hyphens. A converted label starts with `xn--`, while ordinary ASCII labels such as `com` stay unchanged. Use the ASCII version in DNS or hosting settings that ask for it, and use the Unicode version to read a domain from a log or configuration file.

## What to paste into the converter

Enter the hostname only. For `https://bücher.com/catalog`, paste `bücher.com`. Subdomains are supported, so `www.bücher.com` becomes `www.xn--bcher-kva.com`.
