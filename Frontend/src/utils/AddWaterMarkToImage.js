export default function addWatermark(image, gpsData, options = {}) {
  return new Promise((resolve, reject) => {
    // Default options with GPS coordinates in watermark text
    const defaults = {
      text: `EVIDENCE | LAT: ${
        gpsData?.latitude?.toFixed(6) || "N/A"
      } | LONG: ${gpsData?.longitude?.toFixed(6) || "N/A"}`,
      font: "bold 5rem Arial", // Large bold font
      color: "white", // White text
      position: "bottom-center",
      margin: 30,
      textStroke: "1px black", // Black stroke for better contrast
    background: "rgba(0, 0, 0, 1)", // Completely black background
      padding: 20, // Padding around text
      textAlign: "center",
    };

    const config = { ...defaults, ...options };

    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "Anonymous";

    const loadImage = (src) => {
      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Set text style
        ctx.font = config.font;
        ctx.fillStyle = config.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";

        // Add text stroke if specified
        if (config.textStroke) {
          ctx.strokeStyle = config.textStroke.split(" ")[1];
          ctx.lineWidth = parseInt(config.textStroke.split(" ")[0]);
          ctx.strokeText(
            config.text,
            canvas.width / 2,
            canvas.height - config.margin
          );
        }

        // Draw watermark text
        ctx.fillText(
          config.text,
          canvas.width / 2,
          canvas.height - config.margin
        );

        // Convert to blob and resolve
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas to Blob conversion failed"));
              return;
            }
            resolve(
              new File([blob], image.name || "watermarked-image", {
                type: "image/jpeg",
                lastModified: new Date().getTime(),
              })
            );
          },
          "image/jpeg",
          0.9
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = src;
    };

    if (image instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => loadImage(e.target.result);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(image);
    } else {
      reject(new Error("Invalid image source"));
    }
  });
}
