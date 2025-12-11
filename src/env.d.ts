/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_KEY: string;
  readonly VITE_API_BASE?: string; // si tu en as d'autres
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}