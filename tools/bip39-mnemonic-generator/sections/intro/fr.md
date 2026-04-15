Create BIP39 seed phrases in the browser, inspect imported mnemonics before you trust them, and convert between raw entropy and wallet words without sending sensitive material to another service. This tool is useful when you need one workspace for generation, checksum validation, and low-level recovery work.

## Generate With Intent

Pick a supported wordlist and word count, then regenerate until you have the seed phrase you want to store. The matching entropy is shown alongside the phrase so you can inspect the exact strength and keep both representations together when documenting a recovery flow.

## Validate Before You Import

Use the validation mode when someone hands you a mnemonic phrase and you want a fast checksum and word-count sanity check before importing it into another wallet. A valid result also reveals the recovered entropy, which helps when you are comparing two recovery sources or debugging derivation steps.

## Convert Entropy Carefully

The conversion mode works both ways: raw entropy to words and mnemonic words back to entropy. That makes it practical for test fixtures, deterministic wallet demos, and incident review work where you need to confirm that a phrase still maps to the expected bytes under a specific BIP39 wordlist.
