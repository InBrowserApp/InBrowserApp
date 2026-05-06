const DEFAULT_INPUT = `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKA+TN2h2fKj3j7KkVlKozY9dwfYR/gnzL5OikweCowV sample@example.com
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDstHdouwFlU60F7/Cx3kwUqgI1Lag+aVXXdo7csOwj8q9oBV+g+ncVYJ44PRpLrnxifKyAv+yypaCy9CuJKeCxETIaT/0Ig6dwzjne3KvXUmkKh4bEWF6nKm5/UhgZJj+7waHxEVwgdrPP/zaUBS/d+RITAstvRM3+ub3JUP/F7E7mlB5hc0fAwDjE7SMyHLl0qf+zWuLwS6sKtTtxqT+UWEhW9bWjDWcAJgzKGspqk56MNlH6gys8TFTjXyohkURTH/aRwczaxtmagjRKY+mQA4gSZeFEzZX2nw2rd+5pBqQDC6Bk5qIRy8gkuWwKbsq5rdN9Zdg9FCupMm8xwA/N sample@example.com`

const STORAGE_KEYS = {
  input: "tools:ssh-public-key-fingerprint:input",
} as const

export { DEFAULT_INPUT, STORAGE_KEYS }
