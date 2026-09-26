# fun with words. — Project Overview

## Projektbeskrivning

En modern webbapplikation (**fun with words.**) för att skapa professionella svenska korsord med automatisk placeringsalgoritm och export till PNG, PDF och utskrift. Designen är high-end och lekfull: bubble-typografi, Lavender Blush / Blush-palett.

## Syfte

Användare ska enkelt kunna skapa klassiska svenska korsord genom att:
1. Skriva in frågor och svar
2. Se en live-förhandsvisning
3. Generera ett färdigt korsord automatiskt
4. Exportera i olika format (PNG, PDF) eller skriva ut

## Teknologistack

- **Frontend Framework**: Next.js 16.2.10 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (custom implementation)
- **Icons**: lucide-react
- **Export**: html2canvas, jspdf

## Projektstruktur

```
crossword/
├── app/
│   ├── layout.tsx          # Root layout med metadata
│   ├── page.tsx             # Huvudsida med hela applikationen
│   └── globals.css          # Global styling
├── components/
│   ├── ui/                  # Grundläggande UI-komponenter
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   ├── ClueInput.tsx        # Input för en fråga/svar-rad
│   ├── CrosswordEditor.tsx  # Editor för alla frågor
│   ├── CrosswordGrid.tsx    # Renderer för korsordsgrid (SVG)
│   └── ClueList.tsx         # Visar frågor i två kolumner
├── lib/
│   ├── utils.ts             # Utility functions (cn, sanitizeAnswer)
│   ├── types.ts             # TypeScript interfaces
│   ├── storage.ts           # localStorage-session (load/save/clear)
│   └── crossword/           # Korsordsgenererings-logik
│       ├── grid.ts              # Grid-manipulation
│       ├── placementEngine.ts   # Placeringsalgoritm
│       ├── numbering.ts         # Numreringslogik
│       ├── crosswordGenerator.ts # Huvudgenerator
│       ├── svgRenderer.ts       # SVG-rendering
│       ├── exportPng.ts         # PNG-export
│       └── exportPdf.ts         # PDF-export
└── package.json
```

## Kärnfunktionalitet

### 1. Editor (CrosswordEditor)

- Användaren kan lägga till/ta bort frågor och svar dynamiskt
- Svar saniteras automatiskt: VERSALER, inga mellanslag, endast A-Z,Å,Ä,Ö
- Plus-knapp för att lägga till frågor
- Röd X-knapp för att ta bort rader
- **Session persistens**: frågor, svar, genererat korsord och bildformat sparas i `localStorage` så att sessionen finns kvar efter siduppdatering
- **"Rensa allt"**-knapp: nollställer editor, grid och rensar lagrad session

### 2. Live Preview

- Uppdateras automatiskt när användaren skriver in fler ord
- Visar hur korsordet växer i realtid
- Använder samma placer ingsalgoritm som den färdiga versionen

### 3. Korsordsgenerator-algoritm

**Placeringslogik** (`lib/crossword/placementEngine.ts`):
- Sorterar ord efter längd (längsta först)
- Placerar första ordet i mitten
- För varje efterföljande ord:
  - Hittar alla möjliga korsningar med befintliga ord
  - Poängsätter varje placering baserat på:
    - Antal korsningar (viktigast)
    - Avstånd från centrum
    - Kompakthet
  - Väljer bästa placeringen

**Grid-hantering** (`lib/crossword/grid.ts`):
- Skapar och manipulerar 2D-grid
- Validerar placeringar (inga kollisioner)
- Komprimerar grid för att ta bort tomma utrymmen
- Beräknar gränser

**Grid-expansion** (`expandGrid` i `placementEngine.ts`):
- Växer grid åt höger/nedåt utan att flytta befintliga celler
- Behåller giltiga koordinater för redan placerade ord (undviker krasch vid många frågor)

**Numrering** (`lib/crossword/numbering.ts`):
- Följer standardregler för korsord
- En ruta får nummer om den är start på vågrätt eller lodrätt ord
- Samma nummer används om både vågrätt och lodrätt ord börjar i samma ruta
- Numrerar från vänster till höger, uppifrån och ner
- Skyddad mot ogiltiga koordinater

### 4. Rendering

**SVG-rendering** (`lib/crossword/svgRenderer.ts`):
- Renderar korsordet som SVG
- Två varianter:
  - `renderCrosswordSVG`: Endast grid
  - `renderFullCrosswordImage`: Grid + frågor i två kolumner

**Layout**:
- Korsordet placeras överst, centrerat
- Frågor längst ned i två kolumner: "Vågrätt" och "Lodrätt"
- Frågorna sorteras efter nummer

