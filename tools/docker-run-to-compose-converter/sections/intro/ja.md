## What It Does

Docker Run to Compose Converter converts one or more `docker run` commands into a
`docker-compose.yml` file in the browser. You can inspect the generated YAML,
copy it, or download it before moving it into your project.

## When To Use It

Use it when you want to turn an ad hoc container command into a repeatable
Compose service definition, or when you want to see how ports, volumes,
environment variables, and resource flags map into Compose.

## What To Expect

Common options such as ports, environment variables, restart policy,
healthchecks, mounts, and resource limits are preserved. Unsupported or
ambiguous flags are surfaced as warnings so you can review the output before
using it.
