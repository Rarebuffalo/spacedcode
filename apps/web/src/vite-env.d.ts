/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_PUBLIC_NAME?: string;
  readonly VITE_PUBLIC_HEADLINE?: string;
  readonly VITE_PUBLIC_GITHUB_URL?: string;
  readonly VITE_PUBLIC_GITHUB_USERNAME?: string;
  readonly VITE_PUBLIC_LINKEDIN_URL?: string;
  readonly VITE_PUBLIC_EMAIL?: string;
  readonly VITE_PUBLIC_LEETCODE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