### 5. Export

**PNG Export** (`lib/crossword/exportPng.ts`):
- Konverterar SVG till canvas
- Skapar high-resolution PNG (3x scale)
- Triggar nedladdning

**PDF Export** (`lib/crossword/exportPdf.ts`):
- Skapar A4 PDF med jsPDF
- Stöder både landscape (4:3) och portrait (3:4)
- Konverterar SVG → Canvas → PDF

**Print**:
- Öppnar nytt fönster med SVG
- Triggar browser print dialog

## Design & Tema

**Varumärke**: **fun with words.** — lekfull men high-end, inspirerad av mjuka marshmallow/bubble-3D-titlar och en sofistikerad punk-rosa palett.

**Färgpalett** (från referens):
- Bakgrund: `#FFE6ED` (Lavender Blush) med mjuka molnliknande radial gradients
- Punk / primärknapp: `#CF7486` (Blush), hover `#B86374`
- Cream till bubble-titel: `#FFF8F0`
- Text: `#5C3A44`, muted `#8A5A66`
- Ytor: frostad vit/glas (`panel`) med soft blush-skuggor
- Border: `#F0C8D2`

**Typografi**:
- Hero-titel: Starbim (lokal bubble-font av Khurasan), Blush `#CF7486` + lager-text-shadow för marshmallow-volym
- UI body: Outfit
- Licens: Starbim är free for commercial use (CC BY-ND) — attribution till Khurasan
- Grid bokstäver/nummer: oförändrad (Arial) — grid-designen rörs inte

**Korsordsgrid** (orörd):
- Vita rutor med svarta linjer (2px)
- Nummer i övre vänstra hörnet
- Bokstäver centrerade i rutan
- Inspirerat av klassiska svenska korsord

## Viktiga Kodbeslut

1. **Modulär arkitektur**: All korsordsgenerator-logik är helt separerad från UI
2. **SVG över Canvas**: SVG för bättre skalbarhet och print-kvalitet
3. **Strict TypeScript**: Full type safety genom hela stacken
4. **Client-side only**: Ingen backend behövs, allt körs i browsern
5. **Responsive design**: Fungerar på desktop och tablet (mobil optimering kan förbättras)

## Användningsflöde

1. Användaren öppnar appen
2. Skriver in frågor och svar
3. Ser live-preview medan hen skriver
4. Väljer bildformat (3:4 eller 4:3)
5. Klickar "Generera korsord"
6. Ser färdigt korsord med frågor
7. Exporterar till PNG, PDF eller skriver ut

## Framtida Förbättringar

- **Drag & drop**: Manuell flytt av ord (påbörjad men ej implementerad fullt ut)
- **Fler teman**: Möjlighet att välja olika färgteman
- **Spara/ladda**: Spara korsord lokalt eller i cloud
- **Mer avancerad algoritm**: Bättre optimering för fler ord
- **Mobil-optimering**: Förbättrad UX på små skärmar
- **Ångra/gör om**: Historik för ändringar
- **Import**: Importera frågor från CSV/Excel

## Kommandoinformation

**Utveckling**:
```bash
npm run dev
```

**Production build**:
```bash
npm run build
npm start
```

**Linting**:
```bash
npm run lint
```

## Konventioner

- **Komponenter**: PascalCase, en komponent per fil
- **Utilities**: camelCase
- **Filer**: camelCase för utilities, PascalCase för komponenter
- **CSS**: Tailwind utility classes, inga custom CSS-filer utom globals.css
- **Types**: Explicit typing, inga `any`
- **Kommentarer**: På svenska där det hjälper förståelsen, annars engelska

## Dependencies

**Runtime**:
- next: 16.2.10
- react: 19.2.4
- react-dom: 19.2.4
- lucide-react: Icons
- html2canvas: PNG export
- jspdf: PDF export
- class-variance-authority: Styling utilities
- clsx + tailwind-merge: Utility class management

**Dev**:
- typescript: 5.x
- tailwindcss: 4.x
- eslint: 9.x

## Uppdateringshistorik

- **2026-09-26**: Visuell rebrand till **fun with words.**
  - Bubble-titel (Starbim), Lavender Blush / Blush-palett
  - Punk-rosa knappar, frosted panels, soft pink cloud-bakgrund
  - Funktionalitet och korsordsgrid oförändrade
- **2026-07-14**: Initial release
  - Komplett korsordsgenerator med smart placeringsalgoritm
  - Live preview
  - Export till PNG, PDF och utskrift
  - Responsiv design med Tailwind CSS
  - Modulär arkitektur
