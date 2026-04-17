## What is chmod?

`chmod` ("change mode") is a Unix/Linux command for changing file and directory permissions. This calculator lets you move between numeric permissions like `755`, symbolic permissions like `rwxr-xr-x`, and the checkbox matrix without doing the mental math by hand.

## How numeric permissions work

Each numeric digit represents one role: owner, group, and others. Inside each digit, `4` means read, `2` means write, and `1` means execute. Add the values together to build the permission you want: `7 = rwx`, `6 = rw-`, `5 = r-x`, and `4 = r--`. For directories, the execute bit also allows entering the directory.

## Common chmod examples

- `chmod 755 script.sh` gives the owner full access and lets everyone else read and execute.
- `chmod 644 notes.txt` keeps a file writable by the owner while everyone else can only read it.
- `chmod 600 .env` is a common choice for private secrets because only the owner can read or write it.
- `chmod 775 shared-folder` is useful for team directories when the group should also be able to create and modify files.
