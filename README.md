# Commit Message Rules

Use the following commit types for changes in this repository:

- `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- `ci`: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- `docs`: Documentation only changes
- `feat`: A new feature
- `fix`: A bug fix
- `perf`: A code change that improves performance
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `test`: Adding missing tests or correcting existing tests

# Testing guidance

## Jest environment

- Use `jsdom` for React component tests.
- It provides a browser-like API surface and accurate simulation of browser-dependent code.
- `node:test` does not include JSDOM and is only suitable for pure Node.js tests.

## Coverage Strategy (V8) because:

1. Performance is critical — V8 has near-zero overhead.
2. You are testing bundled code — it works on SWC, esbuild, webpack, and other output.
3. You need E2E or integration coverage across processes.
4. You are using modern tooling that Istanbul does not support.
5. You are on Next.js App Router and need coverage for Server Actions.

## Colocated tests

- For smaller or medium-sized projects, colocated test files keep related code and tests close together.
- Use `*.test.ts`, `*.spec.ts`, `*.test.tsx`, etc. alongside the source files they cover.
