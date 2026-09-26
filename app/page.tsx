"use client";

import { useState, useEffect, useMemo } from "react";
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
  const [previewGrid, setPreviewGrid] = useState<CrosswordGridType | null>(null);
  const [finalGrid, setFinalGrid] = useState<CrosswordGridType | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("4:3");
  const [isGenerating, setIsGenerating] = useState(false);

  // Track which words are placed in the grid
  const placedWordIds = useMemo(() => {
    if (!previewGrid) return new Set<string>();
    return new Set(previewGrid.words.map(w => w.id));
  }, [previewGrid]);

  // Live preview
  useEffect(() => {
    const validClues = clues.filter((c) => c.answer.length > 0);
    if (validClues.length > 0) {
      const grid = generateLivePreview(validClues);
      setPreviewGrid(grid);
    } else {
      setPreviewGrid(null);
    }
  }, [clues]);

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Korsordsgenerator</h1>
          <p className="text-gray-600">
            Skapa professionella korsord enkelt och snabbt
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Editor */}
          <div>
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
              <Card className="mt-6">
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
                  <div className="text-center space-y-4">
                    <div className="text-gray-500">
                      <p className="mb-2">
                        Lägg till {validCluesCount} / minst 3 frågor och svar
                      </p>
                      <p className="text-sm">
                        Klicka sedan på "Generera korsord" för att skapa det
                        färdiga korsordet
                      </p>
                    </div>

                    {validCluesCount >= 3 && (
                      <>
                        <div className="pt-4">
                          <label className="block text-sm font-medium mb-2">
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
