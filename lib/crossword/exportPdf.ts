"use client";

import { jsPDF } from "jspdf";

export async function exportToPDF(
  svgString: string,
  filename: string,
  aspectRatio: "3:4" | "4:3"
): Promise<void> {
  // Create a Blob from the SVG string
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // Create an image element
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Create canvas
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.scale(scale, scale);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);

      // Create PDF (A4 size)
      const pdf = new jsPDF({
        orientation: aspectRatio === "4:3" ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Add image to PDF
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Save PDF
      pdf.save(filename);

      URL.revokeObjectURL(url);
      resolve();
    };

    img.onerror = () => {
      reject(new Error("Failed to load SVG"));
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
}
