// The Strapi plugins (repo qkix/strapi-plugins): what the /strapi-plugins/ pages say about each. Their long docs,
// screenshots, versions and npm downloads come from the repo itself (tools/sync_plugins.py -> src/content/plugins/,
// public/strapi-plugins/<id>/, src/data/plugins.json).
import meta from "./plugins.json";
import type { Lang } from "./site";

export interface Plugin {
  id: string;
  name: string;
  pkg: string;                       // the Strapi plugin's npm package
  accent: string;
  shot: string;                      // the screenshot on its card / at the top of its page (public/strapi-plugins/<id>/)
  tag: Record<Lang, string>;         // one line
  points: Record<Lang, string[]>;    // three short facts for the card
}

export const PLUGINS: Plugin[] = [
  {
    id: "better-blocks", name: "Better Blocks", pkg: "@qkix/strapi-plugin-better-blocks", accent: "#7c6cf0",
    shot: "better-blocks-demo.gif",
    tag: { en: "An enhanced Rich Text (Blocks) editor for Strapi v5 – and React, Astro and Vue renderers for what it writes.",
           pl: "Rozszerzony edytor Rich Text (Blocks) dla Strapi v5 – oraz renderery React, Astro i Vue do tego, co w nim napiszesz." },
    points: { en: ["Colours, tables, callouts, embeds", "Code, math and diagrams", "Renderers for React, Astro and Vue"],
              pl: ["Kolory, tabele, callouty, embedy", "Kod, wzory i diagramy", "Renderery dla React, Astro i Vue"] },
  },
  {
    id: "chartkit", name: "Chartkit", pkg: "@qkix/strapi-plugin-chartkit", accent: "#18a58a",
    shot: "chart-types.png",
    tag: { en: "Charts rendered as SVG on the server – a page gets a chart without a byte of client-side JavaScript.",
           pl: "Wykresy renderowane jako SVG na serwerze – strona dostaje wykres bez ani bajta JavaScriptu w przeglądarce." },
    points: { en: ["A field of its own or a Better Blocks block", "Data grid, spreadsheet paste or a file", "No client-side JavaScript"],
              pl: ["Osobne pole albo blok w Better Blocks", "Siatka danych, wklejka z arkusza albo plik", "Zero JavaScriptu w przeglądarce"] },
  },
  {
    id: "rewind", name: "Rewind", pkg: "@qkix/strapi-plugin-rewind", accent: "#e0664c",
    shot: "edit-view.png",
    tag: { en: "Document version history for Strapi v5: every save is a snapshot, and any snapshot can be put back.",
           pl: "Historia wersji dokumentów w Strapi v5: każdy zapis to migawka, a każdą migawkę można przywrócić." },
    points: { en: ["A snapshot on every save", "A diff between any two", "Restore without losing new fields"],
              pl: ["Migawka przy każdym zapisie", "Różnice między dowolnymi dwiema", "Przywracanie bez gubienia nowych pól"] },
  },
  {
    id: "greenlight", name: "Greenlight", pkg: "@qkix/strapi-plugin-greenlight", accent: "#3fae5a",
    shot: "panel.png",
    tag: { en: "Multi-stage content review with a publish gate: nothing goes live until it has been approved.",
           pl: "Wieloetapowa akceptacja treści z bramką publikacji: nic nie trafia na stronę bez zatwierdzenia." },
    points: { en: ["The stage is a gate, not a label", "Enforced on every publish route", "A review queue for your team"],
              pl: ["Etap to bramka, nie etykieta", "Działa przy każdej drodze publikacji", "Kolejka przeglądów dla zespołu"] },
  },
  {
    id: "blueprint", name: "Blueprint", pkg: "@qkix/strapi-plugin-blueprint", accent: "#3d7fe0",
    shot: "diagram.png",
    tag: { en: "A diagram of your content types – with the components and dynamic zones other visualisers leave out.",
           pl: "Diagram typów treści – razem z komponentami i strefami dynamicznymi, które inne narzędzia pomijają." },
    points: { en: ["Components and dynamic zones included", "Real SVG, rendered on the server", "The same drawing in admin, README and docs"],
              pl: ["Komponenty i strefy dynamiczne", "Prawdziwe SVG z serwera", "Ten sam rysunek w panelu, README i dokumentacji"] },
  },
  {
    id: "ferry", name: "Ferry", pkg: "@qkix/strapi-plugin-ferry", accent: "#f0a500",
    shot: "dry-run.png",
    tag: { en: "Import and export content as JSON or CSV – relations, components and dynamic zones survive the trip.",
           pl: "Import i eksport treści w JSON lub CSV – relacje, komponenty i strefy dynamiczne przeżywają podróż." },
    points: { en: ["A dry run before anything is written", "Keyed on documentId", "A failed import rolls back"],
              pl: ["Próba na sucho przed zapisem", "Klucz: documentId", "Nieudany import się wycofuje"] },
  },
];

export interface PluginMeta { version: string; packages: string[]; downloads: Record<string, number | null>; monthly: number;
  changelog: { version: string; notes: string[] }[] }
export const PLUGIN_META = meta as Record<string, PluginMeta>;
export const REPO = "https://github.com/qkix/strapi-plugins";
export const NPM_ORG = "https://www.npmjs.com/org/qkix";
export const COFFEE = "https://buymeacoffee.com/qkix";
