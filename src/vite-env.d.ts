/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FARMMAP_API_KEY: string
  readonly VITE_FARMMAP_API_BASE_URL: string
  readonly VITE_KMA_API_KEY: string
  readonly VITE_KMA_API_BASE_URL: string
  readonly VITE_KAMIS_API_KEY: string
  readonly VITE_KAMIS_API_BASE_URL: string
  readonly VITE_DATA_PORTAL_API_KEY: string
  readonly VITE_DATA_PORTAL_API_KEY_ENCODED: string
  readonly VITE_DATA_PORTAL_BASE_URL: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_LOG_API_CALLS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}