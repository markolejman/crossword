"use client";

import { useState, useMemo } from "react";
import { ClueAnswer, CrosswordGrid as CrosswordGridType, AspectRatio } from "@/lib/types";
import { CrosswordEditor } from "@/components/CrosswordEditor";
import { CrosswordGrid } from "@/components/CrosswordGrid";
import { ClueList } from "@/components/ClueList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateLivePreview, generateCrossword } from "@/lib/crossword/crosswordGenerator";
import { renderFullCrosswordImage, getCluesFromGrid } from "@/lib/crossword/svgRenderer";
import { exportToPNG } from "@/lib/crossword/exportPng";
import { exportToPDF } from "@/lib/crossword/exportPdf";
import { Download, FileImage, Printer } from "lucide-react";

export default function Home() {
  const [clues, setClues] = useState<ClueAnswer[]>([
    { id: crypto.randomUUID(), clue: "", answer: "" },
  ]);
  const [finalGrid, setFinalGrid] = useState<CrosswordGridType | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("4:3");
  const [isGenerating, setIsGenerating] = useState(false);

  // Live preview — derived from clues (no effect needed)
  const previewGrid = useMemo(() => {
    const validClues = clues.filter((c) => c.answer.length > 0);
    if (validClues.length === 0) return null;
    return generateLivePreview(validClues);
  }, [clues]);

  // Track which words are placed in the grid
  const placedWordIds = useMemo(() => {
    if (!previewGrid) return new Set<string>();
    return new Set(previewGrid.words.map(w => w.id));
  }, [previewGrid]);

  const handleGenerate = () => {
    setIsGenerating(true);
    const validClues = clues.filter((c) => c.answer.length > 0);

    setTimeout(() => {
      const grid = generateCrossword(validClues);
      setFinalGrid(grid);
      setIsGenerating(false);
    }, 100);
  };

  const finalClues = useMemo(() => {
    if (!finalGrid) return { across: [], down: [] };
    return getCluesFromGrid(finalGrid);
  }, [finalGrid]);

  const handleExportPNG = async () => {
    if (!finalGrid) return;

    const svg = renderFullCrosswordImage(finalGrid, {
      cellSize: 40,
      fontSize: 20,
      numberFontSize: 10,
      aspectRatio,
      showLetters: false, // Empty grid for export
    });

    await exportToPNG(svg, "korsord.png");
  };

  const handleExportPDF = async () => {
    if (!finalGrid) return;

    const svg = renderFullCrosswordImage(finalGrid, {
      cellSize: 40,
      fontSize: 20,
      numberFontSize: 10,
      aspectRatio,
      showLetters: false, // Empty grid for export
    });

    await exportToPDF(svg, "korsord.pdf", aspectRatio);
  };

  const handlePrint = () => {
    if (!finalGrid) return;

    const svg = renderFullCrosswordImage(finalGrid, {
      cellSize: 40,
      fontSize: 20,
      numberFontSize: 10,
      aspectRatio,
      showLetters: false, // Empty grid for export
    });

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Korsord</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              @media print {
                body {
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            ${svg}
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const validCluesCount = clues.filter((c) => c.answer.length > 0).length;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <header className="text-center mb-12 sm:mb-16">
          <h1 className="bubble-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            fun with words.
          </h1>
          <p className="fade-up mt-5 text-base sm:text-lg text-muted font-light tracking-wide">
            Skapa professionella korsord enkelt och snabbt
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Editor */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frågor och Svar</CardTitle>
              </CardHeader>
              <CardContent>
                <CrosswordEditor 
                  clues={clues} 
                  onChange={setClues}
                  placedWordIds={placedWordIds}
                />
              </CardContent>
            </Card>

            {/* Live Preview */}
            {previewGrid && (
              <Card>
                <CardHeader>
                  <CardTitle>Live-förhandsvisning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CrosswordGrid grid={previewGrid} cellSize={30} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Final Grid */}
          <div>
            {!finalGrid ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-5">
                    <div className="text-muted">
                      <p className="mb-2 font-medium text-foreground">
                        Lägg till {validCluesCount} / minst 3 frågor och svar
                      </p>
                      <p className="text-sm leading-relaxed">
                        Klicka sedan på &quot;Generera korsord&quot; för att skapa det
                        färdiga korsordet
                      </p>
                    </div>

                    {validCluesCount >= 3 && (
                      <>
                        <div className="pt-2">
                          <label className="block text-sm font-medium text-foreground mb-3">
                            Bildformat
                          </label>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant={aspectRatio === "4:3" ? "default" : "outline"}
                              onClick={() => setAspectRatio("4:3")}
                              type="button"
                            >
                              4:3 (Liggande)
                            </Button>
                            <Button
                              variant={aspectRatio === "3:4" ? "default" : "outline"}
                              onClick={() => setAspectRatio("3:4")}
                              type="button"
                            >
                              3:4 (Stående)
                            </Button>
                          </div>
                        </div>

                        <Button
                          onClick={handleGenerate}
                          disabled={isGenerating}
                          size="lg"
                          className="w-full"
                        >
                          {isGenerating ? "Genererar..." : "Generera korsord"}
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Färdigt korsord</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CrosswordGrid grid={finalGrid} cellSize={35} />
                    <ClueList across={finalClues.across} down={finalClues.down} />
                  </CardContent>
                </Card>

                {/* Export Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Exportera</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={handleExportPNG}
                      variant="outline"
                      className="w-full"
                    >
                      <FileImage className="h-4 w-4 mr-2" />
                      Exportera PNG
                    </Button>
                    <Button
                      onClick={handleExportPDF}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportera PDF
                    </Button>
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      className="w-full"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Skriv ut
                    </Button>
                  </CardContent>
                </Card>

                <Button
                  onClick={() => setFinalGrid(null)}
                  variant="ghost"
                  className="w-full"
                >
                  Redigera frågor
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
