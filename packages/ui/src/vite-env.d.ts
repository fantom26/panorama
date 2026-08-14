/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REST_COUNTRIES_API_URL: string
  readonly VITE_REST_COUNTRIES_API_AUTH_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
