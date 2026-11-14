import type { Locale } from "@/lib/i18n";

export type PaletteLink = { id: string; label: string; href: string; hint?: string; keywords?: string[] };

/** Everything the command palette needs, serialised from the server layout. */
export type PaletteData = {
  locale: Locale;
  labels: {
    placeholder: string;
    empty: string;
    navigate: string;
    projects: string;
    actions: string;
    links: string;
    toggleTheme: string;
    switchLanguage: string;
    copyEmail: string;
    copied: string;
    downloadCv: string;
    close: string;
  };
  navigation: PaletteLink[];
  projects: PaletteLink[];
  external: PaletteLink[];
  email: string;
  cvPdf: string;
};
