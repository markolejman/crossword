"use client";

export async function exportToPNG(svgString: string, filename: string): Promise<void> {
  // Create a Blob from the SVG string
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // Create an image element
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Create canvas with high DPI
      const scale = 3; // 3x for high resolution
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Scale and draw
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      // Convert to PNG and download
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Could not create blob"));
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }, "image/png");

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      reject(new Error("Failed to load SVG"));
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
}
