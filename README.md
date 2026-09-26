# 📝 Korsordsgenerator

En modern webbapplikation för att skapa professionella svenska korsord med automatisk placeringsalgoritm.

![Korsordsgenerator](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwind-css)

## ✨ Funktioner

- 📝 **Enkel editor** - Lägg till frågor och svar dynamiskt
- 🔄 **Live-förhandsvisning** - Se korsordet växa i realtid
- 🧠 **Intelligent algoritm** - Automatisk placering med optimala korsningar
- 📐 **Två bildformat** - 4:3 (liggande) eller 3:4 (stående)
- 💾 **Export** - PNG, PDF eller skriv ut direkt
- 🎨 **Klassisk design** - Inspirerad av svenska pysselblad

## 🚀 Kom igång

### Installation

```bash
npm install
```

### Utveckling

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

### Produktion

```bash
npm run build
npm start
```

## 📖 Hur man använder

1. **Skriv in frågor och svar**
   - Fyll i minst 3 frågor
   - Svar konverteras automatiskt till versaler
   - Lägg till fler frågor med plus-knappen

2. **Se live-förhandsvisning**
   - Korsordet uppdateras automatiskt
   - Visualisera hur orden korsar varandra

3. **Generera färdigt korsord**
   - Välj bildformat (4:3 eller 3:4)
   - Klicka "Generera korsord"
   - Se det färdiga korsordet med numrerade rutor och frågor

4. **Exportera**
   - Exportera som PNG (hög upplösning)
   - Exportera som PDF (A4-format)
   - Skriv ut direkt

## 🛠 Teknologier

- **Next.js 16.2** - React framework med App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - UI-komponenter
- **html2canvas** - PNG-export
- **jsPDF** - PDF-export

## 📂 Projektstruktur

```
crossword/
├── app/              # Next.js App Router
├── components/       # React-komponenter
│   ├── ui/          # Grundläggande UI-komponenter
│   ├── ClueInput.tsx
│   ├── CrosswordEditor.tsx
│   ├── CrosswordGrid.tsx
│   └── ClueList.tsx
├── lib/             # Affärslogik
│   ├── crossword/   # Korsordsgenerator-logik
│   │   ├── grid.ts
│   │   ├── placementEngine.ts
│   │   ├── numbering.ts
│   │   ├── crosswordGenerator.ts
│   │   ├── svgRenderer.ts
│   │   ├── exportPng.ts
│   │   └── exportPdf.ts
│   ├── types.ts
│   └── utils.ts
└── public/          # Statiska filer
```

## 🎯 Algoritm

Korsordsgeneratorn använder en intelligent placeringsalgoritm:

1. **Sortera ord** - Längsta ord först
2. **Placera första ordet** - I mitten av griden
3. **Hitta korsningar** - Leta efter bokstäver som matchar
4. **Poängsätta placeringar**:
   - Flest korsningar (viktigast)
   - Närmare centrum
   - Kompakt layout
5. **Välj bästa placeringen** - Optimera för läsbarhet
6. **Komprimera** - Ta bort tomma utrymmen
7. **Numrera** - Enligt standardregler

## 📝 Exempel

```
Input:
- Sveriges huvudstad → STOCKHOLM
- Nordens största land → SVERIGE  
- Storstad i södra Sverige → MALMÖ

Output:
¹STOCKHOLM²M
 V        A
 E        L
 R        M
 I        Ö
 G
 E
```

## 🤝 Bidra

Bidrag är välkomna! Öppna ett issue eller skicka en pull request.

## 📄 Licens

MIT

## 👤 Författare

Skapad med ❤️ för svenska korsordsentusiaster

---

**Tips:** För bästa resultat, använd ord som har gemensamma bokstäver!
