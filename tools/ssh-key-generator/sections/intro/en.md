## What is an SSH key pair?

An SSH key pair is a public key and private key used to authenticate to servers, Git hosts, deployment systems, and other SSH-based services. The public key can be shared. The private key must stay secret.

This generator creates OpenSSH-formatted Ed25519 or RSA keys entirely in your browser. It also shows the SHA-256 fingerprint, which is the compact value OpenSSH commonly displays when you verify a key.

## When to use this tool

- Create a development key for a test server, Git remote, container, or temporary lab environment.
- Generate an Ed25519 key when you need a modern, compact default for new SSH access.
- Generate an RSA key when an older service does not support Ed25519.
- Copy a public key into `authorized_keys` while keeping the private key on your device.

## How to choose an algorithm

Ed25519 is the best default for most new SSH keys because it is small, fast, and widely supported by current OpenSSH versions. RSA is useful for compatibility with older appliances, legacy Git servers, or policy requirements that still expect RSA keys.

For RSA, 4096 bits is a conservative default. Smaller 2048-bit keys are faster and still common, but many teams now prefer 3072 or 4096 bits for new long-lived keys.

## What to keep in mind

- The private key produced here is unencrypted. Add a passphrase with `ssh-keygen -p -f <key-file>` if you need one.
- Store the private key with restrictive permissions, such as `chmod 600 <key-file>`.
- Do not paste private keys into tickets, chat, logs, or unknown web pages.
- Rotate keys when a laptop, CI secret, or backup containing the private key might be exposed.
