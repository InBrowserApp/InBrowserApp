## What is bcrypt?

bcrypt is a password hashing algorithm designed for password storage. It combines the password with a random salt and repeats expensive work based on a cost factor, so attackers need more time to test each guess.

## When to use this tool

- Generate a bcrypt hash for a test account, seed script, or local development environment.
- Compare how different cost factors change the output format and runtime.
- Create a copy-ready hash without sending the password to a server.

## How to choose the cost factor

Higher cost values are slower and usually safer, but they also make every login attempt slower for your application. A cost around 10-12 is common for interactive systems; higher values can be reasonable for admin-only or low-volume workflows. Test the cost on the same kind of hardware that will verify the password.

## What to keep in mind

- Every generated hash uses a fresh random salt, so the output changes even when the password and cost stay the same.
- Store the bcrypt hash, not the original password.
- Use bcrypt for passwords, not for file checksums, signatures, or general hashing.
- Keep verification behavior constant and avoid revealing whether a user account exists.
