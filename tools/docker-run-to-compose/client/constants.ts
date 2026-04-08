const DEFAULT_DOCKER_RUN_INPUT = `docker run --name api -p 8080:8080 -e NODE_ENV=production -e API_KEY \\
  -v ./data:/data --restart unless-stopped node:20-alpine node server.js

docker run -d --name redis -p 6379:6379 redis:7-alpine`

const STORAGE_KEYS = {
  inputText: "tools:docker-run-to-compose:input",
} as const

export { DEFAULT_DOCKER_RUN_INPUT, STORAGE_KEYS }
